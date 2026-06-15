document.addEventListener('DOMContentLoaded', function () {

  // ========= 1. 目录编号注入 =========
  (function () {
    const tocContent = document.querySelector('.toc-card__content');
    if (!tocContent) return;
    const ol = tocContent.querySelector('ol');
    if (!ol) return;

    const counters = [];
    function processList(list, depth) {
      const items = list.children;
      for (let i = 0; i < items.length; i++) {
        const li = items[i];
        counters[depth] = (counters[depth] || 0) + 1;
        counters.splice(depth + 1);
        const a = li.querySelector(':scope > a');
        if (a) {
          const numStr = counters.join('.');
          a.innerHTML = '<span class="toc-num">' + numStr + '</span><span class="toc-text">' + a.innerText.trim() + '</span>';
        }
        const nestedOl = li.querySelector(':scope > ol');
        if (nestedOl) {
          nestedOl.classList.add('toc-sub-list');
          if (depth >= 0) li.classList.add('toc-collapsed');
          processList(nestedOl, depth + 1);
        }
      }
    }
    processList(ol, 0);

    const allSubLists = document.querySelectorAll('.toc-sub-list');
    allSubLists.forEach(function (sub) { sub.style.display = 'none'; });

    // Scroll spy
    const tocLinks = tocContent.querySelectorAll('a');
    const linkMap = new Map();
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) linkMap.set(href.substring(1), link);
    });

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(function (h) { return h.id && linkMap.has(h.id); });
    if (headings.length === 0) return;

    let activeLink = null;

    function expandOnlyForH1(h1Link) {
      const topLiElements = tocContent.querySelectorAll(':scope > ol > li');
      topLiElements.forEach(function (li) {
        const a = li.querySelector(':scope > a');
        const subOl = li.querySelector(':scope > ol');
        if (a && a === h1Link) {
          if (subOl) { subOl.style.display = ''; li.classList.remove('toc-collapsed'); }
        } else {
          if (subOl) { subOl.style.display = 'none'; li.classList.add('toc-collapsed'); }
        }
      });
    }

    const observer = new IntersectionObserver(function (entries) {
      const visible = entries.filter(function (e) { return e.isIntersecting; })
        .map(function (e) { return e.target; })
        .sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      if (visible.length > 0) {
        const topHeading = visible[0];
        const newLink = linkMap.get(topHeading.id);
        if (newLink && newLink !== activeLink) {
          if (activeLink) activeLink.classList.remove('active');
          newLink.classList.add('active');
          activeLink = newLink;
          let h1Link = newLink;
          const parentLi = h1Link.closest('li');
          if (parentLi) {
            const parentOl = parentLi.closest('ol');
            if (parentOl) {
              const parentTopLi = parentOl.closest('li');
              if (parentTopLi) {
                const parentA = parentTopLi.querySelector(':scope > a');
                if (parentA) h1Link = parentA;
              }
            }
          }
          expandOnlyForH1(h1Link);
        }
      }
    }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

    headings.forEach(function (h) { observer.observe(h); });

    window.addEventListener('scroll', function () {
      const anyVisible = headings.some(function (h) {
        var rect = h.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      if (!anyVisible && activeLink) {
        activeLink.classList.remove('active');
        activeLink = null;
        allSubLists.forEach(function (sub) { sub.style.display = 'none'; });
      }
    }, { passive: true });
  })();

  // ========= 2. 代码块增强 =========
  (function () {
    document.querySelectorAll('pre.highlight').forEach(function (pre) {
      if (!pre.querySelector('.code-copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = '复制';
        btn.addEventListener('click', function () {
          const code = pre.querySelector('code');
          if (!code) return;
          navigator.clipboard.writeText(code.innerText).then(function () {
            btn.textContent = '已复制';
            setTimeout(function () { btn.textContent = '复制'; }, 2000);
          });
        });
        pre.appendChild(btn);
      }
      const code = pre.querySelector('code');
      if (!code || code.querySelector('.code-line')) return;
      const lines = code.innerHTML.split('\n');
      const clean = lines.length && lines[lines.length - 1].trim() === ''
        ? lines.slice(0, -1) : lines;
      code.innerHTML = clean.map(function (line) {
        return '<span class="code-line">' + (line || '&nbsp;') + '</span>';
      }).join('\n');
      code.classList.add('has-line-numbers');
      pre.classList.add('line-numbers');
    });
  })();

  // ========= 3. 暗色模式 =========
  (function () {
    const STORAGE_KEY = 'blog-theme';
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', '切换暗色模式');
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.title = '切换暗色/亮色模式';

    function setTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }

    // 初始化：优先 localStorage，其次系统偏好，默认暗色
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('dark');
    }

    // 监听系统偏好变化（仅当用户未手动设置时）
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      setTheme(next);
    });

    // 注入到 masthead 导航栏
    const nav = document.querySelector('.greedy-nav .visible-links');
    if (nav) {
      const li = document.createElement('li');
      li.className = 'masthead__menu-item theme-toggle-item';
      li.appendChild(toggle);
      nav.appendChild(li);
    }
  })();

  // ========= 4. 回到顶部按钮 =========
  (function () {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '回到顶部');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.title = '回到顶部';

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 400) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);
  })();

  // ========= 5. 粒子背景画布 =========
  (function () {
    if (document.getElementById('particle-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 在暗色模式下使用蓝色粒子，亮色模式使用绿色粒子
    function getColor() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return isDark ? '88,166,255' : '26,188,156';
    }

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const rgb = getColor();
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ',' + p.a + ')';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - dist / 150) * 0.08) + ')';
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();

    // 主题切换时重新绘制（颜色变化）
    const observer = new MutationObserver(function () {
      if (canvas) { /* color will update on next frame via getColor() */ }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  // ========= 6. 阅读进度条 =========
  (function () {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.appendChild(bar);

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          bar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

});
