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

  // ===== イラスト＋注釈オーバーレイ =====
  getIllustration(key) {
    const data = this._illustData()[key];
    if (!data) return '';

    const W = 300, H = 300;
    // ハイライト円
    const circles = (data.highlights || []).map(h =>
      `<circle cx="${h.x}" cy="${h.y}" r="${h.r||30}" fill="${h.color||'#ef4444'}" opacity="0.18"/>
       <circle cx="${h.x}" cy="${h.y}" r="${h.r||30}" fill="none" stroke="${h.color||'#ef4444'}" stroke-width="2.5" stroke-dasharray="6,3" opacity="0.7"/>`
    ).join('');
    // 矢印
    const arrows = (data.arrows || []).map(a => {
      const ang = Math.atan2(a.y2-a.y1, a.x2-a.x1), s=10, c=a.color||'#2563eb';
      return `<line x1="${a.x1}" y1="${a.y1}" x2="${a.x2}" y2="${a.y2}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
              <polygon points="${a.x2},${a.y2} ${a.x2-s*Math.cos(ang-.4)},${a.y2-s*Math.sin(ang-.4)} ${a.x2-s*Math.cos(ang+.4)},${a.y2-s*Math.sin(ang+.4)}" fill="${c}"/>`;
    }).join('');
    // テキストラベル
    const labels = (data.labels || []).map(l => {
      const bg = l.bg || '#ffffff';
      const c = l.color || '#1e293b';
      const fs = l.size || 13;
      const tw = l.text.length * fs * 0.6 + 16;
      return `<rect x="${l.x - tw/2}" y="${l.y - fs/2 - 4}" width="${tw}" height="${fs + 8}" rx="${(fs+8)/2}" fill="${bg}" opacity="0.92" stroke="${c}" stroke-width="0.5"/>
              <text x="${l.x}" y="${l.y + fs/2 - 1}" text-anchor="middle" font-size="${fs}" fill="${c}" font-weight="700">${l.text}</text>`;
    }).join('');
    // 回数バッジ
    const badge = data.badge ? `<rect x="20" y="${H-32}" width="${W-40}" height="26" rx="13" fill="#f0f9ff" stroke="#93c5fd" stroke-width="1"/>
      <text x="${W/2}" y="${H-15}" text-anchor="middle" font-size="12" fill="#1d4ed8" font-weight="600">${data.badge}</text>` : '';

    return `<div style="position:relative;max-width:${W}px;margin:0 auto">
      <img src="img/selfcare/${data.img}" alt="${key}" style="width:100%;height:auto;display:block;border-radius:14px">
      <svg viewBox="0 0 ${W} ${H}" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">
        ${circles}${arrows}${labels}${badge}
      </svg>
    </div>`;
  },

  _illustData() {
    return {
      neckStretch: {
        img: 'neck_stretch.png',
        highlights: [
          { x:130, y:80, r:35, color:'#ef4444' }
        ],
        arrows: [
          { x1:170, y1:50, x2:130, y2:40, color:'#2563eb' }
        ],
        labels: [
          { x:130, y:120, text:'首〜肩が伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:200, y:50, text:'押す', color:'#2563eb', bg:'#eff6ff' }
        ],
        badge: '20秒キープ × 3回'
      },
      shoulderShrug: {
        img: 'shoulder_rotate.png',
        highlights: [
          { x:120, y:90, r:32, color:'#7c3aed' },
          { x:180, y:90, r:32, color:'#7c3aed' }
        ],
        arrows: [
          { x1:120, y1:120, x2:120, y2:70, color:'#2563eb' },
          { x1:120, y1:70, x2:120, y2:120, color:'#ef4444' }
        ],
        labels: [
          { x:60, y:70, text:'上げる!', color:'#2563eb', bg:'#eff6ff' },
          { x:60, y:120, text:'ストン!', color:'#dc2626', bg:'#fef2f2' },
          { x:240, y:90, text:'5秒', color:'#d97706', bg:'#fef3c7', size:16 }
        ],
        badge: '10回 × 2セット'
      },
      armStretch: {
        img: 'shoulder_back.png',
        highlights: [
          { x:150, y:100, r:40, color:'#ef4444' }
        ],
        arrows: [
          { x1:200, y1:130, x2:150, y2:120, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:155, text:'肩の後ろが伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:230, y:120, text:'引き寄せ', color:'#2563eb', bg:'#eff6ff' }
        ],
        badge: '15秒キープ × 3回'
      },
      scapulaExercise: {
        img: 'shoulder_front.png',
        highlights: [
          { x:120, y:110, r:28, color:'#7c3aed' },
          { x:180, y:110, r:28, color:'#7c3aed' }
        ],
        arrows: [
          { x1:100, y1:110, x2:135, y2:110, color:'#2563eb' },
          { x1:200, y1:110, x2:165, y2:110, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:70, text:'胸を張る↔背中を丸める', color:'#1e293b', bg:'#f0fdf4', size:11 },
          { x:150, y:155, text:'肩甲骨を意識', color:'#7c3aed', bg:'#f5f3ff' }
        ],
        badge: '各3秒 × 10回'
      },
      wristStretch: {
        img: 'wrist_stretch.png',
        highlights: [
          { x:150, y:130, r:35, color:'#ef4444' }
        ],
        arrows: [
          { x1:170, y1:100, x2:150, y2:80, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:170, text:'前腕が伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:200, y:70, text:'手前に引く', color:'#2563eb', bg:'#eff6ff' },
          { x:150, y:250, text:'表・裏 両方やる', color:'#64748b', bg:'#f8fafc', size:11 }
        ],
        badge: '各15秒 × 3回'
      },
      gripExercise: {
        img: 'grip_test.png',
        highlights: [
          { x:150, y:140, r:35, color:'#2563eb' }
        ],
        arrows: [],
        labels: [
          { x:150, y:60, text:'ギュッと握る!', color:'#2563eb', bg:'#eff6ff', size:16 },
          { x:80, y:240, text:'❶握る5秒', color:'#2563eb', bg:'#dbeafe', size:12 },
          { x:220, y:240, text:'❷離す5秒', color:'#16a34a', bg:'#dcfce7', size:12 }
        ],
        badge: '10回 × 2セット'
      },
      hipFlexorStretch: {
        img: 'leg_stretch.png',
        highlights: [
          { x:140, y:130, r:38, color:'#ef4444' }
        ],
        arrows: [
          { x1:180, y1:160, x2:200, y2:130, color:'#2563eb' }
        ],
        labels: [
          { x:140, y:175, text:'股関節の前面が伸びる', color:'#dc2626', bg:'#fef2f2', size:11 },
          { x:230, y:120, text:'おへそを前に', color:'#2563eb', bg:'#eff6ff', size:11 }
        ],
        badge: '15秒 × 3回（左右）'
      },
      pelvicStabilize: {
        img: 'fukkin_woman.png',
        highlights: [
          { x:150, y:150, r:32, color:'#f59e0b' }
        ],
        arrows: [
          { x1:120, y1:130, x2:140, y2:145, color:'#2563eb' },
          { x1:180, y1:130, x2:160, y2:145, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:100, text:'膝にクッションを挟む', color:'#d97706', bg:'#fef3c7' },
          { x:150, y:195, text:'内ももに力を入れる', color:'#2563eb', bg:'#eff6ff', size:12 }
        ],
        badge: '5秒キープ × 10回'
      },
      hamstringStretch: {
        img: 'hamstring.png',
        highlights: [
          { x:150, y:150, r:40, color:'#ef4444' }
        ],
        arrows: [
          { x1:150, y1:80, x2:150, y2:110, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:195, text:'もも裏が伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:220, y:80, text:'前に倒す', color:'#2563eb', bg:'#eff6ff' }
        ],
        badge: '20秒 × 3回（左右）'
      },
      quadStretch: {
        img: 'yoga_cobra.png',
        highlights: [
          { x:150, y:130, r:40, color:'#ef4444' }
        ],
        arrows: [
          { x1:200, y1:160, x2:200, y2:120, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:80, text:'太もも前面が伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:230, y:100, text:'膝を曲げる', color:'#2563eb', bg:'#eff6ff', size:12 }
        ],
        badge: '15秒 × 3回（左右）'
      },
      calfStretch: {
        img: 'achilles.png',
        highlights: [
          { x:130, y:180, r:35, color:'#ef4444' }
        ],
        arrows: [
          { x1:130, y1:140, x2:130, y2:170, color:'#ef4444' }
        ],
        labels: [
          { x:130, y:225, text:'ふくらはぎが伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:220, y:130, text:'タオルで引く', color:'#2563eb', bg:'#eff6ff', size:12 }
        ],
        badge: '20秒 × 3回（左右）'
      },
      ankleExercise: {
        img: 'toe_stand.png',
        highlights: [
          { x:150, y:200, r:35, color:'#f59e0b' }
        ],
        arrows: [
          { x1:150, y1:200, x2:150, y2:160, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:245, text:'足裏のアーチを上げる', color:'#d97706', bg:'#fef3c7', size:12 },
          { x:150, y:100, text:'つま先立ち+タオルギャザー', color:'#1e293b', bg:'#f0f9ff', size:11 }
        ],
        badge: '10回 + タオルギャザー10回'
      },
      footRoll: {
        img: 'foam_roller.png',
        highlights: [
          { x:150, y:180, r:35, color:'#84cc16' }
        ],
        arrows: [
          { x1:110, y1:200, x2:190, y2:200, color:'#2563eb' }
        ],
        labels: [
          { x:150, y:80, text:'足裏をコロコロ', color:'#1e293b', bg:'#f0fdf4', size:14 },
          { x:150, y:240, text:'痛気持ちいい程度で', color:'#64748b', bg:'#f8fafc', size:11 }
        ],
        badge: '各30秒 × 合計2〜3分'
      },
      trunkStretch: {
        img: 'taisou_woman.png',
        highlights: [
          { x:120, y:130, r:35, color:'#ef4444' }
        ],
        arrows: [
          { x1:180, y1:100, x2:140, y2:110, color:'#2563eb' }
        ],
        labels: [
          { x:120, y:175, text:'脇腹が伸びる', color:'#dc2626', bg:'#fef2f2' },
          { x:220, y:90, text:'横に倒す', color:'#2563eb', bg:'#eff6ff' }
        ],
        badge: '15秒キープ × 3回'
      },
      trunkStabilize: {
        img: 'fukkin_woman.png',
        highlights: [
          { x:150, y:140, r:35, color:'#22c55e' }
        ],
        arrows: [
          { x1:150, y1:140, x2:150, y2:115, color:'#22c55e' }
        ],
        labels: [
          { x:150, y:80, text:'お腹を凹ます（ドローイン）', color:'#1e293b', bg:'#dcfce7', size:12 },
          { x:150, y:200, text:'息は止めずにゆっくり', color:'#22c55e', bg:'#f0fdf4', size:12 }
        ],
        badge: '10秒 × 10回（朝・夜）'
      }
    };
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
