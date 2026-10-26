// Display public Google map embeds. The external navigation
// exporter is independent of this preview and can emit a single full-route GPX.
export function mountMap(container,mapURLs){
 if(!mapURLs.length){const box=document.createElement('div');box.className='map-empty';const heading=document.createElement('strong');heading.textContent='Route map not yet available';const description=document.createElement('p');description.textContent='This reference has no route map coordinates. Read the road highlights and practice notes; no exact route line has been inferred.';box.append(heading,description);container.replaceChildren(box);return ()=>{};}
 const frame=document.createElement('iframe');frame.title='Historical route map; road path has not been independently verified';frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
 const controls=document.createElement('div');controls.className='map-part-controls';
 const label=document.createElement('span');label.className='map-part-label';
 function show(index){const u=new URL(mapURLs[index]);if(u.origin!=='https://www.google.com'||u.pathname!=='/maps/embed')throw new Error('Unsupported route map.');frame.src=u.href;label.textContent=`Historical route map ${index+1} of ${mapURLs.length}`;controls.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 mapURLs.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`Map ${i+1}`;b.setAttribute('aria-label',`Show route map ${i+1} of ${mapURLs.length}`);b.onclick=()=>show(i);controls.append(b);});
 container.replaceChildren(frame,label,controls);show(0);return ()=>{};
}
