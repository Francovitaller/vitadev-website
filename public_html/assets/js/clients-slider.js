document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-flow-slider]');
  if (!section) return; // no existe en esta página

  const rail = section.querySelector('.rail');
  const track = section.querySelector('.rail__track');
  const units = Array.from(track.children);
  const markersTrack = section.querySelector('.markers__track');

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let prevX = 0;
  let velocity = 0;
  let index = 0;
  let autoRAF;

  /* ===== CLONADO LOOP ===== */


  const baseCount = units.length;
  const unitWidth = units[0].offsetWidth + 40;

  // Calcula límites de translateX permitidos (centra la tarjeta activa)
  function getBounds() {
    const railWidth = rail.offsetWidth;
    const cardWidth = units[0].offsetWidth;
    const centerOffset = (railWidth - cardWidth) / 2;
    const maxX = centerOffset; // primera tarjeta centrada
    const minX = - (baseCount - 1) * unitWidth + centerOffset; // última tarjeta centrada
    return { minX, maxX };
  }

  /* ===== MARKERS ===== */
  units.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => snapTo(i));
    markersTrack.appendChild(dot);
  });

  const markers = Array.from(markersTrack.children);

  /* ===== DRAG ===== */
  rail.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    velocity = 0;
    cancelAnimationFrame(autoRAF);
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    velocity = dx * 0.25;
    currentX = prevX + dx;
    // permitir un pequeño overscroll visual, pero limitar valores extremos
    const { minX, maxX } = getBounds();
    const overscroll = 120; // px permitidos fuera de bounds durante el drag
    if (currentX > maxX + overscroll) currentX = maxX + overscroll;
    if (currentX < minX - overscroll) currentX = minX - overscroll;
    track.style.transform = `translateX(${currentX}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    prevX = currentX;
    applyMomentum();
  });

  /* ===== MOMENTUM ===== */
  function applyMomentum() {
    currentX += velocity;
    velocity *= 0.88;
    const { minX, maxX } = getBounds();

    // Si llegamos fuera de límites, frena y corrige
    if (currentX > maxX) {
      currentX = Math.min(currentX, maxX);
      velocity = 0;
    } else if (currentX < minX) {
      currentX = Math.max(currentX, minX);
      velocity = 0;
    }

    track.style.transform = `translateX(${currentX}px)`;

    if (Math.abs(velocity) > 0.6) {
      requestAnimationFrame(applyMomentum);
    } else {
      snap();
      startAutoMove();
    }
  }

  /* ===== SNAP ===== */
  // Snap al índice más cercano según currentX
  function snap() {
    const railWidth = rail.offsetWidth;
    const cardWidth = units[0].offsetWidth;
    const centerOffset = (railWidth - cardWidth) / 2;

    // raw: número de unidades desplazadas (puede ser fraccional)
    const raw = - (currentX - centerOffset) / unitWidth;
    let nearest = Math.round(raw);
    // clamp
    nearest = Math.max(0, Math.min(baseCount - 1, nearest));
    snapTo(nearest);
  }
function snapTo(i) {
  index = ((i % baseCount) + baseCount) % baseCount;

  const railWidth = rail.offsetWidth;
  const cardWidth = units[0].offsetWidth;
  const centerOffset = (railWidth - cardWidth) / 2;

  currentX = -index * unitWidth + centerOffset;
  prevX = currentX;

  track.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
  track.style.transform = `translateX(${currentX}px)`;

  setTimeout(() => {
    track.style.transition = 'none';
  }, 450);

  updateMarkers();
}


  /* ===== MARKERS ===== */
  function updateMarkers() {
    markers.forEach((m, i) =>
      m.classList.toggle('is-active', i === index)
    );

    const size = markers[0].offsetWidth + 10;
    markersTrack.style.transform = `translateX(${-index * size}px)`;
  }

  /* INIT */
  // Auto-move: avanza al siguiente ítem cada X ms usando requestAnimationFrame
  let lastAutoTime = 0;
  const AUTO_DELAY = 3000; // ms

  function startAutoMove() {
    cancelAnimationFrame(autoRAF);
    lastAutoTime = performance.now();

    function autoLoop(now) {
      autoRAF = requestAnimationFrame(autoLoop);
      if (now - lastAutoTime >= AUTO_DELAY) {
        lastAutoTime = now;
        snapTo(index + 1);
      }
    }

    autoRAF = requestAnimationFrame(autoLoop);
  }

  snapTo(0);
  startAutoMove();
});
