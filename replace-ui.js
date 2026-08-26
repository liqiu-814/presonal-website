const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'about-template', 'assets', 'index-D17OUV97.js');

let content = fs.readFileSync(indexFile, 'utf-8');

const replacements = [
  // Page titles
  ['ITom — Creative 3D Portfolio', '张三 — 资深前端工程师作品集'],
  ['About Me — ITom Portfolio', '关于我 — 张三作品集'],
  ['Gallery & Projects — ITom Portfolio', '项目集 — 张三作品集'],
  ['The Studio — ITom Portfolio', '创作日常 — 张三作品集'],
  ['Contact — ITom Portfolio', '联系我 — 张三作品集'],

  // UI labels
  ['"PORTFOLIO"', '"作品集"'],
  ['"EXPLORER"', '"探索"'],
  ['"Click a door to enter. Audio is currently"', '"点击门进入。当前音频："'],
  ['"[ON]"', '"[开]"'],
  ['"[OFF]"', '"[关]"'],
  ['"LOADING"', '"加载中"'],
  ['"ENTER"', '"进入"'],
  ['"CLOSE"', '"关闭"'],
  ['"BACK"', '"返回"'],
  ['"MUTE"', '"静音"'],
  ['"UNMUTE"', '"取消静音"'],
  ['"SKIP"', '"跳过"'],
  ['"NEXT"', '"下一个"'],
  ['"PREVIOUS"', '"上一个"'],

  // Room/door labels
  ['"about"', '"关于我"'],
  ['"gallery"', '"项目集"'],
  ['"studio"', '"创作日常"'],
  ['"contact"', '"联系我"'],

  // Descriptions
  ['Creative 3D developer portfolio', '创意3D开发者作品集'],
  ['Interactive 3D developer portfolio', '交互式3D开发者作品集'],
];

let success = 0;
let failure = 0;

replacements.forEach(([from, to]) => {
  if (content.includes(from)) {
    content = content.replace(from, to);
    console.log(`✓ Replaced: "${from}" → "${to}"`);
    success++;
  } else {
    console.log(`✗ Not found: "${from}"`);
    failure++;
  }
});

fs.writeFileSync(indexFile, content, 'utf-8');
console.log(`\nTotal: ${success} replaced, ${failure} failed`);