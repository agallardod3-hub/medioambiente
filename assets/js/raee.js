// Interactividad para sobre-raee.html
document.addEventListener('DOMContentLoaded', () => {
  setupChipFilter();
  setupChipArrows();
  setupAccordions();
  setupVideoModal();
});

function setupChipFilter(){
  const chips = Array.from(document.querySelectorAll('.chip'));
  const cards = Array.from(document.querySelectorAll('.edu-card, .a-card'));
  if (!chips.length || !cards.length) return;

  const applyFilter = (key) => {
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      const show = key === 'all' || tags.includes(key);
      card.style.display = show ? '' : 'none';
    });
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter(chip.dataset.filter || 'all');
    });
  });
}

function setupChipArrows(){
  const scroller = document.getElementById('chipScroller');
  const prev = document.getElementById('chipPrev');
  const next = document.getElementById('chipNext');
  const progress = document.getElementById('chipProgress');
  if (!scroller || !prev || !next) return;
  const step = () => Math.min(220, scroller.clientWidth * 0.6);
  prev.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => scroller.scrollBy({ left: step(), behavior: 'smooth' }));

  const update = () => {
    if (!progress) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const value = max > 0 ? (scroller.scrollLeft / max) * 100 : 0;
    progress.style.width = value + '%';
  };
  scroller.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function setupAccordions(){
  document.querySelectorAll('[data-accordion]').forEach(acc => {
    acc.querySelectorAll('.acc-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  });
}

function setupVideoModal(){
  const modal = document.getElementById('videoModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const open = (src) => {
    body.innerHTML = `<iframe src="${src}" title="Video educativo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };
  const close = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    body.innerHTML = '';
    document.body.classList.remove('modal-open');
  };

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  document.querySelectorAll('.video-btn').forEach(btn => {
    btn.addEventListener('click', () => open(btn.getAttribute('data-video')));
  });
}
