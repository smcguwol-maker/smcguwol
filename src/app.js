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
  const table = document.querySelector('.rates-disclosure');
  if (location.hash === '#rates' && table) table.open = true;
}
showRates();
window.addEventListener('hashchange', showRates);
document.querySelectorAll('a[href="#rates"]').forEach(link => link.addEventListener('click', () => {
  const table = document.querySelector('.rates-disclosure');
  if (table) table.open = true;
}));
// This link changes with the chosen room; it can already have the #rates hash.
document.querySelector('[data-mobile-secondary]')?.addEventListener('click', event => {
  const table = document.querySelector('.rates-disclosure');
  if (table && event.currentTarget.getAttribute('href') === '#rates') table.open = true;
});

// Reserve the actual bar height when enlarged text or a narrower screen adds lines.
const mobileBooking = document.querySelector('.mobile-booking');
if (mobileBooking && typeof ResizeObserver === 'function') {
  const reserveBookingSpace = () => {
    const height = Math.ceil(mobileBooking.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mobile-booking-height', `${height}px`);
  };
  new ResizeObserver(reserveBookingSpace).observe(mobileBooking);
  reserveBookingSpace();
}

// Preserve links shared before the one-page site became five pages.
if (location.pathname === '/') {
  const destinations = {rooms:'/rooms/',rates:'/rooms/#rates',faq:'/guide/',visit:'/visit/','booking-guide':'/booking/'};
  const oldTarget=location.hash.slice(1);
  if (oldTarget.startsWith('room-')) location.replace('/rooms/'+location.hash);
  else if(destinations[oldTarget]) location.replace(destinations[oldTarget]);
}

const helpDialog=document.querySelector('.help-dialog');
const helpLaunch=document.querySelector('.help-launch');
const helpConfig=document.getElementById('help-config');
if(helpDialog && helpLaunch && helpConfig && typeof helpDialog.showModal==='function') {
  const config=JSON.parse(helpConfig.textContent);
  const answer=helpDialog.querySelector('.help-answer');
  const input=document.getElementById('help-question');
  const submit=helpDialog.querySelector('button[type="submit"]');
  let pending;
  helpLaunch.hidden=false;
  helpLaunch.addEventListener('click',()=>{helpDialog.showModal();document.body.classList.add('photo-open');});
  helpDialog.querySelector('.help-close').addEventListener('click',()=>helpDialog.close());
  helpDialog.addEventListener('click',event=>{if(event.target===helpDialog)helpDialog.close();});
  helpDialog.addEventListener('close',()=>{pending?.abort();pending=null;submit.disabled=false;document.body.classList.remove('photo-open');helpLaunch.focus({preventScroll:true});});
  const text=message=>{answer.textContent=message;answer.dataset.state='ready';};
  const fallback='확인된 안내에서 답을 찾지 못했습니다. 요금·예약·주차·운영 시간 버튼을 선택하시거나 카카오톡·전화로 문의해 주세요.';
  function localAnswer(question) {
    const match=config.rules.find(([,pattern])=>new RegExp(pattern,'i').test(question));
    return match ? config.answers[match[0]] : '';
  }
  async function ask(question) {
    pending?.abort();pending=null;submit.disabled=false;
    question=question.trim();
    if(!question)return;
    if(question.length>200){text('질문은 200자 이내로 입력해 주세요.');return;}
    if(/\b01[016789][ -]?\d{3,4}[ -]?\d{4}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(question)){text('개인정보를 지우고 이용 방법만 질문해 주세요.');return;}
    const known=localAnswer(question);
    if(known || !config.endpoint){submit.disabled=false;text(known||fallback);return;}
    const controller=new AbortController();pending=controller;
    const timeout=setTimeout(()=>controller.abort(),12000);
    submit.disabled=true;answer.dataset.state='loading';answer.textContent='확인된 매장 안내를 찾고 있습니다…';
    try {
      const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question}),signal:controller.signal});
      if(!response.ok)throw Error('unavailable');
      const data=await response.json();
      if(typeof data.answer!=='string'||!data.answer.trim())throw Error('empty');
      if(pending===controller)text(data.answer);
    } catch {
      if(pending===controller)text('지금은 자동 답변을 제공하기 어렵습니다. 아래 질문 버튼과 카카오톡·전화 문의는 계속 이용할 수 있습니다.');
    } finally {clearTimeout(timeout);if(pending===controller){submit.disabled=false;pending=null;}}
  }
  helpDialog.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.question;ask(button.dataset.question);}));
  document.getElementById('smc-help-form').addEventListener('submit',event=>{event.preventDefault();ask(input.value);});
}

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

// Load third-party video only after a visitor explicitly chooses to play it.
document.querySelectorAll('[data-video]').forEach(shell=>{shell.querySelector('button')?.addEventListener('click',()=>{const id=shell.dataset.video;if(!/^[a-zA-Z0-9_-]{11}$/.test(id))return;const frame=document.createElement('iframe');frame.title=(shell.dataset.videoTitle||'SMC 소개')+' 유튜브 영상';frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';shell.replaceChildren(frame);});});
