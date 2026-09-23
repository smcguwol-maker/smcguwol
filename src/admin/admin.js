'use strict';
const $=id=>document.getElementById(id);
let board={revision:0,posts:[]},editing=null,pendingImage=null,previewUrl='',busy=false,dirty=false;
const status=(message,error=false)=>{$('admin-status').textContent=message;$('admin-status').classList.toggle('error',error);};
const videoId=value=>{try {const u=new URL(value.trim());if(u.protocol!=='https:'||u.username||u.password)return '';let id=u.hostname==='youtu.be'?u.pathname.slice(1):['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)?(u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/)?.[1]):'';return /^[\w-]{11}$/.test(id||'')?id:'';}catch{return '';}};
async function api(method='GET',data) {
 const response=await fetch('/admin/api/board',{method,credentials:'same-origin',cache:'no-store',headers:data?{'Content-Type':'application/json'}:{},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(20000)});
 if(!response.headers.get('content-type')?.includes('application/json'))throw Error('로그인이 만료되었습니다. 입력 내용을 복사해 둔 뒤 다시 로그인해 주세요.');
 const body=await response.json();if(!response.ok)throw Error((body.error||'저장하지 못했습니다. 잠시 후 다시 시도해 주세요.')+(/^A0[1-6]$/.test(body.code||'')?' (오류 코드: '+body.code+')':''));return body;
}
function element(tag,text,className){const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e;}
function photoUrl(p){return p.type==='video'?`https://i.ytimg.com/vi/${p.videoId}/hqdefault.jpg`:p.image.startsWith('/media/promotions/')?p.image.replace('/media/promotions/','/admin/api/image/'):p.image;}
function render() {
 $('admin-list').replaceChildren();$('post-count').textContent=`${board.posts.length} / 30`;$('new-post').disabled=busy||board.posts.length>=30;
 if(!board.posts.length){$('admin-list').append(element('p','아직 등록한 소식이 없습니다. 첫 소식을 올려 보세요.'));return;}
 board.posts.forEach((p,index)=>{
  const card=element('article',null,'admin-card'),image=element('img');image.src=photoUrl(p);image.alt=p.title;image.width=480;image.height=270;
  const copy=element('div');copy.append(element('span',p.published?'공개 중':'숨김','post-state'+(p.published?'':' is-hidden')),element('h3',p.title),element('p',p.type==='video'?'유튜브 영상':'사진·그림'));
  const actions=element('div',null,'post-actions');
  for(const [label,action,disabled] of [['수정',()=>openEditor(p),false],[p.published?'숨기기':'공개하기',()=>changePosts(posts=>{posts[index].published=!posts[index].published;}),false],['위로 ↑',()=>changePosts(posts=>{[posts[index-1],posts[index]]=[posts[index],posts[index-1]];}),index===0],['아래로 ↓',()=>changePosts(posts=>{[posts[index+1],posts[index]]=[posts[index],posts[index+1]];}),index===board.posts.length-1]]) {
   const button=element('button',label);button.disabled=busy||disabled;button.setAttribute('aria-label',p.title+' '+label);button.addEventListener('click',action);actions.append(button);
  }
  copy.append(actions);card.append(image,copy);$('admin-list').append(card);
 });
}
async function changePosts(change) {
 if(busy)return;busy=true;render();const posts=structuredClone(board.posts);change(posts);
 try{board=await api('PUT',{revision:board.revision,posts});status('저장했습니다. 홈페이지를 새로 열면 반영된 소식을 볼 수 있습니다.');}catch(e){status(e.message,true);}finally{busy=false;render();}
}
function clearPreview(){if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl='';}$('preview-image').removeAttribute('src');$('editor-preview').hidden=true;}
function showPreview(src){if(!src){clearPreview();return;}$('preview-image').src=src;$('editor-preview').hidden=false;}
function fields(){const video=$('post-type').value==='video';$('video-fields').hidden=!video;$('image-fields').hidden=video;$('post-video').required=video;if(video)showPreview(videoId($('post-video').value)?`https://i.ytimg.com/vi/${videoId($('post-video').value)}/hqdefault.jpg`:'');else showPreview(previewUrl||(editing?.type==='image'?photoUrl(editing):''));}
function openEditor(post=null) {
 if(busy)return;editing=post;pendingImage=null;dirty=false;clearPreview();$('post-form').reset();$('editor-title').textContent=post?'소식 수정':'소식 올리기';$('post-type').value=post?.type||'video';$('post-title').value=post?.title||'';$('post-description').value=post?.description||'';$('post-video').value=post?.videoId?'https://youtu.be/'+post.videoId:'';$('post-published').checked=post?.published??true;$('editor-status').textContent='';fields();$('post-editor').showModal();$('post-title').focus();
}
function closeEditor(){if(busy)return;if(dirty&&!confirm('저장하지 않은 변경을 닫을까요?'))return;$('post-editor').close();clearPreview();dirty=false;}
async function compressPhoto(file) {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15000000)throw Error('15MB 이하의 JPG·PNG·WebP 사진을 선택해 주세요.');
 const image=await createImageBitmap(file);
 try {
  if(image.width*image.height>60000000)throw Error('사진이 너무 큽니다. 작은 크기로 저장한 뒤 다시 선택해 주세요.');
  let scale=Math.min(1,2400/Math.max(image.width,image.height));
  for(let attempt=0;attempt<4;attempt++) {
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.88));
   if(blob&&blob.size<=1000000){const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return {blob,width:canvas.width,height:canvas.height,data:btoa(binary),id:crypto.randomUUID()};}scale*=.75;
  }
  throw Error('사진 용량을 줄이지 못했습니다. 작은 사진으로 다시 선택해 주세요.');
 }finally{image.close();}
}
$('post-image').addEventListener('change',async()=>{
 const file=$('post-image').files[0];if(!file)return;
 busy=true;$('editor-save').disabled=true;$('editor-fields').disabled=true;$('editor-status').textContent='사진 크기를 맞추고 있습니다.';
 try{pendingImage=await compressPhoto(file);clearPreview();previewUrl=URL.createObjectURL(pendingImage.blob);showPreview(previewUrl);dirty=true;$('editor-status').textContent=`사진 준비 완료 · ${Math.round(pendingImage.blob.size/1000)}KB`;}catch(e){pendingImage=null;clearPreview();$('post-image').value='';$('editor-status').textContent=e.message;}finally{busy=false;$('editor-save').disabled=false;$('editor-fields').disabled=false;}
});
$('post-type').addEventListener('change',fields);$('post-video').addEventListener('input',fields);$('post-form').addEventListener('input',()=>{dirty=true;});$('new-post').addEventListener('click',()=>openEditor());$('editor-close').addEventListener('click',closeEditor);$('editor-cancel').addEventListener('click',closeEditor);$('post-editor').addEventListener('cancel',event=>{event.preventDefault();closeEditor();});
$('post-form').addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;
 const post={id:editing?.id||crypto.randomUUID(),type:$('post-type').value,title:$('post-title').value.trim(),description:$('post-description').value.trim(),published:$('post-published').checked};
 let upload;
 if(post.type==='video'){post.videoId=videoId($('post-video').value);if(!post.videoId){$('editor-status').textContent='올바른 YouTube 공유 주소를 입력해 주세요.';return;}}
 else if(pendingImage){Object.assign(post,{image:'/media/promotions/'+pendingImage.id,width:pendingImage.width,height:pendingImage.height});upload={id:pendingImage.id,data:pendingImage.data};}
 else if(editing?.type==='image')Object.assign(post,{image:editing.image,width:editing.width,height:editing.height});
 else{$('editor-status').textContent='사진을 선택해 주세요.';return;}
 const posts=structuredClone(board.posts);const index=posts.findIndex(p=>p.id===post.id);if(index<0)posts.unshift(post);else posts[index]=post;
 busy=true;$('editor-save').disabled=true;$('editor-fields').disabled=true;$('editor-status').textContent='저장하고 있습니다.';
 try{board=await api('PUT',{revision:board.revision,posts,...(upload?{upload}:{})});dirty=false;$('post-editor').close();clearPreview();status(post.published?'저장했습니다. 홈페이지 첫 화면에 공개되었습니다.':'저장했습니다. 이 소식은 첫 화면에 표시하지 않습니다.');}catch(e){$('editor-status').textContent=e.message;}finally{busy=false;$('editor-save').disabled=false;$('editor-fields').disabled=false;render();}
});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
api().then(data=>{board=data;status('영상과 사진을 자유롭게 바꿔 보세요.');render();}).catch(e=>status(e.message,true));
