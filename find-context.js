const fs = require('fs');
const css = fs.readFileSync('about-template/assets/index-BvAzD-RO.css', 'utf8');
const re = /z-index:\s*(\d+)/g;
const set = new Set();
let m;
while ((m = re.exec(css))) set.add(m[1]);
console.log('CSS z-index 值:', [...set].join(', '));
// 查看 html 里引入了哪些字体
const html = fs.readFileSync('about-template/index.html', 'utf8');
const fonts = html.match(/fonts\.googleapis[^"]*/g);
console.log('字体:', fonts ? fonts.join('\n') : '无 Google Fonts');
