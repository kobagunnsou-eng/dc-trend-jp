// 様式B（アイソメトリック図解）プレースホルダSVG生成
// 液冷記事用：GPU → コールドプレート → CDU → 屋外放熱器 という熱の経路を左→右に描く
const fs = require('fs');

const C30 = Math.cos(Math.PI / 6); // 0.8660
const S30 = 0.5;

// 等角投影：worldX は右下へ、worldY は左下へ、worldZ は上へ
function iso(x, y, z, ox, oy) {
  return [ox + (x - y) * C30, oy + (x + y) * S30 - z];
}
const P = (p) => p.map((q) => q.join(',')).join(' ');

function box(x, y, z, w, d, h, ox, oy, cTop, cRight, cLeft, stroke) {
  const top = [
    iso(x, y, z + h, ox, oy), iso(x + w, y, z + h, ox, oy),
    iso(x + w, y + d, z + h, ox, oy), iso(x, y + d, z + h, ox, oy),
  ];
  const right = [
    iso(x + w, y, z, ox, oy), iso(x + w, y + d, z, ox, oy),
    iso(x + w, y + d, z + h, ox, oy), iso(x + w, y, z + h, ox, oy),
  ];
  const left = [
    iso(x, y + d, z, ox, oy), iso(x + w, y + d, z, ox, oy),
    iso(x + w, y + d, z + h, ox, oy), iso(x, y + d, z + h, ox, oy),
  ];
  return `    <polygon points="${P(left)}" fill="${cLeft}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
    <polygon points="${P(right)}" fill="${cRight}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
    <polygon points="${P(top)}" fill="${cTop}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

// 画面上で真横に進む方向は (dx=+1, dy=-1)
const OX = 600, OY = 214;
const STEP = 176;          // 部材間の world 距離
const W = 104, D = 104;      // 部材の底面
const positions = [0, 1, 2, 3].map((i) => {
  const t = (i - 1.5) * STEP;
  return { x: t, y: -t };
});

const SLATE = ['#4a5a6e', '#33404f', '#232d38'];
const CYAN  = ['#38bdf8', '#1d7fb0', '#145a7d'];
const COPPER= ['#f0b27a', '#c8763a', '#8a4d25'];
const STEEL = ['#7c8b9a', '#53616e', '#3a454f'];
const EDGE  = '#0b141c';

let parts = [];

// ① GPUサーバー（コールドプレート付き）
{
  const p = positions[0];
  parts.push(box(p.x, p.y, 0, W, D, 42, OX, OY, ...SLATE, EDGE));
  // 上面のコールドプレート2枚
  parts.push(box(p.x + 14, p.y + 18, 42, 32, 70, 11, OX, OY, ...COPPER, EDGE));
  parts.push(box(p.x + 58, p.y + 18, 42, 32, 70, 11, OX, OY, ...COPPER, EDGE));
}
// ② マニホールド（ラック側の分配）
{
  const p = positions[1];
  parts.push(box(p.x, p.y, 0, W, D, 64, OX, OY, ...SLATE, EDGE));
  parts.push(box(p.x + 12, p.y + 12, 64, 80, 80, 10, OX, OY, ...CYAN, EDGE));
}
// ③ CDU（熱交換器）
{
  const p = positions[2];
  parts.push(box(p.x, p.y, 0, W, D, 82, OX, OY, ...SLATE, EDGE));
  // 熱交換のフィン
  for (let i = 0; i < 4; i++) {
    parts.push(box(p.x + 12 + i * 21, p.y + 14, 82, 10, 76, 18, OX, OY, ...CYAN, EDGE));
  }
}
// ④ 屋外放熱器（ドライクーラー）
{
  const p = positions[3];
  parts.push(box(p.x, p.y, 0, W, D, 54, OX, OY, ...STEEL, EDGE));
  // 天面のファン2基
  const fanAt = (fx, fy) => {
    const c = iso(p.x + fx, p.y + fy, 54, OX, OY);
    return `    <ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="27" ry="15.6" fill="#1b2530" stroke="${EDGE}" stroke-width="1.6"/>
    <ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="16" ry="9.2" fill="#2b3947" stroke="#55707e" stroke-width="1.4"/>`;
  };
  parts.push(fanAt(32, 52));
  parts.push(fanAt(74, 52));
}

// 配管：温かい側（上段・オレンジ）と冷たい側（下段・シアン）
function pipe(fromIdx, toIdx, zOff, color, width) {
  const a = positions[fromIdx], b = positions[toIdx];
  const p1 = iso(a.x + W, a.y + D / 2, zOff, OX, OY);
  const p2 = iso(b.x, b.y + D / 2, zOff, OX, OY);
  return `    <line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}
function arrow(fromIdx, toIdx, zOff, color, dir) {
  const a = positions[fromIdx], b = positions[toIdx];
  const p1 = iso(a.x + W, a.y + D / 2, zOff, OX, OY);
  const p2 = iso(b.x, b.y + D / 2, zOff, OX, OY);
  const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
  const s = dir > 0 ? 1 : -1;
  return `    <path d="M ${(mx - 9 * s).toFixed(1)} ${(my - 7).toFixed(1)} L ${(mx + 9 * s).toFixed(1)} ${my.toFixed(1)} L ${(mx - 9 * s).toFixed(1)} ${(my + 7).toFixed(1)} Z" fill="${color}"/>`;
}

let pipes = [];
for (let i = 0; i < 3; i++) {
  pipes.push(pipe(i, i + 1, 50, '#fb923c', 7));   // 温水：右へ
  pipes.push(arrow(i, i + 1, 50, '#fdba74', +1));
  pipes.push(pipe(i, i + 1, 16, '#38bdf8', 7));   // 冷水：左へ
  pipes.push(arrow(i, i + 1, 16, '#7dd3fc', -1));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <!-- Style B (isometric technical illustration): the heat path of a liquid-cooled rack —
         GPU + cold plate → manifold → CDU → outdoor dry cooler. Warm loop runs right, cool loop returns left. -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1622"/>
      <stop offset="55%" stop-color="#101d2c"/>
      <stop offset="100%" stop-color="#070d15"/>
    </linearGradient>
    <linearGradient id="tov" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(5,10,17,0)"/>
      <stop offset="30%" stop-color="rgba(5,10,17,0.70)"/>
      <stop offset="100%" stop-color="rgba(5,10,17,0.97)"/>
    </linearGradient>
    <radialGradient id="vgn" cx="50%" cy="38%" r="76%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(3,7,12,0.72)"/>
    </radialGradient>
    <filter id="ts"><feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(0,0,0,0.95)"/></filter>
    <filter id="ds"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="rgba(0,0,0,0.55)"/></filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- faint isometric grid -->
  <g stroke="#1e3a54" stroke-width="1" opacity="0.5">
${(() => {
  let g = [];
  for (let i = -14; i <= 14; i++) {
    const a = iso(i * 70, -900, 0, OX, OY), b = iso(i * 70, 900, 0, OX, OY);
    g.push(`    <line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`);
    const c = iso(-900, i * 70, 0, OX, OY), d = iso(900, i * 70, 0, OX, OY);
    g.push(`    <line x1="${c[0].toFixed(1)}" y1="${c[1].toFixed(1)}" x2="${d[0].toFixed(1)}" y2="${d[1].toFixed(1)}"/>`);
  }
  return g.join('\n');
})()}
  </g>

  <!-- pipes behind the blocks -->
  <g>
${pipes.join('\n')}
  </g>

  <!-- components -->
  <g filter="url(#ds)">
${parts.join('\n')}
  </g>

  <rect width="1200" height="630" fill="url(#vgn)"/>
  <rect x="0" y="288" width="1200" height="342" fill="url(#tov)"/>

  <!-- Category badge -->
  <rect x="40" y="36" width="188" height="38" rx="19" fill="#0f766e"/>
  <text x="134" y="61" font-family="sans-serif" font-size="15" font-weight="700" fill="white" text-anchor="middle">電力・冷却技術</text>

  <!-- Spec badge -->
  <rect x="874" y="32" width="286" height="44" rx="8" fill="#0c4a6e" opacity="0.96"/>
  <text x="1017" y="60" font-family="sans-serif" font-size="16" font-weight="900" fill="white" text-anchor="middle">1ラック120kW時代</text>

  <rect x="40" y="404" width="5" height="128" rx="2.5" fill="#38bdf8"/>

  <text x="60" y="462" font-family="sans-serif" font-size="47" font-weight="900" fill="#7dd3fc" filter="url(#ts)">空冷の限界、液冷の時代へ</text>
  <text x="60" y="534" font-family="sans-serif" font-size="31" font-weight="900" fill="white" filter="url(#ts)">GPUの熱は、どこを通って建物の外へ出るのか</text>
  <text x="60" y="582" font-family="sans-serif" font-size="17" fill="#bae6fd" filter="url(#ts)">コールドプレート → マニホールド → CDU → 屋外放熱器という一本の経路</text>

  <text x="1160" y="606" font-family="sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="end">DCトレンド研究</text>
</svg>
`;

const out = process.argv[2];
fs.writeFileSync(out, svg, 'utf8');
console.log('wrote', out);
