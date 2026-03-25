// SMART TRAVEL ITINERARY PLANNER — APP JS
// Backend: Flask/FastAPI at http://localhost:5000

const API_BASE = 'http://localhost:5000';
let currentItinerary = null;
let activeDay = 0;

// ============ NAVIGATION ============
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function setActive(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
}

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const cta = document.querySelector('.nav-cta');
  if (links) links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  if (cta) cta.style.display = cta.style.display === 'block' ? 'none' : 'block';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.4)' : '';
});

// ============ TRAVELER COUNT ============
function changeTravelers(delta) {
  const input = document.getElementById('travelers');
  const cur = parseInt(input.value) || 2;
  const next = Math.max(1, Math.min(20, cur + delta));
  input.value = next;
}

// ============ FORM SUBMIT ============
document.getElementById('tripForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const destination = document.getElementById('destination').value.trim();
  const startDate   = document.getElementById('startDate').value;
  const endDate     = document.getElementById('endDate').value;
  const budget      = parseFloat(document.getElementById('budget').value);
  const travelers   = parseInt(document.getElementById('travelers').value);
  const prefs       = [...document.querySelectorAll('input[name="pref"]:checked')].map(c => c.value);

  if (!destination) return showToast('Please enter a destination ✈️');
  if (!startDate || !endDate) return showToast('Please select your travel dates 📅');
  if (new Date(endDate) <= new Date(startDate)) return showToast('End date must be after start date');
  if (!budget || budget <= 0) return showToast('Please enter your budget 💰');

  const payload = { destination, startDate, endDate, budget, travelers, preferences: prefs };

  setLoading(true);

  try {
    // ── Try real backend first ──────────────────────────────────────────────
    const response = await fetchWithTimeout(`${API_BASE}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, 6000);

    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    renderItinerary(data, payload);

  } catch (err) {
    // ── Fall back to demo data ──────────────────────────────────────────────
    console.warn('Backend not available, using demo data:', err.message);
    const demo = buildDemoItinerary(payload);
    renderItinerary(demo, payload);
  }

  setLoading(false);
  showSection('dashboard');
  setActive(document.querySelectorAll('.nav-link')[2]);
  showToast(`✦ Itinerary for ${destination} is ready!`);
});

// ============ LOADING STATE ============
function setLoading(on) {
  const btn  = document.getElementById('submitBtn');
  const txt  = document.getElementById('btnText');
  const ldr  = document.getElementById('btnLoader');
  btn.disabled = on;
  txt.classList.toggle('hidden', on);
  ldr.classList.toggle('hidden', !on);
}

// ============ FETCH WITH TIMEOUT ============
function fetchWithTimeout(url, opts, ms = 5000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

// ============ BUILD DEMO ITINERARY ============
function buildDemoItinerary(payload) {
  const demo = DEMO_ITINERARIES.default;
  const start = new Date(payload.startDate);
  const end   = new Date(payload.endDate);
  const numDays = Math.max(1, Math.round((end - start) / 86400000) + 1);

  return {
    destination: payload.destination,
    startDate:   payload.startDate,
    endDate:     payload.endDate,
    budget:      payload.budget,
    travelers:   payload.travelers,
    days: demo.days.slice(0, numDays).map((d, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return { ...d, date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    })
  };
}

// ============ LOAD DEMO ITINERARY ============
function loadDemoItinerary() {
  const demo = DEMO_ITINERARIES.default;
  const payload = {
    destination: demo.destination,
    startDate:   demo.startDate,
    endDate:     demo.endDate,
    budget:      demo.budget,
    travelers:   demo.travelers,
  };
  const itinerary = buildDemoItinerary(payload);
  renderItinerary(itinerary, payload);
}

// ============ RENDER ITINERARY ============
function renderItinerary(data, payload) {
  currentItinerary = data;
  activeDay = 0;

  const numDays = data.days.length;
  const totalPlaces = data.days.reduce((s, d) => s + d.activities.length, 0);

  // Header
  document.getElementById('dashTitle').textContent = data.destination;
  document.getElementById('dashBadge').textContent = 'Your Journey ✦';

  const startLabel = formatDate(data.startDate);
  const endLabel   = formatDate(data.endDate);
  document.getElementById('dashMeta').textContent =
    `${startLabel} – ${endLabel} · ${data.travelers} Traveler${data.travelers > 1 ? 's' : ''} · $${Number(data.budget).toLocaleString()} Budget`;

  // Stats
  document.getElementById('statDays').textContent     = numDays;
  document.getElementById('statPlaces').textContent   = totalPlaces;
  document.getElementById('statBudget').textContent   = `$${Number(data.budget).toLocaleString()}`;
  document.getElementById('statTravelers').textContent = data.travelers;

  // Map label
  const city = data.destination.split(',')[0];
  document.getElementById('mapCity').textContent = city;

  // Progress bar (Day 1)
  updateProgress(1, numDays);

  // Day Tabs
  renderDayTabs(data.days);

  // First day cards
  renderDayCards(data.days[0]);

  // Recommendations
  renderRecommendations(data.destination);
}

function renderDayTabs(days) {
  const container = document.getElementById('dayTabs');
  container.innerHTML = '';
  days.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = `day-tab${i === 0 ? ' active' : ''}`;
    btn.innerHTML = `<span>Day ${day.day}</span>`;
    if (day.date) btn.title = day.date;
    btn.onclick = () => {
      document.querySelectorAll('.day-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDay = i;
      renderDayCards(days[i]);
      updateProgress(i + 1, days.length);
    };
    container.appendChild(btn);
  });
}

function renderDayCards(day) {
  const container = document.getElementById('itineraryCards');
  container.innerHTML = '';

  // Day heading
  const heading = document.createElement('div');
  heading.style.cssText = 'font-family:var(--font-display);font-size:22px;font-weight:300;color:var(--text);margin-bottom:4px;';
  heading.innerHTML = `Day ${day.day} — <em style="font-style:italic;color:var(--accent)">${day.label || 'Exploration'}</em>`;
  container.appendChild(heading);

  if (day.date) {
    const sub = document.createElement('div');
    sub.style.cssText = 'font-size:12px;color:var(--text3);margin-bottom:16px;letter-spacing:0.05em;text-transform:uppercase;';
    sub.textContent = day.date;
    container.appendChild(sub);
  }

  day.activities.forEach((act, idx) => {
    const card = document.createElement('div');
    card.className = 'itin-card';
    card.style.animationDelay = `${idx * 0.06}s`;

    const [hour, min] = (act.time || '09:00').split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);

    card.innerHTML = `
      <div class="itin-time">
        <div class="itin-time-main">${h12}:${min}</div>
        <div class="itin-time-ampm">${ampm}</div>
        <div class="itin-time-dot"></div>
      </div>
      <div class="itin-body">
        <div class="itin-header">
          <div class="itin-name">${escHtml(act.name)}</div>
          <div class="itin-tag">${escHtml(act.type || 'Activity')}</div>
        </div>
        <div class="itin-note">${escHtml(act.note || '')}</div>
        <div class="itin-meta">
          <div class="itin-meta-item">⏱ ${escHtml(act.duration || '1 hr')}</div>
          ${act.cost ? `<div class="itin-meta-item">💸 ${escHtml(act.cost)}</div>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderRecommendations(destination) {
  const list = document.getElementById('recList');
  list.innerHTML = '';
  const recs = RECOMMENDATIONS.default;

  recs.forEach((rec, i) => {
    const item = document.createElement('div');
    item.className = 'rec-item';
    item.innerHTML = `
      <div class="rec-emoji">${rec.emoji}</div>
      <div class="rec-info">
        <div class="rec-name">${rec.name}</div>
        <div class="rec-meta">
          <span class="rec-rating">${rec.rating}</span>
          <span class="rec-duration">· ${rec.duration}</span>
          <span class="rec-duration">· ${rec.category}</span>
        </div>
      </div>
      <button class="rec-add-btn" title="Add to itinerary" onclick="addRecommendation(this, '${escHtml(rec.name)}')">+</button>
    `;
    list.appendChild(item);
  });
}

function addRecommendation(btn, name) {
  if (btn.classList.contains('added')) return;
  btn.classList.add('added');
  btn.textContent = '✓';
  showToast(`Added "${name}" to your itinerary`);
}

function updateProgress(day, total) {
  const pct = Math.round((day / total) * 100);
  document.getElementById('progFill').style.width = pct + '%';
  document.getElementById('progDays').textContent = `Day ${day} of ${total}`;
}

// ============ EXPORT (DEMO) ============
function exportItinerary() {
  showToast('📄 PDF export ready — connect your backend to enable!');
}

// ============ HELPERS ============
function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Set default date range
  const today = new Date();
  const next7 = new Date(today);
  next7.setDate(today.getDate() + 7);
  const fmt = d => d.toISOString().split('T')[0];
  const sd = document.getElementById('startDate');
  const ed = document.getElementById('endDate');
  if (sd) sd.min = fmt(today);
  if (sd) sd.value = fmt(new Date(today.setDate(today.getDate() + 14)));
  if (ed) ed.value = fmt(next7);

  // Enforce end > start
  if (sd && ed) {
    sd.addEventListener('change', () => { if (ed.value <= sd.value) ed.value = ''; });
  }
});
