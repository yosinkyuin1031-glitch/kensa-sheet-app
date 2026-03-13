// ===== 検査ロジック：段階的原因特定システム =====

const InspectionLogic = {
  // ランドマーク定義
  landmarks: {
    mastoid: { name: '乳様突起', description: '耳の後ろの骨の突起' },
    scapulaInferior: { name: '肩甲下角', description: '肩甲骨の下端' },
    iliacCrest: { name: '腸骨稜', description: '骨盤の上端' }
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
    { key: 'acromion', name: '肩峰', area: '肩〜肘', areaShort: '肩〜腕' },
    { key: 'mastoidDetail', name: '肘頭', area: '肘〜手首', areaShort: '前腕〜手首' },
    { key: 'radialStyloid', name: '橈骨茎状突起', area: '前腕〜手首', areaShort: '前腕〜手首' }
  ],

  lowerDetailLandmarks: [
    { key: 'greaterTrochanter', name: '大転子', area: '骨盤〜大腿', areaShort: '股関節〜太もも' },
    { key: 'patellaUpper', name: '膝蓋骨上端', area: '大腿〜膝', areaShort: '太もも〜膝' },
    { key: 'lateralMalleolus', name: '外果', area: '膝〜足首', areaShort: 'すね〜足首' }
  ],

  // ===== 縮こまり＋引っ張り分析（拡張版） =====
  //
  // 縮こまり（Contraction）:
  //   隣り合うランドマークが互いに近づく方向 → その間が縮んでいる
  //   右側: 上が右下(-1) かつ 下が右上(1)
  //   左側: 上が左下(1) かつ 下が左上(-1)
  //
  // 引っ張り（Tension）:
  //   隣り合うランドマークが互いに離れる方向 → その間が引っ張られている
  //   右側: 上が右上(1) かつ 下が右下(-1)
  //   左側: 上が左上(-1) かつ 下が左下(1)
  //
  // どちらも「悪さをしている箇所」として報告

  analyzeContraction(landmarkDefs, data) {
    const results = {
      landmarks: [],
      contractions: [],   // 縮こまり箇所
      tensions: [],       // 引っ張り箇所
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

      // --- 縮こまり検出 ---
      // 右側: 上が右下(-1) かつ 下が右上(1) → 右が縮こまり
      const rightContracted = (upper.value === -1 && lower.value === 1);
      // 左側: 上が左下(1) かつ 下が左上(-1) → 左が縮こまり
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

      // --- 引っ張り検出 ---
      // 右側: 上が右上(1) かつ 下が右下(-1) → 右が引っ張り
      const rightTensioned = (upper.value === 1 && lower.value === -1);
      // 左側: 上が左上(-1) かつ 下が左下(1) → 左が引っ張り
      const leftTensioned = (upper.value === -1 && lower.value === 1);

      if (rightTensioned || leftTensioned) {
        // 縮こまりと同じインデックスの場合、反対側なので別エントリ
        // ただし contraction で rightContracted かつ leftTensioned の場合は
        // 右が縮こまり＋左が引っ張り → これは同じ現象の表裏
        // 重複しないよう、引っ張り側のみ記録
        const tensionSide = rightTensioned && leftTensioned ? 'both' :
                            rightTensioned ? 'right' : 'left';

        // 縮こまりと同じインデックスで反対側なら、引っ張り情報を追加
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

    // 問題箇所の統合（縮こまり＋引っ張り）
    const allIssues = [...results.contractions, ...results.tensions].sort((a, b) => a.index - b.index);

    if (allIssues.length >= 2) {
      for (let i = 0; i < allIssues.length - 1; i++) {
        const c1 = allIssues[i];
        const c2 = allIssues[i + 1];
        const type1 = c1.type === 'contraction' ? '縮こまり' : '引っ張り';
        const type2 = c2.type === 'contraction' ? '縮こまり' : '引っ張り';
        results.problemAreas.push({
          from: c1.area,
          to: c2.area,
          type1, type2,
          description: `${c1.area}（${type1}）と ${c2.area}（${type2}）の間が悪影響を及ぼしている可能性があります`
        });
      }
    }

    for (const issue of allIssues) {
      const typeLabel = issue.type === 'contraction' ? '縮こまり' : '引っ張り';
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
