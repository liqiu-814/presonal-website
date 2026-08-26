const fs = require('fs');
const path = require('path');

const ROOT = 'd:/presonal website/about-template';

const replacements = [
  // === about-template/index.html ===
  // Title and meta
  { file: 'index.html', from: 'ITom – Award-Winning Creative Developer | Interactive Websites', to: '个人作品集 | 创意开发者' },
  { file: 'index.html', from: 'lang="en"', to: 'lang="zh-CN"' },
  { file: 'index.html', from: 'content="Interactive 3D developer portfolio by Tomasz \'ITom\' Szmajda. Explore WebGL experiments, React projects & GSAP animations in a hand-drawn gallery."', to: 'content="个人作品集 - 创意开发者。探索 WebGL 实验、React 项目与 GSAP 动画。"' },
  { file: 'index.html', from: 'content="Tomasz Szmajda"', to: 'content="你的名字"' },
  { file: 'index.html', from: 'content="Tomasz Szmajda, ITom, Tomasz ITom Szmajda, web developer portfolio, 3D web development, Three.js developer, React portfolio, frontend engineer"', to: 'content="个人作品集, 前端开发, 3D网页开发, Three.js, React, 创意编程"' },
  { file: 'index.html', from: 'content="Portfolio of Tomasz Szmajda (ITom) — creative developer building interactive websites with smooth animations, storytelling, and clean code. Award-winning."', to: 'content="个人作品集 - 构建流畅动画、叙事驱动的交互式网站。"' },
  { file: 'index.html', from: 'content="Tomasz Szmajda Portfolio"', to: 'content="个人作品集"' },
  { file: 'index.html', from: 'content="en_US"', to: 'content="zh_CN"' },
  { file: 'index.html', from: 'content="Portfolio of Tomasz Szmajda (ITom) — creative developer building interactive websites with smooth animations, storytelling, and clean code. Award-winning."', to: 'content="个人作品集 - 构建流畅动画、叙事驱动的交互式网站。"' },

  // === Experience-C9qO4Ipl.js ===
  // About room - intro
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"TOMASZ SZMAJDA"', to: '"你的名字"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"(ITOM)"', to: '"(创意开发者)"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '\'"Crafting digital experiences\'', to: '\'"打造数字体验\'' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '\'that push creative boundaries"\'', to: '\'突破创意边界"\'' },

  // About room - awards
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"AWARDS"', to: '"奖项"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Site of the Day Awards"', to: '"年度最佳网站奖"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Site of the Month Awards"', to: '"月度最佳网站奖"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Other Awards"', to: '"其他奖项"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"AWARD"', to: '"奖项"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"PRESTIGE"', to: '"荣誉"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"SOTD"', to: '"今日之星"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"SOTM"', to: '"本月之星"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"OTHER"', to: '"其他"' },

  // About room - journey
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"JOURNEY"', to: '"经历"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"My path so far..."', to: '"我的过往..."' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"2025-NOW"', to: '"2025-至今"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"2023-NOW"', to: '"2023-至今"' },

  // About room - skills
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"SKILLS"', to: '"技能"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Technologies I love working with"', to: '"我热爱的技术"' },

  // Gallery project titles
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"MONETUNE"', to: '"音乐教学"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"TIMBERKITTY"', to: '"小猫游戏"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"YOUNG MULTI"', to: '"青年音乐人"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"BIO"', to: '"个人简介"' },

  // Gallery project descriptions
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'MoneTune is a step-by-step blueprint that teaches beginners how to generate passive income using AI-created music.', to: '一个教初学者利用AI音乐赚取被动收入的教程平台。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'TimberKitty is an addictive, free-to-play browser arcade game built in pure JavaScript.', to: '一款用纯JavaScript构建的上瘾免费浏览器街机游戏。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'A sleek, modern concept website dedicated to the Polish rapper and creator Young Multi.', to: '为青年音乐人打造的现代概念网站。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'A fast, modern personal bio page serving as a central hub for my digital footprint.', to: '一个快速现代的个人主页，作为我的数字足迹中心。' },

  // Studio platform labels
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"YouTube"', to: '"YouTube"' },  // Keep as is
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Blog"', to: '"博客"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"TikTok"', to: '"TikTok"' },  // Keep as is
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Instagram"', to: '"Instagram"' },  // Keep as is
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"X (Twitter)"', to: '"X"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"LinkedIn"', to: '"LinkedIn"' },  // Keep as is
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"Codrops"', to: '"Codrops"' },  // Keep as is

  // Studio content data - sample entries
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'I Built a Website for Young Multi for $__,___', to: '我为音乐人搭建了一个官方网站' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Turning an ordinary selfie into a professional AI photoshoot!', to: '用AI把普通自拍变成专业写真！' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'React Three Fiber Crash Course', to: 'React Three Fiber 速成教程' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Shaders for Beginners', to: '着色器入门' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'GSAP + Three.js Integration', to: 'GSAP 与 Three.js 集成' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Building Interactive 3D Scenes', to: '构建交互式3D场景' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'WebGL Performance Deep Dive', to: 'WebGL性能深挖' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Procedural Textures Tutorial', to: '程序化纹理教程' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Double Site of the Day confirmed!', to: '再次获得年度最佳网站！' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'The Hand-Drawn Aesthetic', to: '手绘美学' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Optimizing 3D for the Web', to: 'Web端3D优化' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Creative Coding Journey', to: '创意编程之旅' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'The Future of Web Experiences', to: '网页体验的未来' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Design Systems for 3D', to: '3D设计系统' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Accessibility in 3D Web', to: '3D网页无障碍' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Audio in Web Experiences', to: '网页体验中的音频' },

  // TikTok content
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Zaobserwuj mnie na TikToku!', to: '在TikTok关注我！' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Dzielę się tam wskazówkami z designu, kodowania i nie tylko.', to: '分享设计、编程等方面的技巧。' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Coding a door animation', to: '编写门的动画' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'When the shader finally works', to: '当着色器终于跑通了' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Day in the life: WebGL Dev', to: 'WebGL开发者的日常' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'React vs Three.js POV', to: 'React vs Three.js 视角' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Making a 3D button', to: '制作3D按钮' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'This shader took 3 hours', to: '这个着色器花了我3小时' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Hover effects compilation', to: '悬停效果合集' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Loading screen ideas', to: '加载界面创意' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Cursor goes brrr', to: '光标呼呼转' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Parallax scrolling magic', to: '视差滚动魔法' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: 'Text animation inspo', to: '文字动画灵感' },

  // UI text
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"VIEW"', to: '"查看"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"OPEN PROJECT"', to: '"打开项目"' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"PROJECT DETAILS:"', to: '"项目详情："' },
  { file: 'assets/Experience-C9qO4Ipl.js', from: '"TECH STACK"', to: '"技术栈"' },

  // === index-D17OUV97.js ===
  // Navigation and UI
  { file: 'assets/index-D17OUV97.js', from: '"HOME"', to: '"首页"' },
  { file: 'assets/index-D17OUV97.js', from: '"ABOUT"', to: '"关于"' },
  { file: 'assets/index-D17OUV97.js', from: '"GALLERY"', to: '"作品"' },
  { file: 'assets/index-D17OUV97.js', from: '"STUDIO"', to: '"工作室"' },
  { file: 'assets/index-D17OUV97.js', from: '"CONTACT"', to: '"联系"' },
  { file: 'assets/index-D17OUV97.js', from: '"ENTER"', to: '"进入"' },
  { file: 'assets/index-D17OUV97.js', from: '"WALK IN"', to: '"走进"' },
  { file: 'assets/index-D17OUV97.js', from: '"SCROLL"', to: '"滚动"' },
  { file: 'assets/index-D17OUV97.js', from: '"Scroll to explore"', to: '"滚动探索"' },
  { file: 'assets/index-D17OUV97.js', from: '"scroll"', to: '"滚动"' },
  { file: 'assets/index-D17OUV97.js', from: '"ORBIT"', to: '"环绕"' },
  { file: 'assets/index-D17OUV97.js', from: '"DRAG"', to: '"拖拽"' },
  { file: 'assets/index-D17OUV97.js', from: '"TO EXPLORE"', to: '"来探索"' },
  { file: 'assets/index-D17OUV97.js', from: '"ZOOM"', to: '"缩放"' },
  { file: 'assets/index-D17OUV97.js', from: '"Achievement Unlocked"', to: '"成就解锁"' },
  { file: 'assets/index-D17OUV97.js', from: '"Settings"', to: '"设置"' },
  { file: 'assets/index-D17OUV97.js', from: '"Mute"', to: '"静音"' },
  { file: 'assets/index-D17OUV97.js', from: '"Unmute"', to: '"取消静音"' },
  { file: 'assets/index-D17OUV97.js', from: '"Back to Entrance"', to: '"返回入口"' },
  { file: 'assets/index-D17OUV97.js', from: '"Send Message"', to: '"发送消息"' },
  { file: 'assets/index-D17OUV97.js', from: '"Your message..."', to: '"你的留言..."' },
  { file: 'assets/index-D17OUV97.js', from: '"Email"', to: '"邮箱"' },
  { file: 'assets/index-D17OUV97.js', from: '"Subject"', to: '"主题"' },
  { file: 'assets/index-D17OUV97.js', from: '"Message"', to: '"留言"' },
  { file: 'assets/index-D17OUV97.js', from: '"Name"', to: '"姓名"' },
  { file: 'assets/index-D17OUV97.js', from: '"Close"', to: '"关闭"' },
  { file: 'assets/index-D17OUV97.js', from: '"Menu"', to: '"菜单"' },
  { file: 'assets/index-D17OUV97.js', from: '"Loading"', to: '"加载中"' },
  { file: 'assets/index-D17OUV97.js', from: '"Please wait"', to: '"请稍候"' },
  { file: 'assets/index-D17OUV97.js', from: '"Next"', to: '"下一个"' },
  { file: 'assets/index-D17OUV97.js', from: '"Previous"', to: '"上一个"' },
  { file: 'assets/index-D17OUV97.js', from: '"More"', to: '"更多"' },
  { file: 'assets/index-D17OUV97.js', from: '"Less"', to: '"收起"' },
  { file: 'assets/index-D17OUV97.js', from: '"View Project"', to: '"查看项目"' },
  { file: 'assets/index-D17OUV97.js', from: '"Visit Website"', to: '"访问网站"' },
  { file: 'assets/index-D17OUV97.js', from: '"Live Demo"', to: '"在线演示"' },
  { file: 'assets/index-D17OUV97.js', from: '"Source Code"', to: '"源代码"' },

  // Preloader text
  { file: 'assets/index-D17OUV97.js', from: '"Loading portfolio"', to: '"加载作品集"' },
  { file: 'assets/index-D17OUV97.js', from: '"Initializing 3D"', to: '"初始化3D"' },
  { file: 'assets/index-D17OUV97.js', from: '"Preparing experience"', to: '"准备体验"' },
  { file: 'assets/index-D17OUV97.js', from: '"Almost ready"', to: '"即将就绪"' },
  { file: 'assets/index-D17OUV97.js', from: '"Welcome"', to: '"欢迎"' },

  // SEO fallback text
  { file: 'assets/index-D17OUV97.js', from: '"ITom — Award-Winning Creative Developer | Interactive Websites"', to: '"个人作品集 | 创意开发者"' },
  { file: 'assets/index-D17OUV97.js', from: '"About Me"', to: '"关于我"' },
  { file: 'assets/index-D17OUV97.js', from: '"My Work"', to: '"我的作品"' },
  { file: 'assets/index-D17OUV97.js', from: '"Studio"', to: '"工作室"' },
  { file: 'assets/index-D17OUV97.js', from: '"Contact"', to: '"联系方式"' },
  { file: 'assets/index-D17OUV97.js', from: '"Get in touch"', to: '"联系我"' },
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
