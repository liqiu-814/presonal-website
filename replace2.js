const fs = require('fs');
const path = require('path');

const ROOT = 'd:/presonal website/about-template';

const replacements = [
  // Door sign labels (Experience-C9qO4Ipl.js)
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"THE"', to: '""' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"GALLERY"', to: '"作品集"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"STUDIO"', to: '"工作室"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"ABOUT"', to: '"关于"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"CONTACT"', to: '"联系"' },

  // Contact room labels
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"LINKEDIN"', to: '"领英"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"GITHUB"', to: '"GitHub"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"FACEBOOK"', to: '"脸书"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"INSTAGRAM"', to: '"Instagram"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"MESSAGE"', to: '"留言"' },

  // Contact form placeholder
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"email..."', to: '"邮箱..."' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"subject..."', to: '"主题..."' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"message..."', to: '"留言..."' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"SENDING..."', to: '"发送中..."' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"SEND"', to: '"发送"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Please fill all fields"', to: '"请填写所有字段"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Message sent! ✓"', to: '"留言已发送！✓"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Failed to send. Try again."', to: '"发送失败，请重试。"' },

  // Intro text (ITOM char animation)
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"<"', to: '"<"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"creative"', to: '"创意"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"developer"', to: '"开发"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"/>"', to: '"/>"' },

  // Studio content descriptions - simplify
  { file: 'assets/Experience-C9qO4Ipl.js', from: "It's late 2025, we're flying to space, and Young Multi... still didn't have his own website. So I took matters into my own hands.", to: '为音乐人打造官方网站的全过程。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: "📸 Watch how I turned a basic selfie into a professional photoshoot using a free AI tool from Google! In this step-by-step tutorial, I reveal my secret trick for crafting perfect prompts, even if you're a total beginner.", to: '用免费AI工具把普通自拍变成专业写真的完整教程。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Everything you need to know to get started with 3D in React.', to: '在 React 中开始 3D 开发所需的一切。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Introduction to GLSL shaders in WebGL and Three.js.', to: 'WebGL 和 Three.js 中的 GLSL 着色器入门。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'How to animate 3D objects with GSAP ScrollTrigger.', to: '如何用 GSAP ScrollTrigger 动画化 3D 对象。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Raycasting, hover effects, and click interactions in Three.js.', to: 'Three.js 中的光线投射、悬停效果和点击交互。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Optimizing draw calls, geometry instancing, and more.', to: '优化绘制调用、几何实例化等。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Creating textures with noise and math functions.', to: '用噪声和数学函数创建纹理。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'You\'ve probably noticed I\'ve been sharing a bunch of SOTD certificates on my stories lately. Yes, it\'s true—the YOUNG MULTI project officially scored a "double" and got recognized on the international stage...', to: 'Young Multi 项目获得多项国际大奖认可。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'How I achieved a sketch-like visual style using shaders.', to: '我如何使用着色器实现素描风格的视觉效果。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Performance tips for smooth 60fps 3D experiences.', to: '流畅 60fps 3D 体验的性能技巧。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'My path from traditional dev to creative development.', to: '我从传统开发者到创意开发者的路径。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Where I think interactive web is heading.', to: '我认为交互式网页的未来方向。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Creating consistent 3D component libraries.', to: '创建一致的 3D 组件库。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Making immersive experiences accessible to everyone.', to: '让沉浸式体验对所有人可用。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Adding spatial audio to enhance immersion.', to: '添加空间音频以增强沉浸感。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'POV: You open a door in Three.js', to: '视角：在 Three.js 中打开门' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'The satisfaction of debugging shaders', to: '调试着色器的满足感' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'What I do as a creative developer', to: '作为创意开发者我做什么' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'The struggle is real', to: '挣扎是真实的' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '30 seconds of pure satisfaction', to: '30秒的纯粹满足' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Was it worth it? Absolutely.', to: '值得吗？当然。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'My favorite micro-interactions', to: '我最爱的微交互' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Creative preloader concepts', to: '创意加载器概念' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Custom cursor madness', to: '自定义光标疯狂' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Simple but effective', to: '简单但有效' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Typography that moves', to: '会动的排版' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'View Content', to: '查看内容' },

  // SEO fallback in HTML
  { file: 'index.html', from: 'ITom – Award-Winning Creative Developer | Interactive Websites', to: '个人作品集 | 创意开发者' },
  { file: 'index.html', from: 'Portfolio of Tomasz Szmajda (ITom) — creative developer building interactive websites with smooth animations, storytelling, and clean code. Award-winning.', to: '个人作品集 - 构建流畅动画、叙事驱动的交互式网站。' },
  { file: 'index.html', from: 'About Me', to: '关于我' },
  { file: 'index.html', from: 'Interactive 3D developer portfolio', to: '个人3D作品集' },
  { file: 'index.html', from: 'Tomasz Szmajda', to: '你的名字' },
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
