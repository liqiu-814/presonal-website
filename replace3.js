const fs = require('fs');
const path = require('path');

const ROOT = 'd:/presonal website/about-template';

const replacements = [
  // View content - found in index-D17OUV97.js
  { file: 'assets/index-D17OUV97.js', from: '"View content"', to: '"查看内容"' },
  { file: 'assets/index-D17OUV97.js', from: '"View"', to: '"查看"' },

  // Accessibility overlay text
  { file: 'assets/index-D17OUV97.js', from: '"ITom — Creative Developer Portfolio"', to: '"个人作品集 | 创意开发者"' },
  { file: 'assets/index-D17OUV97.js', from: '"Portfolio Navigation"', to: '"作品集导航"' },
  { file: 'assets/index-D17OUV97.js', from: '"Welcome to ITom\'s interactive 3D portfolio. Click or press Enter on the doors to enter."', to: '"欢迎来到交互式3D作品集。点击或按回车键进入门。"' },
  { file: 'assets/index-D17OUV97.js', from: '"You are in the corridor. Choose a room to explore:"', to: '"你在走廊里。选择一个房间探索："' },
  { file: 'assets/index-D17OUV97.js', from: '"About — My story, skills, and journey"', to: '"关于 — 我的故事、技能和经历"' },
  { file: 'assets/index-D17OUV97.js', from: '"The Gallery — My projects and work"', to: '"作品集 — 我的项目"' },
  { file: 'assets/index-D17OUV97.js', from: '"Contact — Get in touch with me"', to: '"联系 — 与我取得联系"' },
  { file: 'assets/index-D17OUV97.js', from: '"The Studio — Technologies and experience"', to: '"工作室 — 技术与经验"' },
  { file: 'assets/index-D17OUV97.js', from: '"You are in the "', to: '"你在"' },
  { file: 'assets/index-D17OUV97.js', from: '" room."', to: '"房间。"' },
  { file: 'assets/index-D17OUV97.js', from: '"About"', to: '"关于"' },
  { file: 'assets/index-D17OUV97.js', from: '"Gallery"', to: '"作品集"' },
  { file: 'assets/index-D17OUV97.js', from: '"Contact"', to: '"联系"' },
  { file: 'assets/index-D17OUV97.js', from: '"Studio"', to: '"工作室"' },
  { file: 'assets/index-D17OUV97.js', from: '"Go back to corridor"', to: '"返回走廊"' },
  { file: 'assets/index-D17OUV97.js', from: '"This room contains my personal story, awards, journey milestones, and technology skills displayed as interactive balloons."', to: '"这个房间包含我的个人故事、奖项、经历里程碑和技术技能，以交互式气球展示。"' },
  { file: 'assets/index-D17OUV97.js', from: '"My Awards"', to: '"我的奖项"' },
  { file: 'assets/index-D17OUV97.js', from: '"Browse through my portfolio projects displayed on paper cards. Click on a project card to see details and visit the live site."', to: '"浏览我在纸卡片上展示的作品集项目。点击卡片查看详情并访问网站。"' },
  { file: 'assets/index-D17OUV97.js', from: '"My Projects"', to: '"我的项目"' },
  { file: 'assets/index-D17OUV97.js', from: '"Find my social media links displayed as floating barrels. Click to visit my profiles on LinkedIn, GitHub, and other platforms."', to: '"以漂浮桶展示的社交媒体链接。点击访问我的领英、GitHub等平台主页。"' },
  { file: 'assets/index-D17OUV97.js', from: '"Contact Me"', to: '"联系我"' },
  { file: 'assets/index-D17OUV97.js', from: '"Explore my experience and skills on rotating monitors. Click a monitor to read detailed information about my work."', to: '"在旋转的显示器上探索我的经验和技能。点击显示器查看工作详细信息。"' },
  { file: 'assets/index-D17OUV97.js', from: '"The Studio"', to: '"工作室"' },
  { file: 'assets/index-D17OUV97.js', from: '"Quick Navigation"', to: '"快速导航"' },
  { file: 'assets/index-D17OUV97.js', from: '"Go to About"', to: '"去关于"' },
  { file: 'assets/index-D17OUV97.js', from: '"Go to Gallery"', to: '"去作品集"' },
  { file: 'assets/index-D17OUV97.js', from: '"Go to Contact"', to: '"去联系"' },
  { file: 'assets/index-D17OUV97.js', from: '"Go to Studio"', to: '"去工作室"' },
  { file: 'assets/index-D17OUV97.js', from: '"Entered "', to: '"已进入"' },

  // Sanity preloading text
  { file: 'assets/index-D17OUV97.js', from: '"Site of the Day Awards"', to: '"年度最佳网站奖"' },
  { file: 'assets/index-D17OUV97.js', from: '"Site of the Month Awards"', to: '"月度最佳网站奖"' },
  { file: 'assets/index-D17OUV97.js', from: '"Other Awards"', to: '"其他奖项"' },
  { file: 'assets/index-D17OUV97.js', from: '"ACHIEVEMENT"', to: '"成就"' },

  // Console log text
  { file: 'assets/index-D17OUV97.js', from: 'TOM KING', to: '个人作品集' },
  { file: 'assets/index-D17OUV97.js', from: 'PORTFOLIO', to: '作品集' },

  // More UI text
  { file: 'assets/index-D17OUV97.js', from: '"Skip to accessible navigation"', to: '"跳至无障碍导航"' },
  { file: 'assets/index-D17OUV97.js', from: '"Accessible navigation for 3D portfolio"', to: '"3D作品集无障碍导航"' },
  { file: 'assets/index-D17OUV97.js', from: '"About room content"', to: '"关于房间内容"' },
  { file: 'assets/index-D17OUV97.js', from: '"Gallery room content"', to: '"作品集房间内容"' },
  { file: 'assets/index-D17OUV97.js', from: '"Contact room content"', to: '"联系房间内容"' },
  { file: 'assets/index-D17OUV97.js', from: '"Studio room content"', to: '"工作室房间内容"' },
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
