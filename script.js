// ===== script.js =====
// Carrossel 3D, Scroll Reveal, Mouse Parallax e navegação da seção Carreira

/* Helper: aplica classes de posição (prev, active, next, back, back-right) */
function setPositions(cards, index) {
  const len = cards.length;
  cards.forEach((card, i) => {
    card.classList.remove('prev','next','active','back','back-right');
  });

  if (len === 0) return;

  const active = index;
  const prev = (index - 1 + len) % len;
  const next = (index + 1) % len;
  const back = (index - 2 + len) % len;
  const backRight = (index + 2) % len;

  cards[active].classList.add('active');
  cards[prev].classList.add('prev');
  cards[next].classList.add('next');

  // se houver mais cards, coloque os dois próximos/anteriores para trás
  if (len > 3) cards[back].classList.add('back');
  if (len > 4) cards[backRight].classList.add('back-right');
}

/* Inicializa um carrossel dado o container .carrossel */
function initCarousel(carousel) {
  const cardsContainer = carousel.querySelector('.cards');
  const cardEls = Array.from(cardsContainer.querySelectorAll('.card'));
  const prevBtn = carousel.querySelector('.carrossel-prev');
  const nextBtn = carousel.querySelector('.carrossel-next');

  let currentIndex = 0;

  // configura posições iniciais
  setPositions(cardEls, currentIndex);

  function goTo(index) {
    currentIndex = (index + cardEls.length) % cardEls.length;
    setPositions(cardEls, currentIndex);
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // botões
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // clique em card central (abre link se houver) ou centraliza se clicar em prev/next
  cardEls.forEach((c, idx) => {
    c.addEventListener('click', (e) => {
      // se o card já está ativo, tenta abrir link interno .view (se existir)
      if (c.classList.contains('active')) {
        const link = c.querySelector('a.view');
        if (link && link.href) {
          // permite abrir em nova aba se usuário usou ctrl/shift/meta
          if (e.ctrlKey || e.metaKey || e.shiftKey) return; 
          window.location.href = link.href;
        }
        return; // já ativo, nada mais a fazer
      }
      // se não está ativo, centraliza esse card
      goTo(idx);
    });
  });

  // teclado
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // touch: swipe simples
  let startX = 0;
  cardsContainer.addEventListener('touchstart', (ev) => { startX = ev.changedTouches[0].clientX; }, {passive:true});
  cardsContainer.addEventListener('touchend', (ev) => {
    const dx = ev.changedTouches[0].clientX - startX;
    if (dx < -30) next();
    if (dx > 30) prev();
  }, {passive:true});

  // exposição inicial (força layout)
  window.addEventListener('load', () => setPositions(cardEls, currentIndex));
}

/* Inicializa todos os carrosséis da página */
document.querySelectorAll('.carrossel').forEach(initCarousel);

// ===== Scroll Reveal básico usando IntersectionObserver =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Mouse Parallax suave (leve) =====
(function mouseParallax(){
  const root = document.documentElement;
  let raf = null;
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10; // -5..5
    const y = (e.clientY / window.innerHeight - 0.5) * 8; // -4..4
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      root.style.setProperty('--mx', x + 'px');
      root.style.setProperty('--my', y + 'px');
      // aplica leve deslocamento na área principal
      document.body.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });
})();

// ===== Botões para a seção 'Carreira' =====
// Se você quiser botões separados para a seção carreira (por exemplo, prev/next específicos),
// o script procura por uma .carreira .carrossel e vincula controles adicionais.
(function carreiraControls(){
  const careerSection = document.querySelector('.carreira');
  if (!careerSection) return;
  const carousel = careerSection.querySelector('.carrossel');
  if (!carousel) return;

  // cria controles caso não existam
  let prev = carousel.querySelector('.carrossel-prev');
  let next = carousel.querySelector('.carrossel-next');
  if (!prev || !next) {
    prev = document.createElement('button');
    next = document.createElement('button');
    prev.className = 'carrossel-prev'; prev.innerHTML = '&#10094;';
    next.className = 'carrossel-next'; next.innerHTML = '&#10095;';
    carousel.appendChild(prev); carousel.appendChild(next);
  }

  // a inicialização do carrossel já liga os listeners, então não é necessário mais nada aqui.
})();

// ===== Pequenas melhorias: animação suave ao trocar classes =====
// Garante que o layout recalcula antes de animar (evita jump em alguns navegadores)
window.addEventListener('resize', () => {
  document.querySelectorAll('.cards').forEach(c => c.style.transition = 'none');
  requestAnimationFrame(()=>{
    document.querySelectorAll('.cards').forEach(c => c.style.transition = 'transform 0.9s cubic-bezier(.22,.9,.31,1)');
  });
});

// Fim do script.js
