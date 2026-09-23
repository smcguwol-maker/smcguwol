// Combined with the existing Pages Worker by build.mjs; no credentials in source.
const promoSeeds = __PROMO_SEEDS__;
const promoOwner = 'smcguwol@gmail.com';
const promoOrigin = 'https://xn--co-002iq89dzga40o12n.kr';
const promoSecurity = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'same-origin'};
const promoJson=(data,status=200)=>Response.json(data,{status,headers:promoSecurity});
const promoError=(message,status=400)=>Object.assign(new Error(message),{status});
const promoUUID=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

async function promoReadBody(body,limit) {
  if(!body)throw promoError('내용을 입력해 주세요.');
  const reader=body.getReader(),chunks=[];let length=0;
  try {while(true){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>limit){await reader.cancel();throw promoError('파일 또는 입력 내용이 너무 큽니다.',413);}chunks.push(value);}}
  finally {reader.releaseLock();}
  const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}
function promoDecode(value) {
  if(!/^[A-Za-z0-9_-]+$/.test(value))throw Error('invalid encoding');
  return Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
}
async function promoAuthorize(request,env) {
  if(!/^[a-z0-9][a-z0-9-]*\.cloudflareaccess\.com$/.test(env.SMC_ACCESS_DOMAIN||'')||!env.SMC_ACCESS_AUD)throw promoError('관리자 로그인 연결을 준비하고 있습니다.',503);
  const token=request.headers.get('Cf-Access-Jwt-Assertion')||'';
  if(token.length>16000)throw promoError('다시 로그인해 주세요.',401);
  try {
    const parts=token.split('.');if(parts.length!==3)throw Error('jwt');
    const h=JSON.parse(new TextDecoder().decode(promoDecode(parts[0])));
    const claims=JSON.parse(new TextDecoder().decode(promoDecode(parts[1])));
    const issuer='https://'+env.SMC_ACCESS_DOMAIN;
    const now=Math.floor(Date.now()/1000);
    if(h.alg!=='RS256'||typeof h.kid!=='string'||h.crit||claims.iss!==issuer||!Array.isArray(claims.aud)||!claims.aud.includes(env.SMC_ACCESS_AUD)||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||(claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>now))||String(claims.email||'').toLowerCase()!==promoOwner||claims.type!=='app')throw Error('claims');
    // Keys come only from the configured Access tenant, never an untrusted JWT URL.
    const response=await fetch(issuer+'/cdn-cgi/access/certs',{signal:AbortSignal.timeout(5000),redirect:'error'});
    if(!response.ok)throw Error('keys');
    const jwks=JSON.parse(new TextDecoder().decode(await promoReadBody(response.body,65536)));
    const key=jwks.keys?.find(k=>k.kid===h.kid&&k.kty==='RSA'&&(!k.alg||k.alg==='RS256')&&(!k.use||k.use==='sig'));
    if(!key)throw Error('key');
    const imported=await crypto.subtle.importKey('jwk',key,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',imported,promoDecode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1])))throw Error('signature');
  }catch {throw promoError('로그인이 만료되었거나 관리 권한이 없습니다. 다시 로그인해 주세요.',401);}
}
function promoCleanPosts(input) {
  if(!Array.isArray(input)||input.length>30)throw promoError('게시물은 최대 30개까지 보관할 수 있습니다.');
  const ids=new Set();
  return input.map(p=>{
    if(!p||!/^[-a-zA-Z0-9]{1,50}$/.test(p.id)||ids.has(p.id))throw promoError('게시물 번호를 확인해 주세요.');ids.add(p.id);
    if(typeof p.title!=='string'||!p.title.trim()||p.title.length>80||typeof p.description!=='string'||p.description.length>300||typeof p.published!=='boolean')throw promoError('제목은 80자, 설명은 300자 이내로 입력해 주세요.');
    const result={id:p.id,type:p.type,title:p.title.trim(),description:p.description.trim(),published:p.published};
    if(p.type==='video') {const id=youtubeId(p.videoId);if(!id)throw promoError('올바른 YouTube 주소를 입력해 주세요.');return {...result,videoId:id};}
    if(p.type==='image') {
      const isSeed=p.image==='/assets/smc-introduction-webtoon.jpg';
      const id=String(p.image||'').replace('/media/promotions/','');
      if(!isSeed&&(!String(p.image).startsWith('/media/promotions/')||!promoUUID.test(id)))throw promoError('사진을 다시 선택해 주세요.');
      if(!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width<1||p.height<1||p.width>6000||p.height>12000)throw promoError('사진 크기를 확인해 주세요.');
      return {...result,image:p.image,width:p.width,height:p.height};
    }
    throw promoError('영상 또는 그림을 선택해 주세요.');
  });
}
function promoJpeg(bytes) {
  if(bytes.length<32||bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)throw promoError('JPG 사진으로 다시 선택해 주세요.');
  let offset=2;
  while(offset+4<bytes.length) {
    if(bytes[offset++]!==255)throw promoError('손상된 사진입니다.');
    while(bytes[offset]===255)offset++;
    const marker=bytes[offset++];if(marker===218||marker===217)break;
    const length=bytes[offset]*256+bytes[offset+1];
    if(length<2||offset+length>bytes.length)break;
    if([192,193,194].includes(marker)&&length>=8) {
      const height=bytes[offset+3]*256+bytes[offset+4],width=bytes[offset+5]*256+bytes[offset+6];
      if(width<1||height<1||width>6000||height>12000||width*height>18000000)break;
      return {width,height};
    }
    offset+=length;
  }
  throw promoError('사진의 크기나 파일 형식을 확인해 주세요.');
}
async function promoBoard(env) {
  if(!env.SMC_PROMO_DB)return {revision:0,posts:promoSeeds};
  const row=await env.SMC_PROMO_DB.prepare('SELECT revision, posts FROM promo_board WHERE id = 1').first();
  if(!row)throw promoError('게시판 저장소를 준비하고 있습니다.',503);
  return {revision:row.revision,posts:promoCleanPosts(JSON.parse(row.posts))};
}
async function promoSave(request,env) {
  if(!request.headers.get('content-type')?.startsWith('application/json'))throw promoError('입력 형식을 확인해 주세요.',415);
  let data;
  try {data=JSON.parse(new TextDecoder().decode(await promoReadBody(request.body,1450000)));}catch(e){throw e.status?e:promoError('입력 내용을 확인해 주세요.');}
  if(!data||typeof data!=='object')throw promoError('입력 내용을 확인해 주세요.');
  if(!Number.isSafeInteger(data.revision)||data.revision<1)throw promoError('새로고침 후 다시 시도해 주세요.');
  if(!data||typeof data!=='object')throw promoError('입력 내용을 확인해 주세요.');
  const posts=promoCleanPosts(data.posts),serialized=JSON.stringify(posts);
  if(new TextEncoder().encode(serialized).length>64000)throw promoError('전체 내용이 너무 깁니다.');
  let upload=null;
  if(data.upload) {
    if(!promoUUID.test(data.upload.id)||typeof data.upload.data!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(data.upload.data))throw promoError('사진을 다시 선택해 주세요.');
    const binary=atob(data.upload.data),bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    if(bytes.length>1000000)throw promoError('사진은 압축 후 1MB 이하로 저장할 수 있습니다.',413);
    const dimensions=promoJpeg(bytes);
    const matching=posts.filter(p=>p.type==='image'&&p.image==='/media/promotions/'+data.upload.id);
    if(!matching.length||matching.some(p=>p.width!==dimensions.width||p.height!==dimensions.height))throw promoError('사진 크기가 일치하지 않습니다.');
    upload={id:data.upload.id,bytes};
  }
  const mediaIds=[...new Set(posts.filter(p=>p.type==='image'&&p.image.startsWith('/media/')).map(p=>p.image.split('/').at(-1)))];
  const {results:stored}=await env.SMC_PROMO_DB.prepare('SELECT id FROM promo_images').all();
  const existing=new Set(stored.map(x=>x.id));
  if(mediaIds.some(id=>id!==upload?.id&&!existing.has(id)))throw promoError('사진이 없습니다. 다시 선택해 주세요.');
  if(upload&&existing.has(upload.id))throw promoError('사진을 다시 선택해 주세요.');
  const statements=[];
  if(upload)statements.push(env.SMC_PROMO_DB.prepare('INSERT INTO promo_images (id, bytes, created_at) SELECT ?1, ?2, ?3 WHERE (SELECT revision FROM promo_board WHERE id=1)=?4').bind(upload.id,upload.bytes.buffer,new Date().toISOString(),data.revision));
  statements.push(env.SMC_PROMO_DB.prepare('UPDATE promo_board SET posts=?1, revision=revision+1, updated_at=?2 WHERE id=1 AND revision=?3').bind(serialized,new Date().toISOString(),data.revision));
  // Remove only unreferenced upload files after a successful board update, atomically.
  statements.push(env.SMC_PROMO_DB.prepare("DELETE FROM promo_images WHERE (SELECT revision FROM promo_board WHERE id=1)=?1 AND id NOT IN (SELECT substr(json_extract(value,'$.image'),19) FROM json_each((SELECT posts FROM promo_board WHERE id=1)) WHERE json_extract(value,'$.type')='image' AND json_extract(value,'$.image') LIKE '/media/promotions/%')").bind(data.revision+1));
  const result=await env.SMC_PROMO_DB.batch(statements);
  if(result[upload?1:0].meta.changes!==1)throw promoError('다른 창에서 내용이 변경되었습니다. 새로고침한 뒤 다시 수정해 주세요.',409);
  return promoJson({revision:data.revision+1,posts,saved:true});
}
async function promoRoute(request,env) {
  const url=new URL(request.url),path=url.pathname,isAdmin=path==='/admin'||path.startsWith('/admin/');
  if(!isAdmin&&!['/','/index.html','/api/promotions'].includes(path)&&!path.startsWith('/media/promotions/'))return null;
  try {
    if(isAdmin) {
      if(url.origin!==promoOrigin)throw promoError('공식 홈페이지의 관리 주소로 접속해 주세요.',403);
      await promoAuthorize(request,env);
      if(!env.SMC_PROMO_DB)throw promoError('게시판 저장소 연결을 준비하고 있습니다.',503);
      if(path.startsWith('/admin/api/image/')) {
        const id=path.slice('/admin/api/image/'.length);
        if(!promoUUID.test(id)||!['GET','HEAD'].includes(request.method))throw promoError('사진을 찾을 수 없습니다.',404);
        const row=await env.SMC_PROMO_DB.prepare('SELECT bytes FROM promo_images WHERE id=?1').bind(id).first();
        if(!row)throw promoError('사진을 찾을 수 없습니다.',404);
        return new Response(request.method==='HEAD'?null:new Uint8Array(row.bytes),{headers:{...promoSecurity,'Content-Type':'image/jpeg','Content-Security-Policy':"default-src 'none'; sandbox"}});
      }
      if(path==='/admin/api/board') {
        if(request.method==='GET')return promoJson(await promoBoard(env));
        if(request.method!=='PUT')throw promoError('지원하지 않는 요청입니다.',405);
        if(request.headers.get('origin')!==url.origin)throw promoError('관리 화면에서 다시 시도해 주세요.',403);
        return await promoSave(request,env);
      }
      if(!['/admin','/admin/','/admin/index.html'].includes(path))throw promoError('페이지를 찾을 수 없습니다.',404);
      if(request.method!=='GET'&&request.method!=='HEAD')throw promoError('지원하지 않는 요청입니다.',405);
      if(path==='/admin')return Response.redirect(url.origin+'/admin/',302);
      const response=await env.ASSETS.fetch(request);const h=new Headers(response.headers);
      for(const [k,v] of Object.entries(promoSecurity))h.set(k,v);
      h.set('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' https://i.ytimg.com blob:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
      return new Response(response.body,{status:response.status,headers:h});
    }
    if(request.method!=='GET'&&request.method!=='HEAD')throw promoError('지원하지 않는 요청입니다.',405);
    if(path==='/api/promotions')return promoJson({posts:(await promoBoard(env)).posts.filter(p=>p.published)});
    if(path.startsWith('/media/promotions/')) {
      const id=path.slice('/media/promotions/'.length);if(!promoUUID.test(id)||!env.SMC_PROMO_DB)throw promoError('사진을 찾을 수 없습니다.',404);
      const board=await promoBoard(env);const post=board.posts.find(p=>p.type==='image'&&p.image===path);
      if(!post)throw promoError('사진을 찾을 수 없습니다.',404);
      if(!post.published){if(url.origin!==promoOrigin)throw promoError('사진을 찾을 수 없습니다.',404);await promoAuthorize(request,env);}
      const row=await env.SMC_PROMO_DB.prepare('SELECT bytes FROM promo_images WHERE id=?1').bind(id).first();
      if(!row)throw promoError('사진을 찾을 수 없습니다.',404);
      return new Response(request.method==='HEAD'?null:new Uint8Array(row.bytes),{headers:{...promoSecurity,'Content-Type':'image/jpeg','Content-Security-Policy':"default-src 'none'; sandbox"}});
    }
    const response=await env.ASSETS.fetch(request);
    if(!env.SMC_PROMO_DB||!response.ok||request.method==='HEAD')return response;
    let markup;
    try {markup=promoMarkup((await promoBoard(env)).posts);}catch {markup='<p class="promo-empty">지금은 소식을 불러올 수 없습니다. 잠시 후 새로고침해 주세요.</p>';}
    const html=new TextDecoder().decode(await promoReadBody(response.body,262144));
    const h=new Headers(response.headers);h.set('Cache-Control','no-store');h.delete('Content-Length');h.delete('Content-Encoding');h.delete('ETag');
    return new Response(html.replace(/<!--PROMO_START-->[\s\S]*?<!--PROMO_END-->/,()=>'<!--PROMO_START-->'+markup+'<!--PROMO_END-->'),{headers:h,status:response.status});
  }catch(error) {
    const status=error.status||503,message=error.status?error.message:'잠시 후 다시 시도해 주세요. 저장되지 않은 내용은 화면에 남아 있습니다.';
    if(isAdmin&&!path.startsWith('/admin/api/'))return new Response(`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>SMC 소식 관리</title><link rel="stylesheet" href="/admin-assets/admin.css"><main class="admin-locked"><p>SMC 인천 구월점</p><h1>소식 관리</h1><p>${promoEscape(message)}</p>${status===401?'<a href="/cdn-cgi/access/logout">다시 로그인</a> · ':'<p>잠시 후 이 페이지를 다시 열어 주세요.</p>'}<a href="/">홈페이지로</a></main></html>`,{status,headers:{...promoSecurity,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'"}});
    return promoJson({error:message},status);
  }
}
