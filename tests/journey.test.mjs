import test from 'node:test';
import assert from 'node:assert/strict';
import {readView,viewURL,overviewPoints,routeAvailability} from '../src/journey.mjs';
import {emptyProgress,validateProgress,summary} from '../src/domain.mjs';
const routes=[{id:'maidstone-01',centreId:'maidstone'},{id:'crawley-01',centreId:'crawley'}],centres=[{id:'maidstone'},{id:'crawley'}],ids=routes.map(r=>r.id);
test('shared route survives reload under a Pages subdirectory and determines its centre',()=>{
 const url=viewURL('https://example.org/driving/',{centreId:'maidstone',selected:'maidstone-01',tab:'routes',detail:true});
 assert.equal(url.pathname,'/driving/');assert.deepEqual(readView(url,routes,centres),{centreId:'maidstone',selected:'maidstone-01',tab:'routes',detail:true});
 assert.equal(readView('https://example.org/driving/?centre=crawley&route=maidstone-01',routes,centres).centreId,'maidstone');
});
test('list and journal URLs remove stale route selection and support history restoration',()=>{
 const detail='https://example.org/driving/?centre=maidstone&route=maidstone-01';
 for(const tab of ['routes','log','skills']){const url=viewURL(detail,{centreId:'crawley',selected:'crawley-01',tab,detail:false});assert.equal(url.searchParams.has('route'),false);const v=readView(url,routes,centres);assert.equal(v.tab,tab);assert.equal(v.detail,false);assert.equal(v.centreId,'crawley');}
 assert.equal(readView(detail,routes,centres).detail,true);
});
test('invalid route, centre and view recover to the default list',()=>{
 assert.deepEqual(readView('https://example.org/?route=missing&centre=missing&view=missing',routes,centres),{centreId:'maidstone',selected:'maidstone-01',tab:'routes',detail:false});
});
test('overview maintains geographic orientation, order and finite bounds including identical points',()=>{
 const points=overviewPoints([{lat:51,lon:0},{lat:52,lon:1},{lat:51,lon:0}]);
 assert.equal(points[0].n,1);assert.equal(points[2].n,3);assert.ok(points[1].x>points[0].x);assert.ok(points[1].y<points[0].y);assert.equal(points[0].x,points[2].x);
 for(const p of [...points,...overviewPoints([{lat:51,lon:0},{lat:51,lon:0}])]){assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(p.x>=40&&p.x<=560&&p.y>=40&&p.y<=300);}
});
test('navigation capability distinguishes historic records and road-name plans',()=>{
 assert.equal(routeAvailability({navigation:null}),'Historical only');assert.equal(routeAvailability({navigation:{kind:'road-plan'}}),'Road-name navigation');assert.equal(routeAvailability({navigation:{kind:'waypoint-plan'}}),'Waypoint navigation');
});
test('previous progress files migrate without losing sessions or bookmarks',()=>{
 const old={version:1,bookmarks:['maidstone-01'],sessions:[{id:'session1',routeId:'maidstone-01',date:'2026-10-26',minutes:30,confidence:3,notes:'Observations'}],scenarioChecks:['junctions']};
 const p=validateProgress(old,ids);assert.deepEqual(p.sessions,old.sessions);assert.deepEqual(p.bookmarks,old.bookmarks);assert.deepEqual(p.plans,[]);assert.deepEqual(p.navigation,{});assert.deepEqual(p.routeNotes,{});
});
test('plans, navigation resume and private testing notes roundtrip without counting as drives',()=>{
 const p={...emptyProgress(),plans:[{id:'p1',routeId:'maidstone-01',date:'2026-10-27',focus:'Roundabouts'}],navigation:{'maidstone-01':4},routeNotes:{'maidstone-01':{date:'2026-10-26',notes:'Check leg 2'}}};
 assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(p)),ids),p);assert.equal(summary(p).sessions,0);
});
test('malformed plans, resume state and testing notes are rejected',()=>{
 for(const patch of [{plans:[null]},{plans:[{id:'x',routeId:'maidstone-01',date:'2026-02-30',focus:''}]},{navigation:{'maidstone-01':-1}},{navigation:{missing:1}},{routeNotes:{'maidstone-01':{date:'2026-02-30',notes:'x'}}},{routeNotes:{missing:{date:'2026-10-26',notes:'x'}}}])assert.throws(()=>validateProgress({...emptyProgress(),...patch},ids));
});
