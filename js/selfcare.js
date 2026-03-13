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

  // ===== SVGイラスト生成（プロフェッショナル版） =====
  getIllustration(key) {
    // 共通定義
    const S = '#fde8d0'; // skin fill
    const K = '#c4956e'; // skin stroke
    const H = '#4a2c1a'; // hair
    const M = '#ef4444'; // muscle/stretch highlight
    const A = '#3b82f6'; // action/arrow
    // 共通SVGヘッダー（筋肉グラデーション含む）
    const defs = `<defs>
      <linearGradient id="muscleHL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${M}" stop-opacity="0.15"/><stop offset="100%" stop-color="${M}" stop-opacity="0.35"/></linearGradient>
      <marker id="aB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="${A}"/></marker>
      <marker id="aU" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto"><path d="M0,8 L4,0 L8,8" fill="${A}"/></marker>
      <marker id="aD" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto"><path d="M0,0 L4,8 L8,0" fill="${M}"/></marker>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    // ステップ番号バッジ
    const badge = (x,y,n,c='#3b82f6') => `<circle cx="${x}" cy="${y}" r="11" fill="${c}" opacity="0.9"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="11" fill="white" font-weight="700">${n}</text>`;
    // 筋肉エリアラベル
    const muscleLabel = (x,y,t,align='start') => `<rect x="${align==='middle'?x-t.length*4:align==='end'?x-t.length*7.5:x-4}" y="${y-12}" width="${t.length*7.5+8}" height="17" rx="4" fill="white" opacity="0.85"/><text x="${x}" y="${y}" text-anchor="${align}" font-size="11" fill="${M}" font-weight="700">${t}</text>`;

    const illustrations = {
      neckStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 椅子 -->
        <path d="M65,148 L175,148 L175,152 L65,152 Z" fill="#b0bec5" opacity="0.3" rx="3"/>
        <rect x="155" y="80" width="6" height="72" rx="2" fill="#b0bec5" opacity="0.25"/>
        <rect x="70" y="152" width="4" height="40" rx="2" fill="#b0bec5" opacity="0.3"/>
        <rect x="166" y="152" width="4" height="40" rx="2" fill="#b0bec5" opacity="0.3"/>
        <!-- 筋肉ハイライト：僧帽筋上部 -->
        <path d="M85,68 Q78,80 82,100 L100,100 L105,68 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6"/>
        ${badge(36,22,'1')}
        <text x="52" y="26" font-size="10" fill="#3b82f6" font-weight="600">手を下に入れる</text>
        <!-- 体幹 -->
        <path d="M105,92 Q120,86 135,92 L133,146 L107,146 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <!-- 首 -->
        <path d="M112,74 Q120,78 128,74 L128,92 L112,92 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <!-- 頭ゴースト（元位置） -->
        <circle cx="120" cy="56" r="20" fill="${S}" stroke="${K}" stroke-width="0.8" opacity="0.2" stroke-dasharray="3,3"/>
        <!-- 頭（傾いた位置） -->
        <ellipse cx="100" cy="54" rx="20" ry="19" fill="${S}" stroke="${A}" stroke-width="1.8"/>
        <path d="M83,42 C86,32 112,30 118,40" fill="${H}" opacity="0.45"/>
        <!-- 左腕（お尻の下） -->
        <path d="M105,96 Q90,106 85,118 Q82,132 86,148" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 右手→頭を押す -->
        <path d="M135,96 Q146,88 148,76 Q146,64 136,56 Q124,48 112,52" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="112" cy="50" r="5" fill="${S}" stroke="${K}" stroke-width="1"/>
        <!-- 押す矢印 -->
        <path d="M148,44 L116,52" stroke="${A}" stroke-width="3" fill="none" marker-end="url(#aB)" filter="url(#glow)"/>
        ${badge(158,38,'2',A)}
        <text x="172" y="42" font-size="10" fill="${A}" font-weight="600">頭を押す</text>
        <!-- 伸びエリア + ラベル -->
        <path d="M82,62 Q72,78 76,98" stroke="${M}" stroke-width="3" fill="none" stroke-dasharray="5,3"/>
        ${muscleLabel(42,82,'僧帽筋の伸び')}
        <!-- 脚 -->
        <path d="M110,146 Q104,170 100,196" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M130,146 Q136,170 140,196" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="98" cy="200" rx="10" ry="5" fill="${S}" stroke="${K}" stroke-width="0.8"/>
        <ellipse cx="142" cy="200" rx="10" ry="5" fill="${S}" stroke="${K}" stroke-width="0.8"/>
        <line x1="30" y1="206" x2="230" y2="206" stroke="#cbd5e1" stroke-width="1"/>
        <!-- 秒数 -->
        <rect x="70" y="216" width="120" height="20" rx="6" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="230" text-anchor="middle" font-size="11" fill="${A}" font-weight="600">20秒キープ × 3回</text>
      </svg>`,

      shoulderShrug: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 筋肉ハイライト：僧帽筋上部 左肩 -->
        <ellipse cx="92" cy="72" rx="24" ry="16" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 体幹 -->
        <path d="M112,86 Q130,80 148,86 L146,158 L114,158 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <!-- 首 -->
        <path d="M120,68 Q130,72 140,68 L140,86 L120,86 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <!-- 頭 -->
        <circle cx="130" cy="50" r="20" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M112,40 C114,28 146,28 148,40" fill="${H}" opacity="0.45"/>
        <!-- 左肩（上がった） -->
        <path d="M112,86 Q88,68 78,58" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M78,58 Q74,74 72,96 Q70,114 74,130" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 右肩（通常） -->
        <path d="M148,86 Q168,82 178,88" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M178,88 Q180,106 178,124 Q176,138 172,148" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- STEP1: 上げる -->
        <path d="M62,74 L62,44" stroke="${A}" stroke-width="3" marker-end="url(#aU)" filter="url(#glow)"/>
        ${badge(44,38,'1',A)}
        <text x="20" y="52" font-size="11" fill="${A}" font-weight="700">上げる</text>
        <!-- STEP2: 5秒キープ -->
        ${badge(44,72,'2','#f59e0b')}
        <text x="20" y="76" font-size="10" fill="#f59e0b" font-weight="600">5秒</text>
        <!-- STEP3: 脱力 -->
        <path d="M56,96 L56,120" stroke="${M}" stroke-width="3" marker-end="url(#aD)"/>
        ${badge(44,108,'3',M)}
        <text x="16" y="130" font-size="11" fill="${M}" font-weight="700">ストン！</text>
        <!-- ゴースト：脱力後の腕 -->
        <path d="M112,86 Q98,84 90,86" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2" stroke-dasharray="4,3"/>
        <path d="M90,86 Q86,100 84,118" stroke="${K}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.2" stroke-dasharray="4,3"/>
        <!-- 脚 -->
        <path d="M118,158 Q112,180 108,206" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M142,158 Q148,180 152,206" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <line x1="50" y1="214" x2="210" y2="214" stroke="#cbd5e1" stroke-width="1"/>
        <rect x="70" y="220" width="120" height="18" rx="6" fill="#fef3c7" stroke="#fcd34d" stroke-width="1"/>
        <text x="130" y="233" text-anchor="middle" font-size="10" fill="#92400e" font-weight="600">10回 × 2セット</text>
      </svg>`,

      armStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 壁 -->
        <rect x="200" y="0" width="14" height="240" fill="#e2e8f0" opacity="0.5"/>
        <line x1="200" y1="0" x2="200" y2="240" stroke="#94a3b8" stroke-width="1.2"/>
        <!-- 筋肉ハイライト：三角筋・脇下 -->
        <path d="M126,76 Q146,60 168,48 Q180,42 190,38 L192,50 Q176,56 158,66 L138,82 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 体幹 -->
        <path d="M104,90 Q118,84 130,90 L128,156 L106,156 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M110,72 Q118,76 126,72 L126,90 L110,90 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="118" cy="54" r="20" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M100,44 C102,32 134,32 136,44" fill="${H}" opacity="0.45"/>
        <!-- STEP1: 壁に腕 -->
        <path d="M130,90 Q150,76 172,60 Q186,50 200,44" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="200" cy="44" r="6" fill="${S}" stroke="#fbbf24" stroke-width="2"/>
        ${badge(212,28,'1',A)}
        <text x="192" y="20" font-size="10" fill="${A}" font-weight="600">壁に手</text>
        <!-- 反対の腕 -->
        <path d="M104,94 Q88,106 82,120 Q78,134 82,146" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- STEP2: ひねる -->
        <path d="M94,118 C80,112 76,126 84,138" stroke="${A}" stroke-width="3" fill="none" marker-end="url(#aB)"/>
        ${badge(62,120,'2',A)}
        <text x="34" y="124" font-size="11" fill="${A}" font-weight="700">ひねる</text>
        <!-- 伸びライン -->
        <path d="M140,78 Q164,62 188,48" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(130,68,'脇〜腕の伸び')}
        <!-- 脚 -->
        <path d="M108,156 Q104,182 100,212" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M126,156 Q130,182 134,212" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <line x1="50" y1="218" x2="205" y2="218" stroke="#cbd5e1" stroke-width="1"/>
        <rect x="60" y="224" width="120" height="14" rx="5" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="120" y="234" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">15秒キープ × 3回</text>
      </svg>`,

      scapulaExercise: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 床 -->
        <line x1="20" y1="176" x2="240" y2="176" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- 筋肉ハイライト：菱形筋・前鋸筋エリア -->
        <ellipse cx="140" cy="82" rx="34" ry="16" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 四つん這いの人物 -->
        <ellipse cx="188" cy="72" rx="16" ry="18" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M174,62 C176,50 200,50 202,62" fill="${H}" opacity="0.45"/>
        <!-- 体 -->
        <path d="M174,86 Q140,78 106,88 Q84,94 68,100" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M176,82 Q140,74 106,84 Q84,90 68,96" stroke="${S}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- 腕 -->
        <path d="M174,90 Q182,118 186,172" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M176,92 Q190,118 196,172" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 脚 -->
        <path d="M70,100 Q62,134 58,172" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M74,100 Q70,134 68,172" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- STEP1: 肩甲骨を寄せる -->
        <path d="M116,70 L134,76" stroke="${A}" stroke-width="3" marker-end="url(#aB)"/>
        <path d="M164,70 L146,76" stroke="${A}" stroke-width="3" marker-end="url(#aB)"/>
        ${badge(140,58,'1',A)}
        <text x="118" y="52" font-size="11" fill="${A}" font-weight="700">寄せる</text>
        <!-- ゴースト：背中丸め -->
        <path d="M174,86 Q140,92 106,100 Q84,108 68,116" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.15" stroke-dasharray="4,3"/>
        <!-- STEP2: 丸める -->
        <path d="M120,104 Q140,120 160,104" stroke="${M}" stroke-width="2.5" fill="none"/>
        ${badge(140,118,'2',M)}
        <text x="118" y="140" font-size="11" fill="${M}" font-weight="700">背中を丸める</text>
        <!-- 筋肉ラベル -->
        ${muscleLabel(114,192,'肩甲骨周囲筋','start')}
        <rect x="58" y="208" width="144" height="28" rx="6" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="220" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">寄せる3秒 → 丸める3秒</text>
        <text x="130" y="232" text-anchor="middle" font-size="9" fill="#64748b">× 10回 × 2セット</text>
      </svg>`,

      wristStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 筋肉ハイライト：前腕屈筋群 -->
        <path d="M28,104 Q80,98 130,96 Q160,94 180,93 L180,108 Q160,109 130,110 Q80,112 28,118 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 腕 -->
        <path d="M28,110 Q80,106 130,104 Q160,102 185,100" stroke="${S}" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M28,110 Q80,106 130,104 Q160,102 185,100" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- 手首関節 -->
        <circle cx="185" cy="100" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
        <!-- 手（反り返り） -->
        <path d="M185,100 Q196,86 204,72 Q208,64 210,56" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M185,100 Q196,86 204,72 Q208,64 210,56" stroke="${S}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/>
        <!-- 指 -->
        <line x1="210" y1="56" x2="214" y2="46" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="210" y1="56" x2="218" y2="48" stroke="${K}" stroke-width="2" stroke-linecap="round"/>
        <line x1="210" y1="56" x2="220" y2="52" stroke="${K}" stroke-width="2" stroke-linecap="round"/>
        <line x1="210" y1="56" x2="222" y2="56" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>
        <!-- STEP1: 腕を前に -->
        ${badge(28,88,'1',A)}
        <text x="10" y="84" font-size="9" fill="${A}" font-weight="600">腕を前に</text>
        <!-- 反対の手 -->
        <path d="M160,78 Q168,74 176,72" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="178" cy="71" r="5" fill="${S}" stroke="${K}" stroke-width="1"/>
        <!-- STEP2: 引く矢印 -->
        <path d="M168,62 L196,64" stroke="${A}" stroke-width="3" fill="none" marker-end="url(#aB)" filter="url(#glow)"/>
        ${badge(156,54,'2',A)}
        <text x="140" y="46" font-size="11" fill="${A}" font-weight="700">手前に引く</text>
        <!-- 伸びエリア -->
        <path d="M70,108 Q120,124 170,108" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(80,142,'前腕屈筋群が伸びる','start')}
        <!-- 内外ガイド -->
        <rect x="40" y="168" width="180" height="52" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="130" y="186" text-anchor="middle" font-size="11" fill="#1e293b" font-weight="600">手のひら側 → 手の甲側</text>
        <text x="130" y="202" text-anchor="middle" font-size="10" fill="#64748b">各15秒 × 3回 両方向</text>
      </svg>`,

      gripExercise: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 前腕 -->
        <path d="M30,120 Q70,116 110,114" stroke="${S}" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M30,120 Q70,116 110,114" stroke="${K}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <!-- 筋肉ハイライト -->
        <path d="M50,108 Q80,104 110,104 L110,126 Q80,128 50,130 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.4"/>
        <!-- タオル -->
        <ellipse cx="160" cy="108" rx="38" ry="26" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.8"/>
        <path d="M132,96 Q160,82 188,96" fill="none" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>
        <path d="M132,120 Q160,134 188,120" fill="none" stroke="#94a3b8" stroke-width="0.8" opacity="0.5"/>
        <text x="160" y="112" text-anchor="middle" font-size="12" fill="#64748b" font-weight="600">タオル</text>
        <!-- 握る手 -->
        <path d="M110,114 Q120,96 130,88 Q138,84 144,92 Q148,100 144,112" stroke="${K}" stroke-width="3" fill="${S}" stroke-linecap="round"/>
        <path d="M130,88 Q134,80 140,82" stroke="${K}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M138,84 Q142,76 148,80" stroke="${K}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M144,86 Q150,80 154,84" stroke="${K}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- STEP1: 握る -->
        <path d="M124,78 Q112,96 124,116" stroke="${A}" stroke-width="2.5" fill="none"/>
        <path d="M198,78 Q210,96 198,116" stroke="${A}" stroke-width="2.5" fill="none"/>
        ${badge(118,68,'1',A)}
        <text x="160" y="152" text-anchor="middle" font-size="14" fill="${A}" font-weight="700">ギュッと握る</text>
        <!-- STEP2: キープ -->
        ${badge(118,150,'2','#f59e0b')}
        <text x="100" y="154" font-size="10" fill="#f59e0b" font-weight="600">5秒</text>
        <!-- STEP3: 離す -->
        ${badge(118,174,'3','#22c55e')}
        <text x="94" y="178" font-size="10" fill="#22c55e" font-weight="600">離す</text>
        <!-- 力の波紋 -->
        <ellipse cx="160" cy="108" rx="48" ry="34" fill="none" stroke="${A}" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3"/>
        <ellipse cx="160" cy="108" rx="56" ry="40" fill="none" stroke="${A}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.15"/>
        ${muscleLabel(50,140,'前腕伸筋群','start')}
        <rect x="70" y="196" width="120" height="28" rx="6" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="208" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">握る5秒 → 離す5秒</text>
        <text x="130" y="220" text-anchor="middle" font-size="9" fill="#64748b">10回 × 2セット</text>
      </svg>`,

      hipFlexorStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <line x1="20" y1="212" x2="240" y2="212" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- 筋肉ハイライト：腸腰筋 -->
        <path d="M90,118 Q78,138 76,160 L92,164 Q90,142 98,122 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6"/>
        <!-- 体幹 -->
        <path d="M112,64 Q124,58 132,64 L130,120 L114,120 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M116,50 Q122,54 128,50 L128,64 L116,64 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="122" cy="34" r="18" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M106,26 C108,16 136,16 138,26" fill="${H}" opacity="0.45"/>
        <!-- 腕 -->
        <path d="M112,70 Q98,82 92,96 Q88,108 92,116" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M132,70 Q144,82 148,96 Q150,108 146,116" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 前脚（膝90度） -->
        <path d="M130,120 Q148,138 162,160" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <circle cx="162" cy="160" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" opacity="0.7"/>
        <path d="M162,160 L162,210" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="164" cy="212" rx="10" ry="4" fill="${S}" stroke="${K}" stroke-width="0.8"/>
        <!-- 後ろ脚（膝つき） -->
        <path d="M114,120 Q92,142 78,166" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <circle cx="78" cy="166" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
        <path d="M78,166 Q68,186 62,210" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- STEP1: 片膝立ち -->
        ${badge(42,164,'1',A)}
        <text x="22" y="180" font-size="9" fill="${A}" font-weight="600">膝をつく</text>
        <!-- STEP2: 前に押し出す -->
        <path d="M102,114 L126,106" stroke="${A}" stroke-width="3" marker-end="url(#aB)" filter="url(#glow)"/>
        ${badge(92,106,'2',A)}
        <text x="70" y="100" font-size="11" fill="${A}" font-weight="700">前へ</text>
        <!-- 伸びライン -->
        <path d="M92,126 Q82,144 80,162" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(38,148,'腸腰筋の伸び')}
        <rect x="60" y="222" width="140" height="14" rx="5" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="232" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">20秒キープ × 3回（左右）</text>
      </svg>`,

      pelvicStabilize: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- マット -->
        <rect x="16" y="152" width="228" height="10" rx="4" fill="#e8f5e9" opacity="0.5"/>
        <line x1="16" y1="162" x2="244" y2="162" stroke="#cbd5e1" stroke-width="1"/>
        <!-- 筋肉ハイライト：内転筋 -->
        <path d="M156,84 Q164,92 170,84 L170,100 Q164,108 156,100 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 仰向けの人物 -->
        <ellipse cx="46" cy="128" rx="18" ry="16" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M30,120 C30,110 62,110 62,120" fill="${H}" opacity="0.35"/>
        <!-- 体 -->
        <path d="M62,130 Q100,126 150,132" stroke="${S}" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.6"/>
        <path d="M62,130 Q100,126 150,132" stroke="${K}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <!-- 腕 -->
        <path d="M80,130 Q82,140 84,152" stroke="${K}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M104,128 Q106,140 108,152" stroke="${K}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- 左膝 -->
        <path d="M150,132 Q160,110 170,82" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M170,82 L170,152" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- 右膝 -->
        <path d="M156,134 Q168,114 180,88" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M180,88 L180,152" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- クッション -->
        <ellipse cx="175" cy="86" rx="15" ry="9" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
        <text x="175" y="90" text-anchor="middle" font-size="8" fill="#92400e" font-weight="600">クッション</text>
        <!-- STEP1: 挟む -->
        <path d="M154,74 L168,80" stroke="${A}" stroke-width="3" marker-end="url(#aB)"/>
        <path d="M196,74 L182,80" stroke="${A}" stroke-width="3" marker-end="url(#aB)"/>
        ${badge(175,60,'1',A)}
        <text x="157" y="54" font-size="13" fill="${A}" font-weight="700">挟む！</text>
        <!-- 力の波紋 -->
        <ellipse cx="175" cy="86" rx="24" ry="16" fill="none" stroke="${A}" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3"/>
        <!-- ${badge(175,128,'2','#f59e0b')} -->
        ${muscleLabel(136,180,'内転筋を強化','start')}
        <rect x="58" y="196" width="144" height="28" rx="6" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="208" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">5秒キープ → 5秒休む</text>
        <text x="130" y="220" text-anchor="middle" font-size="9" fill="#64748b">10回 × 3セット</text>
      </svg>`,

      hamstringStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 椅子 -->
        <rect x="30" y="132" width="80" height="8" rx="3" fill="#b0bec5" opacity="0.3"/>
        <rect x="100" y="66" width="6" height="72" rx="2" fill="#b0bec5" opacity="0.25"/>
        <rect x="35" y="140" width="4" height="42" rx="2" fill="#b0bec5" opacity="0.3"/>
        <rect x="102" y="140" width="4" height="42" rx="2" fill="#b0bec5" opacity="0.3"/>
        <!-- 筋肉ハイライト：ハムストリングス -->
        <path d="M76,130 Q120,130 170,132 Q190,132 206,134 L206,142 Q190,140 170,140 Q120,140 76,138 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>
        <!-- 体 -->
        <path d="M60,92 Q72,86 80,92 L78,130 L62,130 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M64,78 Q70,82 76,78 L76,92 L64,92 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="70" cy="62" r="18" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M54,54 C56,44 84,44 86,54" fill="${H}" opacity="0.45"/>
        <!-- 腕 -->
        <path d="M60,96 Q50,108 46,124" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M80,96 Q88,108 92,124" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 曲げた脚 -->
        <path d="M62,130 Q56,152 52,184" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- 伸ばした脚 -->
        <path d="M78,130 Q120,132 162,134 Q186,136 206,136" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M206,136 L214,126" stroke="${K}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        ${badge(220,122,'1',A)}
        <text x="210" y="116" font-size="9" fill="${A}" font-weight="600">つま先↑</text>
        <!-- STEP2: 前屈 -->
        <path d="M84,76 Q102,70 110,86" stroke="${A}" stroke-width="3" fill="none" marker-end="url(#aB)" filter="url(#glow)"/>
        ${badge(96,62,'2',A)}
        <text x="106" y="58" font-size="12" fill="${A}" font-weight="700">前屈</text>
        <!-- もも裏の伸び -->
        <path d="M90,140 Q140,156 190,140" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(100,170,'ハムストリングスの伸び','start')}
        <line x1="20" y1="192" x2="230" y2="192" stroke="#cbd5e1" stroke-width="1"/>
        <rect x="60" y="200" width="140" height="28" rx="6" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="212" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">20秒キープ × 3回</text>
        <text x="130" y="224" text-anchor="middle" font-size="9" fill="#64748b">左右各3回ずつ</text>
      </svg>`,

      quadStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 壁 -->
        <rect x="16" y="0" width="12" height="240" fill="#e2e8f0" opacity="0.5"/>
        <line x1="28" y1="0" x2="28" y2="240" stroke="#94a3b8" stroke-width="1.2"/>
        <!-- 筋肉ハイライト：大腿四頭筋 -->
        <path d="M108,124 Q124,138 136,158 L124,164 Q114,144 102,130 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6"/>
        <!-- 体 -->
        <path d="M92,68 Q104,62 112,68 L110,128 L94,128 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M96,54 Q102,58 108,54 L108,68 L96,68 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="102" cy="38" r="18" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M86,30 C88,18 116,18 118,30" fill="${H}" opacity="0.45"/>
        <!-- STEP1: 壁に手 -->
        <path d="M92,74 Q66,72 32,72" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="72" r="5" fill="${S}" stroke="${K}" stroke-width="1"/>
        ${badge(42,58,'1',A)}
        <text x="34" y="54" font-size="9" fill="${A}" font-weight="600">壁に手</text>
        <!-- 立脚 -->
        <path d="M96,128 Q94,160 92,200" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="90" cy="206" rx="11" ry="5" fill="${S}" stroke="${K}" stroke-width="0.8"/>
        <!-- 曲げた脚 -->
        <path d="M110,128 Q132,146 142,168" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="142" cy="168" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" opacity="0.7"/>
        <path d="M142,168 Q134,150 124,126" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <!-- STEP2: 手で足首を持つ -->
        <path d="M112,74 Q126,88 132,108 Q134,118 130,126" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="128" cy="126" r="4.5" fill="${S}" stroke="${K}" stroke-width="1"/>
        ${badge(148,116,'2',A)}
        <text x="152" y="112" font-size="9" fill="${A}" font-weight="600">足首を持つ</text>
        <!-- 伸びライン -->
        <path d="M112,128 Q128,140 138,162" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(150,146,'大腿四頭筋','start')}
        ${muscleLabel(150,162,'の伸び','start')}
        <line x1="50" y1="212" x2="210" y2="212" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="60" y="218" width="140" height="14" rx="5" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="228" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">15秒 × 3回（左右）</text>
      </svg>`,

      calfStretch: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 壁 -->
        <rect x="200" y="0" width="14" height="240" fill="#e2e8f0" opacity="0.5"/>
        <line x1="200" y1="0" x2="200" y2="240" stroke="#94a3b8" stroke-width="1.2"/>
        <!-- 筋肉ハイライト：腓腹筋 -->
        <path d="M80,164 Q72,178 70,198 L86,200 Q84,182 90,168 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6"/>
        <!-- 体 -->
        <path d="M138,66 Q150,60 158,66 L156,118 L140,118 Z" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M142,52 Q148,56 154,52 L154,66 L142,66 Z" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="148" cy="36" r="18" fill="${S}" stroke="${K}" stroke-width="1.2"/>
        <path d="M132,28 C134,16 162,16 164,28" fill="${H}" opacity="0.45"/>
        <!-- 壁に手 -->
        <path d="M158,70 Q176,62 198,54" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M156,76 Q178,70 198,62" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="198" cy="54" r="4" fill="${S}" stroke="${K}" stroke-width="1"/>
        <circle cx="198" cy="62" r="4" fill="${S}" stroke="${K}" stroke-width="1"/>
        <!-- 前脚 -->
        <path d="M156,118 Q166,140 172,164" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M172,164 L176,200" stroke="${K}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="178" cy="204" rx="10" ry="4" fill="${S}" stroke="${K}" stroke-width="0.8"/>
        <!-- 後ろ脚（伸ばす）STEP1 -->
        <path d="M140,118 Q112,144 90,172" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M90,172 L78,204" stroke="${K}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- かかと -->
        <circle cx="76" cy="206" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
        ${badge(56,208,'1','#d97706')}
        <text x="30" y="212" font-size="9" fill="#d97706" font-weight="600">かかと↓</text>
        <!-- 伸びライン -->
        <path d="M88,172 Q78,184 76,200" stroke="${M}" stroke-width="3" stroke-dasharray="5,3" fill="none"/>
        ${muscleLabel(32,176,'腓腹筋の伸び','start')}
        <!-- STEP2: 前膝曲げ -->
        ${badge(182,150,'2',A)}
        <text x="188" y="146" font-size="9" fill="${A}" font-weight="600">膝を曲げる</text>
        <line x1="30" y1="212" x2="210" y2="212" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="56" y="220" width="148" height="14" rx="5" fill="#f0f9ff" stroke="#bfdbfe" stroke-width="1"/>
        <text x="130" y="230" text-anchor="middle" font-size="10" fill="${A}" font-weight="600">20秒キープ × 3回（左右）</text>
      </svg>`,

      ankleExercise: `<svg viewBox="0 0 260 240" class="selfcare-illust">
        ${defs}
        <!-- 椅子ヒント -->
        <rect x="40" y="30" width="180" height="8" rx="3" fill="#b0bec5" opacity="0.2"/>
        <!-- すね -->
        <path d="M100,34 L96,90" stroke="${S}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M100,34 L96,90" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <path d="M160,34 L164,90" stroke="${S}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M160,34 L164,90" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <!-- 足首関節 -->
        <circle cx="96" cy="92" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" opacity="0.7"/>
        <circle cx="164" cy="92" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" opacity="0.7"/>
        <!-- 足（大きく詳細に） -->
        <path d="M78,92 Q72,102 68,114 Q64,128 66,138 Q74,156 130,158 Q156,158 170,150 Q180,142 180,130 Q180,112 172,100 Q168,94 164,92"
          fill="${S}" stroke="${K}" stroke-width="1.8"/>
        <!-- 足裏アーチ線 -->
        <path d="M78,148 Q110,164 150,152" stroke="${K}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <!-- 筋肉ハイライト：足底筋 -->
        <path d="M82,142 Q110,158 148,146 L148,154 Q110,166 82,152 Z" fill="url(#muscleHL)" stroke="${M}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.4"/>
        <!-- つま先・かかと固定 -->
        <circle cx="168" cy="146" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
        <circle cx="72" cy="140" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
        <text x="176" y="150" font-size="10" fill="#d97706" font-weight="600">固定</text>
        <text x="42" y="144" font-size="10" fill="#d97706" font-weight="600">固定</text>
        <!-- STEP1: アーチ上げ -->
        <path d="M120,148 L120,116" stroke="${A}" stroke-width="3.5" marker-end="url(#aU)" filter="url(#glow)"/>
        ${badge(138,102,'1',A)}
        <text x="146" y="98" font-size="13" fill="${A}" font-weight="700">アーチ↑</text>
        <!-- STEP2: タオルギャザー -->
        <rect x="40" y="174" width="180" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
        ${badge(56,188,'2','#22c55e')}
        <text x="72" y="192" font-size="12" fill="#22c55e" font-weight="700">タオルギャザー</text>
        <text x="130" y="210" text-anchor="middle" font-size="10" fill="#64748b">足指でタオルをたぐり寄せる</text>
        <!-- 指の動きイメージ -->
        <path d="M100,192 Q108,196 116,192 Q124,188 132,192" stroke="#22c55e" stroke-width="1.5" fill="none"/>
        <path d="M140,192 Q148,196 156,192" stroke="#22c55e" stroke-width="1.5" fill="none"/>
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
