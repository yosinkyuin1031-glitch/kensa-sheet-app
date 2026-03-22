// ===== 動的人体図：身体パーツが上下にずれて歪みを表現 =====
// 重要: 画面の左＝患者の左、画面の右＝患者の右（患者目線で統一）
// val=-1: 左が高い → 画面左が上がる
// val= 1: 右が高い → 画面右が上がる
// 下側にいっている方 = 詰まっている（縮こまり）

const BodyDiagram = {
  TILT: 14,

  positions: {
    firstStage: {
      mastoid:         { leftX: 132, rightX: 168, baseY: 38, label: '乳様突起' },
      scapulaInferior: { leftX: 106, rightX: 194, baseY: 152, label: '肩甲下角' },
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

  // 左側シフト計算: val=-1で上(-TILT)、val=1で下(+TILT)
  _lShift(val) { return (val || 0) * this.TILT; },
  // 右側シフト計算: val=1で上(-TILT)、val=-1で下(+TILT)
  _rShift(val) { return -(val || 0) * this.TILT; },

  // ===== 背面図SVG（セグメントをグループ化） =====
  createBodySVG() {
    return `
    <svg viewBox="-20 0 340 580" xmlns="http://www.w3.org/2000/svg" class="body-svg">
      <defs>
        <radialGradient id="jointGrad">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde8d0"/>
          <stop offset="50%" stop-color="#f5d5b8"/>
          <stop offset="100%" stop-color="#e8c4a0"/>
        </linearGradient>
        <linearGradient id="skinGradDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f0c8a0"/>
          <stop offset="100%" stop-color="#ddb08a"/>
        </linearGradient>
        <radialGradient id="headGrad" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#fde8d0"/>
          <stop offset="80%" stop-color="#f0c8a0"/>
          <stop offset="100%" stop-color="#ddb08a"/>
        </radialGradient>
        <filter id="softShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="shadow"/>
          <feFlood flood-color="#00000020"/>
          <feComposite in2="shadow" operator="in"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="bodyClip">
          <rect x="0" y="0" width="300" height="580"/>
        </clipPath>
      </defs>

      <g class="body-segments" filter="url(#softShadow)">

        <!-- ===== 胴体（静的ベース）===== -->
        <g class="seg-torso">
          <path class="body-part" data-part="torso"
            d="M82,74 C82,68 115,64 150,64 C185,64 218,68 218,74 L220,150 L218,242 C216,258 196,264 150,264 C104,264 84,258 82,242 L80,150 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.2"/>
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
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1"/>
          <circle class="joint" cx="150" cy="54" r="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        </g>

        <!-- ===== 頭部（mastoidで傾く）===== -->
        <g class="seg seg-head">
          <ellipse cx="150" cy="26" rx="24" ry="28" fill="#5a3825" opacity="0.3"/>
          <ellipse class="body-part" data-part="head" cx="150" cy="28" rx="22" ry="26"
            fill="url(#headGrad)" stroke="#c4956e" stroke-width="1.2"/>
          <path d="M128,18 C128,6 172,6 172,18 L172,28 C172,22 128,22 128,28 Z" fill="#4a2c1a" opacity="0.5"/>
          <ellipse class="body-part" data-part="ear-l" cx="128" cy="32" rx="5" ry="8"
            fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>
          <ellipse class="body-part" data-part="ear-r" cx="172" cy="32" rx="5" ry="8"
            fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>
        </g>

        <!-- ===== 左腕（肩〜手：scapulaInferiorで上下）===== -->
        <g class="seg seg-arm-l">
          <ellipse class="joint seg-shoulder-joint-l" cx="82" cy="76" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="upperArm-l"
            d="M78,82 C68,96 60,122 56,148 L48,148 C54,118 64,92 76,78 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M72,88 C66,104 62,124 58,144" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.3"/>
          <ellipse class="joint" cx="52" cy="150" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="forearm-l"
            d="M50,156 L46,222 L38,222 L44,156 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <ellipse class="joint" cx="42" cy="226" rx="6" ry="4" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="hand-l"
            d="M38,230 L36,260 C35,268 34,280 33,290 C32,296 30,304 32,308 C34,314 42,314 44,308 C46,302 46,290 46,280 L48,260 L48,230 Z"
            fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
          <line x1="34" y1="296" x2="32" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="37" y1="296" x2="36" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="40" y1="296" x2="40" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="43" y1="296" x2="43" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        </g>

        <!-- ===== 右腕 ===== -->
        <g class="seg seg-arm-r">
          <ellipse class="joint seg-shoulder-joint-r" cx="218" cy="76" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="upperArm-r"
            d="M222,82 C232,96 240,122 244,148 L252,148 C246,118 236,92 224,78 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M228,88 C234,104 238,124 242,144" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.3"/>
          <ellipse class="joint" cx="248" cy="150" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="forearm-r"
            d="M250,156 L254,222 L262,222 L256,156 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <ellipse class="joint" cx="258" cy="226" rx="6" ry="4" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="hand-r"
            d="M262,230 L264,260 C265,268 266,280 267,290 C268,296 270,304 268,308 C266,314 258,314 256,308 C254,302 254,290 254,280 L252,260 L252,230 Z"
            fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
          <line x1="266" y1="296" x2="268" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="263" y1="296" x2="264" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="260" y1="296" x2="260" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
          <line x1="257" y1="296" x2="257" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        </g>

        <!-- ===== 左脚（iliacCrestで上下）===== -->
        <g class="seg seg-leg-l">
          <ellipse class="joint" cx="128" cy="260" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="thigh-l"
            d="M118,266 C116,290 114,320 113,350 L112,370 L140,370 L139,350 C138,320 138,290 140,266 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M124,280 C122,310 120,340 118,365" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="126" cy="374" rx="9" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="shin-l"
            d="M116,380 C114,410 112,444 110,478 L110,494 L138,494 L138,478 C137,444 137,410 138,380 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M114,395 C110,415 110,440 112,460" stroke="#d4a882" stroke-width="0.8" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="124" cy="498" rx="8" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="foot-l"
            d="M112,503 L110,520 C109,530 140,530 138,520 L136,503 Z"
            fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        </g>

        <!-- ===== 右脚 ===== -->
        <g class="seg seg-leg-r">
          <ellipse class="joint" cx="172" cy="260" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="thigh-r"
            d="M160,266 C162,290 162,320 161,350 L160,370 L188,370 L187,350 C186,320 184,290 182,266 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M176,280 C178,310 180,340 182,365" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="174" cy="374" rx="9" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="shin-r"
            d="M162,380 C163,410 163,444 162,478 L162,494 L190,494 L190,478 C188,444 186,410 184,380 Z"
            fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
          <path d="M186,395 C190,415 190,440 188,460" stroke="#d4a882" stroke-width="0.8" fill="none" opacity="0.25"/>
          <ellipse class="joint" cx="176" cy="498" rx="8" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
          <path class="body-part" data-part="foot-r"
            d="M162,503 L160,520 C159,530 190,530 188,520 L186,503 Z"
            fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        </g>
      </g>

      <!-- 左右ラベル -->
      <text x="16" y="18" font-size="13" fill="#64748b" font-weight="700"
        stroke="white" stroke-width="3" paint-order="stroke">左</text>
      <text x="272" y="18" font-size="13" fill="#64748b" font-weight="700"
        stroke="white" stroke-width="3" paint-order="stroke">右</text>
      <text x="150" y="570" text-anchor="middle" font-size="10" fill="#94a3b8" font-weight="500">背面図（患者目線）</text>

      <!-- 動的レイヤー -->
      <g class="spine-dynamic-layer"></g>
      <g class="zone-layer" clip-path="url(#bodyClip)"></g>
      <g class="indicator-layer"></g>
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
        el.setAttribute('fill', '#f0c8a0');
      }
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

    // ===== ランドマークドット・ライン描画 =====
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

      // 右ドット
      landmarkLayer.appendChild(this._createSVGEl('circle', {
        cx: pos.rightX, cy: rightY, r: 6,
        fill: val === 1 ? '#3b82f6' : val === -1 ? '#f97316' : '#22c55e',
        stroke: 'white', 'stroke-width': 2
      }));

      if (val !== 0) {
        const lArrow = val === -1 ? '↑' : '↓';
        const lColor = val === -1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.leftX - 14, y: leftY + 4, 'text-anchor': 'end',
          'font-size': 10, fill: lColor, 'font-weight': 700
        }, lArrow));

        const rArrow = val === 1 ? '↑' : '↓';
        const rColor = val === 1 ? '#3b82f6' : '#f97316';
        landmarkLayer.appendChild(this._createSVGEl('text', {
          x: pos.rightX + 14, y: rightY + 4, 'text-anchor': 'start',
          'font-size': 10, fill: rColor, 'font-weight': 700
        }, rArrow));
      }

      // ラベル
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: 150, y: pos.baseY - 14, 'text-anchor': 'middle',
        'font-size': 9, fill: '#64748b', 'font-weight': 600
      }, pos.label));
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
      if (valA === valB) continue; // 同方向ずれ = 全乱（圧迫はない）
      if (valA === 0 || valB === 0) continue; // 片方が正常なら圧迫判定しない

      // 値が互い違い = 一方が詰まり、反対側が伸び
      // valA=1, valB=-1: 左側 上で下がり→下で上がり = 左詰まり
      // valA=-1, valB=1: 右側 上で下がり→下で上がり = 右詰まり
      const leftCompressed = (valA === 1 && valB === -1);
      const rightCompressed = (valA === -1 && valB === 1);

      const posA = this.positions[type][keyA];
      const posB = this.positions[type][keyB];
      const midY = (posA.baseY + posB.baseY) / 2;
      const spanY = (posB.baseY - posA.baseY) * 0.3;

      // 詰まり側（赤）
      const compSide = leftCompressed ? 'left' : 'right';
      const compX = compSide === 'left' ? 105 : 195;
      const compLabel = compSide === 'left' ? '左' : '右';
      const stretchX = compSide === 'left' ? 195 : 105;
      const stretchLabel = compSide === 'left' ? '右' : '左';

      // === 詰まりインジケーター ===
      // 背景
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compX - 22, y: midY - 28, width: 44, height: 56,
        rx: 8, fill: 'rgba(239,68,68,0.12)', stroke: '#ef4444',
        'stroke-width': 1.5, 'stroke-dasharray': '4,2'
      }));

      // 圧迫矢印 ↓↑（上から押し下げ、下から押し上げ）
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compX, y: midY - 10, 'text-anchor': 'middle',
        'font-size': 16, fill: '#ef4444', 'font-weight': 900
      }, '↓'));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compX, y: midY + 16, 'text-anchor': 'middle',
        'font-size': 16, fill: '#ef4444', 'font-weight': 900
      }, '↑'));

      // ラベル「詰」
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compX - 14, y: midY - 4, width: 28, height: 18,
        rx: 4, fill: '#ef4444'
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compX, y: midY + 10, 'text-anchor': 'middle',
        'font-size': 11, fill: 'white', 'font-weight': 800
      }, `${compLabel}詰`));

      // === 伸びインジケーター ===
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchX - 22, y: midY - 28, width: 44, height: 56,
        rx: 8, fill: 'rgba(139,92,246,0.1)', stroke: '#8b5cf6',
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // 牽引矢印 ↑↓（上は上へ、下は下へ引っ張られる）
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchX, y: midY - 10, 'text-anchor': 'middle',
        'font-size': 14, fill: '#8b5cf6', 'font-weight': 700
      }, '↑'));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchX, y: midY + 16, 'text-anchor': 'middle',
        'font-size': 14, fill: '#8b5cf6', 'font-weight': 700
      }, '↓'));

      // ラベル「伸」
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchX - 14, y: midY - 4, width: 28, height: 18,
        rx: 4, fill: '#8b5cf6'
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchX, y: midY + 10, 'text-anchor': 'middle',
        'font-size': 11, fill: 'white', 'font-weight': 800
      }, `${stretchLabel}伸`));

      // 横の圧迫ライン（筋肉の圧縮を表現）
      const compLineX1 = compSide === 'left' ? 120 : 165;
      const compLineX2 = compSide === 'left' ? 145 : 190;
      for (let j = -2; j <= 2; j++) {
        const ly = midY + j * 6;
        indicatorLayer.appendChild(this._createSVGEl('line', {
          x1: compLineX1, y1: ly, x2: compLineX2, y2: ly,
          stroke: '#ef4444', 'stroke-width': 1.5, opacity: 0.35 - Math.abs(j) * 0.06
        }));
      }
    }
  },

  // ===== 縮こまり・引っ張りゾーン描画（showZones） =====
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
      const svgLeftColor = svgLeftIsContraction ? 'rgba(239,68,68,0.22)' : 'rgba(168,85,247,0.18)';
      const svgLeftStroke = svgLeftIsContraction ? '#ef4444' : '#8b5cf6';
      zoneLayer.appendChild(this._createSVGEl('polygon', {
        points: `${cx},${svgLeftYA} ${posA.leftX},${svgLeftYA} ${posB.leftX},${svgLeftYB} ${cx},${svgLeftYB}`,
        fill: svgLeftColor, stroke: svgLeftStroke,
        'stroke-width': 1.2, 'stroke-dasharray': '4,2'
      }));

      // ゾーン（右側）
      const svgRightIsContraction = pattern1;
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
        const mx1 = (cx + Math.max(posA.rightX, posB.rightX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '右縮'));
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
        const mx1 = (cx + Math.min(posA.leftX, posB.leftX)) / 2;
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 3, 'text-anchor': 'middle',
          'font-size': 14, fill: '#ef4444', 'font-weight': 900
        }, '✕'));
        zoneLayer.appendChild(this._createSVGEl('text', {
          x: mx1, y: midY + 16, 'text-anchor': 'middle',
          'font-size': 8, fill: '#ef4444', 'font-weight': 700
        }, '左縮'));
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

  // ===== 全身統合ダイアグラム =====
  // 上半身(肩峰・肘頭・茎状突起) + 下半身(大転子・膝蓋骨上端・外果) を1体で表示
  unifiedPositions: {
    acromion:           { leftX: 78,  rightX: 222, baseY: 78,  label: '肩峰' },
    mastoidDetail:      { leftX: 56,  rightX: 244, baseY: 146, label: '肘頭' },
    radialStyloid:      { leftX: 46,  rightX: 254, baseY: 224, label: '茎状突起' },
    greaterTrochanter:  { leftX: 116, rightX: 184, baseY: 252, label: '大転子' },
    patellaUpper:       { leftX: 118, rightX: 182, baseY: 370, label: '膝蓋骨上端' },
    lateralMalleolus:   { leftX: 112, rightX: 188, baseY: 500, label: '外果' }
  },

  // 全身統合ダイアグラムを描画（上半身データ＋下半身データを合わせて1枚で表示）
  updateUnified(containerId, upperData, lowerData, standingData) {
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

    // 全データを統合
    const allData = { ...upperData, ...lowerData };

    // === 身体パーツの動的シフト（全身版） ===
    this._applyUnifiedShifts(svg, allData);

    // === ランドマーク名ラベルのみ描画（ドット・矢印は色分けで代替） ===
    // 立位基本3点
    const standingPosMap = this.positions.firstStage;
    for (const [key, pos] of Object.entries(standingPosMap)) {
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: 150, y: pos.baseY + 3, 'text-anchor': 'middle',
        'font-size': 7, fill: '#94a3b8', 'font-weight': 600
      }, pos.label));
    }

    // 詳細6点（左右両方に表示）
    const posMap = this.unifiedPositions;
    for (const [key, pos] of Object.entries(posMap)) {
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: pos.leftX - 14, y: pos.baseY - 8, 'text-anchor': 'end',
        'font-size': 7, fill: '#64748b', 'font-weight': 600
      }, pos.label));
      landmarkLayer.appendChild(this._createSVGEl('text', {
        x: pos.rightX + 14, y: pos.baseY - 8, 'text-anchor': 'start',
        'font-size': 7, fill: '#64748b', 'font-weight': 600
      }, pos.label));
    }

    // === 体幹の色分け（立位検査の3区間） ===
    this._colorTrunkSegments(svg, standingData || {}, allData);

    // === 腕脚の色分け + ラベル ===
    this._drawUnifiedCompressionIndicators(svg, allData);

    // === 立位検査の4区間ラベル（体の外側に） ===
    this._drawStandingAnalysis(svg, standingData || {}, allData);

    // === 体幹回旋 ===
    this._drawTrunkImpact(svg, allData, standingData || {});
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

  // ===== 体幹の色分け（立位3区間 + 肩峰↔肩甲下角） =====
  // 縮み側 = 赤、伸び側 = 紫で体幹を左右に色分け
  _colorTrunkSegments(svg, standingData, detailData) {
    const zoneLayer = svg.querySelector('.zone-layer');
    if (!zoneLayer) return;

    const acromVal = detailData.acromion;
    const scapVal = standingData.scapulaInferior;
    const iliacVal = standingData.iliacCrest;
    const gtVal = detailData.greaterTrochanter;

    // 体幹3区間の定義（Y範囲 + 左右X範囲）
    const cx = 150;
    const trunkSegments = [
      { valA: acromVal, valB: scapVal, yTop: 78, yBottom: 152, name: '肩峰〜肩甲下角' },
      { valA: scapVal, valB: iliacVal, yTop: 152, yBottom: 232, name: '肩甲下角〜腸骨稜' },
      { valA: iliacVal, valB: gtVal, yTop: 232, yBottom: 258, name: '腸骨稜〜大転子' }
    ];

    for (const seg of trunkSegments) {
      if (seg.valA == null || seg.valB == null) continue;
      if (seg.valA === 0 || seg.valB === 0) continue;
      if (seg.valA === seg.valB) continue;

      const leftCompressed = (seg.valA === 1 && seg.valB === -1);
      const rightCompressed = (seg.valA === -1 && seg.valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      // 縮み側 = 赤、伸び側 = 紫
      const leftColor = leftCompressed ? 'rgba(239,68,68,0.25)' : 'rgba(139,92,246,0.18)';
      const rightColor = rightCompressed ? 'rgba(239,68,68,0.25)' : 'rgba(139,92,246,0.18)';

      // 左半分
      zoneLayer.appendChild(this._createSVGEl('rect', {
        x: 82, y: seg.yTop, width: cx - 82, height: seg.yBottom - seg.yTop,
        fill: leftColor, rx: 4
      }));
      // 右半分
      zoneLayer.appendChild(this._createSVGEl('rect', {
        x: cx, y: seg.yTop, width: 218 - cx, height: seg.yBottom - seg.yTop,
        fill: rightColor, rx: 4
      }));
    }
  },

  // ===== 全身連続の詰まり・伸びインジケーター =====
  // 各区間を腕・脚の実際の位置に配置
  _drawUnifiedCompressionIndicators(svg, data) {
    const indicatorLayer = svg.querySelector('.indicator-layer');
    if (!indicatorLayer) return;

    const keys = ['acromion', 'mastoidDetail', 'radialStyloid', 'greaterTrochanter', 'patellaUpper', 'lateralMalleolus'];
    const posMap = this.unifiedPositions;

    // 各区間のインジケーター位置と対応パーツ
    const segmentConfig = {
      0: { // 肩峰→肘頭 = 上腕
        leftX: 30, rightX: 270,
        parts: { left: ['upperArm-l'], right: ['upperArm-r'] }
      },
      1: { // 肘頭→茎状突起 = 前腕
        leftX: 18, rightX: 282,
        parts: { left: ['forearm-l', 'hand-l'], right: ['forearm-r', 'hand-r'] }
      },
      2: { // 茎状突起→大転子 = 体幹
        leftX: 40, rightX: 260,
        parts: { left: [], right: [] }
      },
      3: { // 大転子→膝蓋骨 = 太もも
        leftX: 80, rightX: 220,
        parts: { left: ['thigh-l'], right: ['thigh-r'] }
      },
      4: { // 膝蓋骨→外果 = すね
        leftX: 78, rightX: 222,
        parts: { left: ['shin-l'], right: ['shin-r'] }
      }
    };

    for (let i = 0; i < keys.length - 1; i++) {
      const keyA = keys[i];
      const keyB = keys[i + 1];
      const valA = data[keyA];
      const valB = data[keyB];

      if (valA === null || valA === undefined || valB === null || valB === undefined) continue;
      if (valA === 0 && valB === 0) continue;
      if (valA === valB) continue;
      if (valA === 0 || valB === 0) continue;

      const leftCompressed = (valA === 1 && valB === -1);
      const rightCompressed = (valA === -1 && valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const cfg = segmentConfig[i];
      const posA = posMap[keyA];
      const posB = posMap[keyB];
      const midY = (posA.baseY + posB.baseY) / 2;

      const compSide = leftCompressed ? 'left' : 'right';
      const compX = compSide === 'left' ? cfg.leftX : cfg.rightX;
      const stretchX = compSide === 'left' ? cfg.rightX : cfg.leftX;
      const compLabel = compSide === 'left' ? '左' : '右';
      const stretchLabel = compSide === 'left' ? '右' : '左';

      // パーツハイライト（腕・脚を色付け）
      const contractedParts = cfg.parts[compSide] || [];
      const tensionedParts = cfg.parts[compSide === 'left' ? 'right' : 'left'] || [];
      contractedParts.forEach(p => this._highlightPart(svg, p, 'rgba(239,68,68,0.30)'));
      tensionedParts.forEach(p => this._highlightPart(svg, p, 'rgba(168,85,247,0.22)'));

      // 縮みインジケーター
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compX - 22, y: midY - 10, width: 44, height: 20,
        rx: 6, fill: '#ef4444', opacity: 0.9
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compX, y: midY + 4, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${compLabel}縮`));

      // 伸びインジケーター
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchX - 22, y: midY - 10, width: 44, height: 20,
        rx: 6, fill: '#8b5cf6', opacity: 0.85
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchX, y: midY + 4, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${stretchLabel}伸`));

      // 部位名ラベルは体に被るため省略
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

    // 体幹エリアのY範囲（肩甲下角〜腸骨稜の間、肩甲下角と被らないよう下寄り）
    const trunkMidY = 200;

    // 4. 肩峰↔大転子の回旋判定
    let rotationLabel = '';
    let rotationColor = '#22c55e';
    if (acromVal != null && gtVal != null) {
      if (acromVal !== 0 && gtVal !== 0 && acromVal !== gtVal) {
        rotationLabel = '体幹回旋';
        rotationColor = '#f59e0b';
      } else if (acromVal !== 0 && gtVal !== 0 && acromVal === gtVal) {
        rotationLabel = '全体偏位';
        rotationColor = '#ef4444';
      }
    }

    // === 体幹中心ライン（肩峰→大転子） ===
    if (acromVal != null && gtVal != null && (acromVal !== 0 || gtVal !== 0)) {
      const acromXOff = (acromVal || 0) * 4;
      const gtXOff = (gtVal || 0) * 4;
      indicatorLayer.appendChild(this._createSVGEl('line', {
        x1: cx + acromXOff, y1: 78,
        x2: cx + gtXOff, y2: 252,
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

    // === 回旋ラベル（体幹中央に大きく） ===
    if (rotationLabel) {
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: cx - 32, y: trunkMidY - 12, width: 64, height: 24,
        rx: 12, fill: rotationColor, opacity: 0.9
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: cx, y: trunkMidY + 4, 'text-anchor': 'middle',
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
      scapulaInferior: 152, // 肩甲下角
      iliacCrest: 232,     // 腸骨稜
      greaterTrochanter: 252 // 大転子
    };

    // 4区間の定義
    const segments = [
      { upper: 'mastoid', lower: 'acromion', valA: mastVal, valB: acromVal, area: '乳様突起〜肩峰', leftX: 48, rightX: 252 },
      { upper: 'acromion', lower: 'scapulaInferior', valA: acromVal, valB: scapVal, area: '肩峰〜肩甲下角', leftX: 40, rightX: 260 },
      { upper: 'scapulaInferior', lower: 'iliacCrest', valA: scapVal, valB: iliacVal, area: '肩甲下角〜腸骨稜', leftX: 40, rightX: 260 },
      { upper: 'iliacCrest', lower: 'greaterTrochanter', valA: iliacVal, valB: gtVal, area: '腸骨稜〜大転子', leftX: 48, rightX: 252 }
    ];

    for (const seg of segments) {
      if (seg.valA == null || seg.valB == null) continue;
      if (seg.valA === 0 && seg.valB === 0) continue;
      if (seg.valA === seg.valB) continue;
      if (seg.valA === 0 || seg.valB === 0) continue;

      // 互い違い → 詰まり判定
      const leftCompressed = (seg.valA === 1 && seg.valB === -1);
      const rightCompressed = (seg.valA === -1 && seg.valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const midY = (posY[seg.upper] + posY[seg.lower]) / 2;
      const compSide = leftCompressed ? '左' : '右';
      const stretchSide = leftCompressed ? '右' : '左';
      const compX = leftCompressed ? seg.leftX : seg.rightX;
      const stretchX = leftCompressed ? seg.rightX : seg.leftX;

      // 詰まりラベル（赤）「右縮み」「左縮み」
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: compX - 16, y: midY - 9, width: 32, height: 18,
        rx: 6, fill: '#ef4444', opacity: 0.9
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: compX, y: midY + 4, 'text-anchor': 'middle',
        'font-size': 9, fill: 'white', 'font-weight': 800
      }, `${compSide}縮`));

      // 伸びラベル（紫）「左伸び」「右伸び」
      indicatorLayer.appendChild(this._createSVGEl('rect', {
        x: stretchX - 16, y: midY - 9, width: 32, height: 18,
        rx: 6, fill: '#8b5cf6', opacity: 0.85
      }));
      indicatorLayer.appendChild(this._createSVGEl('text', {
        x: stretchX, y: midY + 4, 'text-anchor': 'middle',
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
        leftX: 124, rightX: 176, y: 540  // 足先の下
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
