// Local-only SQLite adapter + ephemeral test signing key. Never copied to public/.
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {promoSeeds} from './promotions-config.mjs';
export const origin='https://xn--co-002iq89dzga40o12n.kr';
export const testDomain='smc-local-test.cloudflareaccess.com';
export async function fixture() {
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec(await readFile(new URL('../migrations/0001_promotions.sql',import.meta.url),'utf8'));
 const site=JSON.parse(await readFile(new URL('../content/site.json',import.meta.url),'utf8'));
 sqlite.prepare('INSERT INTO promo_board VALUES (1,1,?,?)').run(JSON.stringify(promoSeeds(site)),new Date().toISOString());
 const db={prepare(sql){let values=[];const statement={bind(...args){values=args.map(v=>v instanceof ArrayBuffer?new Uint8Array(v):v);return statement;},async all(){const prepared=sqlite.prepare(sql);const args=Object.fromEntries(values.map((v,i)=>[String(i+1),v]));const results=prepared.all(args).map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,v instanceof Uint8Array?Array.from(v):v])));return {results,meta:{changes:Number(sqlite.prepare('SELECT changes() AS n').get().n)}};},async first(){return (await statement.all()).results[0]||null;},async run(){return statement.all();}};return statement;},async batch(statements){sqlite.exec('BEGIN');try{const output=[];for(const statement of statements)output.push(await statement.all());sqlite.exec('COMMIT');return output;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 const keys=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk={...await crypto.subtle.exportKey('jwk',keys.publicKey),kid:'local-test',alg:'RS256',use:'sig'};
 const b64=value=>Buffer.from(typeof value==='string'?value:new Uint8Array(value)).toString('base64url');
 const token=async(claims={},header={})=>{const now=Math.floor(Date.now()/1000);const input=b64(JSON.stringify({alg:'RS256',kid:'local-test',...header}))+'.'+b64(JSON.stringify({iss:'https://'+testDomain,aud:['test-audience'],iat:now,exp:now+3600,type:'app',email:'Smcguwol@gmail.com',...claims}));return input+'.'+b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',keys.privateKey,new TextEncoder().encode(input)));};
 return {sqlite,db,jwk,token,env:{SMC_PROMO_DB:db,SMC_ACCESS_DOMAIN:testDomain,SMC_ACCESS_AUD:'test-audience'}};
}
