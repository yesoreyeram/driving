import {skills} from './skills.mjs';
export function routeAvailability(route) {
  if (!route.navigation) return 'Historical only';
  return route.navigation.kind === 'road-plan' ? 'Road-name navigation' : 'Waypoint navigation';
}
export function readView(href, routes, centres) {
  const params = new URL(href).searchParams;
  const route = routes.find(r => r.id === params.get('route'));
  const centre = route?.centreId || (centres.some(c => c.id === params.get('centre')) ? params.get('centre') : centres[0].id);
  const requested=params.get('view')==='scenarios'?'skills':params.get('view');
  const skill=skills.find(s=>s.id===params.get('skill'));
  const tab=skill?'skills':['routes','skills','log','community'].includes(requested)?requested:'routes';
  return {centreId:centre, selected:route?.id || routes.find(r=>r.centreId===centre)?.id, tab, ...(tab==='skills'?{skillId:skill?.id||null}:{}), detail:!!route && tab==='routes'};
}
export function viewURL(href, {centreId,selected,tab,detail,skillId}) {
  const url = new URL(href);
  url.searchParams.set('centre',centreId);
  if(tab==='routes')url.searchParams.delete('view');else url.searchParams.set('view',tab);
  if(detail && tab==='routes')url.searchParams.set('route',selected);else url.searchParams.delete('route');
  if(tab==='skills'&&skills.some(s=>s.id===skillId))url.searchParams.set('skill',skillId);else url.searchParams.delete('skill');
  url.hash='';return url;
}
// Geographic projection for orientation only: sparse anchors are not road geometry.
export function overviewPoints(points) {
  if(!points?.length)return [];
  const cos=Math.cos(points[0].lat*Math.PI/180);
  const xy=points.map(p=>({x:p.lon*cos,y:-p.lat}));
  const xs=xy.map(p=>p.x),ys=xy.map(p=>p.y);
  const minX=Math.min(...xs),minY=Math.min(...ys),dx=Math.max(...xs)-minX,dy=Math.max(...ys)-minY;
  const scale=Math.min(520/(dx||1e-9),260/(dy||1e-9));
  return xy.map((p,i)=>({x:40+(520-dx*scale)/2+(p.x-minX)*scale,y:40+(260-dy*scale)/2+(p.y-minY)*scale,n:i+1}));
}
