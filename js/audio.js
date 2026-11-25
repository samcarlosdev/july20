/* Soundtrack integration. An authorized file can be placed in assets/audio/.
   Web Audio API reacts to frequency energy; the site's reading speed is user-controlled. */
(() => {
  'use strict';
  const audio=document.getElementById('soundtrack');
  const btn=document.getElementById('musicBtn');
  const label=document.getElementById('musicLabel');
  const root=document.documentElement;
  let context=null,analyser=null,source=null,buffer=null,frame=null;
  let lastPower=0;
  const toast=message=>window.JulyToast?.(message);

  function updateButton(playing) {
    btn.classList.toggle('is-playing',playing);
    btn.setAttribute('aria-pressed',String(playing));
    btn.setAttribute('aria-label',playing?'Pausar música':'Tocar música');
    label.textContent=playing?'Pausar':'Música';
    btn.title=playing?'Pausar música':'Tocar música';
  }
  function initAnalyzer() {
    if(context || !('AudioContext' in window || 'webkitAudioContext' in window))return;
    try {
      const AudioContextCtor=window.AudioContext||window.webkitAudioContext;
      context=new AudioContextCtor();
      analyser=context.createAnalyser();
      analyser.fftSize=512;
      analyser.smoothingTimeConstant=.85;
      source=context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      buffer=new Uint8Array(analyser.frequencyBinCount);
    } catch (error) {
      console.warn('Visualizador de áudio indisponível; a reprodução continua.',error);
      context=null;analyser=null;
    }
  }
  function tick() {
    if(audio.paused || !analyser){frame=null;return;}
    analyser.getByteFrequencyData(buffer);
    // Average bass and midrange, avoiding very high frequencies that yield noisy flashes.
    let sum=0;
    const limit=Math.min(buffer.length,120);
    for(let i=2;i<limit;i++)sum+=buffer[i];
    const average=sum/(limit-2)/255;
    const power=Math.max(0,Math.min(1,average*1.72));
    const eased=lastPower*.69+power*.31;
    lastPower=eased;
    root.style.setProperty('--pulse',eased.toFixed(3));
    root.style.setProperty('--spectrum',Math.min(1,eased*1.7).toFixed(3));
    frame=requestAnimationFrame(tick);
  }
  async function start() {
    if(!audio.paused)return;
    // The audio comes from a local file the owner adds. No commercial track ships with the site.
    try {
      initAnalyzer();
      if(context?.state==='suspended')await context.resume();
      await audio.play();
      updateButton(true);
      if(!frame && analyser)tick();
    }catch(error){
      console.info('Trilha não disponível ou bloqueada:',error);
      updateButton(false);
      toast('A trilha ainda não foi adicionada. A surpresa continua mesmo assim. ♡');
    }
  }
  function pause() {
    audio.pause();updateButton(false);
    if(frame){cancelAnimationFrame(frame);frame=null;}
    lastPower=0;
    root.style.setProperty('--pulse','0');root.style.setProperty('--spectrum','.2');
  }
  btn.addEventListener('click',()=>audio.paused?start():pause());
  audio.addEventListener('pause',()=>updateButton(false));
  audio.addEventListener('play',()=>updateButton(true));
  audio.addEventListener('error',()=>updateButton(false));
  window.JulyAudio={start,pause};
})();
