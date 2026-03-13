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

  // ===== SVGイラスト生成 =====
  getIllustration(key) {
    const illustrations = {
      neckStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 椅子 -->
        <rect x="60" y="110" width="80" height="8" rx="3" fill="#cbd5e1"/>
        <rect x="65" y="118" width="4" height="40" fill="#cbd5e1"/>
        <rect x="131" y="118" width="4" height="40" fill="#cbd5e1"/>
        <!-- 人物 -->
        <circle cx="100" cy="42" r="16" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="100" y1="58" x2="100" y2="108" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 傾いた頭 -->
        <circle cx="88" cy="38" r="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" opacity="0.7"/>
        <!-- 手で押す矢印 -->
        <path d="M120,30 C115,28 108,30 105,34" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrowBlue)"/>
        <line x1="120" y1="30" x2="130" y2="28" stroke="#64748b" stroke-width="2"/>
        <!-- 矢印 -->
        <defs><marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#3b82f6"/></marker></defs>
        <!-- 伸び表示 -->
        <path d="M80,48 Q72,60 76,75" stroke="#ef4444" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
        <text x="64" y="68" font-size="9" fill="#ef4444" font-weight="600">伸び</text>
        <!-- 脚 -->
        <line x1="92" y1="108" x2="80" y2="150" stroke="#64748b" stroke-width="2.5"/>
        <line x1="108" y1="108" x2="120" y2="150" stroke="#64748b" stroke-width="2.5"/>
      </svg>`,

      shoulderShrug: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <circle cx="100" cy="35" r="16" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="100" y1="51" x2="100" y2="110" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 肩を上げた状態 -->
        <line x1="100" y1="62" x2="68" y2="52" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="100" y1="62" x2="132" y2="58" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 上矢印 -->
        <path d="M68,60 L68,42" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowUp)"/>
        <text x="52" y="48" font-size="9" fill="#3b82f6" font-weight="600">上げる</text>
        <!-- 下矢印 -->
        <path d="M60,75 L60,90" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowDown)"/>
        <text x="44" y="98" font-size="9" fill="#ef4444" font-weight="600">脱力</text>
        <defs>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto"><path d="M0,6 L3,0 L6,6" fill="#3b82f6"/></marker>
          <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto"><path d="M0,0 L3,6 L6,0" fill="#ef4444"/></marker>
        </defs>
        <line x1="92" y1="110" x2="80" y2="155" stroke="#64748b" stroke-width="2.5"/>
        <line x1="108" y1="110" x2="120" y2="155" stroke="#64748b" stroke-width="2.5"/>
      </svg>`,

      armStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 壁 -->
        <rect x="155" y="0" width="8" height="180" fill="#e2e8f0"/>
        <circle cx="100" cy="38" r="16" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="100" y1="54" x2="100" y2="115" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 壁に手をつく -->
        <line x1="100" y1="66" x2="155" y2="40" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="155" cy="40" r="3" fill="#fbbf24"/>
        <!-- 体のひねり矢印 -->
        <path d="M85,85 C75,80 70,90 75,100" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrowBlue2)"/>
        <text x="50" y="92" font-size="9" fill="#3b82f6" font-weight="600">ひねる</text>
        <!-- 伸び表示 -->
        <path d="M110,58 L145,42" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
        <text x="118" y="38" font-size="9" fill="#ef4444" font-weight="600">伸び</text>
        <defs><marker id="arrowBlue2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#3b82f6"/></marker></defs>
        <line x1="92" y1="115" x2="82" y2="160" stroke="#64748b" stroke-width="2.5"/>
        <line x1="108" y1="115" x2="118" y2="160" stroke="#64748b" stroke-width="2.5"/>
      </svg>`,

      scapulaExercise: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 四つん這い -->
        <circle cx="140" cy="50" r="14" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <!-- 背中 -->
        <line x1="130" y1="60" x2="70" y2="65" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 腕 -->
        <line x1="130" y1="60" x2="140" y2="110" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 脚 -->
        <line x1="70" y1="65" x2="60" y2="110" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 肩甲骨の矢印 -->
        <path d="M95,55 L105,55" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrR)"/>
        <path d="M115,55 L105,55" stroke="#3b82f6" stroke-width="2"/>
        <text x="92" y="48" font-size="8" fill="#3b82f6" font-weight="600">寄せる</text>
        <!-- 丸める矢印 -->
        <path d="M95,78 Q100,90 105,78" stroke="#ef4444" stroke-width="1.5" fill="none"/>
        <text x="88" y="98" font-size="8" fill="#ef4444" font-weight="600">丸める</text>
        <defs><marker id="arrR" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#3b82f6"/></marker></defs>
        <!-- 床 -->
        <line x1="30" y1="115" x2="170" y2="115" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      wristStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 腕を前に伸ばす -->
        <line x1="40" y1="90" x2="160" y2="90" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <!-- 手 -->
        <path d="M155,90 L165,75 L170,70" stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- 反対の手で引く -->
        <path d="M140,70 L158,72" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrPull)"/>
        <text x="130" y="62" font-size="9" fill="#3b82f6" font-weight="600">引く</text>
        <!-- 伸び表示 -->
        <path d="M80,90 Q100,100 120,90" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
        <text x="88" y="110" font-size="9" fill="#ef4444" font-weight="600">前腕の伸び</text>
        <defs><marker id="arrPull" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#3b82f6"/></marker></defs>
      </svg>`,

      gripExercise: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 手とタオル -->
        <ellipse cx="100" cy="80" rx="30" ry="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
        <text x="100" y="84" text-anchor="middle" font-size="10" fill="#64748b">タオル</text>
        <!-- 握る矢印 -->
        <path d="M65,70 Q60,80 65,90" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrGrip)"/>
        <path d="M135,70 Q140,80 135,90" stroke="#3b82f6" stroke-width="2" fill="none"/>
        <text x="100" y="120" text-anchor="middle" font-size="10" fill="#3b82f6" font-weight="600">ギュッと握る</text>
        <text x="100" y="140" text-anchor="middle" font-size="9" fill="#64748b">5秒キープ → 離す</text>
        <defs><marker id="arrGrip" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#3b82f6"/></marker></defs>
      </svg>`,

      hipFlexorStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 片膝立ち -->
        <circle cx="100" cy="30" r="14" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="100" y1="44" x2="100" y2="90" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 前の脚 -->
        <line x1="100" y1="90" x2="130" y2="130" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="130" y1="130" x2="130" y2="165" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 後ろの脚（膝をつく） -->
        <line x1="100" y1="90" x2="65" y2="130" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="65" y1="130" x2="55" y2="165" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="65" cy="130" r="3" fill="#fbbf24"/>
        <!-- 前方への矢印 -->
        <path d="M90,85 L110,80" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrFwd)"/>
        <text x="105" y="72" font-size="9" fill="#3b82f6" font-weight="600">前へ</text>
        <!-- 伸び表示 -->
        <path d="M75,95 Q70,110 72,125" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
        <text x="44" y="112" font-size="8" fill="#ef4444" font-weight="600">伸び</text>
        <defs><marker id="arrFwd" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#3b82f6"/></marker></defs>
        <line x1="30" y1="168" x2="170" y2="168" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      pelvicStabilize: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 仰向け -->
        <line x1="40" y1="100" x2="160" y2="100" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="50" cy="88" r="12" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="62" y1="88" x2="120" y2="90" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 膝を立てる -->
        <line x1="120" y1="90" x2="140" y2="65" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="140" y1="65" x2="140" y2="98" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- クッション -->
        <ellipse cx="140" cy="72" rx="8" ry="5" fill="#fbbf24" stroke="#d97706" stroke-width="1" opacity="0.8"/>
        <!-- 挟む矢印 -->
        <path d="M130,68 L136,70" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arrSq)"/>
        <path d="M150,68 L144,70" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="140" y="52" text-anchor="middle" font-size="8" fill="#3b82f6" font-weight="600">挟む</text>
        <defs><marker id="arrSq" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="#3b82f6"/></marker></defs>
      </svg>`,

      hamstringStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 椅子 -->
        <rect x="30" y="100" width="60" height="6" rx="2" fill="#cbd5e1"/>
        <rect x="34" y="106" width="3" height="35" fill="#cbd5e1"/>
        <rect x="83" y="106" width="3" height="35" fill="#cbd5e1"/>
        <!-- 人物（椅子に座る） -->
        <circle cx="60" cy="55" r="14" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="60" y1="69" x2="60" y2="98" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 伸ばした脚 -->
        <line x1="60" y1="98" x2="155" y2="105" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="155" cy="105" r="3" fill="#64748b"/>
        <!-- 前屈の矢印 -->
        <path d="M65,72 Q80,70 85,80" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrBend)"/>
        <text x="80" y="66" font-size="9" fill="#3b82f6" font-weight="600">前屈</text>
        <!-- もも裏の伸び -->
        <path d="M90,108 Q115,118 140,108" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
        <text x="105" y="130" font-size="8" fill="#ef4444" font-weight="600">もも裏の伸び</text>
        <defs><marker id="arrBend" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#3b82f6"/></marker></defs>
      </svg>`,

      quadStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 壁 -->
        <rect x="20" y="0" width="6" height="180" fill="#e2e8f0"/>
        <!-- 人物（片足立ち） -->
        <circle cx="80" cy="30" r="14" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="80" y1="44" x2="80" y2="95" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 壁に手 -->
        <line x1="80" y1="60" x2="26" y2="60" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
        <!-- 立脚 -->
        <line x1="80" y1="95" x2="80" y2="160" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 曲げた脚 -->
        <line x1="80" y1="95" x2="110" y2="120" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="110" y1="120" x2="100" y2="90" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 手で持つ -->
        <line x1="95" y1="70" x2="100" y2="90" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
        <!-- 伸び表示 -->
        <path d="M88,95 Q100,105 108,115" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
        <text x="115" y="108" font-size="8" fill="#ef4444" font-weight="600">太もも前面</text>
        <line x1="50" y1="165" x2="130" y2="165" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      calfStretch: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 壁 -->
        <rect x="150" y="0" width="8" height="180" fill="#e2e8f0"/>
        <!-- 人物 -->
        <circle cx="120" cy="30" r="14" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <line x1="120" y1="44" x2="115" y2="90" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
        <!-- 壁に手 -->
        <line x1="120" y1="58" x2="150" y2="50" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 前の脚（曲げ） -->
        <line x1="115" y1="90" x2="130" y2="130" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="130" y1="130" x2="135" y2="160" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 後ろの脚（伸ばし） -->
        <line x1="115" y1="90" x2="70" y2="130" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="70" y1="130" x2="60" y2="160" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- ふくらはぎの伸び -->
        <path d="M68,130 Q62,145 64,158" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
        <text x="35" y="148" font-size="8" fill="#ef4444" font-weight="600">伸び</text>
        <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`,

      ankleExercise: `<svg viewBox="0 0 200 180" class="selfcare-illust">
        <!-- 足のクローズアップ -->
        <path d="M50,100 L50,130 C50,150 150,150 150,130 L150,100 Z" fill="#f0f4f8" stroke="#64748b" stroke-width="1.5"/>
        <text x="100" y="120" text-anchor="middle" font-size="10" fill="#64748b">足裏</text>
        <!-- アーチを持ち上げる矢印 -->
        <path d="M100,128 L100,108" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrArchUp)"/>
        <text x="100" y="90" text-anchor="middle" font-size="9" fill="#3b82f6" font-weight="600">アーチを上げる</text>
        <!-- つま先固定 -->
        <circle cx="145" cy="135" r="3" fill="#fbbf24"/>
        <text x="155" y="142" font-size="8" fill="#d97706">固定</text>
        <circle cx="55" cy="135" r="3" fill="#fbbf24"/>
        <text x="30" y="142" font-size="8" fill="#d97706">固定</text>
        <defs><marker id="arrArchUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto"><path d="M0,6 L3,0 L6,6" fill="#3b82f6"/></marker></defs>
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
