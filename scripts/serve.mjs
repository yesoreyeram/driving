import {createServer} from 'node:http';
import {readFile, realpath, stat} from 'node:fs/promises';
import {resolve, relative, isAbsolute, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const types = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.gpx':'application/gpx+xml'};
const within = (root, path) => {const rel=relative(root,path);return !rel.startsWith('..') && !isAbsolute(rel);};

export function createStaticServer(directory) {
  const root = resolve(directory);
  return createServer(async (request,response) => {
    response.setHeader('X-Content-Type-Options','nosniff');
    if (!['GET','HEAD'].includes(request.method)) {
      response.writeHead(405, {'Allow':'GET, HEAD'}).end('Method not allowed');return;
    }
    try {
      const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      let path=resolve(root,'.'+pathname);
      if (!within(root,path)) {response.writeHead(403).end('Forbidden');return;}
      if ((await stat(path)).isDirectory()) path=resolve(path,'index.html');
      const [realRoot,realFile]=await Promise.all([realpath(root),realpath(path)]);
      if (!within(realRoot,realFile)) {response.writeHead(403).end('Forbidden');return;}
      const content=await readFile(realFile);
      response.writeHead(200, {'Content-Type':types[extname(realFile)]||'application/octet-stream',
        'Content-Length':content.length, 'Cache-Control':'no-cache'});
      response.end(request.method==='HEAD'?undefined:content);
    } catch (error) {
      const status=error instanceof URIError||error.code==='ERR_INVALID_ARG_VALUE'?400:404;
      response.writeHead(status).end(status===400?'Bad request':'Not found');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const built=process.argv.includes('--built');
  const root=fileURLToPath(new URL(built?'../_site/':'../src/',import.meta.url));
  const port=Number(process.env.PORT||8080);
  if (!Number.isInteger(port)||port<1||port>65535) throw new Error('PORT must be an integer from 1 to 65535.');
  const server=createStaticServer(root);
  server.on('error',error=>{console.error(`Cannot start local server: ${error.code||error.message}`);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Routewise ${built?'build preview':'development'}: http://127.0.0.1:${port}`));
}
