// アイキャッチ様式B（アイソメトリック図解）の共通部品
//
// 等角投影（30度）の座標計算と、立体の描画、標準版面の生成をまとめたもの。
// 個別の図は style-b-*.js からこれを読み込んで使う。

const C30 = Math.cos(Math.PI / 6); // 0.86603
const S30 = 0.5;

/**
 * 等角投影。worldX は右下へ、worldY は左下へ、worldZ は上へ伸びる。
 * 画面上で真横（右）に進みたいときは (dx=+1, dy=-1) 方向へ動かす。
 */
function iso(x, y, z, ox, oy) {
  return [ox + (x - y) * C30, oy + (x + y) * S30 - z];
}

const fmt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
const poly = (pts) => pts.map(fmt).join(' ');

/** 軸に平行な直方体。cTop/cRight/cLeft の3面を描く。 */
function box(x, y, z, w, d, h, ox, oy, [cTop, cRight, cLeft], stroke = '#0b141c', sw = 1.6) {
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
  const a = `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  return `    <polygon points="${poly(left)}" fill="${cLeft}" ${a}/>
    <polygon points="${poly(right)}" fill="${cRight}" ${a}/>
    <polygon points="${poly(top)}" fill="${cTop}" ${a}/>`;
}

/**
 * 任意の多角形底面を押し出した角柱。船体のような非直方体に使う。
 * pts は world XY の反時計回りで与えること（側面の可視判定に使う）。
 */
function prism(pts, z, h, ox, oy, [cTop, cSideA, cSideB], stroke = '#0b141c', sw = 1.6) {
  const a = `stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`;
  let out = [];
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    // 反時計回りのとき外向き法線は (dy, -dx)。視線 (1,1,1) に対し nx+ny>0 なら可視
    if (dy - dx <= 0) continue;
    const face = [
      iso(p1[0], p1[1], z, ox, oy), iso(p2[0], p2[1], z, ox, oy),
      iso(p2[0], p2[1], z + h, ox, oy), iso(p1[0], p1[1], z + h, ox, oy),
    ];
    // 手前ほど後に描く
    const depth = (p1[0] + p1[1] + p2[0] + p2[1]) / 2;
    out.push({ depth, svg: `    <polygon points="${poly(face)}" fill="${i % 2 ? cSideB : cSideA}" ${a}/>` });
  }
  out.sort((p, q) => p.depth - q.depth);
  const top = pts.map((p) => iso(p[0], p[1], z + h, ox, oy));
  return out.map((o) => o.svg).join('\n') + `\n    <polygon points="${poly(top)}" fill="${cTop}" ${a}/>`;
}

/** 平らな面（水面・床など）。半透明で重ねると「沈んでいる」表現になる。 */
function plane(pts, z, ox, oy, fill, stroke = 'none', sw = 0) {
  const p = pts.map((q) => iso(q[0], q[1], z, ox, oy));
  return `    <polygon points="${poly(p)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

/** world 上の2点を結ぶ線。配管・係留索・ケーブルに使う。 */
function link(p1, p2, ox, oy, color, width, opts = {}) {
  const a = iso(p1[0], p1[1], p1[2], ox, oy);
  const b = iso(p2[0], p2[1], p2[2], ox, oy);
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  return `    <line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash}/>`;
}

/** 線の中点に置く矢印。向きは画面上の p1→p2。 */
function arrowAt(p1, p2, ox, oy, color, size = 9) {
  const a = iso(p1[0], p1[1], p1[2], ox, oy);
  const b = iso(p2[0], p2[1], p2[2], ox, oy);
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len, uy = vy / len;
  const px = -uy, py = ux;
  // 正三角形に近いと向きが読めない。長さ:幅 をおよそ 2:1 にする
  const t = [mx + ux * size * 1.4, my + uy * size * 1.4];
  const l = [mx - ux * size * 0.8 + px * size * 0.55, my - uy * size * 0.8 + py * size * 0.55];
  const r = [mx - ux * size * 0.8 - px * size * 0.55, my - uy * size * 0.8 - py * size * 0.55];
  return `    <path d="M ${fmt(t).replace(',', ' ')} L ${fmt(l).replace(',', ' ')} L ${fmt(r).replace(',', ' ')} Z" fill="${color}"/>`;
}

/** 等角のうすいグリッド。 */
function grid(ox, oy, step = 70, n = 15, color = '#1e3a54', opacity = 0.5) {
  let g = [`  <g stroke="${color}" stroke-width="1" opacity="${opacity}">`];
  for (let i = -n; i <= n; i++) {
    const a = iso(i * step, -1100, 0, ox, oy), b = iso(i * step, 1100, 0, ox, oy);
    g.push(`    <line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`);
    const c = iso(-1100, i * step, 0, ox, oy), d = iso(1100, i * step, 0, ox, oy);
    g.push(`    <line x1="${c[0].toFixed(1)}" y1="${c[1].toFixed(1)}" x2="${d[0].toFixed(1)}" y2="${d[1].toFixed(1)}"/>`);
  }
  g.push('  </g>');
  return g.join('\n');
}

/**
 * CLAUDE.md「D. 版面仕様」に従った定型の枠。
 * 座標・サイズはここを唯一の出どころにする（様式が変わっても版面は不変）。
 */
const CATEGORY_COLOR = {
  '電力・冷却技術': '#0f766e',
  'AI・HPCインフラ': '#4338ca',
  '海外DC動向': '#0369a1',
  '国内DC動向': '#b45309',
  '市場データ・統計': '#4b5563',
};

function frame({ category, spec, kicker, headline, sub, accent, kickerColor, subColor, specBg, scrim }) {
  const catW = Math.max(150, category.length * 15 + 62);
  const specW = Math.max(220, spec.length * 17 + 60);
  return `
  <rect width="1200" height="630" fill="url(#vgn)"/>
  <rect x="0" y="288" width="1200" height="342" fill="${scrim}"/>

  <rect x="40" y="36" width="${catW}" height="38" rx="19" fill="${CATEGORY_COLOR[category]}"/>
  <text x="${40 + catW / 2}" y="61" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="15" font-weight="700" fill="white" text-anchor="middle">${category}</text>

  <rect x="${1160 - specW}" y="32" width="${specW}" height="44" rx="8" fill="${specBg}" opacity="0.96"/>
  <text x="${1160 - specW / 2}" y="60" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="16" font-weight="900" fill="white" text-anchor="middle">${spec}</text>

  <rect x="40" y="404" width="5" height="128" rx="2.5" fill="${accent}"/>

  <text x="60" y="462" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="46" font-weight="900" fill="${kickerColor}" filter="url(#ts)">${kicker}</text>
  <text x="60" y="534" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="31" font-weight="900" fill="white" filter="url(#ts)">${headline}</text>
  <text x="60" y="582" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="17" fill="${subColor}" filter="url(#ts)">${sub}</text>

  <text x="1160" y="606" font-family="Meiryo, Yu Gothic UI, Noto Sans JP, sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="end">DCトレンド研究</text>`;
}

module.exports = { iso, box, prism, plane, link, arrowAt, grid, frame, CATEGORY_COLOR, C30, S30 };
