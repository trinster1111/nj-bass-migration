// Shared Layout & Live Telemetry Engine for Pt. Beach Striper Tracker

const NAV_LINKS = [
  { href: 'index.html', label: 'Migration Map' },
  { href: 'how-they-act.html', label: 'How They Act' },
  { href: 'tackle.html', label: 'No-BS Tackle & Fleet' },
  { href: 'cook.html', label: 'Cook Your Catch' },
  { href: 'conservation.html', label: 'Conservation' }
];

function renderSharedLayout() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // 1. Inject Top Telemetry Bar + Navigation Header
  const headerPlaceholder = document.getElementById('site-header');
  if (headerPlaceholder) {
    const navHtml = NAV_LINKS.map(link => {
      const isActive = currentPath === link.href;
      const classes = isActive
        ? 'px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-bold'
        : 'px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition';
      return `<a href="${link.href}" class="${classes}">${link.label}</a>`;
    }).join('');

    headerPlaceholder.innerHTML = `
      <!-- LIVE TELEMETRY TOP BAR -->
      <div class="bg-slate-950 border-b border-slate-800 px-4 py-2 text-xs">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold tracking-wider uppercase text-emerald-400">Pt. Beach / Manasquan Live Telemetry</span>
          </div>
          <div class="flex flex-wrap gap-3 md:gap-5 text-slate-300 font-mono">
            <div>💧 Surf Temp: <span id="water-temp" class="text-white font-bold">61.2°F</span></div>
            <div>🌡️ Air: <span id="air-temp" class="text-white font-bold">--°F</span></div>
            <div>💨 Wind: <span id="wind-speed" class="text-white font-bold">-- mph</span></div>
            <div>🧭 Baro: <span id="barometer" class="text-white font-bold">-- inHg</span></div>
            <div>🌊 Next Tide: <span id="next-tide" class="text-sky-400 font-bold">Loading...</span></div>
            <div class="hidden sm:block">📏 NJ Slot: <span class="text-amber-400 font-bold">1 Fish (28" to &lt;31")</span></div>
          </div>
        </div>
      </div>

      <!-- MAIN NAVIGATION -->
      <header class="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <a href="index.html" class="block group">
            <div class="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              🐟 PT. BEACH STRIPER TRACKER
              <span class="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">FREE / NO BS</span>
            </div>
            <p class="text-xs text-slate-400">Built by Point Pleasant Beach surfcasters. Powered by local boats &amp; tackle shops.</p>
          </a>
          <nav class="flex flex-wrap gap-1.5 md:gap-2 text-xs md:text-sm font-semibold">
            ${navHtml}
          </nav>
        </div>
      </header>
    `;
  }

  // 2. Inject Shared Footer
  const footerPlaceholder = document.getElementById('site-footer');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="border-t border-slate-800 bg-slate-950 py-8 mt-16 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong class="text-white">Pt. Beach Striper Tracker</strong> • Point Pleasant Beach, NJ
            <p class="text-slate-500 mt-0.5">100% Free Forever. Zero paywalls, zero spot-burning, zero BS.</p>
          </div>
          <div class="flex gap-4 font-mono text-slate-400">
            <a href="index.html" class="hover:text-emerald-400">Map</a>
            <a href="how-they-act.html" class="hover:text-emerald-400">Behavior</a>
            <a href="tackle.html" class="hover:text-emerald-400">Tackle &amp; Fleet</a>
            <a href="cook.html" class="hover:text-emerald-400">Cook</a>
            <a href="conservation.html" class="hover:text-emerald-400">Conservation</a>
          </div>
        </div>
      </footer>
    `;
  }
}

// Fetch Live Weather (Pt. Pleasant Beach) & NOAA Tides (Sandy Hook / NJ Coast)
async function loadMarineTelemetry() {
  // 1. Open-Meteo Live Air Temp, Wind & Barometer for Pt. Beach (40.0912, -74.0365)
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=40.0912&longitude=-74.0365&current=temperature_2m,surface_pressure,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph'
    );
    const data = await res.json();
    const cur = data.current;
    const inHg = (cur.surface_pressure * 0.02953).toFixed(2);
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    const windDir = dirs[Math.round(cur.wind_direction_10m / 22.5) % 16];

    document.getElementById('air-temp').textContent = `${Math.round(cur.temperature_2m)}°F`;
    document.getElementById('wind-speed').textContent = `${windDir} ${Math.round(cur.wind_speed_10m)} mph`;
    document.getElementById('barometer').textContent = `${inHg} inHg`;
  } catch (err) {
    console.warn('Weather API fallback', err);
  }

  // 2. NOAA CO-OPS API (Station 8531680 - High/Low Tide Predictions & Water Temp)
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    // Fetch next High/Low tide
    const tideUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=24&station=8531680&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=nj_bass_tracker&format=json`;
    const tideRes = await fetch(tideUrl);
    const tideData = await tideRes.json();

    if (tideData.predictions && tideData.predictions.length > 0) {
      const now = new Date();
      const upcoming = tideData.predictions.find(p => new Date(p.t.replace(' ', 'T')) > now) || tideData.predictions[0];
      const typeLabel = upcoming.type === 'H' ? 'High' : 'Low';
      const timePart = upcoming.t.split(' ')[1];
      document.getElementById('next-tide').textContent = `${typeLabel} @ ${timePart}`;
    }

    // Fetch live water temp
    const tempUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8531680&product=water_temperature&units=english&time_zone=lst_ldt&application=nj_bass_tracker&format=json`;
    const tempRes = await fetch(tempUrl);
    const tempData = await tempRes.json();
    if (tempData.data && tempData.data[0] && tempData.data[0].v) {
      document.getElementById('water-temp').textContent = `${ parseFloat(tempData.data[0].v).toFixed(1) }°F`;
    }
  } catch (err) {
    document.getElementById('next-tide').textContent = 'See Local Chart';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSharedLayout();
  loadMarineTelemetry();
});