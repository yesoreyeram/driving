import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,filterScenarios,matchingRoutes,scenarioState,validateScenarioPractice} from '../src/scenarios.mjs';
import {emptyProgress,validateProgress} from '../src/domain.mjs';
const record={checked:[0],status:'working-on',notes:'Discuss visibility next time',date:'2026-10-26'};
test('local scenarios stay in their centre and filters combine with text search',()=>{
 const progress={...emptyProgress(),scenarioPractice:{junctions:record}};
 assert.equal(filterScenarios(scenarios,{centreId:'maidstone',filter:'local',progress}).length,2);
 assert.equal(filterScenarios(scenarios,{centreId:'crawley',filter:'local',progress}).length,0);
 assert.deepEqual(filterScenarios(scenarios,{centreId:'maidstone',filter:'working-on',query:'junction',progress}).map(s=>s.id),['junctions']);
 assert.equal(filterScenarios(scenarios,{centreId:'maidstone',query:'no such scenario',progress}).length,0);
});
test('legacy preparation remains reviewed without claiming practical confidence',()=>{
 const s=scenarios.find(s=>s.id==='junctions'),progress={...emptyProgress(),scenarioChecks:[s.id]};
 const state=scenarioState(s,progress);assert.equal(state.checked.length,s.checks.length);assert.equal(state.status,'not-practised');
 assert.ok(!filterScenarios(scenarios,{centreId:'maidstone',filter:'unreviewed',progress}).some(x=>x.id===s.id));
});
test('route suggestions require current centre, matching skill and navigation',()=>{
 const s=scenarios.find(s=>s.id==='junctions');
 const routes=[{id:'a',centreId:'maidstone',skills:['Junctions'],navigation:{}},{id:'b',centreId:'crawley',skills:['Junctions'],navigation:{}},{id:'c',centreId:'maidstone',skills:['Roundabouts'],navigation:{}},{id:'d',centreId:'maidstone',skills:['Junctions'],navigation:null}];
 assert.deepEqual(matchingRoutes(s,routes,'maidstone').map(r=>r.id),['a']);
});
test('scenario progress survives export and overrides conflicting legacy review flags',()=>{
 const p=validateProgress({...emptyProgress(),scenarioChecks:['junctions'],scenarioPractice:{junctions:record}},[]);
 assert.deepEqual(p.scenarioChecks,[]);assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(p)),[]),p);
 const reviewed=validateProgress({...p,scenarioPractice:{junctions:{...record,checked:[0,1,2]}}},[]);
 assert.deepEqual(reviewed.scenarioChecks,['junctions']);
});
test('invalid scenario records are rejected and extra fields discarded',()=>{
 for(const value of [null,[],{unknown:record},{junctions:{...record,checked:[0,0]}},{junctions:{...record,checked:[3]}},{junctions:{...record,status:'passed'}},{junctions:{...record,date:'2026-02-30'}},{junctions:{...record,notes:'x'.repeat(2001)}}])assert.throws(()=>validateScenarioPractice(value));
 assert.deepEqual(validateScenarioPractice({junctions:{...record,extra:'discard'}}),{junctions:record});
});
test('catalogue retains original IDs and provides complete preparation and reflection content',()=>{
 assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
 for(const id of ['d-junction','running-horse','mini-roundabouts','meeting-traffic','junctions','independent'])assert.ok(scenarios.some(s=>s.id===id));
 for(const s of scenarios){assert.equal(s.checks.length,3);assert.ok(s.goal&&s.watch&&s.reflect&&s.skills.length);assert.equal(new URL(s.guideUrl).origin,'https://www.gov.uk');if(s.centreId)assert.ok(s.note.includes('Local reference only'));}
});
