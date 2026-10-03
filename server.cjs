// Optional local preview. No npm packages required. Node.js 20 or newer.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const allowed=new Set(['index.html','style.css','core.js','app.js','manifest.json','sw.js','icon.svg','icon-192.png','icon-512.png','icon-maskable.png']);
const server=http.createServer((req,res)=>{
  let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400).end();return;}
  if(!allowed.has(file)){res.writeHead(404).end('Not found');return;}
  fs.readFile(path.join(__dirname,file),(error,data)=>{if(error){res.writeHead(500).end('File unavailable');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data);});
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Portti 8080 on jo käytössä. Sulje aiempi palvelin.':error.message);process.exitCode=1;});
server.listen(8080,'127.0.0.1',()=>console.log('Aamupaino: http://127.0.0.1:8080 — lopeta Ctrl+C'));
