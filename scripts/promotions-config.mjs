export function promoSeeds(site) {
  return [
    ...(site.videos||[]).map((v,i)=>({id:'video-'+(i+1),type:'video',title:v.title,description:'',videoId:v.id,published:true})),
    ...(site.webtoon?.src?[{id:'smc-webtoon',type:'image',title:'웹툰으로 만나는 SMC',description:'연습이 즐거워지는 공간',image:'/'+site.webtoon.src,width:site.webtoon.width,height:site.webtoon.height,published:true}]:[])
  ];
}
