// ===== 関節セグメント式 人体図 =====
// 重要: 画面の左＝患者の左、画面の右＝患者の右（患者目線で統一）
// val=-1: 左が高い → 画面左が上がる
// val= 1: 右が高い → 画面右が上がる

const BodyDiagram = {
  TILT: 12,

  // ===== ランドマーク座標（viewBox: 0 0 300 580） =====
  // leftX = 画面左 = 患者の左
  // rightX = 画面右 = 患者の右
  positions: {
    firstStage: {
      mastoid:         { leftX: 132, rightX: 168, baseY: 38, label: '乳様突起' },
      scapulaInferior: { leftX: 106, rightX: 194, baseY: 168, label: '肩甲下角' },
      iliacCrest:      { leftX: 102, rightX: 198, baseY: 232, label: '腸骨稜' }
    },
    upperDetail: {
      acromion:      { leftX: 78,  rightX: 222, baseY: 78, label: '肩峰' },
      mastoidDetail: { leftX: 56,  rightX: 244, baseY: 146, label: '肘頭' },
      radialStyloid: { leftX: 46,  rightX: 254, baseY: 224, label: '茎状突起' }
    },
    lowerDetail: {
      greaterTrochanter: { leftX: 116, rightX: 184, baseY: 252, label: '大転子' },
      patellaUpper:      { leftX: 118, rightX: 182, baseY: 370, label: '膝蓋骨上端' },
      lateralMalleolus:  { leftX: 112, rightX: 188, baseY: 500, label: '外果' }
    }
  },

  // ===== 背面図SVG =====
  createBodySVG() {
    return `
    <svg viewBox="0 0 300 580" xmlns="http://www.w3.org/2000/svg" class="body-svg">
      <defs>
        <radialGradient id="jointGrad">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <radialGradient id="bodyGrad">
          <stop offset="0%" stop-color="#f0f4f8"/>
          <stop offset="70%" stop-color="#dce4ee"/>
          <stop offset="100%" stop-color="#c8d5e3"/>
        </radialGradient>
        <clipPath id="bodyClip">
          <ellipse cx="150" cy="30" rx="20" ry="24"/>
          <rect x="140" y="52" width="20" height="14" rx="5"/>
          <path d="M86,72 C86,68 115,66 150,66 C185,66 214,68 214,72 L216,150 L214,240 C212,254 194,260 150,260 C106,260 88,254 86,240 L84,150 Z"/>
          <path d="M84,78 C68,86 58,110 54,140 L50,200 C48,230 46,260 44,285 L42,310 C41,318 50,320 51,312 L53,285 C55,258 57,230 59,200 L63,142 C66,115 74,94 86,84 Z"/>
          <path d="M216,78 C232,86 242,110 246,140 L250,200 C252,230 254,260 256,285 L258,310 C259,318 250,320 249,312 L247,285 C245,258 243,230 241,200 L237,142 C234,115 226,94 214,84 Z"/>
          <path d="M120,260 C118,300 116,340 114,380 L112,420 L110,465 L108,505 C107,515 138,515 136,505 L134,465 L133,420 L132,380 C131,340 132,300 134,262 Z"/>
          <path d="M166,262 C168,300 169,340 168,380 L168,420 L167,465 L166,505 C165,515 196,515 194,505 L192,465 L190,420 L189,380 C188,340 186,300 184,260 Z"/>
        </clipPath>
      </defs>

      <g class="body-segments">
        <!-- 頭部 -->
        <ellipse class="body-part" data-part="head" cx="150" cy="30" rx="20" ry="24"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.5"/>
        <!-- 耳（画面左=患者左、画面右=患者右） -->
        <ellipse class="body-part" data-part="ear-l" cx="130" cy="34" rx="5" ry="7"
          fill="#e8ecf2" stroke="#9cafbe" stroke-width="1"/>
        <ellipse class="body-part" data-part="ear-r" cx="170" cy="34" rx="5" ry="7"
          fill="#e8ecf2" stroke="#9cafbe" stroke-width="1"/>
        <!-- 首 -->
        <rect class="body-part" data-part="neck" x="140" y="52" width="20" height="14" rx="5"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <circle class="joint" cx="150" cy="54" r="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <!-- 胴体 -->
        <path class="body-part" data-part="torso"
          d="M86,72 C86,68 115,66 150,66 C185,66 214,68 214,72 L216,150 L214,240 C212,254 194,260 150,260 C106,260 88,254 86,240 L84,150 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.5"/>
        <!-- 背骨ライン -->
        <line x1="150" y1="68" x2="150" y2="248" stroke="#a0b0c0" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.5"/>
        <!-- 肩甲骨ヒント -->
        <path d="M110,112 L128,108 L130,162 L112,166 Z" fill="none" stroke="#a0b0c0" stroke-width="1" stroke-dasharray="3,2" opacity="0.35"/>
        <path d="M190,112 L172,108 L170,162 L188,166 Z" fill="none" stroke="#a0b0c0" stroke-width="1" stroke-dasharray="3,2" opacity="0.35"/>
        <circle cx="112" cy="166" r="2" fill="#a0b0c0" opacity="0.4"/>
        <circle cx="188" cy="166" r="2" fill="#a0b0c0" opacity="0.4"/>
        <!-- 腸骨稜ヒント -->
        <path d="M100,228 C110,222 130,220 150,220 C170,220 190,222 200,228" fill="none" stroke="#a0b0c0" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.35"/>

        <!-- ===== 画面左＝患者左 肩関節 ===== -->
        <ellipse class="joint" cx="84" cy="76" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="upperArm-l"
          d="M80,82 C72,92 66,116 62,142 L55,142 C60,114 68,90 78,78 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="57" cy="146" rx="6" ry="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="forearm-l"
          d="M55,152 L50,220 L44,220 L51,152 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="47" cy="224" rx="5.5" ry="3.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="hand-l"
          d="M44,228 L42,268 L40,295 C39,303 50,305 51,297 L52,268 L52,228 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>

        <!-- ===== 画面右＝患者右 肩関節 ===== -->
        <ellipse class="joint" cx="216" cy="76" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="upperArm-r"
          d="M220,82 C228,92 234,116 238,142 L245,142 C240,114 232,90 222,78 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="243" cy="146" rx="6" ry="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="forearm-r"
          d="M245,152 L250,220 L256,220 L249,152 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="253" cy="224" rx="5.5" ry="3.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="hand-r"
          d="M248,228 L248,268 L249,295 C250,303 261,305 260,297 L258,268 L256,228 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>

        <!-- ===== 画面左＝患者左 股関節 ===== -->
        <ellipse class="joint" cx="128" cy="256" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="thigh-l"
          d="M120,262 L118,320 L116,362 L136,362 L134,320 L136,262 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="126" cy="366" rx="8" ry="5.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="shin-l"
          d="M118,372 L114,440 L112,488 L136,488 L134,440 L136,372 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="124" cy="492" rx="7" ry="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="foot-l"
          d="M114,497 L112,518 C111,526 138,526 136,518 L134,497 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>

        <!-- ===== 画面右＝患者右 股関節 ===== -->
        <ellipse class="joint" cx="172" cy="256" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="thigh-r"
          d="M164,262 L162,320 L160,362 L180,362 L178,320 L180,262 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="170" cy="366" rx="8" ry="5.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="shin-r"
          d="M162,372 L160,440 L158,488 L182,488 L180,440 L182,372 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
        <ellipse class="joint" cx="170" cy="492" rx="7" ry="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="foot-r"
          d="M160,497 L158,518 C157,526 184,526 183,518 L182,497 Z"
          fill="url(#bodyGrad)" stroke="#9cafbe" stroke-width="1.3"/>
      </g>

      <!-- 左右ラベル（画面左＝患者の左、画面右＝患者の右） -->
      <text x="22" y="18" font-size="11" fill="#94a3b8" font-weight="600">左</text>
      <text x="272" y="18" font-size="11" fill="#94a3b8" font-weight="600">右</text>
      <text x="150" y="574" text-anchor="middle" font-size="9" fill="#94a3b8">背面図（患者目線）</text>

      <!-- 動的レイヤー -->
      <g class="zone-layer" clip-path="url(#bodyClip)"></g>
      <g class="landmark-layer"></g>
    </svg>`;
  },

  init(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = this.createBodySVG();
  },

  _highlightPart(svg, partName, color) {
    const part = svg.querySelector(`[data-part="${partName}"]`);
    if (part) part.setAttribute('fill', color);
  },

  _resetParts(svg) {
    svg.querySelectorAll('.body-part').forEach(el => {
      if (el.dataset.part && el.dataset.part.startsWith('ear')) {
        el.setAttribute('fill', '#e8ecf2');
      } else {
        el.setAttribute('fill', 'url(#bodyGrad)');
      }
    });
  },

  // ===== ランドマーク表示更新 =====
  // 画面左(leftX) = 患者の左、画面右(rightX) = 患者の右
  // val=-1: 左が高い → leftX側が上がる（青↑）、rightX側が下がる（橙↓）
  // val= 1: 右が高い → rightX側が上がる（青↑）、leftX側が下がる（橙↓）
  update(containerId, type, data) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const svg = el.querySelector('svg');
    if (!svg) {
      this.init(containerId);
      return this.update(containerId, type, data);
    }

    const landmarkLayer = svg.querySelector('.landmark-layer');
    const zoneLayer = svg.querySelector('.zone-layer');
    landmarkLayer.innerHTML = '';
    zoneLayer.innerHTML = '';
    this._resetParts(svg);

    const posMap = this.positions[type];
    if (!posMap) return;

    for (const [key, pos] of Object.entries(posMap)) {
      const val = data[key];
      if (val === null || val === undefined) continue;

      // 画面左=患者左: val=-1(左が高い)で上がる、val=1(右が高い)で下がる
      const leftY  = pos.baseY + (val === -1 ? -this.TILT : val === 1 ? this.TILT : 0);
      // 画面右=患者右: val=1(右が高い)で上がる、val=-1(左が高い)で下がる
      const rightY = pos.baseY + (val === 1 ? -this.TILT : val === -1 ? this.TILT : 0);

      // 接続線
      landmarkLayer.appendChild(this._createSVGEl('line', {
        x1: pos.leftX, y1: leftY, x2: pos.rightX, y2: rightY,
        stroke: val === 0 ? '#22c55e' : '#e74c3c',
        'stroke-width': 2.5,
        'stroke-dasharray': val === 0 ? '' : '6,3',
        opacity: 0.8
      }));

      // 画面左ドット(患者左): 左が高い=青(↑)、右が高い=橙(↓)
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.leftX, cy: leftY, r: 6,
        fill: val === -1 ? '#3b82f6' : val === 1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': 2
      }));

      // 画面右ドット(患者右): 右が高い=青(↑)、左が高い=橙(↓)
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.rightX, cy: rightY, r: 6,
        fill: val === 1 ? '#3b82f6' : val === -1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': 2
      }));

      if (val !== 0) {
        // 画面左=患者左の矢印
        const lArrow = val === -1 ? '↑' : '↓';
        const lColor = val === -1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.leftX - 14, y: leftY + 4, 'text-anchor': 'end',
          'font-size': 10, fill: lColor, 'font-weight': 700
        }, lArrow));

        // 画面右=患者右の矢印
        const rArrow = val === 1 ? '↑' : '↓';
        const rColor = val === 1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.rightX + 14, y: rightY + 4, 'text-anchor': 'start',
          'font-size': 10, fill: rColor, 'font-weight': 700
        }, rArrow));
      }

      // ランドマーク名ラベル
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: 150, y: pos.baseY - 14, 'text-anchor': 'middle',
        'font-size': 9, fill: '#64748b', 'font-weight': 600
      }, pos.label));
    }
  },

  // ===== 縮こまり・引っ張りゾーン描画 =====
  // 画面左=患者左、画面右=患者右
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

    // パーツマッピング: right=画面右=患者右、left=画面左=患者左
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

      // 画面左Y=患者左（val=-1で上、val=1で下）
      const svgLeftYA = posA.baseY + (valA === -1 ? -this.TILT : valA === 1 ? this.TILT : 0);
      const svgLeftYB = posB.baseY + (valB === -1 ? -this.TILT : valB === 1 ? this.TILT : 0);
      // 画面右Y=患者右（val=1で上、val=-1で下）
      const svgRightYA = posA.baseY + (valA === 1 ? -this.TILT : valA === -1 ? this.TILT : 0);
      const svgRightYB = posB.baseY + (valB === 1 ? -this.TILT : valB === -1 ? this.TILT : 0);

      // 縮こまり判定: 値が互い違い
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

      // pattern1: valA=-1, valB=1
      //   患者右: 上が下がり(-1→右下)、下が上がる(1→右上) → 右縮こまり
      //   患者左: 上が上がり(-1→左上)、下が下がる(1→左下) → 左引っ張り
      // pattern2: valA=1, valB=-1
      //   患者左: 上が下がり(1→左下)、下が上がる(-1→左上) → 左縮こまり
      //   患者右: 上が上がり(1→右上)、下が下がる(-1→右下) → 右引っ張り
      const pattern1 = (valA === -1 && valB === 1); // 右縮 + 左引っ張り
      const pattern2 = (valA === 1 && valB === -1);  // 左縮 + 右引っ張り

      // 画面左側（患者左側）のゾーン
      const svgLeftIsContraction = pattern2; // 左縮こまり
      const svgLeftColor = svgLeftIsContraction ? 'rgba(239,68,68,0.22)' : 'rgba(168,85,247,0.18)';
      const svgLeftStroke = svgLeftIsContraction ? '#ef4444' : '#8b5cf6';
      zoneLayer.appendChild(this._createSVGEl('polygon', {
        points: `${cx},${svgLeftYA} ${posA.leftX},${svgLeftYA} ${posB.leftX},${svgLeftYB} ${cx},${svgLeftYB}`,
        fill: svgLeftColor, stroke: svgLeftStroke,
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // 画面右側（患者右側）のゾーン
      const svgRightIsContraction = pattern1; // 右縮こまり
      const svgRightColor = svgRightIsContraction ? 'rgba(239,68,68,0.22)' : 'rgba(168,85,247,0.18)';
      const svgRightStroke = svgRightIsContraction ? '#ef4444' : '#8b5cf6';
      zoneLayer.appendChild(this._createSVGEl('polygon', {
        points: `${cx},${svgRightYA} ${posA.rightX},${svgRightYA} ${posB.rightX},${svgRightYB} ${cx},${svgRightYB}`,
        fill: svgRightColor, stroke: svgRightStroke,
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // パーツハイライト
      const mapping = partMapping[type]?.[i];
      if (mapping) {
        const contractedSide = pattern1 ? 'right' : 'left';
        const tensionedSide = pattern1 ? 'left' : 'right';
        if (mapping[contractedSide]) {
          mapping[contractedSide].forEach(p => this._highlightPart(svg, p, 'rgba(239,68,68,0.28)'));
        }
        if (mapping[tensionedSide]) {
          mapping[tensionedSide].forEach(p => this._highlightPart(svg, p, 'rgba(168,85,247,0.2)'));
        }
      }

      // ラベル
      const midY = (posA.baseY + posB.baseY) / 2;

      if (pattern1) {
        // 画面右（患者右）= 右縮こまり
        const mx1 = (cx + Math.max(posA.rightX, posB.rightX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '右縮'));
        // 画面左（患者左）= 左引っ張り
        const mx2 = (cx + Math.min(posA.leftX, posB.leftX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 12, fill: '#8b5cf6', 'font-weight': 700
        }, '↕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#8b5cf6', 'font-weight': 700
        }, '左引'));
      } else {
        // 画面左（患者左）= 左縮こまり
        const mx1 = (cx + Math.min(posA.leftX, posB.leftX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '左縮'));
        // 画面右（患者右）= 右引っ張り
        const mx2 = (cx + Math.max(posA.rightX, posB.rightX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 12, fill: '#8b5cf6', 'font-weight': 700
        }, '↕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx2, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#8b5cf6', 'font-weight': 700
        }, '右引'));
      }
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
