import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {mkdtemp,mkdir,writeFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createStaticServer} from '../scripts/serve.mjs';
import {loadRegistry} from '../src/registry.mjs';

async function listen(t,root){
  const server=createStaticServer(root);server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  return `http://127.0.0.1:${server.address().port}`;
}
test('Node development server serves the app and its complete split registry',async t=>{
  const base=await listen(t,fileURLToPath(new URL('../src/',import.meta.url)));
  const page=await fetch(base+'/');assert.equal(page.status,200);assert.match(await page.text(),/Routewise/);
  for(const file of ['app.js','registry.mjs','data/index.json']){
    const response=await fetch(base+'/'+file,{method:'HEAD'});assert.equal(response.status,200);
    assert.match(response.headers.get('content-type'),file.endsWith('.json')?/application\/json/:/text\/javascript/);
    assert.equal(await response.text(),'');
  }
  const data=await loadRegistry(new URL(base+'/data/index.json'));assert.equal(data.routes.length,14);
  assert.equal((await fetch(base+'/missing')).status,404);
  assert.equal((await fetch(base+'/data/index.json',{method:'POST'})).status,405);
  assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,403);
});
test('Node server does not expose files through symlinks outside the public root',async t=>{
  const temp=await mkdtemp(join(tmpdir(),'routewise-server-'));t.after(()=>rm(temp,{recursive:true,force:true}));
  const root=join(temp,'public');await mkdir(root);await writeFile(join(temp,'private.txt'),'private');
  await symlink(join(temp,'private.txt'),join(root,'leak.txt'));
  const base=await listen(t,root);assert.equal((await fetch(base+'/leak.txt')).status,403);
});
