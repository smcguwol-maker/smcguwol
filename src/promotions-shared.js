// Shared, escaped markup for the initial build and live D1 content.
export const promoEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function youtubeId(value) {
  const input=String(value||'').trim();
  if(/^[a-zA-Z0-9_-]{11}$/.test(input))return input;
  try {
    const u=new URL(input);if(u.protocol!=='https:'||u.username||u.password)return '';
    let id='';
    if(u.hostname==='youtu.be')id=u.pathname.slice(1);
    else if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)) {
      if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
      else id=u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/)?.[1]||'';
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id)?id:'';
  }catch{return '';}
}
export function promoMarkup(posts) {
  const visible=posts.filter(p=>p.published);
  if(!visible.length)return '<p class="promo-empty">새로운 소식을 준비하고 있습니다.</p>';
  return visible.map((p,index)=>{
    const title=promoEscape(p.title), description=promoEscape(p.description);
    const image=p.type==='video'?`https://i.ytimg.com/vi/${p.videoId}/hqdefault.jpg`:p.image;
    const destination=p.type==='video'?`https://youtu.be/${p.videoId}`:p.image;
    return `<article class="promo-card"${index>2?' data-promo-extra hidden':''}><a class="promo-open" href="${promoEscape(destination)}" data-promo-type="${p.type}" data-promo-title="${title}" data-promo-description="${description}"${p.type==='video'?` data-promo-video="${p.videoId}"`:''} target="_blank" rel="noopener noreferrer"><span class="promo-thumbnail"><img src="${promoEscape(image)}" alt="${title}${p.type==='video'?' 영상 썸네일':''}" width="${p.type==='video'?480:(p.width||720)}" height="${p.type==='video'?360:(p.height||1280)}" loading="${index<3?'eager':'lazy'}" decoding="async">${p.type==='video'?'<span class="promo-play" aria-hidden="true">▶</span>':'<span class="promo-image-label">그림 보기 ＋</span>'}</span><span class="promo-copy"><small>${p.type==='video'?'영상':'그림·소식'}</small><strong>${title}</strong>${description?`<span class="promo-description">${description}</span>`:''}<span class="promo-action">${p.type==='video'?'영상 보기':'크게 보기'} <span aria-hidden="true">↗</span></span></span></a></article>`;
  }).join('')+(visible.length>3?`<button class="promo-more" type="button" aria-expanded="false">소식 더 보기 (${visible.length-3}) <span aria-hidden="true">＋</span></button>`:'');
}
