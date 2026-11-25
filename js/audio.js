/* July 20 — soundtrack, starts directly on user gesture. */
(() => {
  'use strict';
  const audio = document.getElementById('soundtrack');
  const btn = document.getElementById('musicBtn');
  const label = document.getElementById('musicLabel');
  const root = document.documentElement;
  const toast = (message) => window.JulyToast?.(message);
  let context, analyser, buffer, frame = null, lastPower = 0;
  let playPending = false;

  function updateButton(playing) {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
    btn.title = playing ? 'Pausar música' : 'Tocar música';
    label.textContent = playing ? 'Pausar' : 'Música';
  }
  function prepareVisualizer() {
    if (context) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    try {
      context = new Ctor();
      analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = .85;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      buffer = new Uint8Array(analyser.frequencyBinCount);
    } catch (err) {
      console.warn('Visualizador de áudio indisponível:', err);
      analyser = null;
    }
  }
  function tick() {
    if (audio.paused || !analyser) { frame = null; return; }
    analyser.getByteFrequencyData(buffer);
    let sum = 0;
    const limit = Math.min(buffer.length, 120);
    for (let i = 2; i < limit; i++) sum += buffer[i];
    const power = Math.min(1, Math.max(0, (sum / (limit - 2) / 255) * 1.72));
    lastPower = lastPower * .69 + power * .31;
    root.style.setProperty('--pulse', lastPower.toFixed(3));
    root.style.setProperty('--spectrum', Math.min(1, lastPower * 1.7).toFixed(3));
    frame = requestAnimationFrame(tick);
  }
  function stopVisuals() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastPower = 0;
    root.style.setProperty('--pulse', '0');
    root.style.setProperty('--spectrum', '.2');
  }
  function start() {
    if (playPending || !audio.paused) return;
    playPending = true;

    // IMPORTANT: call play() immediately inside the actual click handler.
    // Awaiting AudioContext.resume() first may lose the mobile gesture.
    let playPromise;
    try {
      playPromise = audio.play();
    } catch (err) {
      playPending = false;
      console.error('Erro ao iniciar áudio:', err);
      toast('Não foi possível iniciar a música. Você pode tentar pelo botão ♫.');
      return;
    }

    // Initialize visuals independently; never block starting the music.
    try {
      prepareVisualizer();
      if (context?.state === 'suspended') {
        context.resume().catch(err => console.warn('Visualizador suspenso:', err));
      }
    } catch (err) {
      console.warn('Visualizador indisponível:', err);
    }

    Promise.resolve(playPromise).then(() => {
      playPending = false;
      updateButton(true);
      if (analyser && frame === null) tick();
    }).catch(err => {
      playPending = false;
      updateButton(false);
      console.error('Falha ao reproduzir música:', err, 'mediaError:', audio.error, 'url:', audio.currentSrc);
      const code = audio.error?.code;
      if (code === 4) toast('O navegador não reconheceu o formato da música.');
      else if (code === 2) toast('Falha de rede ao carregar a música. Tente novamente.');
      else if (err?.name === 'NotAllowedError') toast('Toque no botão de música para autorizar o áudio.');
      else toast('Não foi possível tocar a música. Toque em ♫ para tentar novamente.');
    });
  }
  function pause() {
    audio.pause();
    updateButton(false);
    stopVisuals();
  }
  btn.addEventListener('click', () => audio.paused ? start() : pause());
  audio.addEventListener('play', () => updateButton(true));
  audio.addEventListener('pause', () => { updateButton(false); stopVisuals(); });
  audio.addEventListener('error', () => {
    updateButton(false);
    console.error('Erro no arquivo de música:', audio.error, audio.currentSrc);
  });
  window.JulyAudio = { start, pause };
})();
