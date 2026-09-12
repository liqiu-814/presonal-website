import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, 'dist');

const publicFiles = [
  'index.html',
  'style.css',
  'script.js',
  '_headers',
  '_redirects',
  'Material/images/p1.jpg',
  'about-template/index.html',
  'about-template/knowledge.html',
  'about-template/knowledge-reader.css',
  'about-template/knowledge-reader.js',
  'about-template/favico.png',
  'about-template/og-image.webp',
  'about-template/robots.txt',
  'about-template/llms.txt',
  'about-template/assets/index-bZnzF_b6.js',
  'about-template/assets/index-QPG3x1c9.css',
  'about-template/assets/Experience-C5_SznB9.js',
  'about-template/assets/browser-C482xkez.js',
  'about-template/assets/stegaEncodeSourceMap-DTCApOeB.js'
];

const publicDirectories = [
  'ai-interview-guide-main/docs',
  'cursors',
  'fonts',
  'images',
  'sounds',
  'textures'
];

const publicMappings = [
  ['about-template/favico.png', 'favico.png'],
  ['about-template/textures/corridor/avatar_sketch.webp', 'textures/corridor/avatar_sketch.webp']
];

function copy(relativePath, options = {}) {
  const source = join(projectRoot, relativePath);
  const destination = join(outputRoot, relativePath);
  if (!existsSync(source)) throw new Error(`缺少部署资源：${relativePath}`);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, ...options });
}

function copyAs([sourcePath, destinationPath]) {
  const source = join(projectRoot, sourcePath);
  const destination = join(outputRoot, destinationPath);
  if (!existsSync(source)) throw new Error(`缺少部署资源：${sourcePath}`);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
publicFiles.forEach(copy);
publicDirectories.forEach(path => copy(path, {
  filter: source => source === join(projectRoot, path) || !source.split(/[\\/]/).includes('backups')
}));
publicMappings.forEach(copyAs);

const aboutIndexPath = join(outputRoot, 'about-template/index.html');
const aboutIndex = readFileSync(aboutIndexPath, 'utf8')
  .replaceAll('./textures/', '/textures/');
writeFileSync(aboutIndexPath, aboutIndex);

const sharedDirectories = ['cursors', 'fonts', 'images', 'sounds', 'textures'];
for (const path of walk(join(outputRoot, 'about-template/assets'))) {
  if (extname(path) !== '.css') continue;
  let css = readFileSync(path, 'utf8');
  for (const directory of sharedDirectories) {
    css = css.replaceAll(`../${directory}/`, `/${directory}/`);
  }
  writeFileSync(path, css);
}

const files = walk(outputRoot);
const bytes = files.reduce((sum, path) => sum + statSync(path).size, 0);
console.log(`部署产物：${files.length} 个文件，${(bytes / 1024 / 1024).toFixed(2)} MB`);
