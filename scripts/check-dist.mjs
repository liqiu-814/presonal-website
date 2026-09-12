import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, 'dist');
const maximumAssetBytes = 25 * 1024 * 1024;
const requiredFiles = [
  'index.html',
  'style.css',
  'script.js',
  '_headers',
  '_redirects',
  'favico.png',
  'Material/images/p1.jpg',
  'about-template/index.html',
  'about-template/assets/index-bZnzF_b6.js',
  'about-template/assets/index-QPG3x1c9.css',
  'about-template/knowledge.html',
  'ai-interview-guide-main/docs/03-rag-system/README.md',
  'textures/corridor/avatar_sketch.webp'
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const missingFiles = requiredFiles.filter(path => !existsSync(join(outputRoot, path)));
if (missingFiles.length) throw new Error(`部署产物缺少文件：${missingFiles.join(', ')}`);

const oversizedFiles = walk(outputRoot)
  .filter(path => statSync(path).size > maximumAssetBytes)
  .map(path => relative(outputRoot, path));
if (oversizedFiles.length) throw new Error(`文件超过 25 MB：${oversizedFiles.join(', ')}`);

const aboutIndex = readFileSync(join(outputRoot, 'about-template/index.html'), 'utf8');
if (aboutIndex.includes('./textures/')) throw new Error('3D 页面仍引用重复贴图目录');

const aboutCss = readFileSync(join(outputRoot, 'about-template/assets/index-QPG3x1c9.css'), 'utf8');
if (/\.\.\/(textures|fonts|images|sounds|cursors)\//.test(aboutCss)) {
  throw new Error('3D 样式仍引用重复公共资源');
}

console.log('部署产物检查通过');
