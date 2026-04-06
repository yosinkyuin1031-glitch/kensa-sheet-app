// ===== 検査ロジック：段階的原因特定システム =====

const InspectionLogic = {
  // ランドマーク定義
  landmarks: {
    mastoid: { name: '乳様突起', simpleName: '首の後ろ', description: '耳の後ろの骨の突起' },
    scapulaInferior: { name: '肩甲下角', simpleName: '肩甲骨の下', description: '肩甲骨の下端' },
    iliacCrest: { name: '腸骨稜', simpleName: '骨盤の外側', description: '骨盤の上端' }
  },

  // ポジション定義
  positions: {
    standing: { name: '立位', icon: '🧍' },
    seated: { name: '座位', icon: '🪑' },
    upperBody: { name: '上半身検査', icon: '💪' }
  },

  // 値のラベル
  valueLabels: {
    '-1': '左が高い',
    '0': '同じ高さ',
    '1': '右が高い'
  },

  // ===== 第1段階：立位 vs 座位の比較（足の影響判定） =====
  compareStandingSeated(standing, seated) {
    const changes = [];
    let hasChange = false;

    for (const [landmark, config] of Object.entries(this.landmarks)) {
      const standVal = standing[landmark] || 0;
      const seatVal = seated[landmark] || 0;
      const changed = standVal !== seatVal;

      if (changed) hasChange = true;

      changes.push({
        landmark,
        name: config.name,
        standing: standVal,
        seated: seatVal,
        changed
      });
    }

    return {
      hasFootInfluence: hasChange,
      changes
    };
  },

  // ===== 第2段階：座位 vs 上半身検査の比較 =====
  compareSeatedUpperBody(seated, upperBody) {
    const changes = [];
    let allNormalized = true;
    let hasChange = false;

    for (const [landmark, config] of Object.entries(this.landmarks)) {
      const seatVal = seated[landmark] || 0;
      const ubVal = upperBody[landmark] || 0;
      const changed = seatVal !== ubVal;

      if (changed) hasChange = true;
      if (ubVal !== 0) allNormalized = false;

      changes.push({
        landmark,
        name: config.name,
        seated: seatVal,
        upperBody: ubVal,
        changed
      });
    }

    return {
      hasUpperBodyInfluence: hasChange,
      allNormalized,
      changes
    };
  },

  // ===== 第3段階：パターン分析（全乱 vs 互い違い） =====
  analyzePattern(data) {
    const values = [
      data.mastoid || 0,
      data.scapulaInferior || 0,
      data.iliacCrest || 0
    ];

    const nonZero = values.filter(v => v !== 0);
    if (nonZero.length === 0) {
      return { pattern: 'normal', description: '全てのランドマークが正常' };
    }

    const positives = nonZero.filter(v => v > 0).length;
    const negatives = nonZero.filter(v => v < 0).length;

    if (positives > 0 && negatives === 0) {
      return {
        pattern: 'zenran',
        direction: 'right',
        description: '全乱（右側が全体的に高い）',
        detail: '全てのランドマークが同じ方向に偏位しています。頭蓋骨や骨盤の影響が考えられます。'
      };
    }

    if (negatives > 0 && positives === 0) {
      return {
        pattern: 'zenran',
        direction: 'left',
        description: '全乱（左側が全体的に高い）',
        detail: '全てのランドマークが同じ方向に偏位しています。頭蓋骨や骨盤の影響が考えられます。'
      };
    }

    return {
      pattern: 'taigaichigai',
      description: '互い違いの歪み',
      detail: 'ランドマークが互い違いに偏位しています。背骨そのものの影響が考えられます。'
    };
  },

  // ===== 総合診断 =====
  diagnose(examData) {
    const { standing, seated, upperBody } = examData;
    const result = {
      examData,
      steps: [],
      primaryCause: null,
      pattern: null,
      treatmentArea: null,
      summary: ''
    };

    result.steps.push({
      step: 1,
      name: '立位検査',
      data: standing,
      finding: this.describeLandmarks(standing)
    });

    const footAnalysis = this.compareStandingSeated(standing, seated);
    result.steps.push({
      step: 2,
      name: '座位検査',
      data: seated,
      finding: this.describeLandmarks(seated),
      comparison: footAnalysis
    });

    if (footAnalysis.hasFootInfluence) {
      result.primaryCause = 'foot';
      result.treatmentArea = '足部';
      result.summary = '立位と座位で左右差に変化があるため、足の接地による影響が考えられます。足部の治療を優先的に検討してください。';
      result.pattern = this.analyzePattern(standing);
    } else {
      const upperAnalysis = this.compareSeatedUpperBody(seated, upperBody);
      result.steps.push({
        step: 3,
        name: '上半身検査',
        data: upperBody,
        finding: this.describeLandmarks(upperBody),
        comparison: upperAnalysis
      });

      if (upperAnalysis.hasUpperBodyInfluence) {
        result.primaryCause = 'upperBody';
        result.treatmentArea = '上半身（肩・上肢）';
        result.summary = '上半身のポジションを変えることで左右差に変化があるため、上半身の影響が大きいと考えられます。';
        result.pattern = this.analyzePattern(seated);
      } else {
        const patternResult = this.analyzePattern(seated);
        result.pattern = patternResult;

        if (patternResult.pattern === 'zenran') {
          result.primaryCause = 'cranialPelvic';
          result.treatmentArea = '頭蓋骨・骨盤';
          result.summary = `どの体勢でも同じ方向の歪み（全乱）が見られます。${patternResult.detail}`;
        } else if (patternResult.pattern === 'taigaichigai') {
          result.primaryCause = 'spine';
          result.treatmentArea = '背骨（脊柱）';
          result.summary = `どの体勢でも互い違いの歪みが見られます。${patternResult.detail}`;
        } else {
          result.primaryCause = 'none';
          result.treatmentArea = 'なし';
          result.summary = '特に顕著な歪みは見られません。';
        }
      }
    }

    return result;
  },

  describeLandmarks(data) {
    const descriptions = [];
    for (const [landmark, config] of Object.entries(this.landmarks)) {
      const val = data[landmark] || 0;
      if (val === 0) {
        descriptions.push(`${config.name}：左右対称`);
      } else if (val < 0) {
        descriptions.push(`${config.name}：左が高い`);
      } else {
        descriptions.push(`${config.name}：右が高い`);
      }
    }
    return descriptions;
  },

  causeLabels: {
    foot: { label: '足部（下半身）の影響', icon: '🦶', color: '#f59e0b' },
    upperBody: { label: '上半身の影響', icon: '💪', color: '#3b82f6' },
    cranialPelvic: { label: '頭蓋骨・骨盤の影響（全乱）', icon: '🦴', color: '#ef4444' },
    spine: { label: '背骨の影響（互い違い）', icon: '🔩', color: '#8b5cf6' },
    none: { label: '顕著な歪みなし', icon: '✅', color: '#22c55e' }
  },

  // ===== 第2段階：詳細検査ランドマーク =====

  upperDetailLandmarks: [
    { key: 'acromion', name: '肩峰', simpleName: '肩の先端', area: '肩〜肘', areaShort: '肩〜腕' },
    { key: 'mastoidDetail', name: '肘頭', simpleName: '肘の先', area: '肘〜手首', areaShort: '前腕〜手首' },
    { key: 'radialStyloid', name: '橈骨茎状突起', simpleName: '手首の外側', area: '前腕〜手首', areaShort: '前腕〜手首' }
  ],

  lowerDetailLandmarks: [
    { key: 'greaterTrochanter', name: '大転子', simpleName: '太ももの付け根', area: '骨盤〜大腿', areaShort: '股関節〜太もも' },
    { key: 'patellaUpper', name: '膝蓋骨上端', simpleName: '膝のお皿の上', area: '大腿〜膝', areaShort: '太もも〜膝' },
    { key: 'lateralMalleolus', name: '外果', simpleName: '足首の外側', area: '膝〜足首', areaShort: 'すね〜足首' }
  ],

  // ===== 詳細検査用ラベル（患者向け） =====
  getPatientFriendlyCauseLabel(cause) {
    const labels = {
      foot: '足元のバランスが原因です',
      upperBody: '上半身のバランスが原因です',
      cranialPelvic: '身体全体のバランスの乱れ',
      spine: '背骨まわりのバランスの乱れ',
      none: '大きな歪みは見られません'
    };
    return labels[cause] || '';
  },

  // ===== 収縮＋伸長分析（拡張版） =====
  //
  // 収縮（Contraction）:
  //   隣り合うランドマークが互いに近づく方向 → その間が縮んでいる
  //   右側: 上が右下(-1) かつ 下が右上(1)
  //   左側: 上が左下(1) かつ 下が左上(-1)
  //
  // 伸長（Tension）:
  //   隣り合うランドマークが互いに離れる方向 → その間が伸長している
  //   右側: 上が右上(1) かつ 下が右下(-1)
  //   左側: 上が左上(-1) かつ 下が左下(1)
  //
  // どちらも「悪さをしている箇所」として報告

  analyzeContraction(landmarkDefs, data) {
    const results = {
      landmarks: [],
      contractions: [],   // 収縮箇所
      tensions: [],       // 伸長箇所
      problemAreas: []    // 統合された問題箇所
    };

    // 各ランドマークの状態を記録
    for (const lm of landmarkDefs) {
      const val = data[lm.key];
      results.landmarks.push({
        key: lm.key,
        name: lm.name,
        area: lm.area,
        areaShort: lm.areaShort || lm.area,
        value: val || 0,
        rightSide: val === 1 ? 'up' : (val === -1 ? 'down' : 'even'),
        leftSide: val === -1 ? 'up' : (val === 1 ? 'down' : 'even')
      });
    }

    // 隣り合うランドマーク間の分析
    for (let i = 0; i < results.landmarks.length - 1; i++) {
      const upper = results.landmarks[i];
      const lower = results.landmarks[i + 1];
      const betweenArea = `${upper.name}〜${lower.name}`;

      // --- 収縮検出 ---
      // 右側: 上が右下(-1) かつ 下が右上(1) → 右が収縮
      const rightContracted = (upper.value === -1 && lower.value === 1);
      // 左側: 上が左下(1) かつ 下が左上(-1) → 左が収縮
      const leftContracted = (upper.value === 1 && lower.value === -1);

      if (rightContracted || leftContracted) {
        results.contractions.push({
          upperLandmark: upper.name,
          lowerLandmark: lower.name,
          area: betweenArea,
          areaShort: upper.areaShort || upper.area,
          side: rightContracted && leftContracted ? 'both' :
                rightContracted ? 'right' : 'left',
          index: i,
          type: 'contraction'
        });
      }

      // --- 伸長検出 ---
      // 右側: 上が右上(1) かつ 下が右下(-1) → 右が伸長
      const rightTensioned = (upper.value === 1 && lower.value === -1);
      // 左側: 上が左上(-1) かつ 下が左下(1) → 左が伸長
      const leftTensioned = (upper.value === -1 && lower.value === 1);

      if (rightTensioned || leftTensioned) {
        // 収縮と同じインデックスの場合、反対側なので別エントリ
        // ただし contraction で rightContracted かつ leftTensioned の場合は
        // 右が収縮＋左が伸長 → これは同じ現象の表裏
        // 重複しないよう、伸長側のみ記録
        const tensionSide = rightTensioned && leftTensioned ? 'both' :
                            rightTensioned ? 'right' : 'left';

        // 収縮と同じインデックスで反対側なら、伸長情報を追加
        const existingContraction = results.contractions.find(c => c.index === i);
        if (existingContraction) {
          existingContraction.tensionSide = tensionSide;
        } else {
          results.tensions.push({
            upperLandmark: upper.name,
            lowerLandmark: lower.name,
            area: betweenArea,
            areaShort: upper.areaShort || upper.area,
            side: tensionSide,
            index: i,
            type: 'tension'
          });
        }
      }
    }

    // 問題箇所の統合（収縮＋伸長）
    const allIssues = [...results.contractions, ...results.tensions].sort((a, b) => a.index - b.index);

    if (allIssues.length >= 2) {
      for (let i = 0; i < allIssues.length - 1; i++) {
        const c1 = allIssues[i];
        const c2 = allIssues[i + 1];
        const type1 = c1.type === 'contraction' ? '収縮' : '伸長';
        const type2 = c2.type === 'contraction' ? '収縮' : '伸長';
        results.problemAreas.push({
          from: c1.area,
          to: c2.area,
          type1, type2,
          description: `${c1.area}（${type1}）と ${c2.area}（${type2}）の間が悪影響を及ぼしている可能性があります`
        });
      }
    }

    for (const issue of allIssues) {
      const typeLabel = issue.type === 'contraction' ? '収縮' : '伸長';
      const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
      results.problemAreas.push({
        from: issue.area,
        to: null,
        issueType: issue.type,
        side: issue.side,
        areaShort: issue.areaShort,
        description: `${issue.area}（${sideLabel}）に${typeLabel}が見られます`
      });
    }

    return results;
  }
};

// ===== 施術プロトコル提案 =====
const TreatmentProtocol = {
  protocols: {
    foot: {
      title: '足部アプローチ',
      techniques: [
        { name: '距骨調整', target: '距骨', description: '距骨の内外反を確認し、正常位に戻す', duration: '3-5分' },
        { name: '足根骨モビライゼーション', target: '足根骨', description: '楔状骨・舟状骨の可動性を改善', duration: '5分' },
        { name: '下腿筋膜リリース', target: '腓腹筋・ヒラメ筋', description: '下腿三頭筋の筋膜を緩める', duration: '5-8分' }
      ],
      checkpoints: ['足部アーチの回復', '片脚立位の安定性', '立位ランドマーク再検査']
    },
    upperBody: {
      title: '上半身アプローチ',
      techniques: [
        { name: '肩甲骨リリース', target: '肩甲骨周囲筋', description: '前鋸筋・菱形筋の緊張を緩める', duration: '5-8分' },
        { name: '頸椎モビライゼーション', target: 'C1-C7', description: '頸椎の可動域を改善', duration: '3-5分' },
        { name: '胸椎伸展', target: '胸椎', description: '胸椎の伸展可動域を改善', duration: '5分' }
      ],
      checkpoints: ['肩甲骨の可動性', '頸部回旋の左右差', '座位ランドマーク再検査']
    },
    cranialPelvic: {
      title: '頭蓋骨・骨盤アプローチ',
      techniques: [
        { name: '骨盤調整', target: '仙腸関節', description: '仙腸関節の可動性を確認し調整', duration: '5-8分' },
        { name: '頭蓋骨リリース', target: '側頭骨・後頭骨', description: '頭蓋縫合の可動性を改善', duration: '5-8分' },
        { name: '硬膜リリース', target: '脊髄硬膜', description: '硬膜の緊張を緩和', duration: '3-5分' }
      ],
      checkpoints: ['骨盤の対称性', '頭蓋骨の可動性', '全体のランドマーク再検査']
    },
    spine: {
      title: '脊柱アプローチ',
      techniques: [
        { name: '脊柱セグメント検査', target: '全脊柱', description: '各椎骨の可動性を個別に確認', duration: '5-8分' },
        { name: 'アジャストメント', target: '問題椎骨', description: '固定された椎骨を特定しアジャスト', duration: '3-5分' },
        { name: '傍脊柱筋リリース', target: '多裂筋・回旋筋', description: '脊柱周囲の深層筋を緩める', duration: '5-8分' }
      ],
      checkpoints: ['脊柱の可動性', '回旋テスト', '互い違いパターンの変化']
    },
    contraction: {
      '首〜肩': {
        title: '首〜肩の収縮施術',
        techniques: [
          { name: '僧帽筋上部リリース', target: '僧帽筋上部', description: 'トリガーポイントを見つけ圧迫リリース', duration: '3-5分' },
          { name: '肩甲挙筋ストレッチ', target: '肩甲挙筋', description: '受動的ストレッチで伸張', duration: '2-3分' }
        ]
      },
      '肩〜腕': {
        title: '肩〜腕の収縮施術',
        techniques: [
          { name: '三角筋リリース', target: '三角筋', description: '三角筋前部・中部の緊張を緩める', duration: '3-5分' },
          { name: '上腕二頭筋リリース', target: '上腕二頭筋', description: '長頭腱の滑走を改善', duration: '3分' }
        ]
      },
      '前腕〜手首': {
        title: '前腕〜手首の収縮施術',
        techniques: [
          { name: '前腕屈筋群リリース', target: '前腕屈筋群', description: '屈筋群のトリガーポイント解放', duration: '3-5分' },
          { name: '手根骨モビライゼーション', target: '手根骨', description: '手根骨の配列を整える', duration: '3分' }
        ]
      },
      '股関節〜太もも': {
        title: '股関節〜太もも施術',
        techniques: [
          { name: '腸腰筋リリース', target: '腸腰筋', description: '腸腰筋の短縮を改善', duration: '5-8分' },
          { name: '中殿筋強化', target: '中殿筋', description: '中殿筋のアクティベーション', duration: '3-5分' }
        ]
      },
      '太もも〜膝': {
        title: '太もも〜膝の施術',
        techniques: [
          { name: 'ハムストリングスリリース', target: 'ハムストリングス', description: 'もも裏の筋緊張を緩める', duration: '5分' },
          { name: '膝蓋骨モビライゼーション', target: '膝蓋骨', description: '膝蓋骨の可動性を改善', duration: '3分' }
        ]
      },
      'すね〜足首': {
        title: 'すね〜足首の施術',
        techniques: [
          { name: '腓腹筋リリース', target: '腓腹筋', description: 'ふくらはぎの筋緊張を緩める', duration: '5分' },
          { name: '足関節モビライゼーション', target: '距腿関節', description: '足関節の背屈可動域を改善', duration: '3-5分' }
        ]
      }
    }
  },

  // ===== カスタムプロトコルキャッシュ =====
  _customProtocols: [],

  async loadCustomProtocols(clinicId) {
    if (!clinicId || typeof SupabaseAuth === 'undefined') return;
    try {
      const { data, error } = await SupabaseAuth.client
        .from('custom_protocols')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('is_active', true)
        .order('sort_order');
      if (!error && data) this._customProtocols = data;
    } catch (e) {
      console.error('カスタムプロトコル読み込みエラー:', e);
    }
  },

  async saveCustomProtocol(clinicId, item) {
    const { data, error } = await SupabaseAuth.client
      .from('custom_protocols')
      .insert({ ...item, clinic_id: clinicId, created_by: SupabaseAuth.getUserId() })
      .select()
      .single();
    if (error) throw error;
    await this.loadCustomProtocols(clinicId);
    return data;
  },

  async updateCustomProtocol(id, updates) {
    const { error } = await SupabaseAuth.client
      .from('custom_protocols')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    await this.loadCustomProtocols(SupabaseAuth.getClinicId());
  },

  async deleteCustomProtocol(id) {
    const { error } = await SupabaseAuth.client
      .from('custom_protocols')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await this.loadCustomProtocols(SupabaseAuth.getClinicId());
  },

  getProtocol(primaryCause) {
    const preset = this.protocols[primaryCause] || null;
    // カスタムのmainタイプをマージ
    const customs = this._customProtocols.filter(
      p => p.protocol_type === 'main' && p.protocol_key === primaryCause
    );
    if (!preset && customs.length === 0) return null;
    if (!preset) {
      const c = customs[0];
      return { title: c.title, techniques: c.techniques, checkpoints: c.checkpoints || [] };
    }
    if (customs.length === 0) return preset;
    // マージ：プリセットのtechniquesにカスタムを追加
    const merged = { ...preset };
    for (const c of customs) {
      const techs = Array.isArray(c.techniques) ? c.techniques : JSON.parse(c.techniques || '[]');
      merged.techniques = [...merged.techniques, ...techs];
      const cps = Array.isArray(c.checkpoints) ? c.checkpoints : JSON.parse(c.checkpoints || '[]');
      merged.checkpoints = [...(merged.checkpoints || []), ...cps];
    }
    return merged;
  },

  getContractionProtocol(areaShort) {
    const preset = this.protocols.contraction?.[areaShort] || null;
    const customs = this._customProtocols.filter(
      p => p.protocol_type === 'area' && p.protocol_key === areaShort
    );
    if (!preset && customs.length === 0) return null;
    if (!preset) {
      const c = customs[0];
      return { title: c.title, techniques: Array.isArray(c.techniques) ? c.techniques : JSON.parse(c.techniques || '[]') };
    }
    if (customs.length === 0) return preset;
    const merged = { ...preset };
    for (const c of customs) {
      const techs = Array.isArray(c.techniques) ? c.techniques : JSON.parse(c.techniques || '[]');
      merged.techniques = [...merged.techniques, ...techs];
    }
    return merged;
  },

  generatePlan(diagnosisResult, contractionResult) {
    const plan = {
      mainProtocol: null,
      areaProtocols: [],
      estimatedTime: 0,
      allCheckpoints: []
    };

    if (diagnosisResult.primaryCause !== 'none') {
      plan.mainProtocol = this.getProtocol(diagnosisResult.primaryCause);
      if (plan.mainProtocol) {
        plan.estimatedTime += plan.mainProtocol.techniques.reduce((sum, t) => {
          const mins = parseInt(t.duration) || 5;
          return sum + mins;
        }, 0);
        plan.allCheckpoints.push(...(plan.mainProtocol.checkpoints || []));
      }
    }

    if (contractionResult) {
      const issues = [];
      if (contractionResult.upper) {
        issues.push(...contractionResult.upper.contractions, ...contractionResult.upper.tensions);
      }
      if (contractionResult.lower) {
        issues.push(...contractionResult.lower.contractions, ...contractionResult.lower.tensions);
      }

      const added = new Set();
      for (const issue of issues) {
        const key = issue.areaShort;
        if (added.has(key)) continue;
        added.add(key);

        const protocol = this.getContractionProtocol(key);
        if (protocol) {
          plan.areaProtocols.push({ ...protocol, issueType: issue.type, side: issue.side });
          plan.estimatedTime += protocol.techniques.reduce((sum, t) => {
            const mins = parseInt(t.duration) || 3;
            return sum + mins;
          }, 0);
        }
      }
    }

    return plan;
  }
};
