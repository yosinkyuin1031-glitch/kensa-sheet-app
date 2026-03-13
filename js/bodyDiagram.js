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
          <ellipse cx="150" cy="28" rx="22" ry="26"/>
          <path d="M138,52 Q150,58 162,52 L162,66 L138,66 Z"/>
          <path d="M82,74 C82,68 115,64 150,64 C185,64 218,68 218,74 L220,150 L218,242 C216,258 196,264 150,264 C104,264 84,258 82,242 L80,150 Z"/>
          <path d="M82,78 C64,88 52,116 48,150 L44,210 C42,240 40,268 38,296 L36,328 C35,338 52,340 52,330 L54,296 C56,268 58,240 60,210 L64,150 C68,118 76,94 86,82 Z"/>
          <path d="M218,78 C236,88 248,116 252,150 L256,210 C258,240 260,268 262,296 L264,328 C265,338 248,340 248,330 L246,296 C244,268 242,240 240,210 L236,150 C232,118 224,94 214,82 Z"/>
          <path d="M118,264 C116,304 114,344 112,384 L110,424 L108,468 L106,510 C105,520 142,520 140,510 L138,468 L137,424 L136,384 C135,344 136,304 138,266 Z"/>
          <path d="M162,266 C164,304 165,344 164,384 L164,424 L163,468 L162,510 C161,520 198,520 196,510 L194,468 L192,424 L191,384 C190,344 188,304 186,264 Z"/>
        </clipPath>
      </defs>

      <g class="body-segments" filter="url(#softShadow)">
        <!-- 頭部（髪の毛含む） -->
        <ellipse cx="150" cy="26" rx="24" ry="28" fill="#5a3825" opacity="0.3"/>
        <ellipse class="body-part" data-part="head" cx="150" cy="28" rx="22" ry="26"
          fill="url(#headGrad)" stroke="#c4956e" stroke-width="1.2"/>
        <!-- 髪の毛（背面） -->
        <path d="M128,18 C128,6 172,6 172,18 L172,28 C172,22 128,22 128,28 Z" fill="#4a2c1a" opacity="0.5"/>
        <!-- 耳（画面左=患者左、画面右=患者右） -->
        <ellipse class="body-part" data-part="ear-l" cx="128" cy="32" rx="5" ry="8"
          fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>
        <ellipse class="body-part" data-part="ear-r" cx="172" cy="32" rx="5" ry="8"
          fill="#f0c8a0" stroke="#c4956e" stroke-width="0.8"/>

        <!-- 首 -->
        <path class="body-part" data-part="neck"
          d="M138,52 Q150,58 162,52 L162,66 Q150,68 138,66 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1"/>
        <circle class="joint" cx="150" cy="54" r="4.5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>

        <!-- 胴体（背面の筋肉を表現） -->
        <path class="body-part" data-part="torso"
          d="M82,74 C82,68 115,64 150,64 C185,64 218,68 218,74 L220,150 L218,242 C216,258 196,264 150,264 C104,264 84,258 82,242 L80,150 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.2"/>

        <!-- 背骨ライン（椎骨風） -->
        <path d="M150,70 C150,70 148,85 150,100 C152,115 148,130 150,145 C152,160 148,175 150,190 C152,205 148,220 150,240"
          stroke="#d4a882" stroke-width="1.5" fill="none" opacity="0.4"/>
        <!-- 椎骨ドット -->
        <circle cx="150" cy="80" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="100" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="120" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="140" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="160" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="180" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="200" r="1.5" fill="#d4a882" opacity="0.3"/>
        <circle cx="150" cy="220" r="1.5" fill="#d4a882" opacity="0.3"/>

        <!-- 肩甲骨（左） -->
        <path d="M108,100 C114,96 130,94 134,100 L136,140 C136,150 132,162 128,168 L110,170 C106,164 104,148 104,138 Z"
          fill="none" stroke="#d4a882" stroke-width="1.2" opacity="0.35"/>
        <!-- 肩甲骨（右） -->
        <path d="M192,100 C186,96 170,94 166,100 L164,140 C164,150 168,162 172,168 L190,170 C194,164 196,148 196,138 Z"
          fill="none" stroke="#d4a882" stroke-width="1.2" opacity="0.35"/>
        <!-- 肩甲骨下角マーカー -->
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

        <!-- ===== 画面左＝患者左 腕 ===== -->
        <ellipse class="joint" cx="82" cy="76" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="upperArm-l"
          d="M78,82 C68,96 60,122 56,148 L48,148 C54,118 64,92 76,78 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
        <!-- 上腕筋肉ライン -->
        <path d="M72,88 C66,104 62,124 58,144" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.3"/>
        <ellipse class="joint" cx="52" cy="150" rx="7" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="forearm-l"
          d="M50,156 L46,222 L38,222 L44,156 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
        <ellipse class="joint" cx="42" cy="226" rx="6" ry="4" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="hand-l"
          d="M38,230 L36,260 C35,268 34,280 33,290 C32,296 30,304 32,308 C34,314 42,314 44,308 C46,302 46,290 46,280 L48,260 L48,230 Z"
          fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        <!-- 指のヒント -->
        <line x1="34" y1="296" x2="32" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="37" y1="296" x2="36" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="40" y1="296" x2="40" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="43" y1="296" x2="43" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>

        <!-- ===== 画面右＝患者右 腕 ===== -->
        <ellipse class="joint" cx="218" cy="76" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
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
          d="M252,230 L252,260 C253,268 254,280 255,290 C256,296 258,304 256,308 C254,314 246,314 244,308 C242,302 242,290 242,280 L240,260 L240,230 Z"
          fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>
        <line x1="254" y1="296" x2="256" y2="308" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="251" y1="296" x2="252" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="248" y1="296" x2="248" y2="312" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>
        <line x1="245" y1="296" x2="245" y2="310" stroke="#c4956e" stroke-width="0.5" opacity="0.4"/>

        <!-- ===== 画面左＝患者左 脚 ===== -->
        <ellipse class="joint" cx="128" cy="260" rx="8" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="thigh-l"
          d="M118,266 C116,290 114,320 113,350 L112,370 L140,370 L139,350 C138,320 138,290 140,266 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
        <!-- 太もも筋肉ライン -->
        <path d="M124,280 C122,310 120,340 118,365" stroke="#d4a882" stroke-width="0.7" fill="none" opacity="0.25"/>
        <ellipse class="joint" cx="126" cy="374" rx="9" ry="6" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="shin-l"
          d="M116,380 C114,410 112,444 110,478 L110,494 L138,494 L138,478 C137,444 137,410 138,380 Z"
          fill="url(#skinGrad)" stroke="#c4956e" stroke-width="1.1"/>
        <!-- ふくらはぎの膨らみ -->
        <path d="M114,395 C110,415 110,440 112,460" stroke="#d4a882" stroke-width="0.8" fill="none" opacity="0.25"/>
        <ellipse class="joint" cx="124" cy="498" rx="8" ry="5" fill="url(#jointGrad)" stroke="#d97706" stroke-width="1.3"/>
        <path class="body-part" data-part="foot-l"
          d="M112,503 L110,520 C109,530 140,530 138,520 L136,503 Z"
          fill="url(#skinGradDark)" stroke="#c4956e" stroke-width="1"/>

        <!-- ===== 画面右＝患者右 脚 ===== -->
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

      <!-- 左右ラベル（画面左＝患者の左、画面右＝患者の右） -->
      <text x="16" y="18" font-size="13" fill="#64748b" font-weight="700"
        stroke="white" stroke-width="3" paint-order="stroke">左</text>
      <text x="272" y="18" font-size="13" fill="#64748b" font-weight="700"
        stroke="white" stroke-width="3" paint-order="stroke">右</text>
      <text x="150" y="570" text-anchor="middle" font-size="10" fill="#94a3b8" font-weight="500">背面図（患者目線）</text>

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
