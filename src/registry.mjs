const validId = id => typeof id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Practice data could not be loaded.');
  return response.json();
}

// Paths are relative to the JSON document containing them, so loading also works
// beneath a GitHub Pages project path. Reject references outside the registry.
export async function loadRegistry(indexURL, readJSON = fetchJSON) {
  const url = new URL(indexURL);
  const index = await readJSON(url);
  if (index.schemaVersion !== 2 || !Array.isArray(index.centres) || !index.centres.length) {
    throw new Error('Unsupported practice registry.');
  }
  const centreIds = new Set();
  for (const entry of index.centres) {
    if (!validId(entry.id) || entry.path !== `./centres/${entry.id}.json` || centreIds.has(entry.id)) {
      throw new Error('Invalid or duplicate centre reference.');
    }
    centreIds.add(entry.id);
  }
  const groups = await Promise.all(index.centres.map(async entry => {
    const centreURL = new URL(entry.path, url);
    const centre = await readJSON(centreURL);
    if (centre.id !== entry.id || !centre.name || !Array.isArray(centre.routes) || !centre.routes.length) {
      throw new Error('Invalid centre record.');
    }
    for (const ref of centre.routes) {
      if (!validId(ref.id) || ref.path !== `../routes/${ref.id}.json`) throw new Error('Invalid route reference.');
    }
    const routes = await Promise.all(centre.routes.map(async ref => {
      const route = await readJSON(new URL(ref.path, centreURL));
      if (route.id !== ref.id || route.centreId !== centre.id || typeof route.title !== 'string' ||
          !Array.isArray(route.roads) || !route.roads.length || !route.roads.every(r=>typeof r==='string') ||
          !Array.isArray(route.skills) || !route.skills.length || !route.skills.every(s=>typeof s==='string')) {
        throw new Error('Route does not match its centre index or has invalid fields.');
      }
      return route;
    }));
    return {centre, routes};
  }));
  const routes = groups.flatMap(group => group.routes);
  if (new Set(routes.map(route => route.id)).size !== routes.length) throw new Error('Duplicate route reference.');
  return {schemaVersion: 2, centres: groups.map(group => group.centre), routes};
}
