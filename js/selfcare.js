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
        evidence: '静的ストレッチ20〜30秒の保持で筋柔軟性が有意に改善（理学療法ガイドライン）',
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
        evidence: '肩すくめ＋脱力法は筋緊張の軽減に効果的（筋弛緩法のエビデンス）',
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
        description: '肩から腕にかけて縮こまりがあります。座ったまま腕を胸の前でクロスして伸ばします。',
        evidence: 'クロスボディストレッチは肩関節可動域の改善に有効（ROM改善のエビデンス）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '縮こまっている側の腕を胸の前にまっすぐ伸ばします',
          '反対の手で肘あたりを持ち、胸に引き寄せます',
          '肩の後ろに伸びを感じたら15秒キープ',
          'ゆっくり戻して3回繰り返します'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2回',
        caution: '肩に痛みがある場合は引き寄せる力を弱めてください',
        illustration: 'armStretch'
      },
      tension: {
        name: '肩〜腕の引っ張りケア',
        target: '肩関節周囲筋・前鋸筋',
        description: '肩から腕が上下に引っ張られています。座ったまま肩甲骨を動かして安定させます。',
        evidence: '肩甲骨安定化運動は肩関節障害の予防・改善に推奨（JOSPT推奨）',
        steps: [
          '椅子に浅く座り、背筋を伸ばします',
          '両手を膝の上に置きます',
          '胸を張りながら肩甲骨を背中の中心に寄せます（3秒）',
          '次に背中を丸めて肩甲骨を広げます（3秒）',
          '10回ゆっくり繰り返します'
        ],
        sets: '10回 × 2セット',
        frequency: '1日2回（朝・夜）',
        caution: '無理に大きく動かさず、心地よい範囲で行ってください',
        illustration: 'scapulaExercise'
      }
    },
    '前腕〜手首': {
      contraction: {
        name: '前腕〜手首の縮こまりケア',
        target: '前腕屈筋群',
        description: '前腕から手首にかけて縮こまっています。手首のストレッチが効果的です。',
        evidence: '手首ストレッチは腱鞘炎・手根管症候群の予防に効果的（職業性疾患予防ガイドライン）',
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
        evidence: '握力強化は上肢機能の全般的改善に寄与（リハビリテーションエビデンス）',
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
        description: '股関節から太ももにかけて縮こまりがあります。椅子に座ったまま股関節を伸ばします。',
        evidence: '腸腰筋ストレッチは腰痛軽減に有効（システマティックレビューで推奨）',
        steps: [
          '椅子に浅く座ります',
          '片足を少し後ろに引きます',
          '背筋を伸ばしたまま、おへそを前に突き出すイメージで骨盤を前傾させます',
          '股関節の前面に伸びを感じたら15秒キープ',
          '左右各3回ずつ行います'
        ],
        sets: '15秒 × 3回（左右）',
        frequency: '1日2回',
        caution: '腰を反らさないよう、お腹に軽く力を入れて行ってください',
        illustration: 'hipFlexorStretch'
      },
      tension: {
        name: '股関節〜太ももの引っ張りケア',
        target: '内転筋・大腿筋膜張筋',
        description: '股関節が上下に引っ張られています。骨盤の安定化エクササイズが効果的です。',
        evidence: '内転筋強化は骨盤アライメント改善と股関節安定性向上に有効',
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
        evidence: 'ハムストリングスストレッチは腰痛・膝痛予防に推奨（運動療法ガイドライン）',
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
        description: '太ももが上下に引っ張られています。うつ伏せで太もも前面を伸ばします。',
        evidence: '大腿四頭筋ストレッチは膝関節の柔軟性改善に効果的（スポーツ医学エビデンス）',
        steps: [
          'うつ伏せに寝ます',
          '片方の膝をゆっくり曲げます',
          '手が届く人は足首を持ち、お尻に近づけます',
          '太もも前面に伸びを感じたら15秒キープ',
          '左右各3回ずつ行います'
        ],
        sets: '15秒 × 3回（左右）',
        frequency: '1日2回',
        caution: '腰が反る場合はお腹の下にタオルを入れてください',
        illustration: 'quadStretch'
      }
    },
    'すね〜足首': {
      contraction: {
        name: 'すね〜足首の縮こまりケア',
        target: '腓腹筋・ヒラメ筋',
        description: 'すねから足首にかけて縮こまっています。座ったままタオルでふくらはぎを伸ばします。',
        evidence: '腓腹筋ストレッチは足関節背屈可動域改善に有効（理学療法エビデンス）',
        steps: [
          '床に座り、片足をまっすぐ前に伸ばします',
          'タオルを足の裏にかけます',
          'タオルの両端を持ち、手前にゆっくり引きます',
          'ふくらはぎに伸びを感じたら20秒キープ',
          '左右各3回ずつ行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日3回',
        caution: '膝が曲がらないように注意してください',
        illustration: 'calfStretch'
      },
      tension: {
        name: 'すね〜足首の引っ張りケア',
        target: '前脛骨筋・足底筋群',
        description: 'すねから足首が引っ張られています。足首の安定化エクササイズを行います。',
        evidence: '足底筋群の強化は扁平足・足部不安定の改善に有効（足部リハビリガイドライン）',
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
    },

    // ===== 足裏ケア（全身統合分析：外果が下がっている側） =====
    '足裏': {
      contraction: {
        name: '足裏アーチケア（ボール・芯踏み）',
        target: '足底筋膜・足底筋群・足部アーチ',
        description: '外果（くるぶし外側）が下がっている側は、足裏のアーチが崩れて重心が外側に偏っています。足裏をほぐしてアーチを回復させることで、下半身全体のバランスが改善します。',
        evidence: '足底筋膜のリリースは足部アライメント改善・姿勢制御向上に有効（足部バイオメカニクスのエビデンス）',
        steps: [
          'テニスボールまたはサランラップの芯を床に置きます',
          '下がっている側の足を乗せ、土踏まずを中心にゆっくり転がします',
          'かかと → 土踏まず → 指の付け根の順に、30秒ずつ圧をかけます',
          '痛気持ちいい程度の圧で、体重をかけすぎないように調整します',
          '合計2〜3分間、丁寧にほぐします'
        ],
        sets: '各エリア30秒 × 合計2〜3分',
        frequency: '1日2〜3回（朝・昼・夜）',
        caution: '強く踏みすぎると逆効果です。痛気持ちいい程度で行ってください。炎症がある場合は中止してください。',
        illustration: 'footRoll'
      }
    },

    // ===== 体幹ケア（基本検査：肩甲下角〜腸骨稜間の問題） =====
    '体幹': {
      contraction: {
        name: '体幹の縮こまりケア',
        target: '腰方形筋・腹斜筋・広背筋',
        description: '体幹が左右どちらかに縮こまっています。椅子に座ったまま側屈ストレッチで伸ばします。',
        evidence: '体幹側屈ストレッチは腰方形筋の柔軟性改善・腰痛予防に有効（運動療法ガイドライン）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '縮こまっている側と反対方向にゆっくり上体を倒します',
          '倒す方向の手を頭の上に伸ばし、脇腹の伸びを感じます',
          '15秒キープして3回繰り返します',
          '反対側も軽く行い、左右のバランスを整えます'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2〜3回',
        caution: '痛みが出ない範囲でゆっくり行ってください',
        illustration: 'trunkStretch'
      },
      tension: {
        name: '体幹の引っ張りケア',
        target: '多裂筋・腹横筋・骨盤底筋群',
        description: '体幹が上下に引っ張られて不安定になっています。体幹を安定させるエクササイズが効果的です。',
        evidence: '体幹安定化運動は腰痛予防・姿勢改善に高いエビデンスがある（コクランレビュー推奨）',
        steps: [
          '仰向けに寝て、両膝を立てます',
          'おへそを背骨に近づけるようにお腹を凹ませます（ドローイン）',
          'その状態を10秒キープします',
          '呼吸は止めずにゆっくり続けます',
          '10回繰り返します'
        ],
        sets: '10秒 × 10回',
        frequency: '1日2回（朝・夜）',
        caution: '息を止めないように注意してください。腰を反らさず床にしっかりつけましょう',
        illustration: 'trunkStabilize'
      }
    }
  },

  // ===== フィットネスアプリ風SVGイラスト =====
  getIllustration(key) {
    const S = '#f5c6a0'; // 肌色
    const H = '#5a3825'; // 髪色
    const T = '#6ba3d6'; // Tシャツ
    const P = '#3d3d3d'; // パンツ
    const R = '#ef4444'; // 伸びる部位
    const A = '#2563eb'; // 矢印
    const BG = '#f8fafc';

    const wrap = (inner, title, reps, vb='0 0 300 260') =>
      `<svg viewBox="${vb}" style="background:${BG};border-radius:16px;max-width:320px;width:100%;font-family:-apple-system,sans-serif">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect x="10" y="8" width="280" height="24" rx="12" fill="#e0f2fe"/>
        <text x="150" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#0369a1">${title}</text>
        ${inner}
        <rect x="40" y="232" width="220" height="24" rx="12" fill="white" stroke="#cbd5e1" stroke-width="1"/>
        <text x="150" y="248" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">${reps}</text>
      </svg>`;

    const arrow = (x1,y1,x2,y2,c=A) => {
      const a=Math.atan2(y2-y1,x2-x1),s=10;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
        <polygon points="${x2},${y2} ${x2-s*Math.cos(a-.4)},${y2-s*Math.sin(a-.4)} ${x2-s*Math.cos(a+.4)},${y2-s*Math.sin(a+.4)}" fill="${c}"/>`;
    };
    const label = (x,y,t,c='#1e293b',bg='#fff',fs=11) => {
      const w=t.length*fs*0.6+14;
      return `<rect x="${x-w/2}" y="${y-8}" width="${w}" height="16" rx="8" fill="${bg}" stroke="${c}" stroke-width="0.5" opacity="0.95"/>
        <text x="${x}" y="${y+4}" text-anchor="middle" font-size="${fs}" fill="${c}" font-weight="700">${t}</text>`;
    };
    const glow = (path,c=R) => `<path d="${path}" fill="${c}" opacity="0.3" filter="url(#glow)"/>`;

    // 椅子共通
    const chair = (cx,sy=130) => `<rect x="${cx-22}" y="${sy}" width="44" height="4" rx="2" fill="#90a4ae"/>
      <rect x="${cx+18}" y="${sy-42}" width="4" height="46" rx="2" fill="#90a4ae"/>
      <rect x="${cx-22}" y="${sy+4}" width="4" height="32" rx="2" fill="#b0bec5"/>
      <rect x="${cx+18}" y="${sy+4}" width="4" height="32" rx="2" fill="#b0bec5"/>`;

    // 座っている上半身（cx=中心X, sy=椅子座面Y）
    const sittingUpper = (cx,sy=130) => `
      <ellipse cx="${cx}" cy="${sy-70}" rx="16" ry="18" fill="${S}"/>
      <ellipse cx="${cx}" cy="${sy-84}" rx="18" ry="10" fill="${H}"/>
      <path d="M${cx-3},${sy-84} Q${cx-16},${sy-82} ${cx-18},${sy-72} L${cx-14},${sy-68}" fill="${H}"/>
      <path d="M${cx+3},${sy-84} Q${cx+16},${sy-82} ${cx+18},${sy-72} L${cx+14},${sy-68}" fill="${H}"/>
      <circle cx="${cx-5}" cy="${sy-70}" r="1.5" fill="#4a3728"/>
      <circle cx="${cx+5}" cy="${sy-70}" r="1.5" fill="#4a3728"/>
      <path d="M${cx-3},${sy-64} Q${cx},${sy-62} ${cx+3},${sy-64}" stroke="#c4956e" stroke-width="1.5" fill="none"/>
      <path d="M${cx-14},${sy-52} L${cx+14},${sy-52} L${cx+16},${sy-8} Q${cx+16},${sy} ${cx+8},${sy} L${cx-8},${sy} Q${cx-16},${sy} ${cx-16},${sy-8} Z" fill="${T}"/>
      <line x1="${cx}" y1="${sy-42}" x2="${cx}" y2="${sy-16}" stroke="#5a93c0" stroke-width="0.8" opacity="0.4"/>`;

    // 座った脚（太もも水平→膝→すね下）
    const sittingLegs = (cx,sy=130) => `
      <path d="M${cx-10},${sy} L${cx-18},${sy+32} L${cx-16},${sy+58}" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M${cx+10},${sy} L${cx+18},${sy+32} L${cx+16},${sy+58}" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <ellipse cx="${cx-16}" cy="${sy+60}" rx="10" ry="5" fill="#e8e8e8"/>
      <ellipse cx="${cx+16}" cy="${sy+60}" rx="10" ry="5" fill="#e8e8e8"/>`;

    const I = {

      // ===== 首ストレッチ =====
      neckStretch: wrap(`
        ${chair(140)}
        ${sittingUpper(140)}
        <!-- 首ハイライト -->
        ${glow('M120,64 Q126,56 134,55 L134,72 Q126,72 120,68 Z')}
        <!-- 頭を傾ける -->
        <ellipse cx="126" cy="56" rx="16" ry="18" fill="${S}" transform="rotate(-15,126,56)"/>
        <ellipse cx="126" cy="42" rx="18" ry="10" fill="${H}" transform="rotate(-15,126,42)"/>
        <!-- 右手で頭を押す -->
        <path d="M154,78 Q162,72 158,60 Q154,48 138,44" stroke="${S}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <!-- 左手はお尻の下 -->
        <path d="M126,78 Q118,90 114,110 Q112,128 120,132" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${sittingLegs(140)}
        ${arrow(162,48,140,40)}
        ${label(185,46,'押す',A,'#eff6ff')}
        ${label(88,68,'首〜肩が伸びる',R,'#fef2f2')}
        ${label(110,116,'手はお尻の下','#64748b','#f1f5f9',9)}
      `, '首〜肩ストレッチ', '20秒キープ × 3回'),

      // ===== 肩すくめ脱力 =====
      shoulderShrug: wrap(`
        ${chair(140)}
        ${sittingUpper(140)}
        <!-- 肩を上げた状態 -->
        ${glow('M108,68 Q126,58 162,68 L162,82 Q140,72 108,82 Z','#7c3aed')}
        <!-- 両腕（膝の上） -->
        <path d="M126,78 Q118,92 116,110 L118,128" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M154,78 Q162,92 164,110 L162,128" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${sittingLegs(140)}
        <!-- 上げる矢印 -->
        ${arrow(90,82,90,56)}
        ${label(72,48,'上げる!',A,'#eff6ff',13)}
        <!-- ストン矢印 -->
        ${arrow(196,56,196,82,'#ef4444')}
        ${label(214,92,'ストン!',R,'#fef2f2',13)}
        <rect x="192" y="104" width="40" height="20" rx="10" fill="#fef3c7"/>
        <text x="212" y="118" text-anchor="middle" font-size="12" fill="#d97706" font-weight="700">5秒</text>
      `, '肩すくめ→脱力', '10回 × 2セット'),

      // ===== 腕クロスストレッチ =====
      armStretch: wrap(`
        ${chair(140)}
        ${sittingUpper(140)}
        <!-- 伸ばす腕（横に伸ばしてクロス） -->
        ${glow('M156,82 Q140,80 100,78 L100,86 Q140,88 156,86 Z')}
        <path d="M156,78 Q136,76 100,78" stroke="${S}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <!-- 反対の腕で押さえる -->
        <path d="M126,78 Q120,88 116,82 L124,76" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${sittingLegs(140)}
        ${arrow(134,72,108,72)}
        ${label(86,60,'引き寄せ',A,'#eff6ff')}
        ${label(190,78,'肩の後ろ',R,'#fef2f2')}
        ${label(190,94,'が伸びる',R,'#fef2f2')}
      `, '腕クロスストレッチ', '15秒キープ × 3回'),

      // ===== 肩甲骨エクササイズ =====
      scapulaExercise: wrap(`
        ${chair(140)}
        ${sittingUpper(140)}
        <!-- 背中の肩甲骨ハイライト -->
        ${glow('M120,72 Q140,66 160,72 L160,92 Q140,86 120,92 Z','#7c3aed')}
        <!-- 両腕（前に出す） -->
        <path d="M126,78 Q114,86 112,100 L114,120" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M154,78 Q166,86 168,100 L166,120" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${sittingLegs(140)}
        <!-- 寄せる矢印 -->
        ${arrow(104,82,124,82)}
        ${arrow(176,82,156,82)}
        ${label(140,48,'胸を張る ↔ 背中を丸める','#334155','#e0f2fe',10)}
        ${label(74,82,'寄せる',A,'#dbeafe')}
        ${label(206,82,'寄せる',A,'#dbeafe')}
        ${label(140,104,'肩甲骨が動く','#7c3aed','#f5f3ff',10)}
      `, '肩甲骨エクササイズ', '各3秒 × 10回'),

      // ===== 手首ストレッチ =====
      wristStretch: wrap(`
        <!-- 腕を前に伸ばした姿（アップ表示） -->
        <path d="M30,120 Q80,116 150,112 L150,128 Q80,132 30,136 Z" fill="${T}"/>
        <path d="M150,110 Q200,108 230,106 L230,130 Q200,132 150,134 Z" fill="${S}"/>
        <!-- 手首ハイライト -->
        ${glow('M224,102 Q240,100 248,108 Q252,120 248,130 Q240,136 224,134 L224,102 Z')}
        <!-- 手（反らす） -->
        <path d="M230,106 Q244,92 254,74" stroke="${S}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M254,74 L258,64 M256,72 L264,66 M258,76 L266,72" stroke="${S}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 反対の手で引く -->
        <path d="M180,94 Q210,82 242,80" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${arrow(244,84,240,98)}
        ${label(260,56,'引く!',A,'#eff6ff',14)}
        ${label(130,100,'腕をまっすぐ前に','#64748b','#f1f5f9',10)}
        ${label(200,150,'前腕の内側が伸びる',R,'#fef2f2')}
        ${label(150,174,'表・裏 両方やる','#64748b','#f8fafc',10)}
      `, '手首ストレッチ', '各15秒 × 3回'),

      // ===== タオル握り =====
      gripExercise: wrap(`
        <!-- 腕アップ表示 -->
        <path d="M30,120 Q70,116 120,112 L120,136 Q70,140 30,144 Z" fill="${T}"/>
        <path d="M120,110 Q150,108 170,106 L170,140 Q150,142 120,142 Z" fill="${S}"/>
        <!-- タオル -->
        <ellipse cx="210" cy="120" rx="38" ry="26" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <text x="210" y="124" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">タオル</text>
        <!-- 握る手 -->
        <path d="M170,108 Q182,92 196,90 Q210,88 214,100 Q216,114 212,130 Q208,140 196,142 Q182,142 170,140 Z" fill="${S}"/>
        <path d="M188,88 Q196,80 206,82" stroke="${S}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 握る表現 -->
        <path d="M180,76 Q200,64 224,76" stroke="${A}" stroke-width="3" fill="none"/>
        <path d="M180,156 Q200,168 224,156" stroke="${A}" stroke-width="3" fill="none"/>
        ${label(202,58,'ギュッ!',A,'#eff6ff',16)}
        <rect x="50" y="180" width="80" height="22" rx="11" fill="#dbeafe"/>
        <text x="90" y="195" text-anchor="middle" font-size="11" fill="${A}" font-weight="700">❶ 握る 5秒</text>
        <rect x="160" y="180" width="80" height="22" rx="11" fill="#dcfce7"/>
        <text x="200" y="195" text-anchor="middle" font-size="11" fill="#16a34a" font-weight="700">❷ 離す 5秒</text>
      `, 'タオル握りエクササイズ', '10回 × 2セット'),

      // ===== 股関節ストレッチ =====
      hipFlexorStretch: wrap(`
        ${chair(130)}
        ${sittingUpper(130)}
        <!-- 前脚（通常） -->
        <path d="M140,130 L148,162 L146,188" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <ellipse cx="146" cy="190" rx="10" ry="5" fill="#e8e8e8"/>
        <!-- 後ろ脚（引いた状態）ハイライト -->
        ${glow('M116,126 Q108,138 100,155 Q94,170 92,180 L104,180 Q108,168 114,152 Q120,138 122,126 Z')}
        <path d="M120,130 Q110,148 100,172 L96,190" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <ellipse cx="94" cy="192" rx="10" ry="5" fill="#e8e8e8"/>
        <!-- 腕 -->
        <path d="M116,78 Q108,92 108,110 L110,126" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M144,78 Q152,92 152,110 L150,126" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${label(76,160,'足を後ろに引く','#64748b','#f1f5f9',9)}
        ${arrow(152,108,166,96)}
        ${label(192,92,'おへそを前に',A,'#eff6ff',10)}
        ${label(90,138,'股関節前面',R,'#fef2f2',10)}
        ${label(90,152,'が伸びる',R,'#fef2f2',10)}
      `, '股関節ストレッチ', '15秒 × 3回（左右）'),

      // ===== 骨盤安定（仰向け） =====
      pelvicStabilize: wrap(`
        <!-- 床 -->
        <rect x="10" y="178" width="280" height="6" rx="3" fill="#e2e8f0"/>
        <!-- 仰向けの体 -->
        <ellipse cx="52" cy="150" rx="16" ry="18" fill="${S}"/>
        <ellipse cx="52" cy="136" rx="18" ry="10" fill="${H}"/>
        <path d="M68,142 L68,160 L180,160 L180,142 Z" fill="${T}" rx="4"/>
        <!-- 腕 -->
        <path d="M88,158 L92,176" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M120,158 L124,176" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 両膝（立てる） -->
        <path d="M180,148 L208,110" stroke="${P}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M180,158 L214,118" stroke="${P}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M208,110 L204,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M214,118 L212,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <!-- クッション -->
        <ellipse cx="211" cy="114" rx="14" ry="10" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <text x="211" y="118" text-anchor="middle" font-size="9" fill="#92400e" font-weight="700">枕</text>
        <!-- 挟む矢印 -->
        ${arrow(196,98,206,108)}
        ${arrow(228,98,218,108)}
        ${label(212,84,'挟んで内ももに力!','#d97706','#fef3c7',11)}
        ${label(120,130,'仰向けに寝て膝を立てる','#64748b','#f1f5f9',9)}
      `, '骨盤安定エクササイズ', '5秒キープ × 10回'),

      // ===== ハムストリングストレッチ =====
      hamstringStretch: wrap(`
        ${chair(80)}
        <!-- 体（前傾） -->
        <ellipse cx="90" cy="58" rx="14" ry="16" fill="${S}"/>
        <ellipse cx="90" cy="46" rx="16" ry="9" fill="${H}"/>
        <path d="M76,74 L104,74 L104,128 Q104,132 96,132 L84,132 Q76,132 76,128 Z" fill="${T}"/>
        <!-- 腕 -->
        <path d="M76,82 Q68,96 68,120" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M104,82 Q112,96 112,120" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 曲げ脚 -->
        <path d="M82,132 L70,176 Q68,182 74,180" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <!-- 伸ばした脚（ハイライト） -->
        ${glow('M100,132 Q150,134 240,130 L240,140 Q150,142 100,140 Z')}
        <path d="M98,132 Q160,134 240,130" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M240,130 L248,120" stroke="${S}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <ellipse cx="250" cy="118" rx="8" ry="4" fill="#e8e8e8" transform="rotate(-20,250,118)"/>
        <!-- 前傾矢印 -->
        ${arrow(118,62,126,80)}
        ${label(148,58,'前に倒す',A,'#eff6ff')}
        ${label(256,110,'つま先↑','#d97706','#fef3c7',9)}
        ${label(178,158,'もも裏が伸びる',R,'#fef2f2')}
      `, 'もも裏ストレッチ', '20秒 × 3回（左右）'),

      // ===== 大腿四頭筋（うつ伏せ） =====
      quadStretch: wrap(`
        <!-- 床 -->
        <rect x="10" y="172" width="280" height="6" rx="3" fill="#e2e8f0"/>
        <!-- うつ伏せ体 -->
        <ellipse cx="46" cy="144" rx="14" ry="16" fill="${S}"/>
        <ellipse cx="46" cy="132" rx="16" ry="9" fill="${H}"/>
        <path d="M60,136 L60,154 L182,154 L182,136 Z" fill="${T}"/>
        <!-- 腕 -->
        <path d="M60,140 L50,126" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M62,152 L52,164" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- まっすぐ脚 -->
        <path d="M182,150 L260,152" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <!-- 曲げた脚（ハイライト） -->
        ${glow('M182,138 Q210,136 228,128 L228,100 Q224,88 218,80 L210,80 Q216,92 218,106 Q220,120 210,130 Q196,138 182,140 Z')}
        <path d="M182,138 L224,136" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M224,136 L222,96" stroke="${P}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="222" cy="92" rx="6" ry="4" fill="#e8e8e8"/>
        <!-- 手で足首を持つ -->
        <path d="M64,140 Q100,120 180,96 Q200,90 218,92" stroke="${S}" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${arrow(228,112,224,96)}
        ${label(250,84,'曲げる',A,'#eff6ff')}
        ${label(160,76,'届く人は足首を持つ','#64748b','#f1f5f9',9)}
        ${label(200,170,'太もも前面が伸びる',R,'#fef2f2',10)}
      `, '太もも前面ストレッチ', '15秒 × 3回（左右）'),

      // ===== ふくらはぎ（タオル引き） =====
      calfStretch: wrap(`
        <!-- 床に座る -->
        <ellipse cx="76" cy="62" rx="14" ry="16" fill="${S}"/>
        <ellipse cx="76" cy="50" rx="16" ry="9" fill="${H}"/>
        <path d="M62,78 L90,78 L92,130 Q92,136 84,136 L72,136 Q64,136 64,130 Z" fill="${T}"/>
        <!-- 曲げた脚 -->
        <path d="M68,136 L56,172 Q54,178 60,178" stroke="${P}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <!-- 伸ばした脚 -->
        ${glow('M88,136 Q160,132 240,128 L240,138 Q160,142 88,146 Z')}
        <path d="M86,136 Q160,132 240,128" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M240,122 L248,114" stroke="${S}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- タオル -->
        <path d="M248,120 Q258,106 254,90 Q246,72 210,60 Q170,50 130,56" stroke="#f59e0b" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="none"/>
        ${label(200,48,'タオル','#d97706','#fef3c7',10)}
        <!-- 両手で引く -->
        <path d="M62,86 L88,82 L130,60" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${arrow(140,56,116,62)}
        ${label(148,44,'手前に引く',A,'#eff6ff')}
        ${label(180,160,'ふくらはぎが伸びる',R,'#fef2f2')}
      `, 'ふくらはぎストレッチ', '20秒 × 3回（左右）'),

      // ===== 足首・足裏トレ =====
      ankleExercise: wrap(`
        ${chair(140)}
        ${sittingUpper(140)}
        <!-- 腕 -->
        <path d="M126,78 Q118,92 116,110 L118,128" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M154,78 Q162,92 164,110 L162,128" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 脚 -->
        <path d="M130,130 L122,162" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M150,130 L158,162" stroke="${P}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <!-- 足（つま先上げ）ハイライト -->
        ${glow('M108,168 Q120,160 140,164 Q146,166 140,176 Q130,180 112,178 Q106,174 108,168 Z','#f59e0b')}
        <path d="M122,164 L110,158 Q104,156 104,162 L106,172 Q108,178 114,178 L124,176" fill="${S}"/>
        <path d="M158,164 L170,158 Q176,156 176,162 L174,172 Q172,178 166,178 L156,176" fill="${S}"/>
        ${arrow(140,172,140,154,'#f59e0b')}
        ${label(140,142,'アーチを上げる!','#d97706','#fef3c7',12)}
        <!-- タオルギャザー -->
        <rect x="84" y="192" width="58" height="16" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
        <text x="113" y="203" text-anchor="middle" font-size="8" fill="#64748b" font-weight="600">タオルたぐり寄せ</text>
        ${arrow(148,200,164,200)}
      `, '足首・足裏トレーニング', '10回 + タオルギャザー10回'),

      // ===== 足裏ボールほぐし =====
      footRoll: wrap(`
        ${chair(120)}
        ${sittingUpper(120)}
        <!-- 腕 -->
        <path d="M106,78 Q98,92 96,110 L98,118" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M134,78 Q142,92 144,110 L142,118" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 後ろ脚 -->
        <path d="M110,118 L102,150 L100,178" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <ellipse cx="100" cy="180" rx="10" ry="5" fill="#e8e8e8"/>
        <!-- 前脚（ボール踏み） -->
        <path d="M130,118 L148,160" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <!-- ボール -->
        <circle cx="158" cy="174" r="12" fill="#c4f17e" stroke="#84cc16" stroke-width="2"/>
        <!-- 足 -->
        <path d="M148,162 Q152,168 156,170" stroke="${S}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- 転がす矢印 -->
        <path d="M142,190 L174,190" stroke="${A}" stroke-width="3"/>
        <polygon points="174,190 166,185 166,195" fill="${A}"/>
        ${label(158,206,'コロコロ転がす',A,'#eff6ff',11)}
        ${label(210,140,'テニスボール','#64748b','#f1f5f9',9)}
        ${label(210,156,'ラップ芯でもOK','#64748b','#f1f5f9',9)}
      `, '足裏ボールほぐし', '各30秒 × 合計2〜3分'),

      // ===== 体幹側屈 =====
      trunkStretch: wrap(`
        ${chair(130)}
        <!-- 体（側屈） -->
        <ellipse cx="116" cy="56" rx="14" ry="16" fill="${S}" transform="rotate(-12,116,56)"/>
        <ellipse cx="118" cy="44" rx="16" ry="9" fill="${H}" transform="rotate(-12,118,44)"/>
        <path d="M108,72 L138,76 L132,128 Q132,132 126,132 L116,132 Q108,132 110,126 Z" fill="${T}"/>
        <!-- 脇腹ハイライト -->
        ${glow('M104,80 Q108,76 114,78 L112,116 Q106,116 102,112 Q98,100 104,80 Z')}
        <!-- 上の腕（伸ばす） -->
        <path d="M118,76 L108,60 L92,42" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 下の腕 -->
        <path d="M112,82 Q100,98 100,120" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 脚 -->
        <path d="M116,132 L106,172 Q104,178 110,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M128,132 L138,172 Q140,178 134,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        ${arrow(158,76,128,86)}
        ${label(178,72,'横に倒す',A,'#eff6ff')}
        ${label(76,100,'脇腹が',R,'#fef2f2',11)}
        ${label(76,114,'伸びる',R,'#fef2f2',11)}
      `, '体幹側屈ストレッチ', '15秒キープ × 3回'),

      // ===== ドローイン =====
      trunkStabilize: wrap(`
        <!-- 床 -->
        <rect x="10" y="178" width="280" height="6" rx="3" fill="#e2e8f0"/>
        <!-- 仰向けの体 -->
        <ellipse cx="52" cy="150" rx="14" ry="16" fill="${S}"/>
        <ellipse cx="52" cy="136" rx="16" ry="9" fill="${H}"/>
        <path d="M66,142 L66,160 L180,160 L180,142 Z" fill="${T}" rx="4"/>
        <!-- お腹凹み表現 -->
        ${glow('M100,140 Q130,132 160,140 L160,148 Q130,140 100,148 Z','#22c55e')}
        <path d="M100,142 Q130,134 160,142" stroke="#22c55e" stroke-width="2.5" fill="none"/>
        ${arrow(130,136,130,144,'#22c55e')}
        <!-- 腕 -->
        <path d="M88,158 L92,176" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M120,158 L124,176" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- 両膝（立てる） -->
        <path d="M180,148 L208,112" stroke="${P}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M180,158 L214,118" stroke="${P}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M208,112 L204,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M214,118 L212,176" stroke="${P}" stroke-width="11" fill="none" stroke-linecap="round"/>
        ${label(130,118,'お腹を凹ます!','#166534','#dcfce7',13)}
        <text x="70" y="128" font-size="18">💨</text>
        ${label(220,100,'息は止めない','#22c55e','#f0fdf4',10)}
      `, 'ドローイン', '10秒 × 10回（朝・夜）')
    };

    return I[key] || '';
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

    // 実用的なポイントを自動生成
    const tipText = this._getTip(exercise.illustration);

    return `
    <div class="selfcare-card">
      <div class="selfcare-header">
        <h4 class="selfcare-name">${exercise.name}</h4>
        <span class="selfcare-side">${sideLabel}</span>
      </div>
      <div class="selfcare-target-label">対象：${exercise.target}</div>
      <p class="selfcare-desc">${exercise.description}</p>

      ${illustSvg ? `<div class="selfcare-illust-wrapper">${illustSvg}</div>` : ''}

      <div class="selfcare-steps-header">やり方</div>
      <ol class="selfcare-steps">
        ${exercise.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
      <div class="selfcare-meta">
        <span class="selfcare-meta-item">回数：${exercise.sets}</span>
        <span class="selfcare-meta-item">頻度：${exercise.frequency}</span>
      </div>
      ${tipText ? `<div class="selfcare-tip"><span class="tip-icon">💡</span> <strong>ポイント：</strong>${tipText}</div>` : ''}
      <div class="selfcare-caution"><span class="caution-icon">⚠️</span> ${exercise.caution}</div>
      ${exercise.evidence ? `<div class="selfcare-evidence"><span class="evidence-icon">📋</span> ${exercise.evidence}</div>` : ''}
    </div>`;
  },

  // 実用的なポイントテキスト
  _getTip(illustrationKey) {
    const tips = {
      neckStretch: '呼吸を止めずにゆっくり伸ばしましょう。お風呂上がりが効果的です。',
      shoulderShrug: '肩を上げるときは「ぎゅっ」と力を入れ、ストンと一気に脱力するのがコツです。',
      armStretch: '引き寄せる時に肩が上がらないように。胸の前で腕が水平になるイメージで。',
      scapulaExercise: '胸を張る時に腰を反らないように。肩甲骨が動く感覚を意識してください。',
      wristStretch: 'デスクワークの合間に行うと効果的です。強く引きすぎないように。',
      gripExercise: 'タオルがなければペットボトルでもOK。握る→脱力のリズムが大切です。',
      hipFlexorStretch: '椅子に浅く座るのがポイント。背中が丸まらないように注意しましょう。',
      pelvicStabilize: 'クッションがなければ丸めたバスタオルでもOK。内ももに力を入れる感覚を覚えましょう。',
      hamstringStretch: 'つま先を天井に向け、背中を丸めずに股関節から前屈しましょう。',
      quadStretch: 'うつ伏せがつらい方はベッドの端で行ってもOK。膝が痛い場合は無理せず。',
      calfStretch: 'タオルを足の裏にしっかりかけ、膝が曲がらないように伸ばしましょう。',
      ankleExercise: '足指を意識的に動かすことで足裏の筋肉が活性化します。毎日続けるのがコツです。',
      footRoll: '硬いボールよりテニスボールくらいの柔らかさがベスト。お風呂上がりにやると効果的です。',
      trunkStretch: '椅子の座面をしっかり持ち、息を吐きながらゆっくり倒しましょう。',
      trunkStabilize: 'ドローインは「おへそを背骨に近づける」イメージ。最初は手をお腹に当てて確認しましょう。'
    };
    return tips[illustrationKey] || '';
  }
};
