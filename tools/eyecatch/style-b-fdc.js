// 様式B：浮体式データセンター（FDC）の系統図
// 記事: floating-datacenter-moi-hitachi-2026
//
// 写真では表せないもの——「船の中にDCがあり、海水で冷やし、係留され、
// 陸とケーブルでつながっている」という関係——を1枚で見せる。
// 使い方: node tools/eyecatch/style-b-fdc.js out.svg

const fs = require('fs');
const { iso, box, prism, plane, link, arrowAt, grid, frame } = require('./iso');

const OX = 600, OY = 188;

// 船の長手方向 u は画面右、幅方向 w は画面下に来るように world へ写す
const R = Math.SQRT1_2;
const uw = (u, w) => [u * R + w * R, -u * R + w * R];

const L = 560;   // 船の長さ（world）
const B = 150;   // 船の幅（world）
const HULL_H = 46;
const DECK = HULL_H;
const WATER_Z = 19;

// 船体の輪郭。world XY 反時計回りになるよう並べる
const hullPts = [
  uw(-L / 2, -B / 2),
  uw(L / 2 - 120, -B / 2),
  uw(L / 2, 0),            // 船首
  uw(L / 2 - 120, B / 2),
  uw(-L / 2, B / 2),
];

const HULL = ['#3f5163', '#2a3746', '#1d2833'];
const RACK_C = ['#4a6f8c', '#2f4a61', '#22374a'];
const HOT = ['#f0b27a', '#c8763a', '#8a4d25'];
const QUAY = ['#5b5f63', '#3d4145', '#2b2e31'];

let art = [];

// ① 船体
art.push(prism(hullPts, 0, HULL_H, OX, OY, HULL));

// ② 甲板上のラック列（カットアウェイ表現）
for (let i = 0; i < 5; i++) {
  const u = -L / 2 + 90 + i * 90;
  const c = uw(u, 0);
  art.push(box(c[0] - 26, c[1] - 26, DECK, 52, 52, 34, OX, OY, RACK_C));
}
// 船尾側の機械室（熱交換器）を1つだけ暖色にして主役を作る
{
  const c = uw(-L / 2 + 54, 0);
  art.push(box(c[0] - 22, c[1] - 22, DECK, 44, 44, 26, OX, OY, HOT));
}

// ③ 岸壁
{
  const q = uw(L / 2 + 140, 26);
  art.push(box(q[0] - 62, q[1] - 62, 0, 124, 124, 34, OX, OY, QUAY));
}

// ④ 係留索（船首側2本）
const moorA = uw(L / 2 - 130, -B / 2);
const moorB = uw(L / 2 - 130, B / 2);
const bollard = uw(L / 2 + 110, 26);
let lines = [];
lines.push(link([moorA[0], moorA[1], HULL_H], [bollard[0], bollard[1], 30], OX, OY, '#94a3b8', 3.2));
lines.push(link([moorB[0], moorB[1], HULL_H], [bollard[0], bollard[1], 30], OX, OY, '#94a3b8', 3.2));

// ⑤ 陸からの電力・通信ケーブル（岸壁 → 船尾、破線）
const cableShore = uw(L / 2 + 140, 62);
const cableShip = uw(-L / 2 + 60, B / 2 - 10);
lines.push(link([cableShore[0], cableShore[1], 26], [cableShip[0], cableShip[1], HULL_H - 6], OX, OY, '#a78bfa', 4, { dash: '14 9' }));

// ⑥ 海水冷却ループ（喫水下・船の左右）
const inA = uw(-L / 2 - 40, B / 2 + 128);
const inB = uw(-L / 2 + 50, B / 2 + 6);
const outA = uw(-L / 2 + 190, B / 2 + 6);
const outB = uw(-L / 2 + 300, B / 2 + 128);
lines.push(link([inA[0], inA[1], 9], [inB[0], inB[1], 9], OX, OY, '#38bdf8', 8));
lines.push(arrowAt([inA[0], inA[1], 9], [inB[0], inB[1], 9], OX, OY, '#7dd3fc', 22));
lines.push(link([outA[0], outA[1], 9], [outB[0], outB[1], 9], OX, OY, '#fb923c', 8));
lines.push(arrowAt([outA[0], outA[1], 9], [outB[0], outB[1], 9], OX, OY, '#fdba74', 22));

// ⑦ 水面（半透明。船体の喫水下を覆って「浮いている」ことを示す）
const waterPts = [[-1400, -1400], [1400, -1400], [1400, 1400], [-1400, 1400]];
const water = plane(waterPts, WATER_Z, OX, OY, 'rgba(12,74,110,0.55)');
// 波の筋
let waves = [];
for (let i = -7; i <= 7; i++) {
  const a = uw(-900, i * 96), b = uw(900, i * 96);
  waves.push(link([a[0], a[1], WATER_Z], [b[0], b[1], WATER_Z], OX, OY, '#5ab6dd', 1.6, { dash: '26 34' }));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <!-- Style B (isometric technical illustration): a floating data center as a system —
         hull with rack rows on deck, seawater cooling loop below the waterline, mooring lines
         to a quay, and a power/network cable from shore. A photograph of a container ship
         cannot show any of these relationships, and would imply the concept already exists. -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#08141f"/>
      <stop offset="52%" stop-color="#0d2033"/>
      <stop offset="100%" stop-color="#060d16"/>
    </linearGradient>
    <radialGradient id="vgn" cx="50%" cy="36%" r="78%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(2,7,13,0.74)"/>
    </radialGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(4,9,16,0)"/>
      <stop offset="30%" stop-color="rgba(4,9,16,0.72)"/>
      <stop offset="100%" stop-color="rgba(4,9,16,0.97)"/>
    </linearGradient>
    <filter id="ts"><feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(0,0,0,0.95)"/></filter>
    <filter id="ds"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="rgba(0,0,0,0.5)"/></filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

${grid(OX, OY, 84, 16, '#17415e', 0.34)}

  <!-- water surface first, so the solids read as sitting in it -->
  <g>
${water}
${waves.join('\n')}
  </g>

  <!-- seawater loop, mooring lines and shore cable -->
  <g>
${lines.join('\n')}
  </g>

  <!-- hull, deck racks, quay -->
  <g filter="url(#ds)">
${art.join('\n')}
  </g>
${frame({
  category: '国内DC動向',
  spec: '中古船改造・約1年',
  kicker: '船の上に、データセンターを載せる',
  headline: '商船三井×日立の構想は本物か — 4つのハードル',
  sub: '海水で冷やす・揺れを抑える・海上で保守する・陸とつなぐ',
  accent: '#38bdf8',
  kickerColor: '#7dd3fc',
  subColor: '#bae6fd',
  specBg: '#0c4a6e',
  scrim: 'url(#scrim)',
})}
</svg>
`;

const out = process.argv[2] || 'style-b-fdc.svg';
fs.writeFileSync(out, svg, 'utf8');
console.log('wrote', out);
