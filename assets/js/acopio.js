// Mapa y panel de puntos de acopio RAEE
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('acopioMap');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('acopioMap', { scrollWheelZoom: false }).setView([-8.111, -79.03], 12.6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const icon = L.icon({
    iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="52" viewBox="0 0 24 32">
        <path d="M12 0C6 0 1.5 4.5 1.5 10.5 1.5 18 12 32 12 32s10.5-14 10.5-21.5C22.5 4.5 18 0 12 0z" fill="#2aa66a"/>
        <circle cx="12" cy="11" r="4.5" fill="#fff"/>
      </svg>`),
    iconSize: [24, 32], iconAnchor: [12, 32], popupAnchor: [0, -28]
  });

  // Datos de puntos (con fuentes públicas/OSM para coordenadas aproximadas)
  const puntos = [
    {
      name: 'Municipalidad Provincial de Trujillo (referencial)',
      address: 'Jirón Pizarro, Centro Histórico',
      coords: [-8.1069631, -79.0236603],
      types: ['telefonia','computo','impresoras','electro','baterias'],
      note: 'Punto usado en campañas municipales (SEGAT)'
    },
    {
      name: 'Real Plaza Trujillo / Mall Plaza',
      address: 'Calle Varsovia, Urb. Santa Inés',
      coords: [-8.1036870, -79.0478657],
      types: ['telefonia','computo','impresoras'],
      note: 'Sede frecuente de campañas RAEE'
    },
    {
      name: 'Parque Jonel Arroyo (referencial)',
      address: 'Av. Mansiche, Cdra. 1',
      coords: [-8.1030101, -79.0388840],
      types: ['telefonia','baterias','computo'],
      note: 'Mencionado por MINAM/SEGAT en campañas'
    },
    {
      name: 'Universidad Nacional de Trujillo (UNT)',
      address: 'Av. América Sur s/n',
      coords: [-8.1146349, -79.0385842],
      types: ['telefonia','computo','impresoras'],
      note: 'Actividades y campañas de RAEE'
    },
    {
      name: 'Municipalidad Distrital Víctor Larco',
      address: 'Av. Víctor Larco Herrera, Buenos Aires',
      coords: [-8.1442806, -79.0554557],
      types: ['telefonia','baterias','electro'],
      note: 'Campañas distritales y orientación'
    },
    {
      name: 'UPAO — Campus Trujillo',
      address: 'Av. América Sur 3145',
      coords: [-8.1279782, -79.0323441],
      types: ['telefonia','computo','impresoras','baterias'],
      note: 'Campañas de recolección universitarias'
    }
  ];

  // Crear marcadores
  const markers = [];
  puntos.forEach(p => {
    const m = L.marker(p.coords, { icon }).addTo(map);
    m.bindPopup(`<strong>${p.name}</strong><br>${p.address}<br><small>${p.note}</small>`);
    markers.push({ marker: m, data: p });
  });

  // Panel de lista + filtros
  const list = document.getElementById('list');
  const q = document.getElementById('q');
  const checks = Array.from(document.querySelectorAll('.filters input[type="checkbox"]'));

  function renderList(items){
    list.innerHTML = '';
    items.forEach(({ data }, idx) => {
      const el = document.createElement('button');
      el.className = 'list-item';
      el.innerHTML = `<strong>${data.name}</strong><small>${data.address}</small><span class="badge">${data.types.length} tipos</span>`;
      el.addEventListener('click', () => {
        map.setView(data.coords, 15);
        markers[idx].marker.openPopup();
        list.querySelectorAll('.list-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
      });
      list.appendChild(el);
    });
  }

  function applyFilters(){
    const query = (q.value || '').toLowerCase().trim();
    const activeTypes = new Set(checks.filter(c => c.checked).map(c => c.getAttribute('data-type')));
    const filtered = markers.filter(({ data, marker }) => {
      const matchText = !query || `${data.name} ${data.address}`.toLowerCase().includes(query);
      const matchType = data.types.some(t => activeTypes.has(t));
      const visible = matchText && matchType;
      marker.setOpacity(visible ? 1 : 0);
      marker[visible ? 'addTo' : 'remove']?.(map);
      return visible;
    });
    renderList(filtered);
  }

  q.addEventListener('input', applyFilters);
  checks.forEach(c => c.addEventListener('change', applyFilters));
  renderList(markers);

  // Botón localizar
  const locate = L.control({ position: 'topleft' });
  locate.onAdd = function(){
    const btn = L.DomUtil.create('button', 'leaflet-bar');
    btn.title = 'Centrar en mi ubicación';
    btn.style.padding = '6px 8px';
    btn.style.cursor = 'pointer';
    btn.innerHTML = '📍';
    btn.onclick = () => map.locate({ setView: true, maxZoom: 15 });
    return btn;
  };
  locate.addTo(map);

  // Asegurar render correcto si cambia el layout
  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener('resize', () => map.invalidateSize());
});
