// ===== セルフケア提案：部位別エクササイズ＋イラスト =====
// 方針：縮こまっている箇所（収縮）を伸ばすストレッチのみ。体の前面（屈筋群）メイン。
// 伸長ケア（tension）は不要。背面を伸ばすケアもほぼ不要。

const SelfcareDatabase = {
  exercises: {
    // ===== 前面・屈筋群メイン =====
    '首前面': {
      contraction: {
        name: '首前面の収縮ケア（前頸部ストレッチ）',
        target: '胸鎖乳突筋・斜角筋・舌骨下筋群',
        description: '首の前面の筋肉が縮こまり、頭が前に出る姿勢になっています。顎を引いて首前面を伸ばします。',
        evidence: '頸部前面のストレッチは前方頭位（ストレートネック）の改善に効果的（姿勢改善エビデンス）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '顎を軽く上げ、首の前面を伸ばします',
          '片手を鎖骨の下に軽く添え、皮膚を下に引きます',
          '首前面に伸びを感じたら15秒キープ',
          'ゆっくり戻して、左右に少し傾けて各3回'
        ],
        sets: '15秒 × 3回',
        frequency: '1日3回',
        caution: '首を後ろに反らしすぎないでください。めまいが出たらすぐ中止してください。',
        illustration: 'anteriorNeckStretch'
      }
    },
    '首〜肩': {
      contraction: {
        name: '首〜肩の収縮ケア',
        target: '僧帽筋上部・肩甲挙筋',
        description: '首から肩にかけての筋肉が収縮しています。反対側に伸ばすストレッチが有効です。',
        evidence: '静的ストレッチ20〜30秒の保持で筋柔軟性が有意に改善（理学療法ガイドライン）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '収縮している側の手をお尻の下に入れます',
          '反対の手で頭を斜め前にゆっくり倒します',
          '首〜肩に伸びを感じたら20秒キープ',
          'ゆっくり戻して3回繰り返します'
        ],
        sets: '20秒 × 3回',
        frequency: '1日2〜3回',
        caution: '痛みが出たら無理をせず、心地よい伸びの範囲で行ってください',
        illustration: 'neckStretch'
      }
    },
    '胸・前肩': {
      contraction: {
        name: '胸・前肩の収縮ケア（大胸筋ストレッチ）',
        target: '大胸筋・小胸筋・前部三角筋',
        description: '胸の筋肉が縮こまり、肩が前に丸まっています。壁を使って胸を開くストレッチで姿勢を改善します。',
        evidence: '大胸筋ストレッチは巻き肩改善・胸郭可動域拡大に有効（姿勢改善エビデンス）',
        steps: [
          '壁の横に立ち、壁側の腕を90度に曲げて壁につけます',
          '壁についた腕はそのまま、体を反対側にゆっくり回します',
          '胸の前面〜肩の前に伸びを感じたら20秒キープ',
          'ゆっくり戻して3回繰り返します',
          '反対側も同様に行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2〜3回',
        caution: '肩に痛みがある場合は腕の角度を下げて行ってください',
        illustration: 'chestStretch'
      }
    },
    '肩〜腕': {
      contraction: {
        name: '肩〜腕の収縮ケア',
        target: '三角筋・上腕二頭筋',
        description: '肩から腕にかけて収縮があります。座ったまま腕を胸の前でクロスして伸ばします。',
        evidence: 'クロスボディストレッチは肩関節可動域の改善に有効（ROM改善のエビデンス）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '収縮している側の腕を胸の前にまっすぐ伸ばします',
          '反対の手で肘あたりを持ち、胸に引き寄せます',
          '肩の後ろに伸びを感じたら15秒キープ',
          'ゆっくり戻して3回繰り返します'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2回',
        caution: '肩に痛みがある場合は引き寄せる力を弱めてください',
        illustration: 'armStretch'
      }
    },
    '前腕〜手首': {
      contraction: {
        name: '前腕〜手首の収縮ケア（指開きストレッチ）',
        target: '前腕屈筋群・手内在筋・指屈筋',
        description: '前腕から手首にかけて屈筋群が収縮しています。指を大きく開いて前腕内側を伸ばすストレッチが効果的です。',
        evidence: '手指伸展ストレッチは前腕屈筋群の柔軟性改善・腱鞘炎予防に効果的（職業性疾患予防ガイドライン）',
        steps: [
          '腕をまっすぐ前に伸ばし、手のひらを正面に向けます',
          '5本の指を思いっきり大きく開きます（パーの形）',
          'そのまま10秒キープし、前腕内側の伸びを感じます',
          '次に反対の手で指先を手前に引き、さらに前腕を伸ばして15秒キープ',
          '左右各3回ずつ繰り返します'
        ],
        sets: '指開き10秒 + 手首反らし15秒 × 3回（左右）',
        frequency: '1日3回（デスクワークの合間に）',
        caution: '手首を強く反らしすぎないようにしてください。指を開く時に力みすぎないこと。',
        illustration: 'wristStretch'
      }
    },
    '腹部前面': {
      contraction: {
        name: '腹部前面の収縮ケア（コブラストレッチ）',
        target: '腹直筋・腸腰筋上部',
        description: '腹部の筋肉が縮こまり、上体が前かがみになっています。うつ伏せから上体を起こすストレッチで腹部前面を伸ばします。',
        evidence: 'コブラストレッチ（脊柱伸展運動）は腹筋群の柔軟性改善・腰痛軽減に有効（マッケンジー法エビデンス）',
        steps: [
          'うつ伏せに寝て、両手を肩の横に置きます',
          '両手で床を押しながら、上体をゆっくり起こします',
          '腰ではなくお腹の前面が伸びる感覚を意識します',
          '心地よい伸びを感じたら15秒キープ',
          'ゆっくり戻して3回繰り返します'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2〜3回',
        caution: '腰に痛みが出る場合は上体を起こす角度を浅くしてください。肘をつけた状態（スフィンクス）から始めるのも有効です。',
        illustration: 'cobraStretch'
      }
    },
    '体幹': {
      contraction: {
        name: '体幹の収縮ケア',
        target: '腰方形筋・腹斜筋・広背筋',
        description: '体幹が左右どちらかに収縮しています。椅子に座ったまま側屈ストレッチで伸ばします。',
        evidence: '体幹側屈ストレッチは腰方形筋の柔軟性改善・腰痛予防に有効（運動療法ガイドライン）',
        steps: [
          '椅子に座り、背筋を伸ばします',
          '収縮している側と反対方向にゆっくり上体を倒します',
          '倒す方向の手を頭の上に伸ばし、脇腹の伸びを感じます',
          '15秒キープして3回繰り返します',
          '反対側も軽く行い、左右のバランスを整えます'
        ],
        sets: '15秒 × 3回',
        frequency: '1日2〜3回',
        caution: '痛みが出ない範囲でゆっくり行ってください',
        illustration: 'trunkStretch'
      }
    },
    '股関節〜太もも': {
      contraction: {
        name: '股関節〜太ももの収縮ケア（膝立ち腸腰筋ストレッチ）',
        target: '腸腰筋・大腿直筋・大腿筋膜張筋',
        description: '股関節前面の筋肉（腸腰筋）が縮こまり、骨盤が前傾しています。膝立ちランジの姿勢で股関節前面を確実に伸ばします。',
        evidence: '膝立ち腸腰筋ストレッチは座位ストレッチより有意に股関節伸展可動域を改善（理学療法エビデンス）',
        steps: [
          '片膝を床につき、反対の足を前に出して膝を90度に曲げます（ランジの姿勢）',
          '後ろ足側の膝の下にタオルを敷くと楽です',
          '背筋をまっすぐ伸ばし、お腹に軽く力を入れます',
          'そのまま体を前にスライドさせ、後ろ足の股関節前面に伸びを感じます',
          '20秒キープし、ゆっくり戻して左右各3回ずつ行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2回',
        caution: '腰を反らさないよう、お腹に力を入れたまま行ってください。膝が痛い場合はタオルを敷いてください。',
        illustration: 'hipFlexorStretch'
      }
    },
    '内もも': {
      contraction: {
        name: '内ももの収縮ケア（片足ずつ内転筋ストレッチ）',
        target: '内転筋群・薄筋',
        description: '内ももの筋肉が縮こまり、股関節の外への動きが制限されています。片足ずつ横に伸ばして内ももをストレッチします。',
        evidence: '内転筋ストレッチは鼠径部痛予防・股関節可動域改善に効果的（スポーツ医学エビデンス）',
        steps: [
          '立った状態で、片足を横に大きく一歩踏み出します',
          '踏み出した足の膝を軽く曲げ、反対の足はまっすぐ伸ばします',
          'まっすぐ伸ばした側の内ももに伸びを感じたら20秒キープ',
          'ゆっくり戻して3回繰り返します',
          '反対側も同様に行います（左右各3回）'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2回',
        caution: '膝が内側に入らないよう、つま先と膝を同じ方向に向けてください。バランスが取りにくい場合は壁や椅子に手を添えてください。',
        illustration: 'adductorStretch'
      }
    },
    '臀部': {
      contraction: {
        name: '臀部の収縮ケア（梨状筋ストレッチ）',
        target: '大殿筋・梨状筋・深層外旋六筋',
        description: 'お尻の筋肉が縮こまり、股関節の動きが制限されています。座ったまま足を組んでお尻を伸ばします。',
        evidence: '梨状筋ストレッチは坐骨神経痛の軽減・股関節可動域改善に有効（理学療法エビデンス）',
        steps: [
          '椅子に座り、片方の足首を反対の膝の上に乗せます（4の字）',
          '背筋を伸ばしたまま、上体をゆっくり前に倒します',
          'お尻の奥に伸びを感じたら20秒キープ',
          'ゆっくり戻して3回繰り返します',
          '反対側も同様に行います'
        ],
        sets: '20秒 × 3回（左右）',
        frequency: '1日2〜3回',
        caution: '膝に痛みがある場合は足を乗せる角度を調整してください',
        illustration: 'gluteStretch'
      }
    },
    '太もも〜膝': {
      contraction: {
        name: '太もも前面の収縮ケア（大腿四頭筋ストレッチ）',
        target: '大腿四頭筋・大腿直筋',
        description: '太もも前面の筋肉が縮こまっています。うつ伏せで太もも前面を伸ばします。',
        evidence: '大腿四頭筋ストレッチは膝関節の柔軟性改善・膝痛予防に効果的（スポーツ医学エビデンス）',
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
        name: 'すね前面の収縮ケア（前脛骨筋ストレッチ）',
        target: '前脛骨筋・長趾伸筋',
        description: 'すね前面の筋肉が縮こまっています。足首を伸ばしてすね前面をストレッチします。',
        evidence: '前脛骨筋ストレッチは足関節可動域改善・シンスプリント予防に有効（スポーツ医学エビデンス）',
        steps: [
          '椅子に座り、片足のつま先を後ろに引いて足の甲を床につけます',
          'ゆっくり体重をかけて、すねの前面を伸ばします',
          '心地よい伸びを感じたら15秒キープ',
          'ゆっくり戻して3回繰り返します',
          '反対側も同様に行います'
        ],
        sets: '15秒 × 3回（左右）',
        frequency: '1日2〜3回',
        caution: '足首を強くひねらないように注意してください',
        illustration: 'ankleExercise'
      }
    },

    // ===== 足裏ケア =====
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
    }
  },

  // ===== AI生成イラスト（性別対応） =====
  getIllustration(key, gender) {
    const imageMap = {
      neckStretch: 'neck_stretch.png',
      armStretch: 'arm_stretch.png',
      wristStretch: 'wrist_stretch.png',
      hipFlexorStretch: 'hip_flexor.png',
      quadStretch: 'quad_stretch.png',
      ankleExercise: 'ankle_exercise.png',
      footRoll: 'foot_roll.png',
      trunkStretch: 'trunk_stretch.png',
      chestStretch: 'chest_stretch.png',
      cobraStretch: 'cobra_stretch.png',
      gluteStretch: 'glute_stretch.png',
      adductorStretch: 'adductor_stretch.png',
      anteriorNeckStretch: 'anterior_neck_stretch.png'
    };
    const file = imageMap[key];
    if (!file) return '';
    const folder = (gender === 'male') ? 'male' : 'female';
    return `<img src="img/selfcare-ai/${folder}/${file}" alt="${key}" style="width:100%;max-width:400px;border-radius:14px;">`;
  },

  // ===== カスタム項目キャッシュ =====
  _customItems: [],

  async loadCustomItems(clinicId) {
    if (!clinicId || typeof SupabaseAuth === 'undefined') return;
    try {
      const { data, error } = await SupabaseAuth.client
        .from('custom_selfcare_items')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('is_active', true)
        .order('sort_order');
      if (!error && data) this._customItems = data;
    } catch (e) {
      console.error('カスタムセルフケア読み込みエラー:', e);
    }
  },

  async saveCustomItem(clinicId, item) {
    const { data, error } = await SupabaseAuth.client
      .from('custom_selfcare_items')
      .insert({ ...item, clinic_id: clinicId, created_by: SupabaseAuth.getUserId() })
      .select()
      .single();
    if (error) throw error;
    await this.loadCustomItems(clinicId);
    return data;
  },

  async updateCustomItem(id, updates) {
    const { error } = await SupabaseAuth.client
      .from('custom_selfcare_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await this.loadCustomItems(SupabaseAuth.getClinicId());
  },

  async deleteCustomItem(id) {
    const { error } = await SupabaseAuth.client
      .from('custom_selfcare_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await this.loadCustomItems(SupabaseAuth.getClinicId());
  },

  // ===== 問題箇所からセルフケアを取得（プリセット＋カスタム配列） =====
  getSelfcareForArea(areaShort, issueType) {
    const results = [];
    // 収縮ケアのみ対応（伸長ケアは不要）
    const type = 'contraction';

    // プリセット
    const areaData = this.exercises[areaShort];
    if (areaData && areaData[type]) {
      results.push({ ...areaData[type], _source: 'preset' });
    }

    // カスタム項目
    const customs = this._customItems.filter(
      item => item.area_key === areaShort && item.issue_type === type
    );
    for (const c of customs) {
      results.push({
        name: c.name, target: c.target, description: c.description,
        steps: Array.isArray(c.steps) ? c.steps : JSON.parse(c.steps || '[]'),
        sets: c.sets, frequency: c.frequency,
        caution: c.caution || '', evidence: c.evidence || '',
        illustration: c.illustration || null,
        _source: 'custom', _id: c.id
      });
    }

    return results;
  },

  // ===== セルフケアカードHTML生成 =====
  renderSelfcareCard(exercise, side, gender) {
    const sideLabel = side === 'both' ? '両側' : side === 'right' ? '右側' : '左側';

    let illustHtml = '';
    if (exercise.illustration && exercise.illustration.startsWith('http')) {
      illustHtml = `<img src="${exercise.illustration}" alt="${exercise.name}" style="width:100%;max-width:400px;border-radius:14px;">`;
    } else {
      illustHtml = this.getIllustration(exercise.illustration, gender);
    }

    const tipText = this._getTip(exercise.illustration);

    return `
    <div class="selfcare-card">
      <div class="selfcare-header">
        <h4 class="selfcare-name">${exercise.name}</h4>
        <span class="selfcare-side">${sideLabel}</span>
      </div>
      <div class="selfcare-target-label">対象：${exercise.target}</div>
      <p class="selfcare-desc">${exercise.description}</p>

      ${illustHtml ? `<div class="selfcare-illust-wrapper">${illustHtml}</div>` : ''}

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
      anteriorNeckStretch: '鎖骨の下に手を添えることで、皮膚と筋膜も一緒に伸ばせます。',
      neckStretch: '呼吸を止めずにゆっくり伸ばしましょう。お風呂上がりが効果的です。',
      chestStretch: '壁についた腕の肘は90度。体を回す時に肩が上がらないように注意しましょう。',
      armStretch: '引き寄せる時に肩が上がらないように。胸の前で腕が水平になるイメージで。',
      wristStretch: 'デスクワークの合間に行うと効果的です。強く引きすぎないように。',
      cobraStretch: '腕の力で押し上げるのではなく、背中の筋肉で起き上がるイメージで。お風呂上がりが効果的です。',
      trunkStretch: '椅子の座面をしっかり持ち、息を吐きながらゆっくり倒しましょう。',
      hipFlexorStretch: '後ろ足の膝を床につけた時、骨盤を正面に向けるのがポイント。お腹に力を入れると腸腰筋がしっかり伸びます。',
      adductorStretch: '伸ばす側の足はまっすぐに。踏み出した側の膝がつま先より前に出ないよう注意しましょう。',
      gluteStretch: '足を組んだ時に骨盤が後ろに倒れないよう、背筋を伸ばして行うのがポイントです。',
      quadStretch: 'うつ伏せがつらい方はベッドの端で行ってもOK。膝が痛い場合は無理せず。',
      ankleExercise: '足の甲を床につける時はゆっくりと。痛みがあれば角度を調整してください。',
      footRoll: '硬いボールよりテニスボールくらいの柔らかさがベスト。お風呂上がりにやると効果的です。'
    };
    return tips[illustrationKey] || '';
  }
};
