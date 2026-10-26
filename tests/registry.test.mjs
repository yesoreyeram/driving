import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {loadRegistry} from '../src/registry.mjs';

const directory=new URL('../src/data/',import.meta.url);
const index=JSON.parse(await readFile(new URL('index.json',directory),'utf8'));
const files=new Map([['index.json',index]]);
for(const folder of ['centres','routes']) for(const name of await readdir(new URL(folder+'/',directory))) {
  files.set(`${folder}/${name}`,JSON.parse(await readFile(new URL(`${folder}/${name}`,directory),'utf8')));
}
const root=new URL('https://example.test/driving/data/');
const read=(records=files)=>async url=>{
  assert.ok(url.href.startsWith(root.href),'Registry escaped its Pages project path');
  const key=url.href.slice(root.href.length);
  if(!records.has(key))throw new Error('Missing file: '+key);
  return structuredClone(records.get(key));
};

test('index resolves every centre and route under a Pages subdirectory',async()=>{
  const seen=[];
  const data=await loadRegistry(new URL('index.json',root),async url=>{seen.push(url.href.slice(root.href.length));return read()(url);});
  assert.equal(data.schemaVersion,2);assert.equal(data.centres.length,3);assert.equal(data.routes.length,14);
  assert.deepEqual(new Set(seen),new Set(files.keys()),'Every data file must be indexed exactly once');
  assert.equal(seen.length,files.size);
});
test('broken, external and duplicate centre references fail closed',async()=>{
  for(const path of ['https://example.test/private.json','../outside.json','./centres/missing.json']){
    const records=structuredClone(files);records.get('index.json').centres[0].path=path;
    await assert.rejects(()=>loadRegistry(new URL('index.json',root),read(records)));
  }
  const records=structuredClone(files);records.get('index.json').centres.push(records.get('index.json').centres[0]);
  await assert.rejects(()=>loadRegistry(new URL('index.json',root),read(records)),/duplicate centre/);
});
test('missing routes, duplicate routes and centre mismatches are rejected',async()=>{
  const missing=structuredClone(files);missing.delete('routes/maidstone-01.json');
  await assert.rejects(()=>loadRegistry(new URL('index.json',root),read(missing)),/Missing file/);
  const duplicate=structuredClone(files);duplicate.get('centres/maidstone.json').routes.push(duplicate.get('centres/maidstone.json').routes[0]);
  await assert.rejects(()=>loadRegistry(new URL('index.json',root),read(duplicate)),/Duplicate route/);
  const mismatch=structuredClone(files);mismatch.get('routes/maidstone-01.json').centreId='crawley';
  await assert.rejects(()=>loadRegistry(new URL('index.json',root),read(mismatch)),/does not match/);
});
test('data has no publisher references and GPX has no publisher metadata',async()=>{
  const banned=new Set(['source','sourceMap','sourceMaps','publisher','accessedAt','locationSources']);
  const inspect=value=>{if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){assert.ok(!banned.has(key),`Unexpected reference field ${key}`);inspect(child);}};
  for(const value of files.values())inspect(value);
  const {routeGpx}=await import('../src/domain.mjs');
  const gpx=routeGpx(files.get('routes/maidstone-01.json'));
  assert.ok(!gpx.includes('<link '));assert.ok(!gpx.includes('Original source'));
});
