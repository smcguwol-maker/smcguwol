(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (header && menu && nav) {
    const mobileLayout = window.matchMedia('(max-width:800px)');
    header.classList.add('nav-enhanced');
    menu.hidden = false;
    const closeMenu = (returnFocus = false) => {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      if (returnFocus) menu.focus();
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const wasOpen = menu.getAttribute('aria-expanded') === 'true';
      closeMenu();
      if (wasOpen && mobileLayout.matches) {
        const destination = document.getElementById(link.hash.slice(1));
        if (destination) {
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
        }
      }
    }));
    mobileLayout.addEventListener('change', () => closeMenu());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenu();
    });
  }

  const dialog = document.querySelector('#photo-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const photo = dialog.querySelector('#photo-full');
    const caption = dialog.querySelector('#photo-caption');
    let opener;
    document.querySelectorAll('.gallery-link').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        const thumbnail = link.querySelector('img');
        photo.src = link.href;
        photo.alt = thumbnail.alt;
        caption.textContent = link.closest('figure').querySelector('.gallery-title').textContent.trim();
        dialog.showModal();
        document.body.classList.add('dialog-open');
        dialog.querySelector('.dialog-close').focus();
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      photo.removeAttribute('src');
      opener?.focus();
    });
  }

  const copy = document.querySelector('.copy-address');
  const status = document.querySelector('#copy-status');
  if (copy && status && navigator.clipboard && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.address);
        status.textContent = '주소를 복사했습니다.';
      } catch {
        status.textContent = '복사 권한이 없습니다. 표시된 주소를 길게 눌러 복사해 주세요.';
      }
    });
  }

  if ('IntersectionObserver' in window && nav) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        nav.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();
