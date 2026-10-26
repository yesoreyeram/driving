export const STORAGE_KEY = 'routewise:v1';
export const emptyProgress = () => ({version:1, bookmarks:[], sessions:[], scenarioChecks:[]});
export function validateProgress(value, routeIds) {
  if (!value || value.version !== 1 || !Array.isArray(value.bookmarks) || !Array.isArray(value.sessions) || !Array.isArray(value.scenarioChecks)) throw new Error('Unsupported practice file.');
  if (value.sessions.length > 10000 || value.bookmarks.some(id=>!routeIds.includes(id)) || value.scenarioChecks.some(id=>typeof id !== 'string' || id.length>80)) throw new Error('Invalid practice data.');
  for (const s of value.sessions) {
    if (!s || typeof s.id!=='string' || !routeIds.includes(s.routeId) || !/^\d{4}-\d{2}-\d{2}$/.test(s.date) || !Number.isFinite(Date.parse(s.date)) || !Number.isInteger(s.minutes) || s.minutes<1 || s.minutes>480 || !Number.isInteger(s.confidence) || s.confidence<1 || s.confidence>5 || typeof s.notes!=='string' || s.notes.length>2000) throw new Error('Invalid session in practice file.');
  }
  if(new Set(value.sessions.map(s=>s.id)).size!==value.sessions.length)throw new Error('Duplicate session IDs.');
  if(value.sessions.some(s=>new Date(s.date).toISOString().slice(0,10)!==s.date))throw new Error('Invalid calendar date.');
  // Whitelist fields rather than retaining arbitrary imported properties.
  return {version:1,bookmarks:[...new Set(value.bookmarks)],scenarioChecks:[...new Set(value.scenarioChecks)],sessions:value.sessions.map(({id,routeId,date,minutes,confidence,notes})=>({id,routeId,date,minutes,confidence,notes}))};
}
export function filterRoutes(routes, {query='',skill='',savedOnly=false,bookmarks=[]}={}) {
  const q=query.trim().toLowerCase();
  return routes.filter(r=>(!q || [r.title,r.number,...r.roads,...r.skills].join(' ').toLowerCase().includes(q)) && (!skill || r.skills.includes(skill)) && (!savedOnly || bookmarks.includes(r.id)));
}
export function summary(progress) {
  return {sessions:progress.sessions.length, routes:new Set(progress.sessions.map(s=>s.routeId)).size, minutes:progress.sessions.reduce((a,s)=>a+s.minutes,0)};
}
export function contributionUrl({kind,title,roads,notes,evidence}) {
  const body=`## ${kind}\n\n### Location / route\n${roads}\n\n### Details\n${notes}\n\n### Evidence / provenance\n${evidence}\n\n### Review checklist\n- [ ] Current signs, access restrictions and legality checked\n- [ ] No learner personal data or private GPS traces\n- [ ] Permission to contribute all supplied material\n- [ ] Independent reviewer confirms before publication\n\nSubmitted via Routewise. This is a proposal, not a verified route.`;
  return `https://github.com/yesoreyeram/driving/issues/new?${new URLSearchParams({title:`[${kind}] ${title}`,body})}`;
}
export function navigationLegs(points) {
  if (!Array.isArray(points) || points.length<2) return [];
  for(const p of points) if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||Math.abs(p.lat)>90||Math.abs(p.lon)>180) throw new Error('Invalid route coordinate.');
  const legs=[];
  // Three intermediate points is the documented mobile-browser limit.
  for(let start=0;start<points.length-1;start+=4) legs.push(points.slice(start,start+5));
  return legs;
}
export function googleMapsUrl(points) {
  if(points.length<2 || points.length>5) throw new Error('A navigation leg needs 2–5 points.');
  navigationLegs(points);
  const coord=p=>`${p.lat},${p.lon}`;
  const q=new URLSearchParams({api:'1',origin:coord(points[0]),destination:coord(points.at(-1)),travelmode:'driving'});
  if(points.length>2)q.set('waypoints',points.slice(1,-1).map(coord).join('|'));
  return 'https://www.google.com/maps/dir/?'+q;
}
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function routeGpx(route) {
  const points=route.navigation?.waypoints;
  if(!points || !navigationLegs(points).length)throw new Error('This route has no navigation waypoints.');
  // rtept, not trkpt: sparse source anchors are not a recorded road-following track.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Routewise" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>${xml(route.title)}</name><desc>Unverified source waypoint plan. Calculate between points with a car routing profile and review before driving. Not an official DVSA route.</desc><link href="${xml(route.source.url)}"><text>Original source</text></link></metadata><rte><name>${xml(route.title)}</name><desc>Keep point order. Full plan, not a verified road trace.</desc>${points.map((p,i)=>`<rtept lat="${p.lat}" lon="${p.lon}"><name>${xml(`${String(i+1).padStart(2,'0')} · ${p.label}`)}</name></rtept>`).join('')}</rte></gpx>\n`;
}
