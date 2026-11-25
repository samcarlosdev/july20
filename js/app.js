/* July 20 — interações. Nenhuma biblioteca necessária. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toastEl = $('#toast');
  let toastTimer = null;
  const toast = (message) => {
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 3300);
  };
  window.JulyToast = toast;

  // Background starfield: positions and sizes fixed after generation.
  const stars = $('#starsLayer');
  for (let i = 0; i < (innerWidth < 550 ? 68 : 118); i++) {
    const el = document.createElement('span');
    const size = Math.random() * 1.75 + .65;
    el.className = 'bg-star';
    el.style.setProperty('--sx', `${Math.random() * 100}%`);
    el.style.setProperty('--sy', `${Math.random() * 100}%`);
    el.style.setProperty('--size', `${size}px`);
    el.style.setProperty('--sc', i % 5 === 0 ? '#f6d7de' : (i % 4 === 0 ? '#ffe5be' : '#c8d7ff'));
    el.style.setProperty('--duration', `${2.7 + Math.random() * 4.3}s`);
    el.style.setProperty('--delay', `${Math.random() * -8}s`);
    stars.appendChild(el);
  }

  // Entry gate — opens on the user's tap; audio playback is attempted from this gesture.
  $('#enterBtn').addEventListener('click', () => {
    const entry = $('#entry');
    entry.classList.add('closed');
    entry.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    window.JulyAudio?.start();
    const delay = reducedMotion ? 60 : 1050;
    setTimeout(() => { entry.hidden = true; $('#inicio').focus?.({preventScroll:true}); }, delay);
  });

  // Scroll-in reveal; content stays readable even if observer isn't supported.
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver(entries => {
      for (const item of entries) {
        if (item.isIntersecting) {
          item.target.classList.add('is-visible');
          io.unobserve(item.target);
        }
      }
    }, {threshold: .10, rootMargin:'0px 0px -25px 0px'});
    $$('.reveal').forEach(el => io.observe(el));
  } else { $$('.reveal').forEach(el => el.classList.add('is-visible')); }

  const starData = [
    {glyph:'🐰',title:'A coelhinha mais fofa',tag:'doçura & pequenos detalhes',text:'Existe uma garota que ama coelhinhos, fica feliz com pequenas coisas e tem um jeitinho doce até quando tenta parecer brava. Ela sorri com os olhos, fica toda nervosinha quando recebe um elogio e consegue transformar momentos simples em lembranças especiais. Essa garota é você, July.'},
    {glyph:'🎨',title:'Mil cores, uma só July',tag:'a artista que vive nela',text:'Cabelo azul, roxo, vermelho, verde... Já perdi a conta de quantas versões suas conheci! Mas a coisa mais bonita é que, em todas elas, você continua sendo você. Uma artista que inventa personagens, desenha mundos e transforma o próprio estilo numa forma de expressão.'},
    {glyph:'🖤',title:'Um coração fofinho e sombrio',tag:'seu lado deliciosamente estranho',text:'Coelhinhos, maquiagem bonita e coisas delicadas... mas também assassinos de jogos, terror psicológico, RPG e personagens completamente malucos. A July consegue ser a pessoa mais adorável do mundo e, cinco minutos depois, estar apaixonada por alguma criatura suspeita. Uma combinação perigosamente perfeita.'},
    {glyph:'📚',title:'A garota dos mil sonhos',tag:'pedagogia, história e museus',text:'Futura pedagoga, apaixonada por crianças, arte e história. E quem sabe, um dia, museóloga também? Você tem tantos caminhos para explorar, July. Não precisa decidir tudo agora. O importante é que continue descobrindo o mundo e construindo um futuro que tenha a sua cara.'},
    {glyph:'🎵',title:'A trilha sonora de uma vida',tag:'música que vira memória',text:'Antes de tantas pessoas chegarem, já existiam músicas fazendo companhia a você. Vito e seus tantos nomes artísticos fazem parte dessa história há anos. E acho bonito como uma música consegue guardar lembranças, fases e sentimentos. Que seus 20 anos tragam ainda mais canções para amar e histórias para viver.'},
    {glyph:'🌙',title:'A beleza de sentir',tag:'doçura, força e sensibilidade',text:'Você é alegre, inteligente, reflexiva e tem um coração que sente muita coisa. Às vezes fica insegura, às vezes prefere ficar quietinha, e em outros momentos não para de brincar. Você não precisa esconder nenhum desses lados. Todos fazem parte da garota especial que você é.'},
    {glyph:'✨',title:'O mundo ainda é seu',tag:'tantos capítulos pela frente',text:'Há tantos lugares que você ainda não conheceu, pessoas que ainda vai encontrar, desenhos que ainda vai criar e sonhos que ainda vai realizar. Seus 20 anos não são uma corrida contra o tempo. São mais um capítulo de uma história que ainda tem muita coisa bonita pela frente.'},
  ];
  let selectedStar = 0;
  function showStar(index) {
    selectedStar = (index + starData.length) % starData.length;
    const star = starData[selectedStar];
    $('#detailNumber').textContent = `ESTRELA ${String(selectedStar+1).padStart(2,'0')} / 07`;
    $('#detailGlyph').textContent = star.glyph;
    $('#detailTitle').textContent = star.title;
    $('#detailText').textContent = star.text;
    $('#detailTag').textContent = star.tag;
    $('#steinBtn').hidden = selectedStar !== 2;
    $$('.star-node').forEach(btn => {
      const isSelected = Number(btn.dataset.star) === selectedStar;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  }
  $$('.star-node').forEach(btn => btn.addEventListener('click', () => showStar(Number(btn.dataset.star))));
  $('#prevStar').addEventListener('click', () => showStar(selectedStar - 1));
  $('#nextStar').addEventListener('click', () => showStar(selectedStar + 1));

  // July's colors — optimized versions of the photos supplied for this project.
  const photos = [
    {file:'purple.webp',color:'#9863d1',title:'Roxo de outro planeta',caption:'Ela muda de cor, experimenta novos estilos e nunca deixa de ser inteiramente ela.',alt:'July com cabelo roxo, acessório amarelo no cabelo e maquiagem artística'},
    {file:'red.webp',color:'#de4968',title:'Vermelho, sem pedir licença',caption:'Um pouquinho de ousadia, um olhar marcante e muita personalidade.',alt:'July de cabelo vermelho e preto, com franja, olhando para o alto'},
    {file:'blue.webp',color:'#4173c8',title:'Azul, a sua cor',caption:'O azul tem tantos tons. Talvez por isso combine com alguém que tem tantos jeitos de ser.',alt:'July de cabelo azul, com roupa alternativa, tirando uma foto no espelho'},
    {file:'teal.webp',color:'#269b9c',title:'Entre o azul e o verde',caption:'O cabelo muda, o estilo evolui, e aquela essência especial continua exatamente ali.',alt:'July de cabelo azul-esverdeado, tirando foto no espelho'},
    {file:'violet.webp',color:'#6b58be',title:'Um toque violeta',caption:'A garota que consegue fazer até uma ida ao espelho parecer uma sessão de fotos.',alt:'July com cabelo de reflexos violetas e fones, em uma selfie'},
    {file:'green-dark.webp',color:'#488d82',title:'O charme do lado escuro',caption:'Um estilo só seu, maquiagem caprichada e toda a liberdade de ser diferente.',alt:'July de cabelo verde-azulado, maquiagem alternativa e batom escuro'},
    {file:'green.webp',color:'#529f80',title:'Verde, mas não convencional',caption:'Entre acessórios, brilhos, piercings e detalhes, cada produção conta uma história.',alt:'July com cabelo verde, olhos marcados por maquiagem roxa'},
    {file:'makeup-art.webp',color:'#617cd2',title:'A artista do inesperado',caption:'Ela também transforma o rosto em tela. E até o terror pode se tornar uma forma de arte.',alt:'July de cabelo azul com maquiagem artística inspirada em terror'},
    {file:'horror.webp',color:'#67508a',title:'Até a escuridão vira arte',caption:'Nem toda beleza precisa ser delicada. Ela também mora na coragem de criar algo assustador.',alt:'July usando maquiagem e efeitos especiais de terror, com olhos e boca sombreados'},
  ];
  const mainPhoto = $('#galleryMain');
  let selectedPhoto = 0;
  let photoTimer;
  function showPhoto(index) {
    selectedPhoto = (index + photos.length) % photos.length;
    const photo = photos[selectedPhoto];
    clearTimeout(photoTimer);
    mainPhoto.classList.add('is-switching');
    const apply = () => {
      mainPhoto.src = `assets/images/${photo.file}`;
      mainPhoto.alt = photo.alt;
      $('#galleryShell').style.setProperty('--gallery-color',photo.color);
      $('#galleryIndex').textContent = `${String(selectedPhoto+1).padStart(2,'0')} / 09`;
      $('#galleryTitle').textContent = photo.title;
      $('#galleryCaption').textContent = photo.caption;
      $$('.photo-thumb').forEach(btn => {
        const isSelected=Number(btn.dataset.photo)===selectedPhoto;
        btn.classList.toggle('selected',isSelected);
        btn.setAttribute('aria-pressed',String(isSelected));
      });
      photoTimer = setTimeout(() => mainPhoto.classList.remove('is-switching'),90);
    };
    photoTimer = setTimeout(apply, reducedMotion ? 0 : 190);
  }
  $('#galleryPrev').addEventListener('click',() => showPhoto(selectedPhoto-1));
  $('#galleryNext').addEventListener('click',() => showPhoto(selectedPhoto+1));
  $$('.photo-thumb').forEach(btn => btn.addEventListener('click',()=>showPhoto(Number(btn.dataset.photo))));
  let touchStartX=null;
  $('#galleryShell').addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
  $('#galleryShell').addEventListener('touchend',e=>{if(touchStartX===null)return;const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>55)showPhoto(selectedPhoto+(delta<0?1:-1));touchStartX=null;},{passive:true});

  // Genuine interactive dialogs and keyboard/backdrop close support.
  const openDialog = id => {const dialog=document.getElementById(id);if(dialog && !dialog.open)dialog.showModal();};
  $('#steinBtn').addEventListener('click',()=>openDialog('steinDialog'));
  $('#openLetter').addEventListener('click',()=>openDialog('letterDialog'));
  $$('[data-close]').forEach(b => b.addEventListener('click',()=>document.getElementById(b.dataset.close)?.close()));
  $$('.modal').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();}));

  // The rabbit responds to her touch. Never traps focus or requires a gesture.
  const rabbitMessages=['Pruu! 💙','O coelhinho gosta de você. 🐰','*narizinho mexendo*','Você ganhou um carinho extra. ♡','Ele disse: feliz 20 aninhos!'];
  let rabbitTouches=0;
  $('#rabbitBtn').addEventListener('click',()=>{
    const rabbit=$('#rabbitBtn');rabbit.classList.remove('hopping');void rabbit.offsetWidth;rabbit.classList.add('hopping');
    const message=rabbitMessages[rabbitTouches%rabbitMessages.length];rabbitTouches++;
    $('#rabbitToast').textContent=message;
    setTimeout(()=>rabbit.classList.remove('hopping'),600);
  });

  // Birthday candle: repeatable, accessible, not tied to the soundtrack timeline.
  const candle=$('#candleBtn');
  const scene=$('#cakeScene');
  function createConfetti() {
    if (reducedMotion) return;
    const root=$('#confetti');
    root.textContent='';
    const palette=['#d9c5ff','#a9d3fe','#f5d3ae','#d6aae8','#ffffff'];
    const fragment=document.createDocumentFragment();
    for(let i=0;i<90;i++){
      const part=document.createElement('span');part.className='confetti-piece';
      part.style.setProperty('--left',`${Math.random()*100}%`);
      part.style.setProperty('--width',`${3+Math.random()*5}px`);
      part.style.setProperty('--height',`${6+Math.random()*10}px`);
      part.style.setProperty('--color',palette[i%palette.length]);
      part.style.setProperty('--speed',`${3+Math.random()*3}s`);
      part.style.setProperty('--delay',`${Math.random()*.7}s`);
      part.style.setProperty('--drift',`${(Math.random()-.5)*280}px`);
      part.style.setProperty('--rotate',`${Math.random()*1000}deg`);
      fragment.appendChild(part);
    }
    root.appendChild(fragment);
    setTimeout(()=>{root.textContent='';},6800);
  }
  candle.addEventListener('click',()=>{
    if(scene.classList.contains('blown'))return;
    scene.classList.add('blown');candle.disabled=true;
    $('#wishPrompt').textContent='Seu desejo foi enviado para as estrelas. ✨';
    createConfetti();
    setTimeout(()=>{
      $('#wishResult').hidden=false;
      $('#wishResult').focus({preventScroll:true});
      $('#wishResult').scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'nearest'});
    },reducedMotion?70:580);
  });
  $('#relightBtn').addEventListener('click',()=>{
    scene.classList.remove('blown');candle.disabled=false;
    $('#wishPrompt').textContent='Toque na chama para apagar sua velinha. ✨';
    $('#wishResult').hidden=true;
    $('#confetti').textContent='';
    candle.focus({preventScroll:true});
  });
})();
