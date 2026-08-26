const fs = require('fs');
const path = require('path');

const ROOT = 'd:/presonal website/about-template';

const replacements = [
  // Hero section - name and bio
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"你的名字"', to: '"张三"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"(创意开发者)"', to: '"(资深前端工程师)"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"打造数字体验"', to: '"专注前端架构"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '突破创意边界', to: '打造精致体验' },

  // Skill balloons labels - update to match user's skills
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"React"', to: 'label:"React"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"Three.js"', to: 'label:"Vue"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"GSAP"', to: 'label:"TypeScript"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"JavaScript"', to: 'label:"JavaScript"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"CSS"', to: 'label:"CSS"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"Next.js"', to: 'label:"Node.js"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"HTML"', to: 'label:"HTML"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"Git"', to: 'label:"Git"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"Figma"', to: 'label:"Webpack"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'label:"Firebase"', to: 'label:"Vite"' },

  // Index.html SEO - change name references
  { file: 'index.html', from: '你的名字', to: '张三' },
];

let successCount = 0;
let failCount = 0;
const failures = [];

for (const { file, from, to } of replacements) {
  const filePath = path.join(ROOT, file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(from)) {
      failCount++;
      failures.push(`${file}: "${from.substring(0, 60)}..." - not found`);
      continue;
    }
    content = content.replace(from, to);
    fs.writeFileSync(filePath, content, 'utf8');
    successCount++;
    console.log(`OK: ${file} - "${from.substring(0, 40)}..." → "${to.substring(0, 40)}..."`);
  } catch (err) {
    failCount++;
    failures.push(`${file}: "${from.substring(0, 60)}..." - ERROR: ${err.message}`);
  }
}

console.log(`\nResults: ${successCount} replaced, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f}`));
}
