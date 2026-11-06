import fs from 'node:fs/promises';
import sharp from 'sharp';

const W = 1200;
const H = 630;

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="42%" r="60%">
      <stop offset="0%" stop-color="#c9a45b" stop-opacity=".20"/>
      <stop offset="60%" stop-color="#8a713f" stop-opacity=".05"/>
      <stop offset="100%" stop-color="#080a08" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#080a08" stop-opacity=".92"/>
      <stop offset="55%" stop-color="#080a08" stop-opacity=".35"/>
      <stop offset="100%" stop-color="#080a08" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#080a08"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="#d8b56f" stroke-opacity=".22"/>
  <text x="80" y="228" font-family="Consolas, monospace" font-size="22" letter-spacing="9" fill="#c9a45b">ARCHIVE / 档案</text>
  <text x="80" y="330" font-family="Georgia, serif" font-size="84" fill="#f3ebda">Noita 知识库</text>
  <text x="80" y="398" font-family="Microsoft YaHei, sans-serif" font-size="27" fill="#b9b09b">Mod 制作 · 机制研究 · 实验记录</text>
  <text x="80" y="470" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="#8d8675">写给愿意把游戏拆开看的人</text>
  <text x="80" y="556" font-family="Consolas, monospace" font-size="20" letter-spacing="3" fill="#8a713f">ayoimiy.github.io</text>
  <rect x="80" y="264" width="86" height="2" fill="#d8b56f" fill-opacity=".55"/>
</svg>`;

const sigil = await fs.readFile('src/assets/hero-sigil.svg');
const sigilPng = await sharp(sigil).resize(470, 470).png().toBuffer();

await sharp(Buffer.from(background))
  .composite([{ input: sigilPng, left: 700, top: 78 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');

const meta = await sharp('public/og.png').metadata();
console.log(`public/og.png ${meta.width}x${meta.height} ${meta.size ?? ''}`);
