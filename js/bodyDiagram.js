// ===== 動的人体図：身体パーツが上下にずれて歪みを表現 =====
// 重要: 画面の左＝患者の左、画面の右＝患者の右（患者目線で統一）
// val=-1: 左が高い → 画面左が上がる
// val= 1: 右が高い → 画面右が上がる
// 下側にいっている方 = 詰まっている（収縮）

const BodyDiagram = {
  TILT: 14,

  positions: {
    firstStage: {
      mastoid:         { leftX: 132, rightX: 168, baseY: 38, label: '乳様突起' },
      scapulaInferior: { leftX: 106, rightX: 194, baseY: 155, label: '肩甲下角' },
      iliacCrest:      { leftX: 102, rightX: 198, baseY: 232, label: '腸骨稜' }
    },
    upperDetail: {
      acromion:      { leftX: 78,  rightX: 222, baseY: 78, label: '肩峰' },
      mastoidDetail: { leftX: 56,  rightX: 244, baseY: 146, label: '肘頭' },
      radialStyloid: { leftX: 46,  rightX: 254, baseY: 224, label: '茎状突起' }
    },
    lowerDetail: {
      greaterTrochanter: { leftX: 116, rightX: 184, baseY: 278, label: '大転子' },
      patellaUpper:      { leftX: 118, rightX: 182, baseY: 370, label: '膝蓋骨上端' },
      lateralMalleolus:  { leftX: 112, rightX: 188, baseY: 500, label: '外果' }
    }
  },

  // 左側シフト計算: val=-1で上(-TILT)、val=1で下(+TILT)
  _lShift(val) { return (val || 0) * this.TILT; },
  // 右側シフト計算: val=1で上(-TILT)、val=-1で下(+TILT)
  _rShift(val) { return -(val || 0) * this.TILT; },

  // ===== ラベル・バッジ・ドットの2次元衝突回避 =====
  // 全要素を同じバウンディングボックス空間で管理する
  _placedBoxes: [],
  _resetPlacedLabels() { this._placedBoxes = []; },
  // 後方互換: _findSafeY をbbox方式にラップ（既存コード呼び出しの互換性維持）
  _findSafeY(desiredY, side, height) {
    const h = height || 18;
    // sideをx座標域に変換（互換用ラフ判定）
    let cx = 150, halfW = 22;
    if (side === 'left' || side === 'left-label') { cx = -16; halfW = 22; }
    else if (side === 'right' || side === 'right-label') { cx = 316; halfW = 22; }
    const placed = this._reserveBox(cx - halfW, desiredY - h / 2, halfW * 2, h, { axis: 'y' });
    return placed.y + h / 2;
  },
  // bbox を「衝突しない位置」に配置して登録する
  // opts: { axis: 'y'|'xy', maxShift: number }
  _reserveBox(x, y, w, h, opts) {
    opts = opts || {};
    const axis = opts.axis || 'y';
    const pad = (opts.padding != null) ? opts.padding : 3;
    let bx = x, by = y;
    let attempts = 0;
    const maxAttempts = 40;
    while (attempts < maxAttempts) {
      const c = this._placedBoxes.find(b => this._overlaps(bx, by, w, h, b, pad));
      if (!c) break;
      if (axis === 'y') {
        // 下方向に逃がす
        by = c.y + c.h + pad + 0.5;
      } else {
        // xy: 試行ごとに方向を変える（下→上→右→左）
        const phase = attempts % 4;
        if (phase === 0) by = c.y + c.h + pad + 0.5;
        else if (phase === 1) by = c.y - h - pad - 0.5;
        else if (phase === 2) bx = c.x + c.w + pad + 0.5;
        else bx = c.x - w - pad - 0.5;
      }
      attempts++;
    }
    const box = { x: bx, y: by, w, h };
    this._placedBoxes.push(box);
    return box;
  },
  _overlaps(x, y, w, h, b, pad) {
    return !(x + w + pad <= b.x ||
             b.x + b.w + pad <= x ||
             y + h + pad <= b.y ||
             b.y + b.h + pad <= y);
  },
  // 既存要素として（位置移動なしで）bboxを登録するだけ
  _markBox(x, y, w, h) {
    this._placedBoxes.push({ x, y, w, h });
  },

  // ===== 背面図SVG（セグメントをグループ化） =====
  createBodySVG(prefix) {
    const p = prefix || '';
    return `
    <svg viewBox="-40 0 380 580" xmlns="http://www.w3.org/2000/svg" class="body-svg" data-prefix="${p}">
      <defs>
        <radialGradient id="${p}jointGrad">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <linearGradient id="${p}skinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde8d0"/>
          <stop offset="50%" stop-color="#f5d5b8"/>
          <stop offset="100%" stop-color="#e8c4a0"/>
        </linearGradient>
        <linearGradient id="${p}skinGradDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f0c8a0"/>
          <stop offset="100%" stop-color="#ddb08a"/>
        </linearGradient>
        <radialGradient id="${p}headGrad" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#fde8d0"/>
          <stop offset="80%" stop-color="#f0c8a0"/>
          <stop offset="100%" stop-color="#ddb08a"/>
        </radialGradient>
        <filter id="${p}softShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="shadow"/>
          <feFlood flood-color="#00000020"/>
          <feComposite in2="shadow" operator="in"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="${p}bodyClip">
          <rect x="0" y="0" width="300" height="580"/>
        </clipPath>
      </defs>

      <g class="body-segments" filter="url(#${p}softShadow)">

        <!-- ===== 胴体（静的ベース）===== -->
        <g class="seg-torso">
          <path class="body-part" data-part="torso"
            d="M82,74 C82,68 115,64 150,64 C185,64 218,68 218,74 L220,150 L218,242 C216,258 196,264 150,264 C104,264 84,258 82,242 L80,150 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.2"/>
          <!-- 背骨ライン（静的・薄く） -->
          <path class="spine-static" d="M150,70 C150,70 148,85 150,100 C152,115 148,130 150,145 C152,160 148,175 150,190 C152,205 148,220 150,240"
            stroke="#d4a882" stroke-width="1.2" fill="none" opacity="0.2"/>
          <!-- 椎骨ドット -->
          <circle cx="150" cy="80" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="100" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="120" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="140" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="160" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="180" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="200" r="1.5" fill="#d4a882" opacity="0.15"/>
          <circle cx="150" cy="220" r="1.5" fill="#d4a882" opacity="0.15"/>
          <!-- 肩甲骨（左） -->
          <path d="M108,100 C114,96 130,94 134,100 L136,140 C136,150 132,162 128,168 L110,170 C106,164 104,148 104,138 Z"
            fill="none" stroke="#d4a882" stroke-width="1.2" opacity="0.35"/>
          <!-- 肩甲骨（右） -->
          <path d="M192,100 C186,96 170,94 166,100 L164,140 C164,150 168,162 172,168 L190,170 C194,164 196,148 196,138 Z"
            fill="none" stroke="#d4a882" stroke-width="1.2" opacity="0.35"/>
          <circle cx="110" cy="170" r="2.5" fill="#d4a882" opacity="0.4"/>
          <circle cx="190" cy="170" r="2.5" fill="#d4a882" opacity="0.4"/>
          <!-- 僧帽筋ライン -->
          <path d="M130,68 Q140,72 150,74 Q160,72 170,68" fill="none" stroke="#d4a882" stroke-width="0.8" opacity="0.25"/>
          <path d="M120,74 Q135,82 150,86 Q165,82 180,74" fill="none" stroke="#d4a882" stroke-width="0.8" opacity="0.2"/>
          <!-- 腸骨稜ヒント -->
          <path d="M96,232 C108,224 130,220 150,220 C170,220 192,224 204,232"
            fill="none" stroke="#d4a882" stroke-width="1" opacity="0.35"/>
          <!-- 仙骨三角 -->
          <path d="M140,234 L150,252 L160,234" fill="none" stroke="#d4a882" stroke-width="0.8" opacity="0.3"/>
          <!-- 首（胴体に付属） -->
          <path class="body-part" data-part="neck"
            d="M138,52 Q150,58 162,52 L162,66 Q150,68 138,66 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1"/>
          <circle class="joint" cx="150" cy="54" r="4.5" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        </g>

        <!-- ===== 頭部（mastoidで傾く）===== -->
        <g class="seg seg-head">
          <ellipse cx="150" cy="26" rx="24" ry="28" fill="#5a3825" opacity="0.3"/>
          <ellipse class="body-part" data-part="head" cx="150" cy="28" rx="22" ry="26"
            fill="url(#${p}headGrad)" stroke="#c4956e" stroke-width="1.2"/>
          <path d="M128,18 C128,6 172,6 172,18 L172,28 C172,22 128,22 128,28 Z" fill="#4a2c1a" opacity="0.5"/>
          <ellipse class="body-part" data-part="ear-l" cx="128" cy="32" rx="5" ry="8"
            fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>
          <ellipse class="body-part" data-part="ear-r" cx="172" cy="32" rx="5" ry="8"
            fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>
        </g>

        <!-- ===== 左腕（肩〜手：scapulaInferiorで上下）===== -->
        <g class="seg seg-arm-l">
          <ellipse class="joint seg-shoulder-joint-l" cx="82" cy="76" rx="8" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="upperArm-l"
            d="M78,82 C68,96 60,122 56,148 L48,148 C54,118 64,92 76,78 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M72,88 C66,104 62,124 58,144" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.3"/>
          <ellipse class="joint" cx="52" cy="150" rx="7" ry="5" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="forearm-l"
            d="M50,156 L46,222 L38,222 L44,156 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <ellipse class="joint" cx="42" cy="226" rx="6" ry="4" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="hand-l"
            d="M38,230 L36,260 C35,268 34,280 33,290 C32,296 30,304 32,308 C34,314 42,314 44,308 C46,302 46,290 46,280 L48,260 L48,230 Z"
            fill="url(#${p}skinGradDark)" stroke="#c4956e" stroke-width="1"/>
          <line x1="34" y1="296" x2="32" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="37" y1="296" x2="36" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="40" y1="296" x2="40" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="43" y1="296" x2="43" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        </g>

        <!-- ===== 右腕 ===== -->
        <g class="seg seg-arm-r">
          <ellipse class="joint seg-shoulder-joint-r" cx="218" cy="76" rx="8" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="upperArm-r"
            d="M222,82 C232,96 240,122 244,148 L252,148 C246,118 236,92 224,78 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M228,88 C234,104 238,124 242,144" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.3"/>
          <ellipse class="joint" cx="248" cy="150" rx="7" ry="5" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="forearm-r"
            d="M250,156 L254,222 L262,222 L256,156 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <ellipse class="joint" cx="258" cy="226" rx="6" ry="4" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="hand-r"
            d="M262,230 L264,260 C265,268 266,280 267,290 C268,296 270,304 268,308 C266,314 258,314 256,308 C254,302 254,290 254,280 L252,260 L252,230 Z"
            fill="url(#${p}skinGradDark)" stroke="#c4956e" stroke-width="1"/>
          <line x1="266" y1="296" x2="268" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="263" y1="296" x2="264" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="260" y1="296" x2="260" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="257" y1="296" x2="257" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        </g>

        <!-- ===== 左脚（iliacCrestで上下）===== -->
        <g class="seg seg-leg-l">
          <ellipse class="joint" cx="128" cy="260" rx="8" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="thigh-l"
            d="M118,266 C116,290 114,320 113,350 L112,370 L140,370 L139,350 C138,320 138,290 140,266 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M124,280 C122,310 120,340 118,365" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="126" cy="374" rx="9" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="shin-l"
            d="M116,380 C114,410 112,444 110,478 L110,494 L138,494 L138,478 C137,444 137,410 138,380 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M114,395 C110,415 110,440 112,460" stroke="#d4a882" stroke-width="0.8" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="124" cy="498" rx="8" ry="5" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="foot-l"
            d="M112,503 L110,520 C109,530 140,530 138,520 L136,503 Z"
            fill="url(#${p}skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        </g>

        <!-- ===== 右脚 ===== -->
        <g class="seg seg-leg-r">
          <ellipse class="joint" cx="172" cy="260" rx="8" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="thigh-r"
            d="M160,266 C162,290 162,320 161,350 L160,370 L188,370 L187,350 C186,320 184,290 182,266 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M176,280 C178,310 180,340 182,365" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="174" cy="374" rx="9" ry="6" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="shin-r"
            d="M162,380 C163,410 163,444 162,478 L162,494 L190,494 L190,478 C188,444 186,410 184,380 Z"
            fill="url(#${p}skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M186,395 C190,415 190,440 188,460" stroke="#d4a882" stroke-width="0.8" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="176" cy="498" rx="8" ry="5" fill="url(#${p}jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="foot-r"
            d="M162,503 L160,520 C159,530 190,530 188,520 L186,503 Z"
            fill="url(#${p}skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        </g>
      </g>

      <!-- 左右ラベル（画面左=患者の左、画面右=患者の右で統一） -->
      <text x="-32" y="18" font-size="13" fill="#64748b" font-weight="700"
        stroke="white" stroke-width="3" paint-order="stroke">左</text>
      <text x="332" y="18" font-size="13" fill="#64748b" font-weight="700" text-anchor="end"
        stroke="white" stroke-width="3" paint-order="stroke">右</text>
      <text x="150" y="570" text-anchor="middle" font-size="10" fill="#94a3b8" font-weight="500">人体図（患者目線）</text>

      <!-- 動的レイヤー -->
      <g class="spine-dynamic-layer"></g>
      <g class="zone-layer" clip-path="url(#${p}bodyClip)"></g>
      <g class="indicator-layer"></g>
      <g class="landmark-layer"></g>
    </svg>`;
  },

  init(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const prefix = containerId.replace(/[^a-zA-Z]/g, '') + '_';
    el.innerHTML = this.createBodySVG(prefix);
  },

  _highlightPart(svg, partName, color) {
    const part = svg.querySelector(`[data-part="${partName}"]`);
    if (part) part.setAttribute('fill', color);
  },

  _resetParts(svg) {
    const prefix = svg.dataset.prefix || '';
    svg.querySelectorAll('.body-part').forEach(el => {
      const p = el.dataset.part;
      if (!p) return;
      if (p === 'head') el.setAttribute('fill', `url(#${prefix}headGrad)`);
      else if (p.startsWith('ear')) el.setAttribute('fill', '#f0c8a0');
      else if (p === 'hand-l' || p === 'hand-r' || p === 'foot-l' || p === 'foot-r') el.setAttribute('fill', `url(#${prefix}skinGradDark)`);
      else el.setAttribute('fill', `url(#${prefix}skinGrad)`);
    });
  },

  // ===== メイン更新：身体パーツの移動 + ランドマーク表示 =====
  update(containerId, type, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let svg = el.querySelector('svg');
    if (!svg) {
      this.init(containerId);
      svg = el.querySelector('svg');
      if (!svg) return;
    }

    const landmarkLayer = svg.querySelector('.landmark-layer');
    const indicatorLayer = svg.querySelector('.indicator-layer');
    const spineDynLayer = svg.querySelector('.spine-dynamic-layer');
    const zoneLayer = svg.querySelector('.zone-layer');
    landmarkLayer.innerHTML = '';
    if (indicatorLayer) indicatorLayer.innerHTML = '';
    if (spineDynLayer) spineDynLayer.innerHTML = '';
    if (zoneLayer) zoneLayer.innerHTML = '';

    // セグメントのtransformをリセット
    svg.querySelectorAll('.seg').forEach(g => g.removeAttribute('transform'));
    this._resetParts(svg);

    const posMap = this.positions[type];
    if (!posMap) return;

    // ===== 身体パーツの動的シフト =====
    if (type === 'firstStage') {
      this._applyFirstStageShifts(svg, data);
    } else if (type === 'upperDetail') {
      this._applyUpperDetailShifts(svg, data);
    } else if (type === 'lowerDetail') {
      this._applyLowerDetailShifts(svg, data);
    }

    // 衝突空間リセット
    this._resetPlacedLabels();

    // ===== ランドマークドット・ライン描画（先にドットを衝突空間に登録） =====
    const dotEntries = [];
    for (const [key, pos] of Object.entries(posMap)) {
      const val = data[key];
      if (val === null || val === undefined) continue;

      const leftY  = pos.baseY + this._lShift(val);
      const rightY = pos.baseY + this._rShift(val);

      // 接続線
      landmarkLayer.appendChild(this._createSVGEl('line', {
        x1: pos.leftX, y1: leftY, x2: pos.rightX, y2: rightY,
        stroke: val === 0 ? '#22c55e' : '#e74c3c',
        'stroke-width': 2.5,
        'stroke-dasharray': val === 0 ? '' : '6,3',
        opacity: 0.8
      }));

      // 左ドット
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.leftX, cy: leftY, r: 6,
        fill: val === -1 ? '#3b82f6' : val === 1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': 2
      }));
      // ドットを衝突空間に登録
      this._markBox(pos.leftX - 7, leftY - 7, 14, 14);

      // 右ドット
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.rightX, cy: rightY, r: 6,
        fill: val === 1 ? '#3b82f6' : val === -1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': 2
      }));
      this._markBox(pos.rightX - 7, rightY - 7, 14, 14);

      dotEntries.push({ key, pos, val, leftY, rightY });
    }

    // ===== 矢印・ラベルを後でレイアウト（衝突回避） =====
    for (const e of dotEntries) {
      const { pos, val, leftY, rightY } = e;
      if (val !== 0) {
        const lArrow = val === -1 ? '↑' : '↓';
        const lColor = val === -1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.leftX - 14, y: leftY + 4, 'text-anchor': 'end',
          'font-size': 10, fill: lColor, 'font-weight': 700
        }, lArrow));
        this._markBox(pos.leftX - 22, leftY - 4, 12, 12);

        const rArrow = val === 1 ? '↑' : '↓';
        const rColor = val === 1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.rightX + 14, y: rightY + 4, 'text-anchor': 'start',
          'font-size': 10, fill: rColor, 'font-weight': 700
        }, rArrow));
        this._markBox(pos.rightX + 10, rightY - 4, 12, 12);
      }

      // 解剖ラベルはドット近くに配置（ドットの少し外側、衝突回避でずらす）
      const label = pos.label;
      const fontSize = 9;
      const labelW = label.length * fontSize + 4;
      const labelH = fontSize + 4;
      // 左ラベル: ドットの左外側に配置
      const lDesiredX = pos.leftX - 22 - labelW;
      const lDesiredY = leftY - labelH / 2;
      const lBox = this._reserveBox(lDesiredX, lDesiredY, labelW, labelH, { axis: 'xy', padding: 3 });
      // リーダー線（短く・薄く）
      landmarkLayer.appendChild(this._createSVGEl('line', {
        x1: pos.leftX - 8, y1: leftY,
        x2: lBox.x + labelW, y2: lBox.y + labelH / 2,
        stroke: '#cbd5e1', 'stroke-width': 0.5,
        'stroke-dasharray': '2,2', opacity: 0.5
      }));
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: lBox.x, y: lBox.y + labelH - 3, 'text-anchor': 'start',
        'font-size': fontSize, fill: '#475569', 'font-weight': 600
      }, label));
    }

    // ===== 詰まり・伸びインジケーター =====
    this._drawCompressionIndicators(svg, type, data);
  },

  // ===== firstStage: 頭・腕・脚を動かす =====
  _applyFirstStageShifts(svg, data) {
    const T = this.TILT;
    const mastVal = data.mastoid || 0;
    const scapVal = data.scapulaInferior || 0;
    const iliacVal = data.iliacCrest || 0;

    // 頭: mastoidで傾く（回転）
    const headRot = -mastVal * 3;
    const headG = svg.querySelector('.seg-head');
    if (headG && headRot !== 0) {
      headG.setAttribute('transform', `rotate(${headRot}, 150, 28)`);
    }

    // 左腕: scapulaInferiorの左側シフト
    const lArmShift = this._lShift(scapVal);
    const lArmG = svg.querySelector('.seg-arm-l');
    if (lArmG && lArmShift !== 0) {
      lArmG.setAttribute('transform', `translate(0, ${lArmShift})`);
    }

    // 右腕: scapulaInferiorの右側シフト
    const rArmShift = this._rShift(scapVal);
    const rArmG = svg.querySelector('.seg-arm-r');
    if (rArmG && rArmShift !== 0) {
      rArmG.setAttribute('transform', `translate(0, ${rArmShift})`);
    }

    // 左脚: iliacCrestの左側シフト
    const lLegShift = this._lShift(iliacVal);
    const lLegG = svg.querySelector('.seg-leg-l');
    if (lLegG && lLegShift !== 0) {
      lLegG.setAttribute('transform', `translate(0, ${lLegShift})`);
    }

    // 右脚: iliacCrestの右側シフト
    const rLegShift = this._rShift(iliacVal);
    const rLegG = svg.querySelector('.seg-leg-r');
    if (rLegG && rLegShift !== 0) {
      rLegG.setAttribute('transform', `translate(0, ${rLegShift})`);
    }

    // 動的背骨カーブ
    this._drawDynamicSpine(svg, mastVal, scapVal, iliacVal);
  },

  // ===== upperDetail: 腕セグメントごとに動かす =====
  _applyUpperDetailShifts(svg, data) {
    // upperDetailでは腕全体を肩峰(acromion)の値で動かす
    const acromVal = data.acromion || 0;
    const lArmShift = this._lShift(acromVal);
    const rArmShift = this._rShift(acromVal);
    const lArmG = svg.querySelector('.seg-arm-l');
    const rArmG = svg.querySelector('.seg-arm-r');
    if (lArmG && lArmShift !== 0) lArmG.setAttribute('transform', `translate(0, ${lArmShift})`);
    if (rArmG && rArmShift !== 0) rArmG.setAttribute('transform', `translate(0, ${rArmShift})`);
  },

  // ===== lowerDetail: 脚セグメントごとに動かす =====
  _applyLowerDetailShifts(svg, data) {
    const gtVal = data.greaterTrochanter || 0;
    const lLegShift = this._lShift(gtVal);
    const rLegShift = this._rShift(gtVal);
    const lLegG = svg.querySelector('.seg-leg-l');
    const rLegG = svg.querySelector('.seg-leg-r');
    if (lLegG && lLegShift !== 0) lLegG.setAttribute('transform', `translate(0, ${lLegShift})`);
    if (rLegG && rLegShift !== 0) rLegG.setAttribute('transform', `translate(0, ${rLegShift})`);
  },

  // ===== 動的背骨カーブ（S字歪みを表現） =====
  _drawDynamicSpine(svg, mastVal, scapVal, iliacVal) {
    const layer = svg.querySelector('.spine-dynamic-layer');
    if (!layer) return;
    layer.innerHTML = '';

    if (mastVal === 0 && scapVal === 0 && iliacVal === 0) return;

    const T = this.TILT;
    // 背骨は左右の中間を通る
    // 各レベルでのX方向の偏位（左が高い=背骨は右に湾曲、右が高い=左に湾曲）
    const xShiftHead = mastVal * 4;
    const xShiftScap = scapVal * 6;
    const xShiftIliac = iliacVal * 5;

    const cx = 150;
    const path = `M ${cx + xShiftHead},66
      C ${cx + xShiftHead},90 ${cx + xShiftScap * 0.6},110 ${cx + xShiftScap},130
      C ${cx + xShiftScap * 1.2},150 ${cx + xShiftScap},170 ${cx + (xShiftScap + xShiftIliac) / 2},190
      C ${cx + xShiftIliac * 0.7},210 ${cx + xShiftIliac},225 ${cx + xShiftIliac},245`;

    // メインの背骨カーブ
    layer.appendChild(this._createSVGEl('path', {
      d: path,
      stroke: '#e74c3c', 'stroke-width': 2.5, fill: 'none',
      opacity: 0.6, 'stroke-linecap': 'round'
    }));

    // 背骨上のドット（椎骨マーカー）
    const yPoints = [70, 90, 110, 130, 150, 170, 190, 210, 230];
    for (const y of yPoints) {
      // Y位置に応じたXオフセットを補間
      let xOff;
      if (y <= 100) {
        const t = (y - 66) / (130 - 66);
        xOff = xShiftHead + (xShiftScap - xShiftHead) * t;
      } else if (y <= 190) {
        const t = (y - 130) / (190 - 130);
        xOff = xShiftScap + ((xShiftScap + xShiftIliac) / 2 - xShiftScap) * t;
      } else {
        const t = (y - 190) / (245 - 190);
        xOff = (xShiftScap + xShiftIliac) / 2 + (xShiftIliac - (xShiftScap + xShiftIliac) / 2) * t;
      }

      layer.appendChild(this._createSVGEl('circle', {
        cx: cx + xOff, cy: y, r: 2,
        fill: '#e74c3c', opacity: 0.5
      }));
    }
  },

  // ===== 詰まり（圧迫）・伸び（牽引）インジケーター =====
  _drawCompressionIndicators(svg, type, data) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    const posMap = this.positions[type];
    const entries = Object.entries(posMap);

    for (let i = 0; i < entries.length - 1; i++) {
      const [keyA] = entries[i];
      const [keyB] = entries[i + 1];
      const valA = data[keyA];
      const valB = data[keyB];

      if (valA === null || valA === undefined || valB === null || valB === undefined) continue;
      if (valA === 0 && valB === 0) continue;
      if (valA === valB) continue;
      if (valA === 0 || valB === 0) continue;

      const leftCompressed = (valA === 1 && valB === -1);
      const rightCompressed = (valA === -1 && valB === 1);

      const posA = this.positions[type][keyA];
      const posB = this.positions[type][keyB];
      const midY = (posA.baseY + posB.baseY) / 2;

      const compSide = leftCompressed ? 'left' : 'right';
      const compXBase = compSide === 'left' ? 105 : 195;
      const compLabel = compSide === 'left' ? '左' : '右';
      const stretchXBase = compSide === 'left' ? 195 : 105;
      const stretchLabel = compSide === 'left' ? '右' : '左';

      // バッジを衝突回避で配置（小型化・padding強化）
      const badgeW = 32, badgeH = 18;
      const compBox = this._reserveBox(compXBase - badgeW / 2, midY - badgeH / 2, badgeW, badgeH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compBox.x, y: compBox.y, width: badgeW, height: badgeH,
        rx: 6, fill: '#ef4444', opacity: 0.92
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compBox.x + badgeW / 2, y: compBox.y + badgeH - 5, 'text-anchor': 'middle',
        'font-size': 10, fill: 'white', 'font-weight': 800
      }, `${compLabel}詰`));

      const stretchBox = this._reserveBox(stretchXBase - badgeW / 2, midY - badgeH / 2, badgeW, badgeH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchBox.x, y: stretchBox.y, width: badgeW, height: badgeH,
        rx: 6, fill: '#0ea5e9', opacity: 0.88
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchBox.x + badgeW / 2, y: stretchBox.y + badgeH - 5, 'text-anchor': 'middle',
        'font-size': 10, fill: 'white', 'font-weight': 800
      }, `${stretchLabel}伸`));
    }
  },

  // ===== 収縮・伸長ゾーン描画（showZones） =====
  showZones(containerId, type, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const svg = el.querySelector('svg');
    if (!svg) return;

    const zoneLayer = svg.querySelector('.zone-layer');
    zoneLayer.innerHTML = '';
    this._resetParts(svg);

    const posMap = this.positions[type];
    if (!posMap) return;

    const entries = Object.entries(posMap);
    const cx = 150;

    const partMapping = {
      upperDetail: {
        0: { left: ['upperArm-l'], right: ['upperArm-r'] },
        1: { left: ['forearm-l', 'hand-l'], right: ['forearm-r', 'hand-r'] }
      },
      lowerDetail: {
        0: { left: ['thigh-l'], right: ['thigh-r'] },
        1: { left: ['shin-l'], right: ['shin-r'] }
      }
    };

    for (let i = 0; i < entries.length - 1; i++) {
      const [keyA, posA] = entries[i];
      const [keyB, posB] = entries[i + 1];
      const valA = data[keyA] || 0;
      const valB = data[keyB] || 0;

      if (valA === 0 && valB === 0) continue;

      const svgLeftYA = posA.baseY + this._lShift(valA);
      const svgLeftYB = posB.baseY + this._lShift(valB);
      const svgRightYA = posA.baseY + this._rShift(valA);
      const svgRightYB = posB.baseY + this._rShift(valB);

      const hasPattern = (valA !== 0 && valB !== 0 && valA !== valB);

      if (!hasPattern) {
        if (valA !== 0 || valB !== 0) {
          const midY = (posA.baseY + posB.baseY) / 2;
          zoneLayer.appendChild(this._createSVGEl('text', {
            x: 150, y: midY + 4, 'text-anchor': 'middle',
            'font-size': 9, fill: '#94a3b8', 'font-weight': 600
          }, '偏位あり'));
        }
        continue;
      }

      const pattern1 = (valA === -1 && valB === 1);
      const pattern2 = (valA === 1 && valB === -1);

      // ゾーン（左側）
      const svgLeftIsContraction = pattern2;
      const svgLeftColor = svgLeftIsContraction ? 'rgba(239,68,68,0.45)' : 'rgba(14,165,233,0.45)';
      const svgLeftStroke = svgLeftIsContraction ? '#ef4444' : '#0ea5e9';
      zoneLayer.appendChild(this._createSVGEl('polygon', {
        points: `${cx},${svgLeftYA} ${posA.leftX},${svgLeftYA} ${posB.leftX},${svgLeftYB} ${cx},${svgLeftYB}`,
        fill: svgLeftColor, stroke: svgLeftStroke,
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // ゾーン（右側）
      const svgRightIsContraction = pattern1;
      const svgRightColor = svgRightIsContraction ? 'rgba(239,68,68,0.45)' : 'rgba(14,165,233,0.45)';
      const svgRightStroke = svgRightIsContraction ? '#ef4444' : '#0ea5e9';
      zoneLayer.appendChild(this._createSVGEl('polygon', {
        points: `${cx},${svgRightYA} ${posA.rightX},${svgRightYA} ${posB.rightX},${svgRightYB} ${cx},${svgRightYB}`,
        fill: svgRightColor, stroke: svgRightStroke,
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // パーツハイライト（腕・脚を赤/紫で色付け）
      const mapping = partMapping[type]?.[i];
      if (mapping) {
        const contractedSide = pattern1 ? 'right' : 'left';
        const tensionedSide = pattern1 ? 'left' : 'right';
        if (mapping[contractedSide]) {
          mapping[contractedSide].forEach(p => this._highlightPart(svg, p, 'rgba(239,68,68,0.50)'));
        }
        if (mapping[tensionedSide]) {
          mapping[tensionedSide].forEach(p => this._highlightPart(svg, p, 'rgba(14,165,233,0.50)'));
        }
      }

      // ラベル
      const midY = (posA.baseY + posB.baseY) / 2;

      if (pattern1) {
        const mx1 = (cx + Math.max(posA.rightX, posB.rightX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '縮'));
        const mx2 = (cx + Math.min(posA.leftX, posB.leftX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 12, fill: '#0ea5e9', 'font-weight': 700
        }, '↕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#0ea5e9', 'font-weight': 700
        }, '伸'));
      } else {
        const mx1 = (cx + Math.min(posA.leftX, posB.leftX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '縮'));
        const mx2 = (cx + Math.max(posA.rightX, posB.rightX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 12, fill: '#0ea5e9', 'font-weight': 700
        }, '↕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#0ea5e9', 'font-weight': 700
        }, '伸'));
      }
    }
  },

  // ===== 全身統合ダイアグラム =====
  // 上半身(肩峰・肘頭・茎状突起) + 下半身(大転子・膝蓋骨上端・外果) を1体で表示
  unifiedPositions: {
    acromion:           { leftX: 78,  rightX: 222, baseY: 78,  label: '肩峰' },
    mastoidDetail:      { leftX: 56,  rightX: 244, baseY: 146, label: '肘頭' },
    radialStyloid:      { leftX: 46,  rightX: 254, baseY: 224, label: '茎状突起' },
    greaterTrochanter:  { leftX: 116, rightX: 184, baseY: 278, label: '大転子' },
    patellaUpper:       { leftX: 118, rightX: 182, baseY: 370, label: '膝蓋骨上端' },
    lateralMalleolus:   { leftX: 112, rightX: 188, baseY: 500, label: '外果' }
  },

  // 全身統合ダイアグラムを描画（上半身データ＋下半身データを合わせて1枚で表示）
  // opts.simple = true: ミニ比較用（ラベル・矢印省略、ゾーン色+バッジのみ）
  updateUnified(containerId, upperData, lowerData, standingData, opts) {
    const simple = opts && opts.simple;
    const el = document.getElementById(containerId);
    if (!el) return;

    let svg = el.querySelector('svg');
    if (!svg) {
      this.init(containerId);
      svg = el.querySelector('svg');
      if (!svg) return;
    }

    const landmarkLayer = svg.querySelector('.landmark-layer');
    const indicatorLayer = svg.querySelector('.indicator-layer');
    const spineDynLayer = svg.querySelector('.spine-dynamic-layer');
    const zoneLayer = svg.querySelector('.zone-layer');
    landmarkLayer.innerHTML = '';
    if (indicatorLayer) indicatorLayer.innerHTML = '';
    if (spineDynLayer) spineDynLayer.innerHTML = '';
    if (zoneLayer) zoneLayer.innerHTML = '';

    // セグメントリセット
    svg.querySelectorAll('.seg').forEach(g => g.removeAttribute('transform'));
    this._resetParts(svg);

    // ラベル衝突回避トラッカーをリセット（左右ラベル群の重なり防止）
    this._resetPlacedLabels();

    // 全データを統合
    const allData = { ...upperData, ...lowerData };

    // === 身体パーツの動的シフト（全身版） ===
    this._applyUnifiedShifts(svg, allData);

    // === 立位基本3点（乳様突起・肩甲下角・腸骨稜）のドット描画 ===
    // 後で配置するラベルのデータを集める
    const standingLabelQueue = [];
    if (!simple) {
      const standingPosMap = this.positions.firstStage;
      for (const [key, pos] of Object.entries(standingPosMap)) {
        const val = standingData ? standingData[key] : null;
        if (val === null || val === undefined) continue;

        const leftY  = pos.baseY + this._lShift(val);
        const rightY = pos.baseY + this._rShift(val);

        landmarkLayer.appendChild(this._createSVGEl('circle', {
          cx: pos.leftX, cy: leftY, r: 5,
          fill: val === -1 ? '#3b82f6' : val === 1 ? '#f97316' : '#22c55e',
          stroke: 'white', 'stroke-width': 1.5
        }));
        this._markBox(pos.leftX - 6, leftY - 6, 12, 12);
        landmarkLayer.appendChild(this._createSVGEl('circle', {
          cx: pos.rightX, cy: rightY, r: 5,
          fill: val === 1 ? '#3b82f6' : val === -1 ? '#f97316' : '#22c55e',
          stroke: 'white', 'stroke-width': 1.5
        }));
        this._markBox(pos.rightX - 6, rightY - 6, 12, 12);

        // 立位ドットの↑↓矢印
        if (val !== 0) {
          const lArrow = val === -1 ? '↑' : '↓';
          const lColor = val === -1 ? '#3b82f6' : '#f97316';
          landmarkLayer.appendChild(this._createSVGEl('text', {
            x: pos.leftX, y: leftY - 10, 'text-anchor': 'middle',
            'font-size': 9, fill: lColor, 'font-weight': 700
          }, lArrow));
          this._markBox(pos.leftX - 5, leftY - 18, 10, 10);
          const rArrow = val === 1 ? '↑' : '↓';
          const rColor = val === 1 ? '#3b82f6' : '#f97316';
          landmarkLayer.appendChild(this._createSVGEl('text', {
            x: pos.rightX, y: rightY - 10, 'text-anchor': 'middle',
            'font-size': 9, fill: rColor, 'font-weight': 700
          }, rArrow));
          this._markBox(pos.rightX - 5, rightY - 18, 10, 10);
        }

        standingLabelQueue.push({ pos, leftY, rightY, isStanding: true });
      }
    }

    // === 詳細6ランドマークのドット描画（接続線なし） ===
    const posMap = this.unifiedPositions;
    const detailLabelQueue = [];
    for (const [key, pos] of Object.entries(posMap)) {
      const val = allData[key];
      if (val === null || val === undefined) continue;

      const leftY  = pos.baseY + this._lShift(val);
      const rightY = pos.baseY + this._rShift(val);

      // simpleモード: ドットだけ小さく表示
      const dotR = simple ? 4 : 6;
      const dotSW = simple ? 1.5 : 2;

      // 左ドット
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.leftX, cy: leftY, r: dotR,
        fill: val === -1 ? '#3b82f6' : val === 1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': dotSW
      }));
      this._markBox(pos.leftX - dotR - 1, leftY - dotR - 1, (dotR + 1) * 2, (dotR + 1) * 2);

      // 右ドット
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.rightX, cy: rightY, r: dotR,
        fill: val === 1 ? '#3b82f6' : val === -1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': dotSW
      }));
      this._markBox(pos.rightX - dotR - 1, rightY - dotR - 1, (dotR + 1) * 2, (dotR + 1) * 2);

      if (!simple) {
        if (val !== 0) {
          const lArrow = val === -1 ? '↑' : '↓';
          const lColor = val === -1 ? '#3b82f6' : '#f97316';
          landmarkLayer.appendChild(this._createSVGEl('text', {
            x: pos.leftX, y: leftY - 10, 'text-anchor': 'middle',
            'font-size': 9, fill: lColor, 'font-weight': 700
          }, lArrow));
          this._markBox(pos.leftX - 5, leftY - 18, 10, 10);
          const rArrow = val === 1 ? '↑' : '↓';
          const rColor = val === 1 ? '#3b82f6' : '#f97316';
          landmarkLayer.appendChild(this._createSVGEl('text', {
            x: pos.rightX, y: rightY - 10, 'text-anchor': 'middle',
            'font-size': 9, fill: rColor, 'font-weight': 700
          }, rArrow));
          this._markBox(pos.rightX - 5, rightY - 18, 10, 10);
        }
        detailLabelQueue.push({ pos, leftY, rightY, isStanding: false });
      }
    }

    // ===== ラベルレイアウト（ドット近接配置・bbox衝突回避） =====
    if (!simple) {
      // 立位3点を先に（薄いラベル）
      for (const item of standingLabelQueue) {
        this._placeAnatomicalLabel(landmarkLayer, item.pos, item.leftY, true);
      }
      // 詳細6点（濃いラベル）
      for (const item of detailLabelQueue) {
        this._placeAnatomicalLabel(landmarkLayer, item.pos, item.leftY, false);
      }
    }

    if (simple) {
      // simpleモード: パーツ色分けだけ（ラベルなし）
      this._applySimpleHighlights(svg, allData, standingData || {});
    } else {
      // === 体幹への影響（全体偏位・体幹回旋ラベルを先に配置） ===
      this._drawTrunkImpact(svg, allData, standingData || {});

      // === 立位検査データ（乳様突起・肩甲下角・腸骨稜）の詰まり/伸び可視化 ===
      this._drawStandingAnalysis(svg, standingData || {}, allData);

      // === 詰まり・伸びインジケーター（全身連続版） ===
      this._drawUnifiedCompressionIndicators(svg, allData);
    }
  },

  // ===== simpleモード用: パーツの色分けのみ（ラベルなし） =====
  _applySimpleHighlights(svg, detailData, standingData) {
    // 全身連続の各区間で収縮/伸長を判定してパーツ色付け
    const keys = ['acromion', 'mastoidDetail', 'radialStyloid', 'greaterTrochanter', 'patellaUpper', 'lateralMalleolus'];
    const partMapping = {
      0: { left: ['upperArm-l'], right: ['upperArm-r'] },
      1: { left: ['forearm-l', 'hand-l'], right: ['forearm-r', 'hand-r'] },
      2: { left: [], right: [] },
      3: { left: ['thigh-l'], right: ['thigh-r'] },
      4: { left: ['shin-l'], right: ['shin-r'] }
    };

    for (let i = 0; i < keys.length - 1; i++) {
      const valA = detailData[keys[i]];
      const valB = detailData[keys[i + 1]];
      if (valA == null || valB == null || valA === 0 || valB === 0 || valA === valB) continue;

      const leftCompressed = (valA === 1 && valB === -1);
      const rightCompressed = (valA === -1 && valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const compSide = leftCompressed ? 'left' : 'right';
      const stretchSide = leftCompressed ? 'right' : 'left';
      const mapping = partMapping[i];
      if (mapping) {
        (mapping[compSide] || []).forEach(p => this._highlightPart(svg, p, 'rgba(239,68,68,0.50)'));
        (mapping[stretchSide] || []).forEach(p => this._highlightPart(svg, p, 'rgba(14,165,233,0.50)'));
      }
    }

    // 体幹の色（全体偏位の場合赤っぽく）
    const acromVal = detailData.acromion;
    const gtVal = detailData.greaterTrochanter;
    if (acromVal != null && gtVal != null && acromVal !== 0 && gtVal !== 0 && acromVal === gtVal) {
      this._highlightPart(svg, 'torso', 'rgba(239,68,68,0.15)');
    } else if (acromVal != null && gtVal != null && acromVal !== 0 && gtVal !== 0 && acromVal !== gtVal) {
      this._highlightPart(svg, 'torso', 'rgba(245,158,11,0.15)');
    }
  },

  // ===== 全身シフト（上半身＋下半身） =====
  _applyUnifiedShifts(svg, data) {
    // 腕: 肩峰(acromion)で上下
    const acromVal = data.acromion || 0;
    const lArmShift = this._lShift(acromVal);
    const rArmShift = this._rShift(acromVal);
    const lArmG = svg.querySelector('.seg-arm-l');
    const rArmG = svg.querySelector('.seg-arm-r');
    if (lArmG && lArmShift !== 0) lArmG.setAttribute('transform', `translate(0, ${lArmShift})`);
    if (rArmG && rArmShift !== 0) rArmG.setAttribute('transform', `translate(0, ${rArmShift})`);

    // 脚: 大転子(greaterTrochanter)で上下
    const gtVal = data.greaterTrochanter || 0;
    const lLegShift = this._lShift(gtVal);
    const rLegShift = this._rShift(gtVal);
    const lLegG = svg.querySelector('.seg-leg-l');
    const rLegG = svg.querySelector('.seg-leg-r');
    if (lLegG && lLegShift !== 0) lLegG.setAttribute('transform', `translate(0, ${lLegShift})`);
    if (rLegG && rLegShift !== 0) rLegG.setAttribute('transform', `translate(0, ${rLegShift})`);

    // 頭: 肩峰の傾きから軽く回転
    const headRot = -acromVal * 2;
    const headG = svg.querySelector('.seg-head');
    if (headG && headRot !== 0) {
      headG.setAttribute('transform', `rotate(${headRot}, 150, 28)`);
    }
  },

  // ===== 解剖ラベルをドットの近くに配置（衝突回避） =====
  // ドットの左外側を第一候補、ダメなら少し離れた候補位置を順に試す
  // 立位ラベル(乳様突起・肩甲下角・腸骨稜)と詳細ラベルは同じ濃さ・サイズで統一
  _placeAnatomicalLabel(layer, pos, leftY, isStanding) {
    const label = pos.label;
    const fontSize = 9;
    const charW = 8.5;
    const labelW = label.length * charW + 4;
    const labelH = fontSize + 4;
    const fill = '#475569'; // 全ラベル共通の濃さ

    // 候補位置（優先順）：左ドットの左外側 → 上 → 下、それでもダメなら左マージン
    const dotX = pos.leftX, dotY = leftY;
    const offsets = [
      { x: dotX - 16 - labelW, y: dotY - labelH / 2 },         // 左外側（同じ高さ）
      { x: dotX - 14 - labelW, y: dotY - labelH - 6 },          // 左上
      { x: dotX - 14 - labelW, y: dotY + 6 },                    // 左下
      { x: dotX - 20 - labelW, y: dotY - labelH / 2 },          // さらに左外側
    ];

    let placed = null;
    for (const o of offsets) {
      // 試しに置いてみる（衝突なし限定）
      const collision = this._placedBoxes.find(b => this._overlaps(o.x, o.y, labelW, labelH, b, 4));
      if (!collision) {
        placed = { x: o.x, y: o.y, w: labelW, h: labelH };
        this._placedBoxes.push(placed);
        break;
      }
    }
    // すべてダメ → 左マージンに落とす（衝突回避でY調整・padding強化）
    if (!placed) {
      placed = this._reserveBox(-36, dotY - labelH / 2, labelW, labelH, { axis: 'y', padding: 4 });
    }

    // リーダー線（短く・薄く）
    layer.appendChild(this._createSVGEl('line', {
      x1: dotX - 7, y1: dotY,
      x2: placed.x + labelW, y2: placed.y + labelH / 2,
      stroke: '#cbd5e1', 'stroke-width': 0.5,
      'stroke-dasharray': '2,2', opacity: 0.5
    }));
    layer.appendChild(this._createSVGEl('text', {
      x: placed.x, y: placed.y + labelH - 3, 'text-anchor': 'start',
      'font-size': fontSize, fill, 'font-weight': 600
    }, label));
  },

  // ===== 全身連続の詰まり・伸びインジケーター =====
  // 各区間を腕・脚の実際の位置に配置
  _drawUnifiedCompressionIndicators(svg, data) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    const posMap = this.unifiedPositions;

    // 採用ペア（ユーザー指定の6組のうち、詳細検査由来の4組）
    // 肩峰×肘頭 / 肘頭×茎状突起 / 大転子×膝 / 膝×外果
    // 茎状突起×大転子は採用しない（解剖学的に意味の薄いペア）
    const pairs = [
      { a: 'acromion',          b: 'mastoidDetail',     cfg: { leftX: 30, rightX: 270, midYAdjust: -8, parts: { left: ['upperArm-l'],            right: ['upperArm-r'] } } },
      { a: 'mastoidDetail',     b: 'radialStyloid',     cfg: { leftX: 18, rightX: 282, midYAdjust:  0, parts: { left: ['forearm-l','hand-l'],    right: ['forearm-r','hand-r'] } } },
      { a: 'greaterTrochanter', b: 'patellaUpper',      cfg: { leftX: 70, rightX: 230, midYAdjust:  0, parts: { left: ['thigh-l'],               right: ['thigh-r'] } } },
      { a: 'patellaUpper',      b: 'lateralMalleolus',  cfg: { leftX: 68, rightX: 232, midYAdjust:  0, parts: { left: ['shin-l'],                right: ['shin-r'] } } }
    ];

    for (const { a: keyA, b: keyB, cfg } of pairs) {
      const valA = data[keyA];
      const valB = data[keyB];

      if (valA === null || valA === undefined || valB === null || valB === undefined) continue;
      if (valA === 0 || valB === 0) continue;
      // X-pattern（互い違いに矢印が向かい合う＝収束）のみ表示する。
      // samePair（同方向の傾き）は筋の縮み伸びが実際には発生しないので無視。
      if (valA === valB) continue;

      const leftCompressed  = (valA === 1  && valB === -1);
      const rightCompressed = (valA === -1 && valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const posA = posMap[keyA];
      const posB = posMap[keyB];
      const rawMidY = (posA.baseY + posB.baseY) / 2 + (cfg.midYAdjust || 0);

      const compSide = leftCompressed ? 'left' : 'right';
      const compX = compSide === 'left' ? cfg.leftX : cfg.rightX;
      const stretchX = compSide === 'left' ? cfg.rightX : cfg.leftX;
      const compLabel = compSide === 'left' ? '左' : '右';
      const stretchLabel = compSide === 'left' ? '右' : '左';
      const stretchSideKey = compSide === 'left' ? 'right' : 'left';

      // パーツハイライト（腕・脚を赤/紫で色付け）
      const contractedParts = cfg.parts[compSide] || [];
      const tensionedParts = cfg.parts[stretchSideKey] || [];
      contractedParts.forEach(p => this._highlightPart(svg, p, 'rgba(239,68,68,0.50)'));
      tensionedParts.forEach(p => this._highlightPart(svg, p, 'rgba(14,165,233,0.50)'));

      // バッジを衝突回避で配置（小型化＋xy方向に逃げる・padding強化）
      const badgeW = 36, badgeH = 17;
      const compBox = this._reserveBox(compX - badgeW / 2, rawMidY - badgeH / 2, badgeW, badgeH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compBox.x, y: compBox.y, width: badgeW, height: badgeH,
        rx: 5, fill: '#ef4444', opacity: 0.92
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compBox.x + badgeW / 2, y: compBox.y + badgeH - 5, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${compLabel}縮`));

      const stretchBox = this._reserveBox(stretchX - badgeW / 2, rawMidY - badgeH / 2, badgeW, badgeH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchBox.x, y: stretchBox.y, width: badgeW, height: badgeH,
        rx: 5, fill: '#0ea5e9', opacity: 0.88
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchBox.x + badgeW / 2, y: stretchBox.y + badgeH - 5, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${stretchLabel}伸`));
    }
  },

  // ===== 体幹への影響（腕脚の詰まり＋骨盤傾斜の結果） =====
  _drawTrunkImpact(svg, detailData, standingData) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    const cx = 150;
    const acromVal = detailData.acromion;
    const gtVal = detailData.greaterTrochanter;
    const iliacVal = standingData.iliacCrest;
    const scapVal = standingData.scapulaInferior;

    // 体幹回旋ラベル位置（肩甲下角・前腕と被らないよう中間）
    const trunkMidY = 190;

    // 4. 肩峰↔大転子の回旋判定
    // ※ 「全体偏位」ラベルは体の中央で他のラベルと衝突するため削除
    let rotationLabel = '';
    let rotationColor = '#22c55e';
    if (acromVal != null && gtVal != null) {
      if (acromVal !== 0 && gtVal !== 0 && acromVal !== gtVal) {
        rotationLabel = '体幹回旋';
        rotationColor = '#f59e0b';
      }
      // 「全体偏位」ラベルは表示しない
    }

    // === 体幹中心ライン（肩峰→大転子） ===
    if (acromVal != null && gtVal != null && (acromVal !== 0 || gtVal !== 0)) {
      const acromXOff = (acromVal || 0) * 4;
      const gtXOff = (gtVal || 0) * 4;
      indicatorLayer.appendChild(this._createSVGEl('line', {
        x1: cx + acromXOff, y1: 78,
        x2: cx + gtXOff, y2: 278,
        stroke: '#f59e0b', 'stroke-width': 2.5,
        'stroke-dasharray': '8,4', opacity: 0.6
      }));
    }

    // === 骨盤傾斜ライン ===
    if (iliacVal != null && iliacVal !== 0) {
      const iliacLeftY = 240 + this._lShift(iliacVal);
      const iliacRightY = 240 + this._rShift(iliacVal);
      indicatorLayer.appendChild(this._createSVGEl('line', {
        x1: 100, y1: iliacLeftY, x2: 200, y2: iliacRightY,
        stroke: '#f59e0b', 'stroke-width': 2, 'stroke-dasharray': '4,3', opacity: 0.5
      }));
    }

    // === 回旋ラベル（体幹中央・bbox衝突回避） ===
    if (rotationLabel) {
      const rW = 60, rH = 22;
      const rBox = this._reserveBox(cx - rW / 2, trunkMidY - rH / 2, rW, rH, { axis: 'xy', padding: 2 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: rBox.x, y: rBox.y, width: rW, height: rH,
        rx: 11, fill: rotationColor, opacity: 0.9
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: rBox.x + rW / 2, y: rBox.y + rH - 6, 'text-anchor': 'middle',
        'font-size': 11, fill: 'white', 'font-weight': 800
      }, rotationLabel));
    }

  },

  // ===== 立位検査 + 詳細検査の4区間 詰まり/伸び可視化 =====
  // 乳様突起↔肩峰、肩峰↔肩甲下角、肩甲下角↔腸骨稜、腸骨稜↔大転子
  _drawStandingAnalysis(svg, standingData, detailData) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    // データ取得
    const mastVal = standingData.mastoid;       // 乳様突起
    const scapVal = standingData.scapulaInferior; // 肩甲下角
    const iliacVal = standingData.iliacCrest;    // 腸骨稜
    const acromVal = detailData.acromion;         // 肩峰
    const gtVal = detailData.greaterTrochanter;  // 大転子

    // 各ランドマークのY座標（人体図上の位置）
    const posY = {
      mastoid: 38,    // 乳様突起（頭頂付近）
      acromion: 78,   // 肩峰
      scapulaInferior: 155, // 肩甲下角
      iliacCrest: 232,     // 腸骨稜
      greaterTrochanter: 278 // 大転子
    };

    // 採用ペア（ユーザー指定の6組のうち、立位検査由来の2組）
    // 1. 乳様突起×肩峰  / 2. 肩甲下角×腸骨稜
    const segments = [
      { upper: 'mastoid',         lower: 'acromion',   valA: mastVal, valB: acromVal, area: '乳様突起〜肩峰',   leftX: 60, rightX: 240, midYAdjust: -4 },
      { upper: 'scapulaInferior', lower: 'iliacCrest', valA: scapVal, valB: iliacVal, area: '肩甲下角〜腸骨稜', leftX: 70, rightX: 230, midYAdjust: 0 }
    ];

    for (const seg of segments) {
      if (seg.valA == null || seg.valB == null) continue;
      if (seg.valA === 0 || seg.valB === 0) continue;
      // X-patternのみ表示（同方向傾きは収束ではないので無視）
      if (seg.valA === seg.valB) continue;

      const leftCompressed  = (seg.valA === 1  && seg.valB === -1);
      const rightCompressed = (seg.valA === -1 && seg.valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const rawMidY = (posY[seg.upper] + posY[seg.lower]) / 2 + (seg.midYAdjust || 0);
      const compSide = leftCompressed ? '左' : '右';
      const stretchSide = leftCompressed ? '右' : '左';
      const compX = leftCompressed ? seg.leftX : seg.rightX;
      const stretchX = leftCompressed ? seg.rightX : seg.leftX;

      // バッジ配置（bbox衝突回避・xy両方向に逃げる・padding強化）
      const bW = 32, bH = 16;
      const compBox = this._reserveBox(compX - bW / 2, rawMidY - bH / 2, bW, bH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compBox.x, y: compBox.y, width: bW, height: bH,
        rx: 5, fill: '#ef4444', opacity: 0.92
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compBox.x + bW / 2, y: compBox.y + bH - 4, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${compSide}縮`));

      const stretchBox = this._reserveBox(stretchX - bW / 2, rawMidY - bH / 2, bW, bH, { axis: 'xy', padding: 4 });
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchBox.x, y: stretchBox.y, width: bW, height: bH,
        rx: 5, fill: '#0ea5e9', opacity: 0.88
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchBox.x + bW / 2, y: stretchBox.y + bH - 4, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${stretchSide}伸`));
    }

    // ===== 茎状突起・外果のマーカー（手先・足先に○×） =====
    this._drawEndpointMarkers(svg, detailData || {});
  },

  // ===== 手先・足先に赤○×マーカーを描画 =====
  // 茎状突起 → 手先、外果 → 足先
  // 下がっている側 = ×（赤）、上がっている側 = ○（緑）
  _drawEndpointMarkers(svg, detailData) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    const endpoints = [
      {
        key: 'radialStyloid',
        label: '茎状突起',
        leftX: 38, rightX: 262, y: 320  // 手先の下
      },
      {
        key: 'lateralMalleolus',
        label: '外果',
        leftX: 118, rightX: 182, y: 548  // 足先の下（重なり回避のため外側に配置）
      }
    ];

    for (const ep of endpoints) {
      const val = detailData[ep.key];
      if (val == null || val === 0) continue;

      // val=-1: 左が高い → 右が下がっている → 右に×
      // val=1: 右が高い → 左が下がっている → 左に×
      const downX = val === 1 ? ep.leftX : ep.rightX;

      indicatorLayer.appendChild(this._createSVGEl('circle', {
        cx: downX, cy: ep.y, r: 12,
        fill: 'white', stroke: '#ef4444', 'stroke-width': 2, opacity: 0.95
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: downX, y: ep.y + 5, 'text-anchor': 'middle',
        'font-size': 14, fill: '#ef4444', 'font-weight': 900
      }, '×'));
      this._markBox(downX - 13, ep.y - 13, 26, 26);
    }
  },

  _createSVGEl(tag, attrs, text) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    if (text !== undefined) el.textContent = text;
    return el;
  }
};
