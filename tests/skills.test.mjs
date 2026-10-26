import test from 'node:test';
import assert from 'node:assert/strict';
import {skills,stages,filterSkills,skillState,skillSummary,validateSkills} from '../src/skills.mjs';
import {scenarios} from '../src/scenarios.mjs';
import {emptyProgress,validateProgress} from '../src/domain.mjs';
import {readView,viewURL} from '../src/journey.mjs';
const record={level:2,checked:[0],notes:'Practise again with instructor',nextFocus:true,date:'2026-10-26'};
const routes=[{id:'maidstone-01',centreId:'maidstone'}],centres=[{id:'maidstone'}];
test('catalogue covers all 27 DVSA syllabus numbers once in staged learning order',()=>{
 assert.equal(skills.length,27);assert.equal(new Set(skills.map(s=>s.id)).size,27);
 assert.deepEqual(skills.map(s=>s.dvsaNumber).sort((a,b)=>a-b),Array.from({length:27},(_,i)=>i+1));
 let last=-1;for(const s of skills){const n=stages.findIndex(x=>x.id===s.stage);assert.ok(n>=last);last=n;assert.ok(s.checks.length>=3&&s.summary&&s.reflect&&s.scope);assert.ok(s.exerciseIds.every(id=>scenarios.some(x=>x.id===id)));}
 assert.equal(skills.find(s=>s.id==='motorways').tags.length,0);
 assert.match(skills.find(s=>s.id==='motorways').scope,/Not part/);
});
test('master checklist combines search, stage and progress without reordering',()=>{
 const progress={...emptyProgress(),skills:{junctions:record,roundabouts:{...record,level:4,nextFocus:false}}};
 assert.deepEqual(filterSkills({stage:'traffic',filter:'developing',query:'junction',progress}).map(s=>s.id),['junctions']);
 assert.deepEqual(filterSkills({filter:'focus',progress}).map(s=>s.id),['junctions']);
 assert.deepEqual(filterSkills({filter:'independent',progress}).map(s=>s.id),['roundabouts']);
 assert.equal(filterSkills({filter:'not-started',progress}).length,25);
 assert.deepEqual(skillSummary(progress),{started:2,independent:1,focus:1});
});
test('scenario migration retains notes without assigning a skill rating',()=>{
 const old={version:1,bookmarks:[],sessions:[],scenarioChecks:['junctions'],scenarioPractice:{junctions:{checked:[0,1,2],notes:'Keep this note',status:'comfortable',date:'2026-10-26'}}};
 const migrated=validateProgress(old,[]);assert.deepEqual(migrated.skills,{});assert.equal(migrated.scenarioPractice.junctions.notes,'Keep this note');assert.equal(skillState('junctions',migrated).level,0);
});
test('skill records export and import independently of route centres',()=>{
 const progress=validateProgress({...emptyProgress(),skills:{junctions:record}},[]);
 assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(progress)),[]),progress);
 assert.equal(skillSummary(progress).started,1);
});
test('checked practice topics never infer independent ability',()=>{
 const progress={...emptyProgress(),skills:{junctions:{...record,level:0,checked:[0,1,2,3]}}};
 assert.deepEqual(skillSummary(progress),{started:0,independent:0,focus:1});
});
test('skill links reload, support list navigation and retain the Pages base path',()=>{
 const u=viewURL('https://example.org/driving/?route=maidstone-01',{centreId:'maidstone',tab:'skills',skillId:'parking'});
 assert.equal(u.pathname,'/driving/');assert.equal(u.searchParams.has('route'),false);
 const v=readView(u,routes,centres);assert.equal(v.tab,'skills');assert.equal(v.skillId,'parking');
 const list=viewURL(u,{centreId:'maidstone',tab:'skills'});assert.equal(readView(list,routes,centres).skillId,null);
 const journal=viewURL(u,{centreId:'maidstone',tab:'log'});assert.equal(journal.searchParams.has('skill'),false);
 assert.equal(readView('https://example.org/driving/?view=scenarios',routes,centres).tab,'skills');
 assert.equal(readView('https://example.org/driving/?view=skills&skill=missing',routes,centres).skillId,null);
});
test('invalid skill records are rejected and extra imported properties are dropped',()=>{
 for(const patch of [{level:6},{level:-1},{level:1.5},{checked:[100]},{checked:[0,0]},{notes:'x'.repeat(2001)},{date:'2026-02-30'},{nextFocus:'yes'}])assert.throws(()=>validateSkills({junctions:{...record,...patch}}));
 for(const input of [null,[],{unknown:record},{junctions:null}])assert.throws(()=>validateSkills(input));
 assert.deepEqual(validateSkills({junctions:{...record,unexpected:'discard'}}),{junctions:record});
});
