const fs = require('fs');

function replaceInFile(file, pairs) {
  let content = fs.readFileSync(file, 'utf8');
  let ok = 0, fail = [];
  for (const [oldS, newS] of pairs) {
    if (content.includes(oldS)) {
      content = content.split(oldS).join(newS);
      ok++;
    } else fail.push(oldS.slice(0, 50));
  }
  fs.writeFileSync(file, content);
  console.log(`${file}: ${ok} 成功, ${fail.length} 失败`);
  fail.forEach(f => console.log('  失败: ' + f));
}

// ===== Experience-C9qO4Ipl.js =====
replaceInFile('about-template/assets/Experience-C9qO4Ipl.js', [
  // 1. 虫子彩蛋
  ['children:"BUG FIXED!"', 'children:"你不要点我哦!"'],
  // 2. Hero 英文署名 ITOM → LIqiu (5字符重新排布)
  [
    '[{char:"I",baseX:-.95,splitDir:-1.6,delay:0},{char:"T",baseX:-.43,splitDir:-.6,delay:0},{char:"O",baseX:.23,splitDir:.6,delay:0},{char:"M",baseX:.95,splitDir:1.8,delay:0}]',
    '[{char:"L",baseX:-1.1,splitDir:-1.6,delay:0},{char:"I",baseX:-.55,splitDir:-.6,delay:0},{char:"q",baseX:0,splitDir:0,delay:0},{char:"i",baseX:.55,splitDir:.6,delay:0},{char:"u",baseX:1.1,splitDir:1.8,delay:0}]'
  ],
  // 3. Hero 中文 "< 创意 开发 />" → "< 欢迎来到 我的世界 />"
  [
    '{text:"创意",baseX:-.4,splitDir:-.8,delay:0},{text:"开发",baseX:.4,splitDir:.8,delay:0}',
    '{text:"欢迎来到",baseX:-.45,splitDir:-.8,delay:0},{text:"我的世界",baseX:.45,splitDir:.8,delay:0}'
  ],
  // 4. 作品集卡片标题
  ['{id:"monetune",title:"音乐教学"', '{id:"monetune",title:"ai学习助手"'],
  ['{id:"timber",title:"小猫游戏"', '{id:"timber",title:"英语学习小助手"']
]);

// ===== index-D17OUV97.js (SEO/品牌一致性) =====
replaceInFile('about-template/assets/index-D17OUV97.js', [
  ['Tomasz "ITom" Szmajda', 'LIqiu'],
  ['by ITom', 'by LIqiu'],
  ["ITom's content studio", "LIqiu's content studio"],
  ['developer portfolio by ITom', 'developer portfolio by LIqiu'],
  ['projects by ITom', 'projects by LIqiu']
]);
