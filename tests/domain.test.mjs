import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emptyProgress,validateProgress,filterRoutes,summary,contributionUrl,navigationLegs,googleMapsUrl,routeGpx} from '../dist/domain.mjs';
const {routes,centres}=JSON.parse(await readFile(new URL('../dist/data/routes.json',import.meta.url)));
const ids=routes.map(r=>r.id);
const session={id:'test-session',routeId:ids[0],date:'2026-10-20',minutes:35,confidence:3,notes:'Practise observations next time.'};
test('every route has provenance, a centre and honest verification state',()=>{
 assert.equal(routes.length,10);assert.equal(new Set(ids).size,10);
 for(const r of routes){assert.ok(centres.some(c=>c.id===r.centreId));assert.equal(new URL(r.source.url).hostname,'maidstonetestroutes.com');assert.equal(r.lastVerifiedAt,null);assert.equal(r.geometry,null);assert.equal(r.navigation.roadPathVerified,false);assert.ok(r.navigation.sourceMaps.length);assert.ok(r.navigation.waypoints.length>=2);}
});
test('search matches roads and combines skill and bookmark filters',()=>{
 assert.deepEqual(filterRoutes(routes,{query:'Sandling'}).map(r=>r.id),['maidstone-07']);
 assert.equal(filterRoutes(routes,{query:'Sandling',skill:'Junctions'}).length,0);
 assert.equal(filterRoutes(routes,{savedOnly:true,bookmarks:[ids[0]]})[0].id,ids[0]);
 assert.equal(filterRoutes(routes,{query:'not a road here'}).length,0);
});
test('saved session roundtrip preserves notes and aggregates unique routes',()=>{
 const p=validateProgress({...emptyProgress(),sessions:[session,{...session,id:'second'}]},ids);
 assert.deepEqual(summary(p),{sessions:2,routes:1,minutes:70});assert.equal(p.sessions[0].notes,session.notes);
 assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(p)),ids),p);
});
test('rejects malformed, unknown and out-of-range imported records',()=>{
 for(const changes of [{routeId:'unknown'},{minutes:0},{minutes:481},{confidence:6},{notes:'x'.repeat(2001)},{date:'invalid'},{date:'2026-02-31'}]) assert.throws(()=>validateProgress({...emptyProgress(),sessions:[{...session,...changes}]},ids));
 assert.throws(()=>validateProgress({version:2},ids));
 assert.throws(()=>validateProgress({...emptyProgress(),bookmarks:['unknown']},ids));
 assert.throws(()=>validateProgress({...emptyProgress(),sessions:[session,session]},ids));
});
test('contribution drafts are encoded and remain on the intended repository',()=>{
 const u=new URL(contributionUrl({kind:'Route correction',title:'Signs & lanes?',roads:'A&B',notes:'Needs review <script>',evidence:'Observed today'}));
 assert.equal(u.origin,'https://github.com');assert.equal(u.pathname,'/yesoreyeram/driving/issues/new');assert.equal(u.searchParams.get('title'),'[Route correction] Signs & lanes?');assert.ok(u.searchParams.get('body').includes('A&B'));
});
test('all Google legs retain point order, overlap boundaries and respect mobile limits',()=>{
 for(const r of routes){const points=r.navigation.waypoints;const legs=navigationLegs(points);const joined=legs.flatMap((leg,i)=>i?leg.slice(1):leg);assert.deepEqual(joined,points);
 for(let i=0;i<legs.length;i++){const leg=legs[i];assert.ok(leg.length>=2&&leg.length<=5);if(i)assert.deepEqual(legs[i-1].at(-1),leg[0]);const url=googleMapsUrl(leg);assert.ok(url.length<2048);const q=new URL(url).searchParams;assert.equal(q.get('api'),'1');assert.equal(q.get('travelmode'),'driving');assert.equal(q.get('origin'),`${leg[0].lat},${leg[0].lon}`);assert.equal(q.get('destination'),`${leg.at(-1).lat},${leg.at(-1).lon}`);assert.equal(q.get('waypoints')?.split('|').length||0,leg.length-2);}
 }
});
test('single GPX plan retains every ordered source anchor without fabricating a track',()=>{
 assert.equal(routes[0].navigation.waypoints.length,27);
 for(const r of routes){const gpx=routeGpx(r);assert.equal((gpx.match(/<rtept /g)||[]).length,r.navigation.waypoints.length);assert.ok(!gpx.includes('<trkpt'));const coords=[...gpx.matchAll(/<rtept lat="([^"]+)" lon="([^"]+)"/g)].map(m=>({lat:Number(m[1]),lon:Number(m[2])}));assert.deepEqual(coords,r.navigation.waypoints.map(({lat,lon})=>({lat,lon})));assert.deepEqual(coords[0],coords.at(-1));}
 const gpx=routeGpx({...routes[0],title:'A&B <route>'});assert.ok(gpx.includes('A&amp;B &lt;route&gt;'));
});
test('invalid coordinates cannot generate navigation links or GPX',()=>{
 assert.throws(()=>navigationLegs([{lat:NaN,lon:0},{lat:0,lon:0}]));
 assert.throws(()=>googleMapsUrl([{lat:91,lon:0},{lat:0,lon:0}]));
 assert.throws(()=>googleMapsUrl(Array(6).fill({lat:51,lon:.5})));
});
