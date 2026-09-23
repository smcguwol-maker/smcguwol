// LOCAL QA ONLY. Loopback listener, in-memory database and ephemeral signed test identity.
// No real credentials are used, no data is persisted, and this file is never deployed.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from '../public/_worker.js';
import {fixture,origin,testDomain} from './promo-test-harness.mjs';
const f=await fixture(),port=8774,root=fileURLToPath(new URL('../public/',import.meta.url));
const originalFetch=globalThis.fetch;
globalThis.fetch=(url,...args)=>String(url)==='https://'+testDomain+'/cdn-cgi/access/certs'?Promise.resolve(Response.json({keys:[f.jwk]})):originalFetch(url,...args);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.json':'application/json','.txt':'text/plain','.xml':'application/xml'};
const env={...f.env,ASSETS:{async fetch(request){const url=new URL(request.url);let name=decodeURIComponent(url.pathname);if(name.endsWith('/'))name+='index.html';const full=path.resolve(root,'.'+name);if(!full.startsWith(root))return new Response('Forbidden',{status:403});try{return new Response(await readFile(full),{headers:{'Content-Type':mime[path.extname(full)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}}};
http.createServer(async(req,res)=>{
 if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host)){res.writeHead(403).end();return;}
 try {
  let length=0;const chunks=[];for await(const chunk of req){length+=chunk.length;if(length>1450000){res.writeHead(413).end();return;}chunks.push(chunk);}
  const headers=new Headers();for(const [k,v] of Object.entries(req.headers))if(typeof v==='string')headers.set(k,v);
  headers.set('Cf-Access-Jwt-Assertion',await f.token());
  if(headers.get('origin')==='http://127.0.0.1:'+port||headers.get('origin')==='http://localhost:'+port)headers.set('origin',origin);
  const request=new Request(new URL(req.url,origin),{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){console.error(error.message);res.writeHead(500).end('Local QA failed');}
}).listen(port,'127.0.0.1',()=>console.log('LOCAL QA http://127.0.0.1:'+port+' — temporary SQLite; no production changes'));
