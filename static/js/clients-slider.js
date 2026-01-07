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
    track.style.transform = `translateX(${currentX}px)`;

    if (Math.abs(velocity) > 0.6) {
      requestAnimationFrame(applyMomentum);
    } else {
      snap();
      startAutoMove();
    }
  }

  /* ===== SNAP ===== */
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
  snapTo(0);
  startAutoMove();
});
