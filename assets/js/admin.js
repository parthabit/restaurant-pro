/* HIGH GARDEN — Admin Dashboard logic (demo, localStorage-backed) */

/* ---------- Auth guard ---------- */
if (sessionStorage.getItem('hg-admin-auth') !== '1') {
  window.location.href = 'login.html';
}

/* ---------- Seed data ---------- */
const DEFAULT_DISHES = [
  {name:"Gavti Kebab Platter", cat:"Kebabs", veg:false, tag:"popular", price:495, img:"https://lh3.googleusercontent.com/p/AF1QipPd88NXHz8zXVx3okAtz1cw-TuCrH7DZtHd2gWP=s400", desc:"Smoked, hand-pounded spice, charred over open flame."},
  {name:"Prawns Matka Biryani", cat:"Biryani", veg:false, tag:"chef", price:725, img:"https://lh3.googleusercontent.com/p/AF1QipOvs6qiuyD2g-qjSTaEhnNRCoHpzD3bV1w_E63w=s400", desc:"Slow-sealed in a clay pot, finished tableside."},
  {name:"Honey Chilli Lotus Stem", cat:"Chinese", veg:true, tag:"popular", price:375, img:"https://lh3.googleusercontent.com/p/AF1QipO4vN6Ff0Lu8G92LDfh0nJcoT9tSW88i1X3UVOp=s400", desc:"Crisp-fried lotus root, sticky chilli glaze."},
  {name:"Chilli Cheese Garlic Naan", cat:"Italian", veg:true, tag:"popular", price:295, img:"https://lh3.googleusercontent.com/p/AF1QipPwvo_V-6S7BTPsRCxQbX08pDJpecRgMvNElu2F=s400", desc:"Wood-fired, molten centre."},
  {name:"Chikmagalur Coffee Ice Cream", cat:"Desserts", veg:true, tag:"chef", price:325, img:"https://lh3.googleusercontent.com/p/AF1QipPE_F2o4UmkGom4fqrQ3q7xgBG_fTS19WbBTqND=s400", desc:"Filter kapi, bittersweet, coffee crumble."},
  {name:"Signature Skyline Mule", cat:"Cocktails", veg:true, tag:"popular", price:495, img:"https://lh3.googleusercontent.com/p/AF1QipPHwCE_N-YFIBSw32hsWkECIovQZFEdmJ2k0gIr=s400", desc:"House gin, ginger beer, fresh lime."},
];
const DEFAULT_GALLERY = [
  {img:"https://lh3.googleusercontent.com/p/AF1QipNm-fSSVPxMK_EPerMF6ZEbEVM3lcqolz-TmZpE=s400", cap:"Terrace seating", cat:"interior"},
  {img:"https://lh3.googleusercontent.com/p/AF1QipOe_LCqstDulzU8x42-kpo7PLwGYdrqlNm1ZfoM=s400", cap:"Evening ambience", cat:"night"},
  {img:"https://lh3.googleusercontent.com/p/AF1QipNdCz54hQxYZ9K5PTa8CyTStnbzg_vbqmt-QNQv=s400", cap:"Guests on the terrace", cat:"people"},
  {img:"https://lh3.googleusercontent.com/p/AF1QipNgTBRqOoYcXlTdW2shMb0x0cldIAfcKy-IzUoE=s400", cap:"Full spread, family style", cat:"food"},
];
const DEFAULT_EVENTS = [
  {name:"Birthdays", desc:"Custom cake tables, skyline backdrops.", icon:"fa-solid fa-cake-candles"},
  {name:"Corporate Events", desc:"Private sections with AV support.", icon:"fa-solid fa-briefcase"},
  {name:"Anniversaries", desc:"Curated set menus for two, or two hundred.", icon:"fa-solid fa-rings-wedding"},
  {name:"Private Dining", desc:"Full-terrace buyouts for milestone nights.", icon:"fa-solid fa-lock"},
];
const REVIEWS = [
  {who:"Omkar N.", rating:5, text:"The rooftop setting turned a simple catch-up with old friends into something memorable.", src:"Google"},
  {who:"Supriya", rating:5, text:"The owner personally saw to every detail for our accessible community event — outstanding staff.", src:"Google"},
  {who:"Suraj K.", rating:5, text:"The matka biryani held its own against places that only do biryani. Great draught beer selection too.", src:"Google"},
  {who:"@priyanka.eats", rating:5, text:"Best rooftop in Shivajinagar — golden hour views are unmatched.", src:"Instagram"},
];

const store = {
  get(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};
if(!localStorage.getItem('hg-menu')) store.set('hg-menu', DEFAULT_DISHES);
if(!localStorage.getItem('hg-gallery')) store.set('hg-gallery', DEFAULT_GALLERY);
if(!localStorage.getItem('hg-events')) store.set('hg-events', DEFAULT_EVENTS);

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dark/light mode ---------- */
  const modeBtn = document.getElementById('modeToggle');
  const applyMode = (m) => {
    document.documentElement.classList.toggle('light', m === 'light');
    if (modeBtn) modeBtn.innerHTML = m === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  };
  applyMode(localStorage.getItem('hg-mode') || 'dark');
  if (modeBtn) modeBtn.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('hg-mode', next); applyMode(next);
  });

  /* ---------- Sidebar nav ---------- */
  const navLinks = document.querySelectorAll('.admin-nav a[data-sec], [data-sec]');
  function showSection(sec){
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + sec);
    if(target) target.classList.add('active');
    document.querySelectorAll('.admin-nav a').forEach(a => a.classList.toggle('active', a.dataset.sec === sec));
    const titleMap = { dashboard:'Dashboard', reservations:'Reservations', menu:'Manage Menu', gallery:'Manage Gallery', events:'Manage Events', reviews:'Customer Reviews', newsletter:'Newsletter Subscribers', settings:'Website Settings', analytics:'Analytics', profile:'Profile' };
    document.getElementById('pageTitle').textContent = titleMap[sec] || 'Dashboard';
    if(sec === 'analytics') renderAnalyticsCharts();
    document.getElementById('sidebar').classList.remove('open');
  }
  navLinks.forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); showSection(a.dataset.sec); }));
  document.getElementById('sidebarToggle')?.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('hg-admin-auth');
    window.location.href = 'login.html';
  });

  document.getElementById('notifBtn').addEventListener('click', () => {
    document.getElementById('notifDot').style.display = 'none';
    alert('Notifications:\n• 3 new reservation requests\n• 1 new review posted\n• Happy hour promo ends in 2 days');
  });

  /* ---------- Modals ---------- */
  document.querySelectorAll('.modal-close').forEach(c => c.addEventListener('click', () => document.getElementById(c.dataset.close).classList.remove('open')));
  document.querySelectorAll('.modal-form').forEach(m => m.addEventListener('click', (e) => { if(e.target === m) m.classList.remove('open'); }));

  /* =========================================================
     DASHBOARD
  ========================================================= */
  function loadReservations(){ return store.get('hg-reservations', []); }

  function renderDashboard(){
    const res = loadReservations();
    const today = new Date().toISOString().slice(0,10);
    const todays = res.filter(r => r.date === today);
    document.getElementById('kpiToday').textContent = todays.length;
    document.getElementById('kpiTodayTrend').textContent = todays.length ? `${todays.length} pending` : 'No bookings yet';
    document.getElementById('kpiTotal').textContent = res.length;
    document.getElementById('kpiVisitors').textContent = (320 + res.length * 7).toLocaleString();
    document.getElementById('kpiRevenue').textContent = '₹' + (18500 + res.length * 640).toLocaleString();

    const tbody = document.getElementById('recentResBody');
    if(!res.length){ tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No reservation requests yet — bookings made on the public site will appear here.</td></tr>`; }
    else {
      tbody.innerHTML = res.slice(0,6).map(r => `
        <tr><td class="name-cell">${r.name}</td><td>${r.date || '—'} · ${r.time || '—'}</td><td>${r.guests || '—'}</td><td>${r.occasion || 'General dining'}</td>
        <td><span class="pill ${r.status||'pending'}">${r.status||'pending'}</span></td></tr>`).join('');
    }

    renderWeekChart(res);
    renderOccasionChart(res, 'chartOccasion');
  }

  function renderAllReservations(filter=''){
    const res = loadReservations().filter(r => (r.name||'').toLowerCase().includes(filter) || (r.phone||'').includes(filter));
    const tbody = document.getElementById('allResBody');
    if(!res.length){ tbody.innerHTML = `<tr><td colspan="7" class="empty-row">No reservation requests match.</td></tr>`; return; }
    tbody.innerHTML = res.map((r,i) => `
      <tr>
        <td class="name-cell">${r.name}</td>
        <td>${r.phone||''}<br><span style="font-size:11.5px;">${r.email||''}</span></td>
        <td>${r.date||'—'} · ${r.time||'—'}</td>
        <td>${r.guests||'—'}</td>
        <td>${r.occasion||'General dining'}</td>
        <td><span class="pill ${r.status||'pending'}">${r.status||'pending'}</span></td>
        <td class="row-actions">
          <button onclick="hgSetResStatus('${r.id}','confirmed')" title="Confirm"><i class="fa-solid fa-check"></i></button>
          <button onclick="hgSetResStatus('${r.id}','cancelled')" title="Cancel"><i class="fa-solid fa-xmark"></i></button>
        </td>
      </tr>`).join('');
  }
  window.hgSetResStatus = (id, status) => {
    const res = loadReservations();
    const item = res.find(r => r.id === id);
    if(item) item.status = status;
    store.set('hg-reservations', res);
    renderAllReservations(document.getElementById('resSearch').value.toLowerCase());
    renderDashboard();
  };
  document.getElementById('resSearch').addEventListener('input', (e) => renderAllReservations(e.target.value.toLowerCase()));
  document.getElementById('clearResBtn').addEventListener('click', () => {
    if(confirm('Clear all demo reservation data?')){ localStorage.removeItem('hg-reservations'); renderAllReservations(); renderDashboard(); }
  });

  /* =========================================================
     MENU CRUD
  ========================================================= */
  function renderMenuGrid(filter=''){
    const dishes = store.get('hg-menu', []);
    const grid = document.getElementById('dishCardGrid');
    const items = dishes.filter(d => d.name.toLowerCase().includes(filter));
    if(!items.length){ grid.innerHTML = `<div class="empty-row" style="grid-column:1/-1;">No dishes found.</div>`; return; }
    grid.innerHTML = items.map((d) => {
      const realIndex = dishes.indexOf(d);
      return `
      <div class="admin-card glass">
        <img src="${d.img}" alt="${d.name}">
        <div class="cname">${d.name}</div>
        <div class="cmeta">${d.cat} · ₹${d.price} · ${d.veg ? 'Veg' : 'Non-Veg'}</div>
        <div class="cactions">
          <button class="btn btn-ghost btn-sm" onclick="hgEditDish(${realIndex})"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-ghost btn-sm" onclick="hgDeleteDish(${realIndex})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
  }
  window.hgEditDish = (i) => {
    const dishes = store.get('hg-menu', []);
    const d = dishes[i];
    document.getElementById('dishModalTitle').textContent = 'Edit Dish';
    document.getElementById('dishIndex').value = i;
    document.getElementById('dName').value = d.name;
    document.getElementById('dCat').value = d.cat;
    document.getElementById('dPrice').value = d.price;
    document.getElementById('dImg').value = d.img;
    document.getElementById('dDesc').value = d.desc || '';
    document.getElementById('dVeg').value = d.veg ? 'true' : 'false';
    document.getElementById('dTag').value = d.tag || '';
    document.getElementById('dishModal').classList.add('open');
  };
  window.hgDeleteDish = (i) => {
    if(!confirm('Delete this dish?')) return;
    const dishes = store.get('hg-menu', []);
    dishes.splice(i,1);
    store.set('hg-menu', dishes);
    renderMenuGrid(document.getElementById('menuAdminSearch').value.toLowerCase());
  };
  document.getElementById('addDishBtn').addEventListener('click', () => {
    document.getElementById('dishForm').reset();
    document.getElementById('dishModalTitle').textContent = 'Add Dish';
    document.getElementById('dishIndex').value = '';
    document.getElementById('dishModal').classList.add('open');
  });
  document.getElementById('dishForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dishes = store.get('hg-menu', []);
    const idx = document.getElementById('dishIndex').value;
    const dish = {
      name: document.getElementById('dName').value,
      cat: document.getElementById('dCat').value,
      price: parseInt(document.getElementById('dPrice').value,10),
      img: document.getElementById('dImg').value,
      desc: document.getElementById('dDesc').value,
      veg: document.getElementById('dVeg').value === 'true',
      tag: document.getElementById('dTag').value,
    };
    if(idx === '') dishes.push(dish); else dishes[parseInt(idx,10)] = dish;
    store.set('hg-menu', dishes);
    document.getElementById('dishModal').classList.remove('open');
    renderMenuGrid();
  });
  document.getElementById('menuAdminSearch').addEventListener('input', (e) => renderMenuGrid(e.target.value.toLowerCase()));

  /* =========================================================
     GALLERY CRUD
  ========================================================= */
  function renderGalleryGrid(filter=''){
    const photos = store.get('hg-gallery', []);
    const grid = document.getElementById('galCardGrid');
    const items = photos.filter(p => p.cap.toLowerCase().includes(filter));
    if(!items.length){ grid.innerHTML = `<div class="empty-row" style="grid-column:1/-1;">No photos found.</div>`; return; }
    grid.innerHTML = items.map((p) => {
      const realIndex = photos.indexOf(p);
      return `
      <div class="admin-card glass">
        <img src="${p.img}" alt="${p.cap}">
        <div class="cname">${p.cap}</div>
        <div class="cmeta">${p.cat}</div>
        <div class="cactions"><button class="btn btn-ghost btn-sm" onclick="hgDeletePhoto(${realIndex})"><i class="fa-solid fa-trash"></i></button></div>
      </div>`;
    }).join('');
  }
  window.hgDeletePhoto = (i) => {
    if(!confirm('Delete this photo?')) return;
    const photos = store.get('hg-gallery', []);
    photos.splice(i,1);
    store.set('hg-gallery', photos);
    renderGalleryGrid();
  };
  document.getElementById('addPhotoBtn').addEventListener('click', () => document.getElementById('photoModal').classList.add('open'));
  document.getElementById('photoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const photos = store.get('hg-gallery', []);
    photos.unshift({ img: document.getElementById('pImg').value, cap: document.getElementById('pCap').value, cat: document.getElementById('pCat').value });
    store.set('hg-gallery', photos);
    document.getElementById('photoModal').classList.remove('open');
    document.getElementById('photoForm').reset();
    renderGalleryGrid();
  });
  document.getElementById('galAdminSearch').addEventListener('input', (e) => renderGalleryGrid(e.target.value.toLowerCase()));

  /* =========================================================
     EVENTS CRUD
  ========================================================= */
  function renderEventsGrid(){
    const events = store.get('hg-events', []);
    const grid = document.getElementById('eventCardGrid');
    if(!events.length){ grid.innerHTML = `<div class="empty-row" style="grid-column:1/-1;">No event types yet.</div>`; return; }
    grid.innerHTML = events.map((ev, i) => `
      <div class="admin-card glass">
        <div style="height:60px; display:flex; align-items:center;"><i class="${ev.icon}" style="font-size:22px; color:var(--gold);"></i></div>
        <div class="cname">${ev.name}</div>
        <div class="cmeta">${ev.desc}</div>
        <div class="cactions"><button class="btn btn-ghost btn-sm" onclick="hgDeleteEvent(${i})"><i class="fa-solid fa-trash"></i></button></div>
      </div>`).join('');
  }
  window.hgDeleteEvent = (i) => {
    if(!confirm('Delete this event type?')) return;
    const events = store.get('hg-events', []);
    events.splice(i,1);
    store.set('hg-events', events);
    renderEventsGrid();
  };
  document.getElementById('addEventBtn').addEventListener('click', () => document.getElementById('eventModal').classList.add('open'));
  document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const events = store.get('hg-events', []);
    events.push({ name: document.getElementById('eName').value, desc: document.getElementById('eDesc').value, icon: document.getElementById('eIcon').value || 'fa-solid fa-star' });
    store.set('hg-events', events);
    document.getElementById('eventModal').classList.remove('open');
    document.getElementById('eventForm').reset();
    renderEventsGrid();
  });

  /* =========================================================
     REVIEWS + NEWSLETTER
  ========================================================= */
  document.getElementById('reviewsBody').innerHTML = REVIEWS.map(r => `
    <tr><td class="name-cell">${r.who}</td><td>${'★'.repeat(r.rating)}</td><td>${r.text}</td><td>${r.src}</td></tr>`).join('');

  function renderSubscribers(){
    const subs = store.get('hg-subscribers', []);
    document.getElementById('subCount').textContent = `${subs.length} total`;
    const tbody = document.getElementById('subsBody');
    tbody.innerHTML = subs.length ? subs.map(s => `<tr><td class="name-cell">${s.email}</td><td>${new Date(s.date).toLocaleDateString()}</td></tr>`).join('')
      : `<tr><td colspan="2" class="empty-row">No subscribers yet — newsletter sign-ups from the site will appear here.</td></tr>`;
  }

  /* =========================================================
     CHARTS
  ========================================================= */
  let weekChart, occChart, occChart2, partyChart, trendChart;
  function renderWeekChart(res){
    const labels = []; const counts = [];
    for(let i=6;i>=0;i--){
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = d.toISOString().slice(0,10);
      labels.push(d.toLocaleDateString('en-IN',{weekday:'short'}));
      counts.push(res.filter(r=>r.date===key).length);
    }
    const ctx = document.getElementById('chartWeek');
    if(!ctx) return;
    if(weekChart) weekChart.destroy();
    weekChart = new Chart(ctx, { type:'line', data:{ labels, datasets:[{ label:'Reservations', data:counts, borderColor:'#D4AF37', backgroundColor:'rgba(212,175,55,0.15)', fill:true, tension:.4 }]},
      options: chartOpts(false) });
  }
  function renderOccasionChart(res, id){
    const map = {};
    res.forEach(r => { const o = r.occasion || 'General dining'; map[o] = (map[o]||0)+1; });
    if(!Object.keys(map).length){ map['General dining']=1; map['Birthday']=0; map['Anniversary']=0; }
    const ctx = document.getElementById(id);
    if(!ctx) return;
    const chart = new Chart(ctx, { type:'doughnut', data:{ labels:Object.keys(map), datasets:[{ data:Object.values(map), backgroundColor:['#D4AF37','#0B3D2E','#8fe3a4','#cbb3f0','#f3a0a0','#9DB3A2'] }]},
      options:{ plugins:{ legend:{ position:'bottom', labels:{ color:'#9DB3A2', font:{family:'Poppins',size:11} } } }, cutout:'62%' } });
    return chart;
  }
  function chartOpts(showLegend){
    return { plugins:{ legend:{ display:showLegend } }, scales:{ x:{ ticks:{ color:'#9DB3A2' }, grid:{ color:'rgba(255,255,255,0.06)' } }, y:{ ticks:{ color:'#9DB3A2' }, grid:{ color:'rgba(255,255,255,0.06)' }, beginAtZero:true } } };
  }
  function renderAnalyticsCharts(){
    const res = loadReservations();
    if(occChart2) occChart2.destroy();
    occChart2 = renderOccasionChart(res, 'chartOccasion2');
    const sizeMap = {};
    res.forEach(r => { const g = r.guests || 'Unspecified'; sizeMap[g] = (sizeMap[g]||0)+1; });
    if(!Object.keys(sizeMap).length){ ['1–2','3–4','5–8','9–14'].forEach(k=>sizeMap[k]=0); }
    const ctxP = document.getElementById('chartPartySize');
    if(partyChart) partyChart.destroy();
    partyChart = new Chart(ctxP, { type:'bar', data:{ labels:Object.keys(sizeMap), datasets:[{ label:'Bookings', data:Object.values(sizeMap), backgroundColor:'#D4AF37', borderRadius:6 }]}, options: chartOpts(false) });
    const labels=[]; const vals=[];
    for(let i=29;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); labels.push(d.getDate()); vals.push(Math.round(4+Math.random()*10)); }
    const ctxT = document.getElementById('chartTrend');
    if(trendChart) trendChart.destroy();
    trendChart = new Chart(ctxT, { type:'line', data:{ labels, datasets:[{ label:'Visitors (demo)', data:vals, borderColor:'#0B3D2E', backgroundColor:'rgba(11,61,46,0.35)', fill:true, tension:.35, pointRadius:0 }]}, options: chartOpts(false) });
  }

  /* ---------- Init ---------- */
  renderDashboard();
  renderAllReservations();
  renderMenuGrid();
  renderGalleryGrid();
  renderEventsGrid();
  renderSubscribers();
});
