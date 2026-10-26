import {cp, mkdir, readdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const source = new URL('../dist/', import.meta.url);
const output = new URL('../_site/', import.meta.url);

// Pages artifacts cannot contain symlinks. Fail rather than packaging targets
// outside the source directory or silently omitting them.
async function checkFiles(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const path = new URL(entry.name, directory);
    if (entry.isSymbolicLink()) throw new Error(`Symlink not allowed: ${fileURLToPath(path)}`);
    if (entry.isDirectory()) await checkFiles(new URL(entry.name + '/', directory));
  }
}

await checkFiles(source);
await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});
await cp(source, output, {recursive: true});
await writeFile(new URL('.nojekyll', output), '');
console.log(`Built GitHub Pages artifact: ${fileURLToPath(output)}`);
