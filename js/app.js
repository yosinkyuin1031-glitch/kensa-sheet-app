// ===== メインアプリケーション：ウィザード形式の検査フロー =====

(function() {
  'use strict';

  // ===== 状態管理 =====
  let currentStep = 0;
  let viewMode = 'practitioner'; // 'practitioner' or 'patient'
  let examData = {
    standing: { mastoid: null, scapulaInferior: null, iliacCrest: null },
    seated: { mastoid: null, scapulaInferior: null, iliacCrest: null },
    upperBody: { mastoid: null, scapulaInferior: null, iliacCrest: null }
  };
  let detailData = {
    upperDetail: { mastoidDetail: null, acromion: null, radialStyloid: null },
    lowerDetail: { greaterTrochanter: null, patellaUpper: null, lateralMalleolus: null }
  };
  let weightBalance = null;  // 'right', 'even', 'left'
  let diagnosisResult = null;
  let contractionResult = null;  // { upper: ..., lower: ... }

  // ===== 初期化 =====
  function init() {
    setupViewToggle();
    setupTabNavigation();
    setupWizardNavigation();
    setupLandmarkButtons();
    setupWeightBalanceButtons();
    setupDiagnosisActions();
    setupDetailedExamButtons();
    setDefaultDate();
    refreshHistory();
    initDiagrams();
  }

  // ===== 表示モード切替 =====
  function setupViewToggle() {
    const toggle = document.getElementById('viewToggle');
    if (!toggle) return;
    toggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.dataset.mode;
        document.body.setAttribute('data-view', viewMode);
        // 既に表示済みの結果を再描画
        if (diagnosisResult) {
          renderDiagnosis(diagnosisResult);
          if (contractionResult) {
            renderUnifiedAnalysis(contractionResult.upper, contractionResult.lower);
          }
        }
      });
    });
  }

  function initDiagrams() {
    BodyDiagram.init('diagram-standing');
    BodyDiagram.init('diagram-seated');
    BodyDiagram.init('diagram-upperBody');
    BodyDiagram.init('diagram-upperDetail');
    BodyDiagram.init('diagram-lowerDetail');
  }

  function updateDiagram(position) {
    const diagramMap = {
      standing:    { id: 'diagram-standing',    type: 'firstStage', data: examData.standing },
      seated:      { id: 'diagram-seated',      type: 'firstStage', data: examData.seated },
      upperBody:   { id: 'diagram-upperBody',   type: 'firstStage', data: examData.upperBody },
      upperDetail: { id: 'diagram-upperDetail', type: 'upperDetail', data: detailData.upperDetail },
      lowerDetail: { id: 'diagram-lowerDetail', type: 'lowerDetail', data: detailData.lowerDetail }
    };
    const cfg = diagramMap[position];
    if (cfg) BodyDiagram.update(cfg.id, cfg.type, cfg.data);
  }

  function setDefaultDate() {
    const dateInput = document.getElementById('inspectionDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  }

  // ===== タブナビゲーション =====
  function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(section => {
      section.classList.toggle('active', section.id === `${tabName}-section`);
    });
    if (tabName === 'history') refreshHistory();
  }

  // ===== ウィザードナビゲーション =====
  function setupWizardNavigation() {
    document.querySelectorAll('.wizard-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateCurrentStep()) goToStep(currentStep + 1);
      });
    });

    document.querySelectorAll('.wizard-prev').forEach(btn => {
      btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    const diagnoseBtn = document.getElementById('diagnoseBtn');
    if (diagnoseBtn) {
      diagnoseBtn.addEventListener('click', () => {
        if (validateCurrentStep()) runDiagnosis();
      });
    }

    const seatedDiagnoseBtn = document.getElementById('seatedDiagnoseBtn');
    if (seatedDiagnoseBtn) {
      seatedDiagnoseBtn.addEventListener('click', () => {
        if (validateCurrentStep()) runDiagnosis();
      });
    }
  }

  function goToStep(step) {
    if (step < 0 || step > 3) return;
    currentStep = step;

    document.querySelectorAll('.wizard-panel').forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.panel) === step);
    });

    document.querySelectorAll('.wizard-step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('active', s === step);
      el.classList.toggle('completed', s < step);
    });

    if (step === 2) updateSeatedComparison();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateCurrentStep() {
    if (currentStep === 0) return true;

    const positions = ['standing', 'seated', 'upperBody'];
    const position = positions[currentStep - 1];
    const data = examData[position];

    for (const landmark of Object.keys(InspectionLogic.landmarks)) {
      if (data[landmark] === null) {
        const landmarkName = InspectionLogic.landmarks[landmark].name;
        alert(`「${landmarkName}」を入力してください`);
        return false;
      }
    }
    return true;
  }

  // ===== 重心バランスボタン =====
  function setupWeightBalanceButtons() {
    const container = document.getElementById('weightBalanceInput');
    if (!container) return;
    container.querySelectorAll('.weight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        weightBalance = btn.dataset.value;
      });
    });
  }

  // ===== ランドマーク入力ボタン =====
  function setupLandmarkButtons() {
    document.querySelectorAll('.landmark-input').forEach(group => {
      const position = group.dataset.position;
      const landmark = group.dataset.landmark;
      const buttons = group.querySelectorAll('.landmark-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          const value = parseInt(btn.dataset.value);

          if (position === 'upperDetail' || position === 'lowerDetail') {
            detailData[position][landmark] = value;
          } else {
            examData[position][landmark] = value;
          }

          if (position === 'seated') updateSeatedComparison();
          updateDiagram(position);
        });
      });
    });
  }

  // ===== 座位検査：比較結果 =====
  function updateSeatedComparison() {
    const compBox = document.getElementById('seatedComparison');
    const seatedData = examData.seated;

    const allInputted = Object.keys(InspectionLogic.landmarks).every(
      lm => seatedData[lm] !== null
    );
    if (!allInputted) {
      compBox.style.display = 'none';
      return;
    }

    const comparison = InspectionLogic.compareStandingSeated(examData.standing, seatedData);

    let html = '<h4>立位との比較結果</h4>';
    html += '<table class="comparison-table"><thead><tr><th>ランドマーク</th><th>立位</th><th>座位</th><th>変化</th></tr></thead><tbody>';

    for (const change of comparison.changes) {
      const standLabel = InspectionLogic.valueLabels[change.standing.toString()];
      const seatLabel = InspectionLogic.valueLabels[change.seated.toString()];
      html += `<tr>
        <td><strong>${change.name}</strong></td>
        <td>${standLabel}</td>
        <td>${seatLabel}</td>
        <td class="${change.changed ? 'changed' : 'same'}">${change.changed ? '変化あり' : '一致'}</td>
      </tr>`;
    }
    html += '</tbody></table>';

    const seatedDiagBtn = document.getElementById('seatedDiagnoseBtn');

    if (comparison.hasFootInfluence) {
      html += `<div class="comparison-verdict foot-influence">
        <strong>🦶 足の影響あり</strong>
        <p>座位で左右差に変化が見られます。足の接地による影響が考えられます。</p>
        <p>「診断する」を押して結果を確認できます。さらに詳しく調べたい場合は上半身検査に進むこともできます。</p>
      </div>`;

      const nextBtn = document.getElementById('seatedNextBtn');
      if (nextBtn) nextBtn.textContent = '上半身検査へ →（任意）';
      if (seatedDiagBtn) seatedDiagBtn.style.display = '';
    } else {
      html += `<div class="comparison-verdict no-foot-influence">
        <strong>→ 足の影響ではない</strong>
        <p>立位と座位で左右差が一致しています。足以外の要因を確認するため、上半身検査に進んでください。</p>
      </div>`;

      const nextBtn = document.getElementById('seatedNextBtn');
      if (nextBtn) nextBtn.textContent = '上半身検査へ →';
      if (seatedDiagBtn) seatedDiagBtn.style.display = 'none';
    }

    compBox.innerHTML = html;
    compBox.style.display = 'block';
  }

  // ===== 診断実行 =====
  function runDiagnosis() {
    diagnosisResult = InspectionLogic.diagnose(examData);
    renderDiagnosis(diagnosisResult);
    showDetailedExam();
    switchTab('diagnosis');
  }

  // ===== 診断結果の描画 =====
  function renderDiagnosis(result) {
    const container = document.getElementById('diagnosisContent');
    const causeInfo = InspectionLogic.causeLabels[result.primaryCause];
    const isPatient = viewMode === 'patient';

    let html = '';

    // メイン診断（両モード共通）
    html += `
    <div class="diagnosis-main" style="border-color: ${causeInfo.color}">
      <div class="diagnosis-icon">${causeInfo.icon}</div>
      <h3 class="diagnosis-label" style="color: ${causeInfo.color}">${isPatient ? getPatientFriendlyLabel(result.primaryCause) : causeInfo.label}</h3>
      <p class="diagnosis-summary">${isPatient ? getPatientFriendlySummary(result) : result.summary}</p>
      ${result.treatmentArea !== 'なし' ? `<div class="diagnosis-treatment">治療対象：<strong>${result.treatmentArea}</strong></div>` : ''}
      ${weightBalance ? `<div class="diagnosis-treatment" style="margin-top:8px;">重心バランス：<strong>${weightBalance === 'right' ? '右重心' : weightBalance === 'left' ? '左重心' : '均等'}</strong></div>` : ''}
    </div>`;

    // === 治療家モード：詳細テーブルと判定 ===
    html += '<div class="practitioner-only">';

    // 検査フローテーブル
    html += '<div class="diagnosis-flow">';
    html += '<h3>検査の流れと結果</h3>';
    html += '<table class="flow-table"><thead><tr><th>ランドマーク</th>';

    for (const step of result.steps) {
      html += `<th>${step.name}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (const [landmark, config] of Object.entries(InspectionLogic.landmarks)) {
      html += `<tr><td><strong>${config.name}</strong></td>`;
      for (const step of result.steps) {
        const val = step.data[landmark] || 0;
        const label = InspectionLogic.valueLabels[val.toString()];
        const cls = val === 0 ? 'val-even' : (val < 0 ? 'val-left' : 'val-right');
        html += `<td class="${cls}">${label}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div>';

    // ステップごとの判定
    html += '<div class="diagnosis-steps"><h3>段階的判定</h3>';

    if (result.steps.length >= 2 && result.steps[1].comparison) {
      const comp = result.steps[1].comparison;
      html += `<div class="diagnosis-step-card ${comp.hasFootInfluence ? 'has-influence' : 'no-influence'}">
        <h4>① 立位 → 座位（足の影響）</h4>
        <p>${comp.hasFootInfluence
          ? '🦶 <strong>変化あり</strong> → 足の接地による影響が確認されました'
          : '→ <strong>変化なし</strong> → 足の影響ではありません'}</p>
      </div>`;
    }

    if (result.steps.length >= 3 && result.steps[2].comparison) {
      const comp = result.steps[2].comparison;
      html += `<div class="diagnosis-step-card ${comp.hasUpperBodyInfluence ? 'has-influence' : 'no-influence'}">
        <h4>② 座位 → 上半身検査（上半身の影響）</h4>
        <p>${comp.hasUpperBodyInfluence
          ? '💪 <strong>変化あり</strong> → 上半身の影響が確認されました'
          : '→ <strong>変化なし</strong> → 上半身の影響ではありません'}</p>
      </div>`;
    }

    if (result.pattern && result.pattern.pattern !== 'normal') {
      const patternIcon = result.pattern.pattern === 'zenran' ? '🔴' : '🔵';
      html += `<div class="diagnosis-step-card pattern-card">
        <h4>③ パターン分析</h4>
        <p>${patternIcon} <strong>${result.pattern.description}</strong></p>
        <p class="pattern-detail">${result.pattern.detail}</p>
      </div>`;
    }

    html += '</div>';
    html += '</div>'; // .practitioner-only

    // === 患者モード：シンプルな説明 ===
    html += '<div class="patient-only">';
    html += renderPatientView(result);
    html += '</div>';

    // 詳細検査への案内
    html += `<div class="detail-exam-guide">
      <p>続いて<strong>全身の詳細検査</strong>を行い、縮こまり・引っ張りの具体的な箇所を特定します。</p>
    </div>`;

    container.innerHTML = html;
    document.getElementById('diagnosisActions').style.display = 'flex';
  }

  // ===== 患者向けラベル =====
  function getPatientFriendlyLabel(cause) {
    const labels = {
      foot: '足元のバランスが原因です',
      upperBody: '上半身のバランスが原因です',
      cranialPelvic: '身体全体のバランスの乱れ',
      spine: '背骨まわりのバランスの乱れ',
      none: '大きな歪みは見られません'
    };
    return labels[cause] || '';
  }

  function getPatientFriendlySummary(result) {
    const summaries = {
      foot: '立っている時の足の着き方が、身体のバランスに影響しています。足元から整えていくことで改善が期待できます。',
      upperBody: '肩や腕の位置が身体のバランスに影響しています。上半身を整えることで改善が期待できます。',
      cranialPelvic: '身体全体が一方向に傾く傾向があります。頭と骨盤のバランスを整える施術が効果的です。',
      spine: '身体の各部位が左右交互にずれています。背骨の調整で改善が期待できます。',
      none: '現時点で大きな歪みは見られません。良い状態を維持しましょう。'
    };
    return summaries[result.primaryCause] || result.summary;
  }

  function renderPatientView(result) {
    let html = '<div class="patient-explanation">';

    // シンプルな身体の状態
    html += '<div class="patient-body-status">';
    html += '<h3>お身体の状態</h3>';

    if (result.primaryCause === 'none') {
      html += '<p class="patient-good">特に気になる歪みは見られませんでした。</p>';
    } else {
      html += '<div class="patient-finding">';
      if (weightBalance) {
        const wbLabel = weightBalance === 'right' ? '右側' : weightBalance === 'left' ? '左側' : '均等';
        if (weightBalance !== 'even') {
          html += `<p>体重が<strong>${wbLabel}</strong>にかかりやすい傾向があります。</p>`;
        }
      }

      // 主な歪みの方向を簡潔に
      if (result.pattern && result.pattern.pattern !== 'normal') {
        if (result.pattern.pattern === 'zenran') {
          const dir = result.pattern.direction === 'right' ? '右側' : '左側';
          html += `<p>身体全体が<strong>${dir}</strong>に傾く傾向があります。</p>`;
        } else {
          html += `<p>身体の上と下で<strong>左右交互にずれ</strong>が見られます。</p>`;
        }
      }
      html += '</div>';
    }

    html += '</div>';
    html += '</div>';
    return html;
  }

  // ===== 詳細検査：上半身＋下半身を表示 =====
  function showDetailedExam() {
    const section = document.getElementById('detailedExamSection');
    const contractionDiv = document.getElementById('contractionAnalysis');
    const selfcareDiv = document.getElementById('selfcareSection');
    const selfcareBtn = document.getElementById('showSelfcareBtn');

    contractionDiv.style.display = 'none';
    if (selfcareDiv) selfcareDiv.style.display = 'none';
    if (selfcareBtn) selfcareBtn.style.display = 'none';

    section.style.display = 'block';
  }

  // ===== 詳細検査ボタンのセットアップ =====
  function setupDetailedExamButtons() {
    const analyzeAllBtn = document.getElementById('analyzeAllBtn');
    if (analyzeAllBtn) {
      analyzeAllBtn.addEventListener('click', () => {
        const upperValid = validateDetailedExam('upperDetail', InspectionLogic.upperDetailLandmarks);
        if (!upperValid) return;
        const lowerValid = validateDetailedExam('lowerDetail', InspectionLogic.lowerDetailLandmarks);
        if (!lowerValid) return;

        runComprehensiveAnalysis();
      });
    }
  }

  function validateDetailedExam(position, landmarkDefs) {
    const data = detailData[position];
    for (const lm of landmarkDefs) {
      if (data[lm.key] === null) {
        alert(`「${lm.name}」を入力してください`);
        return false;
      }
    }
    return true;
  }

  // ===== 統合分析（上半身＋下半身） =====
  function runComprehensiveAnalysis() {
    const upperResult = InspectionLogic.analyzeContraction(
      InspectionLogic.upperDetailLandmarks, detailData.upperDetail
    );
    const lowerResult = InspectionLogic.analyzeContraction(
      InspectionLogic.lowerDetailLandmarks, detailData.lowerDetail
    );

    contractionResult = { upper: upperResult, lower: lowerResult };

    // ダイアグラム更新
    BodyDiagram.update('diagram-upperDetail', 'upperDetail', detailData.upperDetail);
    BodyDiagram.showZones('diagram-upperDetail', 'upperDetail', detailData.upperDetail);
    BodyDiagram.update('diagram-lowerDetail', 'lowerDetail', detailData.lowerDetail);
    BodyDiagram.showZones('diagram-lowerDetail', 'lowerDetail', detailData.lowerDetail);

    renderUnifiedAnalysis(upperResult, lowerResult);

    // セルフケアボタンの表示制御
    const allIssues = [
      ...upperResult.contractions, ...upperResult.tensions,
      ...lowerResult.contractions, ...lowerResult.tensions
    ];
    const selfcareBtn = document.getElementById('showSelfcareBtn');
    if (selfcareBtn) {
      selfcareBtn.style.display = allIssues.length > 0 ? '' : 'none';
    }
  }

  // ===== 統合分析結果の描画 =====
  function renderUnifiedAnalysis(upperResult, lowerResult) {
    const container = document.getElementById('contractionAnalysis');
    const isPatient = viewMode === 'patient';

    // 全ランドマークを統合（上半身→下半身の順）
    const allLandmarks = [...upperResult.landmarks, ...lowerResult.landmarks];
    const allContractions = [
      ...upperResult.contractions,
      ...lowerResult.contractions.map(c => ({ ...c, index: c.index + upperResult.landmarks.length }))
    ];
    const allTensions = [
      ...upperResult.tensions,
      ...lowerResult.tensions.map(t => ({ ...t, index: t.index + upperResult.landmarks.length }))
    ];
    const allIssues = [
      ...upperResult.contractions.map(c => ({ ...c, bodyPart: 'upper' })),
      ...upperResult.tensions.map(t => ({ ...t, bodyPart: 'upper' })),
      ...lowerResult.contractions.map(c => ({ ...c, bodyPart: 'lower' })),
      ...lowerResult.tensions.map(t => ({ ...t, bodyPart: 'lower' }))
    ];

    let html = '<div class="comprehensive-results">';
    html += '<h2 class="comprehensive-title">全身統合分析</h2>';

    if (isPatient) {
      // === 患者モード：シンプル表示 ===
      html += renderPatientAnalysis(allIssues, allLandmarks, upperResult, lowerResult);
    } else {
      // === 治療家モード：詳細表示 ===
      html += renderPractitionerAnalysis(allLandmarks, upperResult, lowerResult, allIssues);
    }

    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 治療家モード：詳細分析表示 =====
  function renderPractitionerAnalysis(allLandmarks, upperResult, lowerResult, allIssues) {
    let html = '';

    // 統合ダイアグラム（全身を一本の流れで表示）
    html += '<div class="contraction-section">';
    html += '<h3>全身ランドマーク状態</h3>';
    html += '<div class="contraction-diagram">';

    // 上半身ヘッダー
    html += '<div class="body-part-divider"><span>上半身</span></div>';

    for (let i = 0; i < upperResult.landmarks.length; i++) {
      html += renderLandmarkRow(upperResult.landmarks[i], i + 1);
      if (i < upperResult.landmarks.length - 1) {
        html += renderBetweenRow(upperResult.contractions, upperResult.tensions, i);
      }
    }

    // 区切り
    html += '<div class="body-part-divider"><span>下半身</span></div>';

    for (let i = 0; i < lowerResult.landmarks.length; i++) {
      html += renderLandmarkRow(lowerResult.landmarks[i], i + 4);
      if (i < lowerResult.landmarks.length - 1) {
        html += renderBetweenRow(lowerResult.contractions, lowerResult.tensions, i);
      }
    }

    html += '</div>'; // .contraction-diagram

    // 検出された問題一覧
    if (allIssues.length > 0) {
      html += '<div class="problem-areas"><h4>検出された問題</h4>';
      for (const issue of allIssues) {
        const typeLabel = issue.type === 'contraction' ? '縮こまり' : '引っ張り';
        const typeIcon = issue.type === 'contraction' ? '✕' : '↕';
        const typeClass = issue.type === 'contraction' ? '' : 'tension-card';
        const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
        const partLabel = issue.bodyPart === 'upper' ? '【上半身】' : '【下半身】';
        html += `<div class="problem-area-card ${typeClass}">
          <span class="problem-icon">${typeIcon}</span>
          <p>${partLabel} <strong>${issue.area}</strong>（${sideLabel}）に<strong>${typeLabel}</strong>が検出されました</p>
        </div>`;
      }
      html += '</div>';
    } else {
      html += `<div class="problem-areas">
        <div class="problem-area-card normal-card">
          <span class="problem-icon">✅</span>
          <p>明確な縮こまり・引っ張りは検出されませんでした。</p>
        </div>
      </div>`;
    }

    html += '</div>'; // .contraction-section

    return html;
  }

  function renderLandmarkRow(lm, num) {
    const valLabel = InspectionLogic.valueLabels[lm.value.toString()];
    const valClass = lm.value === 0 ? 'val-even' : (lm.value < 0 ? 'val-left' : 'val-right');

    return `
      <div class="diagram-landmark">
        <span class="diagram-number">${num}</span>
        <span class="diagram-name">${lm.name}</span>
        <span class="diagram-value ${valClass}">${valLabel}</span>
        <span class="diagram-sides">
          <span class="side-label">右: ${lm.rightSide === 'up' ? '↑上' : lm.rightSide === 'down' ? '↓下' : '＝'}</span>
          <span class="side-label">左: ${lm.leftSide === 'up' ? '↑上' : lm.leftSide === 'down' ? '↓下' : '＝'}</span>
        </span>
      </div>`;
  }

  function renderBetweenRow(contractions, tensions, index) {
    const contraction = contractions.find(c => c.index === index);
    const tension = tensions.find(t => t.index === index);

    if (contraction) {
      const sideText = contraction.side === 'both' ? '両側'
        : contraction.side === 'right' ? '右側' : '左側';
      const tensionInfo = contraction.tensionSide
        ? `（反対側：${contraction.tensionSide === 'right' ? '右側' : '左側'}引っ張り）`
        : '';
      return `
      <div class="diagram-between contracted">
        <span class="contraction-mark">✕ 縮こまり（${sideText}）${tensionInfo}</span>
        <span class="contraction-area">${contraction.area}</span>
      </div>`;
    } else if (tension) {
      const sideText = tension.side === 'both' ? '両側'
        : tension.side === 'right' ? '右側' : '左側';
      return `
      <div class="diagram-between tensioned">
        <span class="tension-mark">↕ 引っ張り（${sideText}）</span>
        <span class="contraction-area">${tension.area}</span>
      </div>`;
    } else {
      return `
      <div class="diagram-between normal">
        <span class="between-line">│</span>
      </div>`;
    }
  }

  // ===== 患者モード：シンプル分析表示 =====
  function renderPatientAnalysis(allIssues, allLandmarks, upperResult, lowerResult) {
    let html = '';

    if (allIssues.length === 0) {
      html += `<div class="patient-result-card good">
        <div class="patient-result-icon">✅</div>
        <h3>良好な状態です</h3>
        <p>身体に大きな縮こまりや引っ張りは見られません。</p>
      </div>`;
      return html;
    }

    html += `<div class="patient-result-card">
      <h3>気になる箇所が見つかりました</h3>
      <p>以下の部分にバランスの乱れがあります。施術で改善していきましょう。</p>
    </div>`;

    for (const issue of allIssues) {
      const typeLabel = issue.type === 'contraction' ? '硬くなっている' : '引っ張られている';
      const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
      const color = issue.type === 'contraction' ? 'var(--severe)' : 'var(--purple)';
      const icon = issue.type === 'contraction' ? '🔴' : '🟣';

      html += `<div class="patient-issue-card" style="border-left-color: ${color}">
        <span class="patient-issue-icon">${icon}</span>
        <div>
          <strong>${issue.area}</strong>
          <p>${sideLabel}が${typeLabel}状態です</p>
        </div>
      </div>`;
    }

    return html;
  }

  // ===== セルフケア提案 =====
  function renderSelfcare(upperResult, lowerResult) {
    const selfcareDiv = document.getElementById('selfcareSection');
    if (!selfcareDiv) return;

    const allIssues = [
      ...upperResult.contractions.map(c => ({ ...c, bodyPart: 'upper' })),
      ...upperResult.tensions.map(t => ({ ...t, bodyPart: 'upper' })),
      ...lowerResult.contractions.map(c => ({ ...c, bodyPart: 'lower' })),
      ...lowerResult.tensions.map(t => ({ ...t, bodyPart: 'lower' }))
    ];

    if (allIssues.length === 0) {
      selfcareDiv.style.display = 'none';
      return;
    }

    let html = '<div class="selfcare-section">';
    html += '<h2 class="selfcare-title">セルフケア提案</h2>';
    html += '<p class="selfcare-intro">検出された問題箇所に対応するセルフケアメニューです。毎日続けることで改善が期待できます。</p>';

    const rendered = new Set();

    for (const issue of allIssues) {
      const areaKey = issue.areaShort;
      const issueType = issue.type || 'contraction';
      const cacheKey = `${areaKey}_${issueType}`;

      if (rendered.has(cacheKey)) continue;
      rendered.add(cacheKey);

      const exercise = SelfcareDatabase.getSelfcareForArea(areaKey, issueType);
      if (exercise) {
        html += SelfcareDatabase.renderSelfcareCard(exercise, issue.side);
      }
    }

    html += '</div>';

    selfcareDiv.innerHTML = html;
    selfcareDiv.style.display = 'block';
    selfcareDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 診断アクション =====
  function setupDiagnosisActions() {
    document.getElementById('saveHistoryBtn').addEventListener('click', () => {
      if (!diagnosisResult) return;
      const patientName = document.getElementById('patientName').value;
      const memo = document.getElementById('inspectionMemo').value;
      const success = Storage.save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance);
      if (success) {
        alert('検査結果を保存しました');
      } else {
        alert('保存に失敗しました');
      }
    });

    document.getElementById('savePdfBtn').addEventListener('click', () => {
      if (!diagnosisResult) return;
      const patientName = document.getElementById('patientName').value;
      const inspectionDate = document.getElementById('inspectionDate').value;
      PdfExport.exportDiagnosis(patientName, inspectionDate, diagnosisResult);
    });

    // セルフケア提案ボタン
    const selfcareBtn = document.getElementById('showSelfcareBtn');
    if (selfcareBtn) {
      selfcareBtn.addEventListener('click', () => {
        const selfcareDiv = document.getElementById('selfcareSection');
        if (selfcareDiv.style.display === 'block') {
          selfcareDiv.style.display = 'none';
          selfcareBtn.textContent = 'セルフケア提案';
        } else if (contractionResult) {
          renderSelfcare(contractionResult.upper, contractionResult.lower);
          selfcareBtn.textContent = 'セルフケアを閉じる';
        }
      });
    }

    document.getElementById('newExamBtn').addEventListener('click', () => {
      resetExam();
    });
  }

  // ===== リセット =====
  function resetExam() {
    examData = {
      standing: { mastoid: null, scapulaInferior: null, iliacCrest: null },
      seated: { mastoid: null, scapulaInferior: null, iliacCrest: null },
      upperBody: { mastoid: null, scapulaInferior: null, iliacCrest: null }
    };
    detailData = {
      upperDetail: { mastoidDetail: null, acromion: null, radialStyloid: null },
      lowerDetail: { greaterTrochanter: null, patellaUpper: null, lateralMalleolus: null }
    };
    weightBalance = null;
    diagnosisResult = null;
    contractionResult = null;

    document.querySelectorAll('.landmark-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('patientName').value = '';
    document.getElementById('inspectionMemo').value = '';
    setDefaultDate();

    document.getElementById('seatedComparison').style.display = 'none';
    document.getElementById('diagnosisContent').innerHTML = '';
    document.getElementById('diagnosisActions').style.display = 'none';
    document.getElementById('detailedExamSection').style.display = 'none';
    document.getElementById('contractionAnalysis').style.display = 'none';
    const selfcareDiv = document.getElementById('selfcareSection');
    if (selfcareDiv) selfcareDiv.style.display = 'none';
    const selfcareBtn = document.getElementById('showSelfcareBtn');
    if (selfcareBtn) {
      selfcareBtn.style.display = 'none';
      selfcareBtn.textContent = 'セルフケア提案';
    }

    initDiagrams();
    goToStep(0);
    switchTab('exam');
  }

  // ===== 履歴 =====
  function refreshHistory() {
    Storage.renderHistoryList(
      (id) => loadFromHistory(id),
      (id) => {
        Storage.delete(id);
        refreshHistory();
      }
    );
  }

  function loadFromHistory(id) {
    const entry = Storage.getById(id);
    if (!entry) return;

    examData = { ...entry.examData };
    if (entry.detailData) {
      detailData = { ...entry.detailData };
    }
    if (entry.weightBalance) {
      weightBalance = entry.weightBalance;
    }

    document.getElementById('patientName').value = entry.patientName || '';
    if (entry.memo) {
      document.getElementById('inspectionMemo').value = entry.memo;
    }

    // ランドマークボタンの状態を復元
    for (const position of ['standing', 'seated', 'upperBody']) {
      for (const landmark of Object.keys(InspectionLogic.landmarks)) {
        const val = examData[position]?.[landmark];
        if (val !== null && val !== undefined) {
          const group = document.querySelector(
            `.landmark-input[data-position="${position}"][data-landmark="${landmark}"]`
          );
          if (group) {
            group.querySelectorAll('.landmark-btn').forEach(btn => {
              btn.classList.toggle('selected', parseInt(btn.dataset.value) === val);
            });
          }
        }
      }
    }

    // 重心バランスボタンの復元
    if (entry.weightBalance) {
      const wbContainer = document.getElementById('weightBalanceInput');
      if (wbContainer) {
        wbContainer.querySelectorAll('.weight-btn').forEach(btn => {
          btn.classList.toggle('selected', btn.dataset.value === entry.weightBalance);
        });
      }
    }

    // 詳細検査ボタンの状態を復元
    if (entry.detailData) {
      for (const position of ['upperDetail', 'lowerDetail']) {
        const posData = entry.detailData[position];
        if (posData) {
          for (const [landmark, val] of Object.entries(posData)) {
            if (val !== null && val !== undefined) {
              const group = document.querySelector(
                `.landmark-input[data-position="${position}"][data-landmark="${landmark}"]`
              );
              if (group) {
                group.querySelectorAll('.landmark-btn').forEach(btn => {
                  btn.classList.toggle('selected', parseInt(btn.dataset.value) === val);
                });
              }
            }
          }
        }
      }
    }

    // 診断結果を再計算して表示
    diagnosisResult = InspectionLogic.diagnose(examData);
    renderDiagnosis(diagnosisResult);
    showDetailedExam();

    // 縮こまり分析結果があれば復元
    if (entry.contractionResult && entry.contractionResult.upper && entry.contractionResult.lower) {
      contractionResult = entry.contractionResult;
      renderUnifiedAnalysis(contractionResult.upper, contractionResult.lower);

      const allIssues = [
        ...contractionResult.upper.contractions, ...contractionResult.upper.tensions,
        ...contractionResult.lower.contractions, ...contractionResult.lower.tensions
      ];
      const selfcareBtn = document.getElementById('showSelfcareBtn');
      if (selfcareBtn) {
        selfcareBtn.style.display = allIssues.length > 0 ? '' : 'none';
      }
    }

    switchTab('diagnosis');
  }

  // ===== DOM準備完了時に初期化 =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
