const switcher = document.querySelector('[data-room-switcher]');
if (switcher) {
  const choices = [...switcher.querySelectorAll('.room-choice')];
  const panels = choices.map(choice => document.querySelector(choice.getAttribute('href')));
  const list = switcher.querySelector('.room-choices');
  if (choices.length && panels.every(Boolean)) {
    function select(index, moveFocus = false) {
      choices.forEach((choice, i) => {
        choice.setAttribute('aria-selected', String(i === index));
        choice.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
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
