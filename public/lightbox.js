(function () {
  function init() {
    var content = document.querySelector('.sl-markdown-content');
    if (!content) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '图片预览');
    overlay.hidden = true;

    var preview = document.createElement('img');
    overlay.appendChild(preview);
    document.body.appendChild(overlay);

    function close() {
      overlay.hidden = true;
      preview.removeAttribute('src');
      document.body.style.overflow = '';
    }

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !overlay.hidden) close();
    });

    var images = content.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      if (image.closest('a')) continue;
      if (image.dataset.lightbox === 'off') continue;
      image.classList.add('lightbox-trigger');
      image.addEventListener('click', function () {
        preview.src = this.currentSrc || this.src;
        preview.alt = this.alt || '';
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
