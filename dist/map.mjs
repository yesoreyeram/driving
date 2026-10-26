// Use the publisher's existing public Google map embeds. The external navigation
// exporter is independent of this preview and can emit a single full-route GPX.
export function mountMap(container,sourceMaps){
 if(!sourceMaps.length){const box=document.createElement('div');box.className='map-empty';const heading=document.createElement('strong');heading.textContent='Route map not yet available';const description=document.createElement('p');description.textContent='This reference has no source map coordinates. Read the road highlights and source notes; no exact route line has been inferred.';box.append(heading,description);container.replaceChildren(box);return ()=>{};}
 const frame=document.createElement('iframe');frame.title='Historical source route map; road path has not been independently verified';frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
 const controls=document.createElement('div');controls.className='source-map-controls';
 const label=document.createElement('span');label.className='source-map-label';
 function show(index){const u=new URL(sourceMaps[index]);if(u.origin!=='https://www.google.com'||u.pathname!=='/maps/embed')throw new Error('Unsupported source map.');frame.src=u.href;label.textContent=`Historical source map ${index+1} of ${sourceMaps.length}`;controls.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 sourceMaps.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`Map ${i+1}`;b.setAttribute('aria-label',`Show source map ${i+1} of ${sourceMaps.length}`);b.onclick=()=>show(i);controls.append(b);});
 container.replaceChildren(frame,label,controls);show(0);return ()=>{};
}
