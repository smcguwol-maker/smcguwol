import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.txt':'text/plain'};
const port = Number(process.env.SMC_PREVIEW_PORT || 8765);
createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file = path.resolve(root,'.' + pathname);
    if (file !== root.slice(0,-1) && !file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const bytes = await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex'});
    res.end(bytes);
  } catch { res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}); res.end(await readFile(path.join(root,'404.html'))); }
}).listen(port,'0.0.0.0',() => console.log(`SMC preview http://localhost:${port}`));
