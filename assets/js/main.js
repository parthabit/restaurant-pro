/* HIGH GARDEN — shared front-end behaviour */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 900);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hide'), 2500);

  /* ---------- Dark / light mode ---------- */
  const modeBtn = document.getElementById('modeToggle');
  const applyMode = (m) => {
    document.documentElement.classList.toggle('light', m === 'light');
    if (modeBtn) modeBtn.innerHTML = m === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  };
  applyMode(localStorage.getItem('hg-mode') || 'dark');
  if (modeBtn) modeBtn.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('hg-mode', next);
    applyMode(next);
  });

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const animRing = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();
    document.querySelectorAll('a, button, .tilt, .fav-btn').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const bar = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (bar) bar.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('show', h.scrollTop > 600);
    if (header) header.classList.toggle('scrolled', h.scrollTop > 30);
  });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const target = parseFloat(e.target.dataset.count);
      const decimals = (e.target.dataset.count.split('.')[1] || '').length;
      const dur = 1400; const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const val = target * (1 - Math.pow(1 - p, 3));
        e.target.textContent = val.toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else e.target.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Ripple on buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
  });

  /* ---------- 3D tilt cards ---------- */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)');
  });

  /* ---------- Particles (hero ambience) ---------- */
  const pc = document.getElementById('particles');
  if (pc) {
    const ctx = pc.getContext('2d');
    let w, h, particles = [];
    const resize = () => { w = pc.width = pc.offsetWidth; h = pc.height = pc.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const N = 46;
    for (let i = 0; i < N; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.4, s: Math.random() * 0.4 + 0.08, o: Math.random() * 0.5 + 0.15 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.s;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(212,175,55,${p.o})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Hero mouse parallax ---------- */
  const heroBg = document.querySelector('.hero-bg img');
  const hero = document.querySelector('.hero');
  if (heroBg && hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      heroBg.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });
  }

  /* ---------- AOS-style init (fallback if AOS lib present) ---------- */
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

  /* ---------- Favorite toggle (dish cards) ---------- */
  document.querySelectorAll('.fav-btn').forEach(b => {
    b.addEventListener('click', (e) => { e.preventDefault(); b.classList.toggle('active'); });
  });

});
