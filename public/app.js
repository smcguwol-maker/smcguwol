const switcher = document.querySelector('[data-room-switcher]');
if (switcher) {
  const choices = [...switcher.querySelectorAll('.room-choice')];
  const panels = choices.map(choice => document.querySelector(choice.getAttribute('href')));
  const list = switcher.querySelector('.room-choices');
  if (choices.length && panels.every(Boolean)) {
    const mobilePrimary = document.querySelector('[data-mobile-primary]');
    const mobileSecondary = document.querySelector('[data-mobile-secondary]');
    const telephone = mobileSecondary?.getAttribute('href');
    function select(index, moveFocus = false) {
      choices.forEach((choice, i) => {
        choice.setAttribute('aria-selected', String(i === index));
        choice.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      const booking = panels[index].querySelector('.inline-book');
      if (booking && mobilePrimary && mobileSecondary) {
        const href = booking.getAttribute('href');
        const byPhone = href.startsWith('tel:');
        mobilePrimary.classList.toggle('naver-book', !byPhone);
        mobilePrimary.setAttribute('href', href);
        if (byPhone) mobilePrimary.removeAttribute('target');
        else mobilePrimary.setAttribute('target', '_blank');
        mobilePrimary.querySelector('[data-mobile-room]').textContent = panels[index].dataset.bookingRoom;
        mobilePrimary.querySelector('[data-mobile-action]').textContent = byPhone ? 'C6 홀 전화 문의 ↗' : '네이버 예약 ↗';
        mobileSecondary.setAttribute('href', byPhone ? '#rates' : telephone);
        mobileSecondary.textContent = byPhone ? '전체 요금표' : '전화 문의';
      }
      if (moveFocus) choices[index].focus();
    }
    switcher.classList.add('is-enhanced');
    list.setAttribute('role', 'tablist');
    const mobile = window.matchMedia('(max-width: 700px)');
    const orient = () => list.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical');
    orient();
    mobile.addEventListener('change', orient);
    choices.forEach((choice, index) => {
      choice.setAttribute('role', 'tab');
      choice.setAttribute('aria-controls', panels[index].id);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', choice.id);
      panels[index].tabIndex = 0;
      choice.addEventListener('click', event => { event.preventDefault(); select(index); });
      choice.addEventListener('keydown', event => {
        const next = mobile.matches ? 'ArrowRight' : 'ArrowDown';
        const previous = mobile.matches ? 'ArrowLeft' : 'ArrowUp';
        let target;
        if (event.key === next) target = (index + 1) % choices.length;
        else if (event.key === previous) target = (index - 1 + choices.length) % choices.length;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = choices.length - 1;
        else if (event.key === ' ') target = index;
        if (target !== undefined) { event.preventDefault(); select(target, true); }
      });
    });
    // An incoming room link takes priority; otherwise start with the personal practice room.
    const requested = panels.findIndex(panel => '#' + panel.id === location.hash);
    select(requested < 0 ? 0 : requested);
    window.addEventListener('hashchange', () => {
      const index = panels.findIndex(panel => '#' + panel.id === location.hash);
      if (index >= 0) select(index);
    });
  }
}
// A menu link to prices should reveal the table as well as scroll to it.
function showRates() {
  if (location.hash === '#rates') document.querySelector('.rates-disclosure').open = true;
}
showRates();
window.addEventListener('hashchange', showRates);
document.querySelectorAll('a[href="#rates"]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.rates-disclosure').open = true;
}));
// This link changes with the chosen room; it can already have the #rates hash.
document.querySelector('[data-mobile-secondary]')?.addEventListener('click', event => {
  if (event.currentTarget.getAttribute('href') === '#rates') document.querySelector('.rates-disclosure').open = true;
});

// Keep the image links usable even when dialogs or JavaScript are unavailable.
const viewer = document.querySelector('.photo-viewer');
if (viewer && typeof viewer.showModal === 'function') {
  let opener;
  document.querySelectorAll('.room-image').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const source = link.querySelector('img');
      const picture = viewer.querySelector('img');
      picture.src = link.href;
      picture.alt = source.alt;
      picture.width = Number(source.getAttribute('width'));
      picture.height = Number(source.getAttribute('height'));
      viewer.querySelector('figcaption').textContent = source.alt;
      viewer.querySelector('h2').textContent = link.closest('.room-panel').querySelector('.room-caption').textContent;
      opener = link;
      viewer.showModal();
      document.body.classList.add('photo-open');
    });
  });
  viewer.querySelector('.photo-close')?.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('photo-open');
    opener?.focus({ preventScroll: true });
  });
}

const copyAddress = document.querySelector('.copy-address');
if (copyAddress && navigator.clipboard?.writeText) {
  copyAddress.hidden = false;
  copyAddress.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('.visit-address address').textContent.trim());
      status.textContent = '주소를 복사했습니다.';
    } catch {
      status.textContent = '주소를 길게 누르거나 선택해 복사해 주세요.';
    }
  });
}
