document.addEventListener('DOMContentLoaded', function () {
  // ========= 1. 目录编号注入（序号 + 标题都放在 <a> 内） =========
  const tocContent = document.querySelector('.toc-card__content');
  if (!tocContent) return;

  const ol = tocContent.querySelector('ol');
  if (!ol) return;

  // 递归遍历，计算编号并注入 <span>
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
        const originalText = a.innerText.trim();
        a.innerHTML = `<span class="toc-num">${numStr}</span><span class="toc-text">${originalText}</span>`;
      }

      const nestedOl = li.querySelector(':scope > ol');
      if (nestedOl) {
        // 给二级和更深层的列表添加折叠类，默认折叠
        nestedOl.classList.add('toc-sub-list');
        if (depth >= 0) {   // depth === 0 表示二级列表（h2 下的 ol）
          li.classList.add('toc-collapsed');   // 默认折叠
        }
        processList(nestedOl, depth + 1);
      }
    }
  }

  processList(ol, 0);

  // 初始：所有二级目录折叠
  const allSubLists = document.querySelectorAll('.toc-sub-list');
  allSubLists.forEach(sub => {
    sub.style.display = 'none';
  });

  // ========= 2. 目录自动折叠/展开（根据当前激活的标题） =========
  const tocLinks = tocContent.querySelectorAll('a');
  const linkMap = new Map();
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      linkMap.set(href.substring(1), link);
    }
  });

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .filter(h => h.id && linkMap.has(h.id));

  if (headings.length === 0) return;

  let activeLink = null;

  // 辅助函数：折叠所有兄弟子列表，只展开指定一级标题下的子列表
  function expandOnlyForH1(h1Link) {
    // 找到所有顶级 li（一级标题项）
    const topLiElements = tocContent.querySelectorAll(':scope > ol > li');
    topLiElements.forEach(li => {
      // 找到该 li 下的 a（一级链接）
      const a = li.querySelector(':scope > a');
      // 该 li 下的子 ol（二级列表）
      const subOl = li.querySelector(':scope > ol');
      if (a && a === h1Link) {
        // 当前激活的一级标题，展开其子列表
        if (subOl) {
          subOl.style.display = '';
          li.classList.remove('toc-collapsed');
        }
      } else {
        // 非激活一级标题，折叠
        if (subOl) {
          subOl.style.display = 'none';
          li.classList.add('toc-collapsed');
        }
      }
    });
  }

  // ========= 3. Scroll Spy（高亮 + 控制折叠） =========
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .map(e => e.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    if (visible.length > 0) {
      const topHeading = visible[0];
      const newLink = linkMap.get(topHeading.id);
      if (newLink && newLink !== activeLink) {
        if (activeLink) activeLink.classList.remove('active');
        newLink.classList.add('active');
        activeLink = newLink;

        // 找到该链接所属的一级标题链接（若是子标题，向上查找）
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
        // 只展开当前一级标题的子列表
        expandOnlyForH1(h1Link);
      }
    }
  }, {
    rootMargin: '-10% 0px -80% 0px',
    threshold: 0
  });

  headings.forEach(h => observer.observe(h));

  // 页面无标题可见时清除高亮并折叠所有子列表
  window.addEventListener('scroll', () => {
    const anyVisible = headings.some(h => {
      const rect = h.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (!anyVisible && activeLink) {
      activeLink.classList.remove('active');
      activeLink = null;
      // 折叠所有子列表
      allSubLists.forEach(sub => sub.style.display = 'none');
    }
  }, { passive: true });
});