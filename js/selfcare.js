// ===== セルフケア提案：部位別エクササイズ＋イラスト =====

const SelfcareDatabase = {
  // エリアキー → セルフケアのマッピング
  // analyzeContraction の結果から areaShort をキーにして検索
  exercises: {
    // ===== 上半身 =====
    '首〜肩': {
      contraction: {
        name: '首〜肩の縮こまりケア',
        target: '僧帽筋上部・肩甲挙筋',
        description: '首から肩にかけての筋肉が縮こまっています。反対側に伸ばすストレッチが有効です。',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '縮こまっている側の手をお尻の下に入れます',
          '反対の手で頭を斜め前にゆっくり倒します',
          '首〜肩に伸びを感じたら20秒キープ',
          'ゆっくり戻して3回繰り返します'
        ],
        sets: '20秒 × 3回',
        frequency: '1日2〜3回',
        caution: '痛みが出たら無理をせず、心地よい伸びの範囲で行ってください',
        illustration: 'neckStretch'
      },
      tension: {
        name: '首〜肩の引っ張りケア',
        target: '胸鎖乳突筋・斜角筋',
        description: '首から肩が上下に引っ張られています。安定させるエクササイズが効果的です。',
        steps: [
          '椅子に座り、両手を膝の上に置きます',
          '引っ張られている側の肩をゆっくり上げ、耳に近づけます',
          '5秒キープしてストンと力を抜きます',
          '10回繰り返します',
          '次に、首をゆっくり左右に5回ずつ回します'
        ],
        sets: '10回 × 2セット + 首回し各5回',
        frequency: '1日3回',
        caution: '急な動きは避け、ゆっくり行ってください',
        illustration: 'shoulderShrug'
      }
    },
    '肩〜腕': {
      contraction: {
        name: '肩〜腕の縮こまりケア',
        target: '三角筋・上腕二頭筋',
        description: '肩から腕にかけて縮こまりがあります。腕を伸ばすストレッチで改善を目指します。',
        steps: [
          '壁の横に立ちます',
          '縮こまっている側の腕を壁に沿って上に伸ばします',
          '体を反対方向に少しひねり、脇の下から腕全体を伸ばします',
          '15秒キープして3回繰り返します'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2回',
        caution: '肩に痛みがある場合は腕の角度を低くして行ってください',
        illustration: 'armStretch'
      },
      tension: {
        name: '肩〜腕の引っ張りケア',
        target: '肩関節周囲筋・前鋸筋',
        description: '肩から腕が上下に引っ張られています。肩甲骨の安定化が重要です。',
        steps: [
          '四つん這いになります',
          '肩甲骨を背骨に寄せるように引きます（3秒）',
          '次に肩甲骨を広げるように背中を丸めます（3秒）',
          '10回ゆっくり繰り返します'
        ],
        sets: '10回 × 2セット',
        frequency: '1日2回（朝・夜）',
        caution: '手首に負担がかかる場合は拳をついて行ってください',
        illustration: 'scapulaExercise'
      }
    },
    '前腕〜手首': {
      contraction: {
        name: '前腕〜手首の縮こまりケア',
        target: '前腕屈筋群',
        description: '前腕から手首にかけて縮こまっています。手首のストレッチが効果的です。',
        steps: [
          '縮こまっている側の腕をまっすぐ前に伸ばします',
          '反対の手で指先を手前に引き、手首を反らします',
          '前腕の内側に伸びを感じたら15秒キープ',
          '次に手の甲を手前に引き、外側も15秒キープ',
          '各3回繰り返します'
        ],
        sets: '15秒 × 3回（内外両方）',
        frequency: '1日3回',
        caution: '手首を強く反らしすぎないようにしてください',
        illustration: 'wristStretch'
      },
      tension: {
        name: '前腕〜手首の引っ張りケア',
        target: '前腕伸筋群・回外筋',
        description: '前腕が上下に引っ張られています。握力トレーニングで安定させます。',
        steps: [
          'タオルを丸めて握ります',
          'ゆっくり握り込み5秒キープ',
          'ゆっくり離して5秒休む',
          '10回繰り返します',
          '手首をゆっくり回す運動も5回ずつ行います'
        ],
        sets: '10回 × 2セット + 手首回し各5回',
        frequency: '1日2回',
        caution: '痛みがある場合は握る力を弱めてください',
        illustration: 'gripExercise'
      }
    },

    // ===== 下半身 =====
    '股関節〜太もも': {
      contraction: {
        name: '股関節〜太ももの縮こまりケア',
        target: '腸腰筋・中殿筋',
        description: '股関節から太ももにかけて縮こまりがあります。股関節を開くストレッチが有効です。',
        steps: [
          '片膝立ちになります（前の膝は90度）',
          '後ろ足側の股関節を前に押し出します',
          '股関節の前面に伸びを感じたら20秒キープ',
          'お尻を横に伸ばす意識も加えます',
          '左右各3回ずつ行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2回',
        caution: '腰を反らさないよう、お腹に力を入れて行ってください',
        illustration: 'hipFlexorStretch'
      },
      tension: {
        name: '股関節〜太ももの引っ張りケア',
        target: '内転筋・大腿筋膜張筋',
        description: '股関節が上下に引っ張られています。骨盤の安定化エクササイズが効果的です。',
        steps: [
          '仰向けに寝て両膝を立てます',
          '両膝の間にクッションを挟みます',
          'クッションを潰すように5秒力を入れます',
          'ゆっくり力を抜いて5秒休む',
          '10回繰り返します'
        ],
        sets: '10回 × 3セット',
        frequency: '1日2回（朝・夜）',
        caution: '腰が浮かないように床にしっかりつけて行ってください',
        illustration: 'pelvicStabilize'
      }
    },
    '太もも〜膝': {
      contraction: {
        name: '太もも〜膝の縮こまりケア',
        target: 'ハムストリングス・大腿四頭筋',
        description: '太ももから膝にかけて縮こまっています。太もものストレッチが重要です。',
        steps: [
          '椅子に浅く座ります',
          '片足をまっすぐ前に伸ばし、つま先を上に',
          '背筋を伸ばしたまま上体を前に倒します',
          'もも裏の伸びを感じたら20秒キープ',
          '左右各3回ずつ行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2〜3回',
        caution: '背中を丸めないように注意してください',
        illustration: 'hamstringStretch'
      },
      tension: {
        name: '太もも〜膝の引っ張りケア',
        target: '大腿直筋・腸脛靭帯',
        description: '太ももが上下に引っ張られています。太もも全体のバランスを整えます。',
        steps: [
          '壁に手をつき、片足立ちになります',
          '後ろの足首を手で持ち、かかとをお尻に近づけます',
          '太もも前面の伸びを感じたら15秒キープ',
          '左右各3回ずつ行います',
          '次に体側ストレッチ（腸脛靭帯）も行います'
        ],
        sets: '15秒 × 3回（左右）',
        frequency: '1日2回',
        caution: 'バランスを崩さないよう壁を使ってください',
        illustration: 'quadStretch'
      }
    },
    'すね〜足首': {
      contraction: {
        name: 'すね〜足首の縮こまりケア',
        target: '腓腹筋・ヒラメ筋',
        description: 'すねから足首にかけて縮こまっています。ふくらはぎのストレッチが効果的です。',
        steps: [
          '壁に両手をつきます',
          '片足を後ろに大きく引きます',
          '後ろ足のかかとを床につけたまま前膝を曲げます',
          'ふくらはぎの伸びを感じたら20秒キープ',
          '左右各3回ずつ行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日3回',
        caution: 'かかとが浮かないように注意してください',
        illustration: 'calfStretch'
      },
      tension: {
        name: 'すね〜足首の引っ張りケア',
        target: '前脛骨筋・足底筋群',
        description: 'すねから足首が引っ張られています。足首の安定化エクササイズを行います。',
        steps: [
          '椅子に座り、足を床につけます',
          'つま先を床につけたまま足裏のアーチを持ち上げます',
          '5秒キープしてゆっくり戻します',
          '10回繰り返します',
          '次にタオルギャザー（タオルを足指でたぐり寄せる）を10回'
        ],
        sets: '10回 + タオルギャザー10回',
        frequency: '1日3回',
        caution: 'つま先が浮かないように注意してください',
        illustration: 'ankleExercise'
      }
    }
  },

  // ===== SVGイラスト生成（詳細版） =====
  getIllustration(key) {
    // 共通の人物パーツ
    const skinFill = '#fde8d0';
    const skinStroke = '#c4956e';
    const hairFill = '#4a2c1a';

    const illustrations = {
      neckStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
        </defs>
        <!-- 椅子 -->
        <rect x="55" y="120" width="90" height="10" rx="4" fill="#94a3b8" opacity="0.3"/>
        <rect x="125" y="56" width="8" height="74" rx="3" fill="#94a3b8" opacity="0.25"/>
        <rect x="60" y="130" width="5" height="45" rx="2" fill="#94a3b8" opacity="0.3"/>
        <rect x="130" y="130" width="5" height="45" rx="2" fill="#94a3b8" opacity="0.3"/>
        <!-- 体 -->
        <path d="M92,72 Q100,68 108,72 L106,118 L94,118 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="94" y="56" width="12" height="16" rx="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭（正面位置・薄く） -->
        <circle cx="100" cy="42" r="18" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1" opacity="0.3"/>
        <!-- 傾いた頭（実際のポーズ） -->
        <ellipse cx="85" cy="40" rx="18" ry="17" fill="${skinFill}" stroke="#3b82f6" stroke-width="1.5"/>
        <path d="M70,30 C72,22 95,20 100,28" fill="${hairFill}" opacity="0.4"/>
        <!-- 左腕（椅子に） -->
        <path d="M92,76 Q80,82 76,96 Q74,108 78,118" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 右手で頭を押す -->
        <path d="M108,76 Q118,72 120,60 Q118,50 108,42 Q102,38 96,40" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 右手の丸 -->
        <circle cx="96" cy="38" r="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 押す方向矢印 -->
        <path d="M118,34 L100,40" stroke="#3b82f6" stroke-width="2.5" fill="none" marker-end="url(#sc-arrowBlue)"/>
        <text x="124" y="30" font-size="11" fill="#3b82f6" font-weight="700">押す</text>
        <!-- 伸びの表示エリア -->
        <path d="M75,50 Q66,62 70,80" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-dasharray="4,3"/>
        <text x="48" y="68" font-size="11" fill="#ef4444" font-weight="700">伸び</text>
        <!-- 脚 -->
        <path d="M96,118 Q90,140 86,168" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M104,118 Q110,140 114,168" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 足 -->
        <ellipse cx="84" cy="170" rx="8" ry="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <ellipse cx="116" cy="170" rx="8" ry="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 床 -->
        <line x1="30" y1="176" x2="190" y2="176" stroke="#cbd5e1" stroke-width="1"/>
      </svg>`,

      shoulderShrug: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto"><path d="M0,8 L4,0 L8,8" fill="#3b82f6"/></marker>
          <marker id="sc-arrowDn" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto"><path d="M0,0 L4,8 L8,0" fill="#ef4444"/></marker>
        </defs>
        <!-- 体 -->
        <path d="M98,68 Q110,64 122,68 L120,130 L100,130 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="104" y="52" width="12" height="16" rx="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="110" cy="36" r="18" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M94,26 C96,16 124,16 126,26" fill="${hairFill}" opacity="0.4"/>
        <!-- 左肩（上がった状態） -->
        <path d="M98,68 Q78,54 70,46" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M70,46 Q66,60 64,80 Q62,95 66,108" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 右肩（通常位置） -->
        <path d="M122,68 Q140,66 148,70" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M148,70 Q150,85 148,100 Q146,112 142,120" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 上げる矢印 -->
        <path d="M58,60 L58,36" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrowUp)"/>
        <text x="36" y="42" font-size="11" fill="#3b82f6" font-weight="700">上げる</text>
        <!-- 脱力矢印 -->
        <path d="M52,78 L52,98" stroke="#ef4444" stroke-width="2.5" marker-end="url(#sc-arrowDn)"/>
        <text x="30" y="110" font-size="11" fill="#ef4444" font-weight="700">脱力！</text>
        <!-- 肩まわりハイライト -->
        <ellipse cx="82" cy="56" rx="18" ry="12" fill="#dbeafe" opacity="0.3" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2"/>
        <!-- 脚 -->
        <path d="M102,130 Q96,150 92,175" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M118,130 Q124,150 128,175" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <line x1="40" y1="182" x2="180" y2="182" stroke="#cbd5e1" stroke-width="1"/>
      </svg>`,

      armStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrowTwist" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
        </defs>
        <!-- 壁 -->
        <rect x="170" y="0" width="12" height="200" fill="#e2e8f0" opacity="0.6"/>
        <line x1="170" y1="0" x2="170" y2="200" stroke="#94a3b8" stroke-width="1"/>
        <!-- 体 -->
        <path d="M92,72 Q105,66 114,72 L112,130 L94,130 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="97" y="56" width="12" height="14" rx="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="103" cy="40" r="18" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M87,30 C89,20 117,20 119,30" fill="${hairFill}" opacity="0.4"/>
        <!-- 壁に伸ばした腕 -->
        <path d="M112,72 Q130,60 150,46 Q160,40 170,36" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 手のひらマーク -->
        <circle cx="170" cy="36" r="5" fill="${skinFill}" stroke="#fbbf24" stroke-width="1.5"/>
        <!-- 反対の腕 -->
        <path d="M92,76 Q78,86 72,100 Q68,112 72,120" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 体のひねり -->
        <path d="M84,95 C72,90 68,102 74,112" stroke="#3b82f6" stroke-width="2.5" fill="none" marker-end="url(#sc-arrowTwist)"/>
        <text x="42" y="104" font-size="11" fill="#3b82f6" font-weight="700">ひねる</text>
        <!-- 伸びエリア -->
        <path d="M120,60 Q140,48 160,38" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <rect x="115" y="46" width="50" height="16" rx="3" fill="white" opacity="0.7"/>
        <text x="120" y="56" font-size="10" fill="#ef4444" font-weight="700">脇〜腕の伸び</text>
        <!-- 脚 -->
        <path d="M96,130 Q92,155 88,180" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M110,130 Q114,155 118,180" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <line x1="40" y1="186" x2="175" y2="186" stroke="#cbd5e1" stroke-width="1"/>
      </svg>`,

      scapulaExercise: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrIn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#3b82f6"/></marker>
        </defs>
        <!-- 床 -->
        <line x1="20" y1="148" x2="200" y2="148" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- 四つん這いの人物 -->
        <!-- 頭 -->
        <ellipse cx="160" cy="60" rx="14" ry="16" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M148,52 C150,42 170,42 172,52" fill="${hairFill}" opacity="0.4"/>
        <!-- 背中〜お尻 -->
        <path d="M148,72 Q120,66 90,74 Q72,78 60,82" stroke="${skinStroke}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- 肉付き -->
        <path d="M150,68 Q120,62 90,70 Q72,74 60,78" stroke="${skinFill}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- 前腕（右） -->
        <path d="M148,75 Q156,100 160,145" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 前腕（左） -->
        <path d="M150,75 Q164,100 168,145" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 後ろ脚 -->
        <path d="M62,82 Q56,110 52,145" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M65,82 Q62,110 60,145" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 肩甲骨エリアハイライト -->
        <ellipse cx="120" cy="68" rx="28" ry="12" fill="#dbeafe" opacity="0.3" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2"/>
        <!-- 寄せる矢印 -->
        <path d="M100,58 L115,62" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrIn)"/>
        <path d="M140,58 L125,62" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrIn)"/>
        <text x="106" y="50" font-size="11" fill="#3b82f6" font-weight="700">寄せる</text>
        <!-- 丸める表示 -->
        <path d="M105,86 Q120,100 135,86" stroke="#ef4444" stroke-width="2" fill="none"/>
        <text x="105" y="110" font-size="11" fill="#ef4444" font-weight="700">丸める</text>
      </svg>`,

      wristStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrPull" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#3b82f6"/></marker>
        </defs>
        <!-- 腕全体 -->
        <path d="M20,100 Q60,98 100,96 Q130,95 155,94" stroke="${skinStroke}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- 腕の肉付き -->
        <path d="M20,100 Q60,98 100,96 Q130,95 155,94" stroke="${skinFill}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- 手首の関節マーク -->
        <circle cx="155" cy="94" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <!-- 手（反り返り） -->
        <path d="M155,94 Q164,82 172,70 Q176,64 178,58" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- 指 -->
        <line x1="178" y1="58" x2="180" y2="50" stroke="${skinStroke}" stroke-width="2" stroke-linecap="round"/>
        <line x1="178" y1="58" x2="182" y2="52" stroke="${skinStroke}" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="178" y1="58" x2="184" y2="55" stroke="${skinStroke}" stroke-width="1.5" stroke-linecap="round"/>
        <!-- 反対の手で引く -->
        <path d="M140,68 Q150,66 162,66" stroke="#3b82f6" stroke-width="2.5" fill="none" marker-end="url(#sc-arrPull)"/>
        <text x="125" y="56" font-size="12" fill="#3b82f6" font-weight="700">引く</text>
        <!-- 反対の手 -->
        <path d="M130,75 Q136,70 142,68" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="144" cy="67" r="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 伸びの表示 -->
        <path d="M60,96 Q100,110 140,96" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <rect x="66" y="114" width="88" height="18" rx="4" fill="white" opacity="0.8"/>
        <text x="110" y="128" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="700">前腕の内側が伸びる</text>
        <!-- 補助テキスト -->
        <text x="110" y="165" text-anchor="middle" font-size="10" fill="#64748b">内側と外側 各15秒</text>
      </svg>`,

      gripExercise: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <!-- 手首から前腕 -->
        <path d="M40,110 Q80,108 110,106" stroke="${skinStroke}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M40,110 Q80,108 110,106" stroke="${skinFill}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- タオル -->
        <ellipse cx="140" cy="100" rx="32" ry="22" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
        <path d="M118,92 Q140,82 162,92" fill="none" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>
        <path d="M118,108 Q140,118 162,108" fill="none" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>
        <text x="140" y="104" text-anchor="middle" font-size="11" fill="#64748b" font-weight="500">タオル</text>
        <!-- 握る手 -->
        <path d="M110,106 Q118,92 126,86 Q132,84 136,90 Q140,96 136,104" stroke="${skinStroke}" stroke-width="2.5" fill="${skinFill}" stroke-linecap="round"/>
        <!-- 指 -->
        <path d="M126,86 Q130,80 134,82" stroke="${skinStroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M132,84 Q136,78 140,80" stroke="${skinStroke}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- 握る矢印 -->
        <path d="M116,78 Q108,90 116,104" stroke="#3b82f6" stroke-width="2" fill="none"/>
        <path d="M168,78 Q176,90 168,104" stroke="#3b82f6" stroke-width="2" fill="none"/>
        <text x="140" y="140" text-anchor="middle" font-size="14" fill="#3b82f6" font-weight="700">ギュッと握る</text>
        <text x="140" y="162" text-anchor="middle" font-size="11" fill="#64748b">5秒キープ → ゆっくり離す</text>
        <!-- 力の波紋 -->
        <ellipse cx="140" cy="100" rx="40" ry="28" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>
      </svg>`,

      hipFlexorStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrFwd" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
        </defs>
        <!-- 床 -->
        <line x1="20" y1="182" x2="200" y2="182" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- 体幹 -->
        <path d="M100,52 Q110,48 116,52 L114,106 L102,106 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="103" y="40" width="10" height="12" rx="3" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="108" cy="26" r="16" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M94,18 C96,10 120,10 122,18" fill="${hairFill}" opacity="0.4"/>
        <!-- 腕 -->
        <path d="M100,58 Q88,68 82,80 Q78,90 82,98" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M116,58 Q126,68 130,80 Q132,90 128,98" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- 前の脚（膝90度） -->
        <path d="M114,106 Q130,120 142,140" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="142" cy="140" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1" opacity="0.6"/>
        <path d="M142,140 L142,180" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 後ろの脚（膝つき） -->
        <path d="M102,106 Q82,126 68,148" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="68" cy="148" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <path d="M68,148 Q60,164 56,180" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 前方矢印 -->
        <path d="M92,100 L112,92" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrFwd)"/>
        <text x="80" y="90" font-size="12" fill="#3b82f6" font-weight="700">前へ</text>
        <!-- 股関節前面の伸び -->
        <path d="M82,112 Q74,128 72,144" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <text x="38" y="132" font-size="11" fill="#ef4444" font-weight="700">伸び</text>
        <!-- 伸びエリアハイライト -->
        <ellipse cx="80" cy="125" rx="16" ry="20" fill="#fee2e2" opacity="0.3"/>
      </svg>`,

      pelvicStabilize: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrSq" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#3b82f6"/></marker>
        </defs>
        <!-- 床/マット -->
        <rect x="20" y="128" width="180" height="8" rx="3" fill="#e2e8f0" opacity="0.5"/>
        <line x1="20" y1="136" x2="200" y2="136" stroke="#cbd5e1" stroke-width="1"/>
        <!-- 仰向けの人物 -->
        <!-- 頭 -->
        <ellipse cx="42" cy="110" rx="16" ry="14" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M28,104 C28,96 56,96 56,104" fill="${hairFill}" opacity="0.3"/>
        <!-- 体 -->
        <path d="M56,112 Q90,110 130,114" stroke="${skinStroke}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M56,112 Q90,110 130,114" stroke="${skinFill}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- 腕 -->
        <path d="M70,112 Q72,120 74,126" stroke="${skinStroke}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M90,112 Q92,120 94,126" stroke="${skinStroke}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- 膝を立てる（左） -->
        <path d="M130,114 Q140,96 148,72" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M148,72 L148,128" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 膝を立てる（右） -->
        <path d="M134,116 Q146,98 156,76" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M156,76 L156,128" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- クッション -->
        <ellipse cx="152" cy="74" rx="12" ry="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
        <text x="152" y="78" text-anchor="middle" font-size="7" fill="#d97706" font-weight="600">クッション</text>
        <!-- 挟む矢印 -->
        <path d="M136,66 L146,70" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrSq)"/>
        <path d="M168,66 L158,70" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#sc-arrSq)"/>
        <text x="152" y="52" text-anchor="middle" font-size="13" fill="#3b82f6" font-weight="700">挟む！</text>
        <!-- 力の波紋 -->
        <ellipse cx="152" cy="74" rx="20" ry="14" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>
        <text x="110" y="170" text-anchor="middle" font-size="10" fill="#64748b">5秒キープ → ゆっくり離す × 10回</text>
      </svg>`,

      hamstringStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrBend" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#3b82f6"/></marker>
        </defs>
        <!-- 椅子 -->
        <rect x="25" y="112" width="70" height="8" rx="3" fill="#94a3b8" opacity="0.3"/>
        <rect x="85" y="52" width="6" height="68" rx="2" fill="#94a3b8" opacity="0.25"/>
        <rect x="30" y="120" width="4" height="42" fill="#94a3b8" opacity="0.3"/>
        <rect x="86" y="120" width="4" height="42" fill="#94a3b8" opacity="0.3"/>
        <!-- 体 -->
        <path d="M52,76 Q62,72 68,76 L66,110 L54,110 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="55" y="62" width="10" height="14" rx="3" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="60" cy="48" r="16" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M46,40 C48,32 72,32 74,40" fill="${hairFill}" opacity="0.4"/>
        <!-- 腕 -->
        <path d="M52,80 Q44,90 40,105" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M68,80 Q76,90 80,105" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- 曲げた脚 -->
        <path d="M54,110 Q48,130 44,160" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 伸ばした脚 -->
        <path d="M66,110 Q100,112 140,114 Q160,114 176,115" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 足先 -->
        <path d="M176,115 L182,108" stroke="${skinStroke}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <text x="180" y="106" font-size="8" fill="#64748b">つま先↑</text>
        <!-- 前屈の矢印 -->
        <path d="M72,62 Q88,58 96,72" stroke="#3b82f6" stroke-width="2.5" fill="none" marker-end="url(#sc-arrBend)"/>
        <text x="84" y="52" font-size="12" fill="#3b82f6" font-weight="700">前屈</text>
        <!-- もも裏の伸び -->
        <path d="M80,118 Q120,132 160,118" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <rect x="86" y="134" width="68" height="16" rx="3" fill="white" opacity="0.7"/>
        <text x="120" y="146" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="700">もも裏の伸び</text>
        <!-- 床 -->
        <line x1="20" y1="168" x2="200" y2="168" stroke="#cbd5e1" stroke-width="1"/>
      </svg>`,

      quadStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <!-- 壁 -->
        <rect x="16" y="0" width="10" height="200" fill="#e2e8f0" opacity="0.6"/>
        <line x1="26" y1="0" x2="26" y2="200" stroke="#94a3b8" stroke-width="1"/>
        <!-- 体 -->
        <path d="M80,54 Q90,50 96,54 L94,110 L82,110 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="83" y="42" width="10" height="12" rx="3" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="88" cy="28" r="16" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M74,20 C76,12 100,12 102,20" fill="${hairFill}" opacity="0.4"/>
        <!-- 壁に手をつく -->
        <path d="M80,60 Q60,58 30,58" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="28" cy="58" r="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 立脚 -->
        <path d="M84,110 Q82,140 80,172" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 曲げた脚 -->
        <path d="M94,110 Q112,126 122,144" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="122" cy="144" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1" opacity="0.6"/>
        <path d="M122,144 Q116,128 108,108" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 手で足首を持つ -->
        <path d="M96,60 Q108,72 114,90 Q116,100 112,108" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="110" cy="108" r="3.5" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 太もも前面の伸びハイライト -->
        <path d="M98,110 Q112,120 120,138" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <ellipse cx="108" cy="125" rx="14" ry="18" fill="#fee2e2" opacity="0.3"/>
        <text x="134" y="124" font-size="11" fill="#ef4444" font-weight="700">太もも</text>
        <text x="134" y="138" font-size="11" fill="#ef4444" font-weight="700">前面の伸び</text>
        <!-- 足 -->
        <ellipse cx="78" cy="176" rx="10" ry="5" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 床 -->
        <line x1="40" y1="182" x2="180" y2="182" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      calfStretch: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <!-- 壁 -->
        <rect x="168" y="0" width="12" height="200" fill="#e2e8f0" opacity="0.6"/>
        <line x1="168" y1="0" x2="168" y2="200" stroke="#94a3b8" stroke-width="1"/>
        <!-- 体 -->
        <path d="M118,52 Q128,48 134,52 L132,100 L120,100 Z" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1"/>
        <!-- 首 -->
        <rect x="121" y="40" width="10" height="12" rx="3" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 頭 -->
        <circle cx="126" cy="26" r="16" fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.2"/>
        <path d="M112,18 C114,10 138,10 140,18" fill="${hairFill}" opacity="0.4"/>
        <!-- 壁に手 -->
        <path d="M134,56 Q148,50 166,44" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M132,60 Q150,56 166,50" stroke="${skinStroke}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="166" cy="44" r="3.5" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <circle cx="166" cy="50" r="3.5" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 前脚（膝を曲げる） -->
        <path d="M132,100 Q142,120 148,142" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M148,142 L152,174" stroke="${skinStroke}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 後ろ脚（伸ばす） -->
        <path d="M120,100 Q96,124 78,148" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M78,148 L68,174" stroke="${skinStroke}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- かかと接地マーク -->
        <circle cx="66" cy="176" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <text x="38" y="180" font-size="8" fill="#d97706" font-weight="600">かかと↓</text>
        <!-- ふくらはぎの伸びハイライト -->
        <path d="M76,148 Q68,158 66,172" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" fill="none"/>
        <ellipse cx="74" cy="158" rx="12" ry="16" fill="#fee2e2" opacity="0.3"/>
        <text x="30" y="155" font-size="11" fill="#ef4444" font-weight="700">ふくらはぎ</text>
        <text x="38" y="168" font-size="11" fill="#ef4444" font-weight="700">の伸び</text>
        <!-- 足 -->
        <ellipse cx="154" cy="178" rx="8" ry="4" fill="${skinFill}" stroke="${skinStroke}" stroke-width="0.8"/>
        <!-- 床 -->
        <line x1="30" y1="182" x2="190" y2="182" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      ankleExercise: `<svg viewBox="0 0 220 200" class="selfcare-illust">
        <defs>
          <marker id="sc-arrArch" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto"><path d="M0,8 L4,0 L8,8" fill="#3b82f6"/></marker>
        </defs>
        <!-- 椅子のヒント -->
        <rect x="40" y="30" width="140" height="6" rx="2" fill="#94a3b8" opacity="0.2"/>
        <!-- すね -->
        <path d="M90,32 L86,80" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M130,32 L134,80" stroke="${skinStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- 足首関節 -->
        <circle cx="86" cy="82" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1" opacity="0.6"/>
        <circle cx="134" cy="82" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1" opacity="0.6"/>
        <!-- 足（側面的に大きく描画） -->
        <path d="M72,82 Q68,90 64,100 Q60,112 62,120 Q68,134 110,136 Q130,136 140,130 Q148,124 148,116 Q148,100 142,90 Q138,84 134,82"
          fill="${skinFill}" stroke="${skinStroke}" stroke-width="1.5"/>
        <!-- 足裏アーチ -->
        <path d="M72,128 Q90,140 120,132" stroke="${skinStroke}" stroke-width="1" fill="none" opacity="0.4"/>
        <!-- つま先固定 -->
        <circle cx="138" cy="126" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <circle cx="66" cy="122" r="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
        <text x="145" y="130" font-size="9" fill="#d97706" font-weight="600">固定</text>
        <text x="38" y="126" font-size="9" fill="#d97706" font-weight="600">固定</text>
        <!-- アーチを上げる矢印 -->
        <path d="M100,126 L100,100" stroke="#3b82f6" stroke-width="3" marker-end="url(#sc-arrArch)"/>
        <text x="110" y="86" font-size="13" fill="#3b82f6" font-weight="700">アーチ↑</text>
        <!-- タオルギャザー -->
        <rect x="50" y="152" width="120" height="36" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <text x="110" y="168" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">+ タオルギャザー</text>
        <text x="110" y="182" text-anchor="middle" font-size="9" fill="#94a3b8">足指でタオルをたぐり寄せる×10回</text>
      </svg>`
    };

    return illustrations[key] || '';
  },

  // ===== 問題箇所からセルフケアを取得 =====
  getSelfcareForArea(areaShort, issueType) {
    const areaData = this.exercises[areaShort];
    if (!areaData) return null;

    const type = issueType === 'tension' ? 'tension' : 'contraction';
    return areaData[type] || null;
  },

  // ===== セルフケアカードHTML生成 =====
  renderSelfcareCard(exercise, side) {
    const sideLabel = side === 'both' ? '両側' : side === 'right' ? '右側' : '左側';
    const illustSvg = this.getIllustration(exercise.illustration);

    return `
    <div class="selfcare-card">
      <div class="selfcare-header">
        <h4 class="selfcare-name">${exercise.name}</h4>
        <span class="selfcare-side">${sideLabel}</span>
      </div>
      <div class="selfcare-target-label">対象：${exercise.target}</div>
      <p class="selfcare-desc">${exercise.description}</p>

      ${illustSvg ? `<div class="selfcare-illust-wrapper">${illustSvg}</div>` : ''}

      <ol class="selfcare-steps">
        ${exercise.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
      <div class="selfcare-meta">
        <span class="selfcare-meta-item">回数：${exercise.sets}</span>
        <span class="selfcare-meta-item">頻度：${exercise.frequency}</span>
      </div>
      <div class="selfcare-caution">${exercise.caution}</div>
    </div>`;
  }
};
