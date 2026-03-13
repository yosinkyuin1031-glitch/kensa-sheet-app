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
  let selectedPatientId = null;  // 選択中の患者ID

  // ===== 初期化 =====
  function init() {
    setupViewToggle();
    setupTabNavigation();
    setupWizardNavigation();
    setupLandmarkButtons();
    setupWeightBalanceButtons();
    setupDiagnosisActions();
    setupDetailedExamButtons();
    setupPatientSearch();
    setupProtocolButton();
    setupBackupButtons();
    setupTrendButton();
    setDefaultDate();
    refreshHistory();
    initDiagrams();
    registerServiceWorker();
    showTutorialIfNeeded();
  }

  // ===== Service Worker登録 =====
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  // ===== チュートリアル =====
  function showTutorialIfNeeded() {
    if (localStorage.getItem('tutorial_completed') === 'true') return;

    const overlay = document.getElementById('tutorialOverlay');
    if (!overlay) return;

    let currentTutorialStep = 0;
    const totalSteps = 4;

    // ドットを生成
    const dotsContainer = document.getElementById('tutorialDots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('span');
      dot.className = 'tutorial-dot' + (i === 0 ? ' active' : '');
      dot.dataset.step = i;
      dotsContainer.appendChild(dot);
    }

    overlay.style.display = 'flex';

    function showTutorialStep(step) {
      overlay.querySelectorAll('.tutorial-step').forEach(el => {
        el.style.display = parseInt(el.dataset.tutorialStep) === step ? 'block' : 'none';
      });
      dotsContainer.querySelectorAll('.tutorial-dot').forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.dataset.step) === step);
      });
      const nextBtn = document.getElementById('tutorialNext');
      nextBtn.textContent = step === totalSteps - 1 ? 'はじめる' : '次へ';
    }

    function closeTutorial() {
      localStorage.setItem('tutorial_completed', 'true');
      overlay.style.display = 'none';
    }

    document.getElementById('tutorialNext').addEventListener('click', () => {
      if (currentTutorialStep >= totalSteps - 1) {
        closeTutorial();
      } else {
        currentTutorialStep++;
        showTutorialStep(currentTutorialStep);
      }
    });

    document.getElementById('tutorialSkip').addEventListener('click', closeTutorial);
  }

  // ===== データバックアップ（Export/Import） =====
  function setupBackupButtons() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importInput = document.getElementById('importFileInput');
    if (!exportBtn || !importBtn || !importInput) return;

    exportBtn.addEventListener('click', () => {
      try {
        const history = Storage.getAll();
        const exportData = {
          appName: 'BodyCheckPro',
          version: '2.0',
          exportDate: new Date().toISOString(),
          data: history
        };
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const dateStr = now.getFullYear().toString() +
          String(now.getMonth() + 1).padStart(2, '0') +
          String(now.getDate()).padStart(2, '0');
        a.href = url;
        a.download = `bodycheck_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('データをエクスポートしました');
      } catch (e) {
        console.error('Export failed:', e);
        alert('エクスポートに失敗しました');
      }
    });

    importBtn.addEventListener('click', () => {
      importInput.click();
    });

    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);

          // バリデーション
          if (!imported || !imported.appName || imported.appName !== 'BodyCheckPro' || !Array.isArray(imported.data)) {
            alert('このファイルは検査アプリのバックアップデータではありません');
            return;
          }

          // データの基本構造チェック
          for (const entry of imported.data) {
            if (!entry.id || !entry.date || !entry.examData) {
              alert('データの形式が正しくありません。破損している可能性があります。');
              return;
            }
          }

          const existingData = Storage.getAll();
          const existingIds = new Set(existingData.map(e => e.id));
          let newCount = 0;

          // 既存データとマージ（重複IDはスキップ）
          for (const entry of imported.data) {
            if (!existingIds.has(entry.id)) {
              existingData.push(entry);
              newCount++;
            }
          }

          // 日付順にソート（新しい順）
          existingData.sort((a, b) => new Date(b.date) - new Date(a.date));

          // 100件制限
          if (existingData.length > 100) {
            existingData.length = 100;
          }

          localStorage.setItem(Storage.STORAGE_KEY, JSON.stringify(existingData));
          refreshHistory();

          if (newCount > 0) {
            alert(`${newCount}件の新しいデータをインポートしました`);
          } else {
            alert('全てのデータは既に存在しています（重複なし）');
          }
        } catch (err) {
          console.error('Import failed:', err);
          alert('ファイルの読み込みに失敗しました。正しいJSONファイルか確認してください。');
        }
      };
      reader.readAsText(file);
      // リセットして同じファイルを再選択できるようにする
      importInput.value = '';
    });
  }

  // ===== 経過グラフ =====
  function setupTrendButton() {
    const trendBtn = document.getElementById('showTrendBtn');
    if (!trendBtn) return;

    trendBtn.addEventListener('click', () => {
      const trendSection = document.getElementById('trendSection');
      if (trendSection.style.display === 'block') {
        trendSection.style.display = 'none';
        trendBtn.textContent = '経過グラフ';
      } else {
        renderPatientTrend();
        trendBtn.textContent = '経過グラフを閉じる';
      }
    });
  }

  function updateTrendButton() {
    const trendBtn = document.getElementById('showTrendBtn');
    if (!trendBtn) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || Storage.findPatientIdByName(patientName);
    if (!pid) {
      trendBtn.style.display = 'none';
      return;
    }
    const history = Storage.getHistoryByPatient(pid);
    trendBtn.style.display = history.length >= 2 ? '' : 'none';
  }

  function renderPatientTrend() {
    const trendSection = document.getElementById('trendSection');
    if (!trendSection) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || Storage.findPatientIdByName(patientName);
    if (!pid) return;

    const history = Storage.getHistoryByPatient(pid);
    if (history.length < 2) return;

    // 古い順にソート
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 各検査のバランススコアを計算（絶対値の合計、低いほど良い）
    const exams = sorted.map(entry => {
      let score = 0;
      if (entry.examData) {
        for (const pos of ['standing', 'seated', 'upperBody']) {
          if (entry.examData[pos]) {
            for (const lm of Object.keys(entry.examData[pos])) {
              score += Math.abs(entry.examData[pos][lm] || 0);
            }
          }
        }
      }
      const date = new Date(entry.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const causeInfo = entry.diagnosisResult
        ? (InspectionLogic.causeLabels[entry.diagnosisResult.primaryCause] || {})
        : {};

      return {
        date: dateStr,
        fullDate: `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
        score,
        cause: causeInfo.label || '',
        causeIcon: causeInfo.icon || ''
      };
    });

    const maxScore = Math.max(...exams.map(e => e.score), 1);
    const chartWidth = 600;
    const chartHeight = 250;
    const padLeft = 50;
    const padRight = 30;
    const padTop = 30;
    const padBottom = 50;
    const plotW = chartWidth - padLeft - padRight;
    const plotH = chartHeight - padTop - padBottom;

    // 座標計算
    const points = exams.map((exam, i) => ({
      x: padLeft + (exams.length === 1 ? plotW / 2 : (i / (exams.length - 1)) * plotW),
      y: padTop + plotH - (exam.score / maxScore) * plotH,
      ...exam
    }));

    // SVG生成
    let svg = `<svg viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">`;

    // グリッド線
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padTop + (i / gridLines) * plotH;
      const val = Math.round(maxScore - (i / gridLines) * maxScore);
      svg += `<line x1="${padLeft}" y1="${y}" x2="${chartWidth - padRight}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
      svg += `<text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="#94a3b8">${val}</text>`;
    }

    // エリア塗りつぶし（グラデーション）
    if (points.length >= 2) {
      // 改善方向（緑）/ 悪化方向（赤）のグラデーション
      const areaPath = `M ${points[0].x},${padTop + plotH} ` +
        points.map(p => `L ${p.x},${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x},${padTop + plotH} Z`;

      // 最初と最後のスコア比較で色を決定
      const improving = points[points.length - 1].score <= points[0].score;
      const areaColor = improving ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)';
      svg += `<path d="${areaPath}" fill="${areaColor}"/>`;

      // ライン
      const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
      svg += `<path d="${linePath}" stroke="#2563eb" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
    }

    // データポイント + 日付ラベル
    points.forEach((p, i) => {
      // ドット
      const scoreClass = p.score <= 2 ? '#22c55e' : p.score <= 5 ? '#f59e0b' : '#ef4444';
      svg += `<circle cx="${p.x}" cy="${p.y}" r="6" fill="${scoreClass}" stroke="white" stroke-width="2"/>`;
      svg += `<text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="10" font-weight="700" fill="${scoreClass}">${p.score}</text>`;

      // X軸ラベル（日付）
      svg += `<text x="${p.x}" y="${padTop + plotH + 18}" text-anchor="middle" font-size="9" fill="#64748b">${p.date}</text>`;

      // 診断ラベル（アイコン）
      if (p.causeIcon) {
        svg += `<text x="${p.x}" y="${padTop + plotH + 34}" text-anchor="middle" font-size="12">${p.causeIcon}</text>`;
      }
    });

    // Y軸ラベル
    svg += `<text x="14" y="${padTop + plotH / 2}" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90, 14, ${padTop + plotH / 2})">バランススコア</text>`;

    // 矢印（改善方向を示す）
    svg += `<text x="${padLeft - 8}" y="${padTop - 8}" text-anchor="end" font-size="9" fill="#94a3b8">悪い</text>`;
    svg += `<text x="${padLeft - 8}" y="${padTop + plotH + 14}" text-anchor="end" font-size="9" fill="#22c55e">良い</text>`;

    svg += '</svg>';

    // HTML生成
    let html = '<div class="trend-card">';
    html += '<div class="trend-header">';
    html += '<h3>経過グラフ</h3>';
    html += `<p>${patientName || '患者'}さんの検査${exams.length}回分の推移</p>`;
    html += '</div>';

    html += `<div class="trend-chart-wrapper">${svg}</div>`;

    html += '<div class="trend-legend">';
    html += '<span class="trend-legend-item"><span class="trend-legend-dot" style="background:#22c55e;"></span> 良好 (0-2)</span>';
    html += '<span class="trend-legend-item"><span class="trend-legend-dot" style="background:#f59e0b;"></span> 注意 (3-5)</span>';
    html += '<span class="trend-legend-item"><span class="trend-legend-dot" style="background:#ef4444;"></span> 要改善 (6+)</span>';
    html += '</div>';

    html += '<div class="trend-exam-labels">';
    exams.forEach(exam => {
      const scoreClass = exam.score <= 2 ? 'trend-score-good' : exam.score <= 5 ? 'trend-score-moderate' : 'trend-score-bad';
      html += `<div class="trend-exam-label">
        <span class="trend-exam-date">${exam.fullDate}</span>
        <span class="trend-exam-cause">${exam.causeIcon} ${exam.cause}</span>
        <span class="trend-exam-score ${scoreClass}">スコア: ${exam.score}</span>
      </div>`;
    });
    html += '</div>';
    html += '</div>';

    trendSection.innerHTML = html;
    trendSection.style.display = 'block';
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
          renderReport();
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

  // ===== 患者検索機能 =====
  function setupPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    const suggestionsDiv = document.getElementById('patientSuggestions');
    const examCountDiv = document.getElementById('patientExamCount');
    if (!searchInput || !suggestionsDiv) return;

    let debounceTimer = null;

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
          suggestionsDiv.innerHTML = '';
          suggestionsDiv.style.display = 'none';
          return;
        }

        const results = Storage.searchPatients(query);
        if (results.length === 0) {
          suggestionsDiv.innerHTML = '<div class="patient-suggestion-empty">該当する患者が見つかりません</div>';
          suggestionsDiv.style.display = 'block';
          return;
        }

        suggestionsDiv.innerHTML = results.map(p => {
          const lastDate = new Date(p.lastDate);
          const dateStr = `${lastDate.getFullYear()}/${String(lastDate.getMonth() + 1).padStart(2, '0')}/${String(lastDate.getDate()).padStart(2, '0')}`;
          return `<div class="patient-suggestion-item" data-patient-id="${p.patientId}" data-patient-name="${p.patientName}">
            <span class="suggestion-name">${p.patientName}</span>
            <span class="suggestion-meta">検査${p.examCount}回 / 最終: ${dateStr}</span>
          </div>`;
        }).join('');
        suggestionsDiv.style.display = 'block';

        // クリックイベント
        suggestionsDiv.querySelectorAll('.patient-suggestion-item').forEach(item => {
          item.addEventListener('click', () => {
            const pid = item.dataset.patientId;
            const pname = item.dataset.patientName;
            selectPatient(pid, pname);
            suggestionsDiv.style.display = 'none';
            searchInput.value = '';
          });
        });
      }, 200);
    });

    // 検索欄外クリックで候補を閉じる
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#patientSearchWrapper')) {
        suggestionsDiv.style.display = 'none';
      }
    });
  }

  function selectPatient(patientId, patientName) {
    selectedPatientId = patientId;
    document.getElementById('patientName').value = patientName;

    const history = Storage.getHistoryByPatient(patientId);
    const examCountDiv = document.getElementById('patientExamCount');
    if (examCountDiv && history.length > 0) {
      examCountDiv.textContent = `過去${history.length}回の検査記録があります`;
      examCountDiv.style.display = 'block';
    }
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
    if (tabName === 'report') renderReport();
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
    updateCompareButton();
    updateTrendButton();
    // Show protocol button
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';
    // Auto-generate report
    renderReport();
    switchTab('diagnosis');
  }

  // ===== 比較ボタンの表示制御 =====
  function updateCompareButton() {
    const compareBtn = document.getElementById('compareBtn');
    if (!compareBtn) return;

    // 現在の患者IDを特定
    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || Storage.findPatientIdByName(patientName);

    if (!pid) {
      compareBtn.style.display = 'none';
      return;
    }

    const history = Storage.getHistoryByPatient(pid);
    if (history.length > 0) {
      compareBtn.style.display = '';
    } else {
      compareBtn.style.display = 'none';
    }
  }

  // ===== ビフォーアフター比較 =====
  function renderComparison() {
    const compSection = document.getElementById('comparisonSection');
    if (!compSection) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || Storage.findPatientIdByName(patientName);
    if (!pid) return;

    const history = Storage.getHistoryByPatient(pid);
    if (history.length === 0) return;

    // 最新（＝前回）の検査を取得
    const prevEntry = history[0];
    const prevResult = prevEntry.diagnosisResult;
    const prevDetail = prevEntry.contractionResult;
    const prevDate = new Date(prevEntry.date);
    const prevDateStr = `${prevDate.getFullYear()}/${String(prevDate.getMonth() + 1).padStart(2, '0')}/${String(prevDate.getDate()).padStart(2, '0')}`;

    let html = '<div class="comparison-card">';
    html += '<div class="comparison-header">';
    html += '<h3>前回との比較（ビフォーアフター）</h3>';
    html += `<p class="comparison-date-info">前回検査日: ${prevDateStr}</p>`;
    html += '</div>';

    // 基本3ランドマーク比較（立位・座位・上半身）
    const positionNames = { standing: '立位', seated: '座位', upperBody: '上半身' };
    const positions = ['standing', 'seated', 'upperBody'];

    for (const pos of positions) {
      const prevData = prevEntry.examData[pos];
      const currData = examData[pos];
      if (!prevData || !currData) continue;

      html += `<div class="comparison-position-block">`;
      html += `<h4 class="comparison-position-title">${positionNames[pos]}</h4>`;

      for (const [lmKey, lmConfig] of Object.entries(InspectionLogic.landmarks)) {
        const prevVal = prevData[lmKey] || 0;
        const currVal = currData[lmKey] || 0;
        const prevLabel = InspectionLogic.valueLabels[prevVal.toString()];
        const currLabel = InspectionLogic.valueLabels[currVal.toString()];

        let changeClass = 'comparison-unchanged';
        let changeText = '変化なし';

        if (prevVal !== currVal) {
          // 改善: 前回ずれていた→正常に近づいた
          if (currVal === 0 && prevVal !== 0) {
            changeClass = 'comparison-improved';
            changeText = '改善';
          } else if (prevVal === 0 && currVal !== 0) {
            changeClass = 'comparison-worsened';
            changeText = '悪化';
          } else if (Math.abs(currVal) < Math.abs(prevVal)) {
            changeClass = 'comparison-improved';
            changeText = '改善';
          } else {
            changeClass = 'comparison-worsened';
            changeText = '悪化';
          }
        }

        html += `<div class="comparison-row ${changeClass}">
          <span class="comparison-landmark">${lmConfig.name}</span>
          <span class="comparison-prev">${prevLabel}</span>
          <span class="comparison-arrow">→</span>
          <span class="comparison-curr">${currLabel}</span>
          <span class="comparison-change">${changeText}</span>
        </div>`;
      }

      html += '</div>';
    }

    // 詳細6ランドマーク比較
    if (prevDetail && contractionResult) {
      html += '<div class="comparison-position-block">';
      html += '<h4 class="comparison-position-title">詳細検査（上半身）</h4>';

      const prevUpperLandmarks = prevDetail.upper ? prevDetail.upper.landmarks : [];
      const currUpperLandmarks = contractionResult.upper ? contractionResult.upper.landmarks : [];

      for (let i = 0; i < currUpperLandmarks.length; i++) {
        const curr = currUpperLandmarks[i];
        const prev = prevUpperLandmarks[i];
        if (!prev) continue;

        const prevLabel = InspectionLogic.valueLabels[prev.value.toString()];
        const currLabel = InspectionLogic.valueLabels[curr.value.toString()];
        const changeInfo = getChangeInfo(prev.value, curr.value);

        html += `<div class="comparison-row ${changeInfo.cls}">
          <span class="comparison-landmark">${curr.name}</span>
          <span class="comparison-prev">${prevLabel}</span>
          <span class="comparison-arrow">→</span>
          <span class="comparison-curr">${currLabel}</span>
          <span class="comparison-change">${changeInfo.text}</span>
        </div>`;
      }

      html += '</div>';

      html += '<div class="comparison-position-block">';
      html += '<h4 class="comparison-position-title">詳細検査（下半身）</h4>';

      const prevLowerLandmarks = prevDetail.lower ? prevDetail.lower.landmarks : [];
      const currLowerLandmarks = contractionResult.lower ? contractionResult.lower.landmarks : [];

      for (let i = 0; i < currLowerLandmarks.length; i++) {
        const curr = currLowerLandmarks[i];
        const prev = prevLowerLandmarks[i];
        if (!prev) continue;

        const prevLabel = InspectionLogic.valueLabels[prev.value.toString()];
        const currLabel = InspectionLogic.valueLabels[curr.value.toString()];
        const changeInfo = getChangeInfo(prev.value, curr.value);

        html += `<div class="comparison-row ${changeInfo.cls}">
          <span class="comparison-landmark">${curr.name}</span>
          <span class="comparison-prev">${prevLabel}</span>
          <span class="comparison-arrow">→</span>
          <span class="comparison-curr">${currLabel}</span>
          <span class="comparison-change">${changeInfo.text}</span>
        </div>`;
      }

      html += '</div>';

      // 縮こまり・引っ張りの変化
      html += renderContractionComparison(prevDetail, contractionResult);
    }

    html += '</div>'; // .comparison-card

    compSection.innerHTML = html;
    compSection.style.display = 'block';
    compSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getChangeInfo(prevVal, currVal) {
    if (prevVal === currVal) {
      return { cls: 'comparison-unchanged', text: '変化なし' };
    }
    if (currVal === 0 && prevVal !== 0) {
      return { cls: 'comparison-improved', text: '改善' };
    }
    if (prevVal === 0 && currVal !== 0) {
      return { cls: 'comparison-worsened', text: '悪化' };
    }
    if (Math.abs(currVal) < Math.abs(prevVal)) {
      return { cls: 'comparison-improved', text: '改善' };
    }
    return { cls: 'comparison-worsened', text: '悪化' };
  }

  function renderContractionComparison(prevDetail, currDetail) {
    let html = '<div class="comparison-position-block">';
    html += '<h4 class="comparison-position-title">縮こまり・引っ張りの変化</h4>';

    // 前回の問題箇所
    const prevIssues = [];
    if (prevDetail.upper) {
      prevIssues.push(...prevDetail.upper.contractions.map(c => ({ ...c, bodyPart: '上半身' })));
      prevIssues.push(...prevDetail.upper.tensions.map(t => ({ ...t, bodyPart: '上半身' })));
    }
    if (prevDetail.lower) {
      prevIssues.push(...prevDetail.lower.contractions.map(c => ({ ...c, bodyPart: '下半身' })));
      prevIssues.push(...prevDetail.lower.tensions.map(t => ({ ...t, bodyPart: '下半身' })));
    }

    // 今回の問題箇所
    const currIssues = [];
    if (currDetail.upper) {
      currIssues.push(...currDetail.upper.contractions.map(c => ({ ...c, bodyPart: '上半身' })));
      currIssues.push(...currDetail.upper.tensions.map(t => ({ ...t, bodyPart: '上半身' })));
    }
    if (currDetail.lower) {
      currIssues.push(...currDetail.lower.contractions.map(c => ({ ...c, bodyPart: '下半身' })));
      currIssues.push(...currDetail.lower.tensions.map(t => ({ ...t, bodyPart: '下半身' })));
    }

    // 比較
    const allAreas = new Set();
    prevIssues.forEach(i => allAreas.add(i.area));
    currIssues.forEach(i => allAreas.add(i.area));

    if (allAreas.size === 0) {
      html += '<div class="comparison-row comparison-unchanged"><span>前回・今回ともに問題箇所なし</span></div>';
    } else {
      for (const area of allAreas) {
        const prev = prevIssues.find(i => i.area === area);
        const curr = currIssues.find(i => i.area === area);

        let cls = 'comparison-unchanged';
        let text = '';

        if (prev && !curr) {
          cls = 'comparison-improved';
          const typeLabel = prev.type === 'contraction' ? '縮こまり' : '引っ張り';
          text = `${area}: ${typeLabel}が解消`;
        } else if (!prev && curr) {
          cls = 'comparison-worsened';
          const typeLabel = curr.type === 'contraction' ? '縮こまり' : '引っ張り';
          text = `${area}: 新たに${typeLabel}が発生`;
        } else if (prev && curr) {
          if (prev.type === curr.type && prev.side === curr.side) {
            const typeLabel = curr.type === 'contraction' ? '縮こまり' : '引っ張り';
            text = `${area}: ${typeLabel}が継続`;
          } else {
            text = `${area}: 状態が変化`;
          }
        }

        if (text) {
          html += `<div class="comparison-row ${cls}"><span>${text}</span></div>`;
        }
      }
    }

    html += '</div>';
    return html;
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

    // プロトコルボタン表示
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';

    // 比較ボタンも更新
    updateCompareButton();
    updateTrendButton();

    // レポート更新
    renderReport();
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

    // 全身統合ダイアグラムを描画（DOMが存在してから）
    const unifiedContainer = document.getElementById('diagram-unified');
    if (unifiedContainer) {
      BodyDiagram.init('diagram-unified');
      BodyDiagram.updateUnified('diagram-unified', detailData.upperDetail, detailData.lowerDetail);
    }

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 治療家モード：詳細分析表示 =====
  function renderPractitionerAnalysis(allLandmarks, upperResult, lowerResult, allIssues) {
    let html = '';

    // === 全身統合ダイアグラム（SVG 1枚で全身表示） ===
    html += '<div class="contraction-section">';
    html += '<h3>全身統合ダイアグラム</h3>';
    html += '<p class="unified-diagram-desc">肩峰〜外果まで全6ランドマークを1つの人体図で表示。体幹（肩峰↔大転子）のズレも可視化しています。</p>';
    html += '<div class="body-diagram-wrapper unified-diagram-wrapper">';
    html += '<div class="body-diagram-container" id="diagram-unified"></div>';
    html += '</div>';

    // テキスト版のランドマーク一覧
    html += '<h3 style="margin-top:20px;">全身ランドマーク状態</h3>';
    html += '<div class="contraction-diagram">';

    // 上半身ヘッダー
    html += '<div class="body-part-divider"><span>上半身</span></div>';

    for (let i = 0; i < upperResult.landmarks.length; i++) {
      html += renderLandmarkRow(upperResult.landmarks[i], i + 1);
      if (i < upperResult.landmarks.length - 1) {
        html += renderBetweenRow(upperResult.contractions, upperResult.tensions, i);
      }
    }

    // 体幹ズレ分析（肩峰↔大転子）
    const acromVal = detailData.upperDetail.acromion || 0;
    const gtVal = detailData.lowerDetail.greaterTrochanter || 0;
    if (acromVal !== 0 || gtVal !== 0) {
      let trunkDesc = '';
      let trunkClass = '';
      if (acromVal !== 0 && gtVal !== 0 && acromVal !== gtVal) {
        trunkDesc = '体幹回旋ズレ（肩峰と大転子が逆方向）';
        trunkClass = 'trunk-rotation';
      } else if (acromVal !== 0 && gtVal !== 0 && acromVal === gtVal) {
        trunkDesc = '全体偏位（肩峰と大転子が同方向）';
        trunkClass = 'trunk-shift';
      } else if (acromVal !== 0) {
        trunkDesc = '上半身のみ偏位';
        trunkClass = 'trunk-upper';
      } else {
        trunkDesc = '下半身のみ偏位';
        trunkClass = 'trunk-lower';
      }
      html += `<div class="diagram-between trunk-analysis ${trunkClass}">
        <span class="trunk-mark">⟷ ${trunkDesc}</span>
        <span class="contraction-area">肩峰〜大転子（体幹）</span>
      </div>`;
    } else {
      html += '<div class="body-part-divider"><span>体幹</span></div>';
    }

    // 下半身
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

    // 全身統合ダイアグラム（患者モードでも表示）
    html += '<div class="body-diagram-wrapper unified-diagram-wrapper">';
    html += '<div class="body-diagram-container" id="diagram-unified"></div>';
    html += '</div>';

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
      const success = Storage.save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance, selectedPatientId);
      if (success) {
        alert('検査結果を保存しました');
        updateCompareButton();
        updateTrendButton();
      } else {
        alert('保存に失敗しました');
      }
    });

    // 患者用PDF
    document.getElementById('savePdfPatientBtn').addEventListener('click', () => {
      if (!diagnosisResult) return;
      const patientName = document.getElementById('patientName').value;
      const inspectionDate = document.getElementById('inspectionDate').value;
      // Gather selfcare data for PDF
      const selfcareItems = [];
      if (contractionResult) {
        const allIssues = [
          ...(contractionResult.upper ? [...contractionResult.upper.contractions, ...contractionResult.upper.tensions] : []),
          ...(contractionResult.lower ? [...contractionResult.lower.contractions, ...contractionResult.lower.tensions] : [])
        ];
        const rendered = new Set();
        for (const issue of allIssues) {
          const cacheKey = `${issue.areaShort}_${issue.type}`;
          if (rendered.has(cacheKey)) continue;
          rendered.add(cacheKey);
          if (typeof SelfcareDatabase !== 'undefined') {
            const exercise = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
            if (exercise) {
              selfcareItems.push({
                name: exercise.name,
                description: exercise.description || '',
                duration: exercise.frequency || exercise.duration || ''
              });
            }
          }
        }
      }
      PdfExport.exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareItems);
    });

    // 施術者用PDF
    document.getElementById('savePdfClinicalBtn').addEventListener('click', () => {
      if (!diagnosisResult) return;
      const patientName = document.getElementById('patientName').value;
      const inspectionDate = document.getElementById('inspectionDate').value;
      PdfExport.exportClinicalPdf(patientName, inspectionDate, diagnosisResult, contractionResult, detailData, weightBalance);
    });

    // 比較ボタン
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        const compSection = document.getElementById('comparisonSection');
        if (compSection.style.display === 'block') {
          compSection.style.display = 'none';
          compareBtn.textContent = '前回と比較';
        } else {
          renderComparison();
          compareBtn.textContent = '比較を閉じる';
        }
      });
    }

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

  // ===== 施術プロトコルボタン =====
  function setupProtocolButton() {
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (!protocolBtn) return;
    protocolBtn.addEventListener('click', () => {
      const section = document.getElementById('treatmentProtocolSection');
      if (section.style.display === 'block') {
        section.style.display = 'none';
        protocolBtn.textContent = '施術プロトコル';
      } else {
        renderTreatmentProtocol();
        protocolBtn.textContent = 'プロトコルを閉じる';
      }
    });
  }

  // ===== 施術プロトコル描画 =====
  function renderTreatmentProtocol() {
    const section = document.getElementById('treatmentProtocolSection');
    if (!section || !diagnosisResult) return;

    const plan = TreatmentProtocol.generatePlan(diagnosisResult, contractionResult);
    let html = '<div class="treatment-protocol practitioner-only">';
    html += '<h2 class="protocol-title">施術プロトコル提案</h2>';

    if (plan.mainProtocol) {
      html += '<div class="protocol-card protocol-main">';
      html += `<div class="protocol-card-header"><h3>${plan.mainProtocol.title}</h3><span class="protocol-badge">メインプロトコル</span></div>`;
      html += '<div class="protocol-techniques">';
      for (const tech of plan.mainProtocol.techniques) {
        html += `<div class="protocol-technique">
          <div class="technique-header">
            <span class="technique-name">${tech.name}</span>
            <span class="technique-duration">${tech.duration}</span>
          </div>
          <div class="technique-target">対象: ${tech.target}</div>
          <div class="technique-desc">${tech.description}</div>
        </div>`;
      }
      html += '</div>';
      if (plan.mainProtocol.checkpoints && plan.mainProtocol.checkpoints.length > 0) {
        html += '<div class="protocol-checkpoints"><h4>チェックポイント</h4><ul>';
        for (const cp of plan.mainProtocol.checkpoints) {
          html += `<li>${cp}</li>`;
        }
        html += '</ul></div>';
      }
      html += '</div>';
    }

    if (plan.areaProtocols.length > 0) {
      html += '<h3 class="protocol-sub-title">部位別プロトコル</h3>';
      for (const ap of plan.areaProtocols) {
        const typeLabel = ap.issueType === 'contraction' ? '縮こまり' : '引っ張り';
        const sideLabel = ap.side === 'both' ? '両側' : ap.side === 'right' ? '右側' : '左側';
        html += `<div class="protocol-card protocol-area">`;
        html += `<div class="protocol-card-header"><h3>${ap.title}</h3><span class="protocol-badge-small">${sideLabel} / ${typeLabel}</span></div>`;
        html += '<div class="protocol-techniques">';
        for (const tech of ap.techniques) {
          html += `<div class="protocol-technique">
            <div class="technique-header">
              <span class="technique-name">${tech.name}</span>
              <span class="technique-duration">${tech.duration}</span>
            </div>
            <div class="technique-target">対象: ${tech.target}</div>
            <div class="technique-desc">${tech.description}</div>
          </div>`;
        }
        html += '</div></div>';
      }
    }

    if (plan.estimatedTime > 0) {
      html += `<div class="protocol-total-time">推定施術時間: <strong>約${plan.estimatedTime}分</strong></div>`;
    }

    if (!plan.mainProtocol && plan.areaProtocols.length === 0) {
      html += '<div class="protocol-empty"><p>現在の診断結果に基づく施術プロトコルはありません。</p></div>';
    }

    html += '</div>';
    section.innerHTML = html;
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== レポート描画 =====
  function renderReport() {
    const container = document.getElementById('reportContent');
    if (!container || !diagnosisResult) {
      if (container) {
        container.innerHTML = '<div class="report-empty"><p>診断を完了すると、レポートが自動生成されます。</p></div>';
      }
      return;
    }

    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];
    const patientName = document.getElementById('patientName').value || '名前未入力';
    const inspectionDate = document.getElementById('inspectionDate').value || new Date().toISOString().split('T')[0];

    let html = '';

    // Header
    html += `<div class="report-header-card">
      <div class="report-patient-info">
        <h3>${patientName}</h3>
        <span class="report-date">${inspectionDate}</span>
      </div>
    </div>`;

    // Main diagnosis
    html += `<div class="report-diagnosis-card" style="--cause-color: ${causeInfo.color}">
      <div class="report-cause-icon">${causeInfo.icon}</div>
      <h3 class="report-cause-label" style="color: ${causeInfo.color}">${causeInfo.label}</h3>
      <p class="report-cause-summary">${diagnosisResult.summary}</p>
      ${diagnosisResult.treatmentArea && diagnosisResult.treatmentArea !== 'なし'
        ? `<div class="report-treatment-badge">治療対象: ${diagnosisResult.treatmentArea}</div>` : ''}
    </div>`;

    // Body map summary (text-based)
    html += '<div class="report-body-map">';
    html += '<h3>身体バランスマップ</h3>';
    html += '<div class="report-map-grid">';

    // Standing landmarks
    const posLabels = { standing: '立位', seated: '座位', upperBody: '上半身' };
    for (const pos of ['standing', 'seated', 'upperBody']) {
      const data = examData[pos];
      if (!data) continue;
      html += `<div class="report-map-position">`;
      html += `<h4>${posLabels[pos]}</h4>`;
      for (const [lmKey, lmConfig] of Object.entries(InspectionLogic.landmarks)) {
        const val = data[lmKey] || 0;
        const label = InspectionLogic.valueLabels[val.toString()];
        const indicator = val === 0 ? 'balanced' : (val < 0 ? 'left-high' : 'right-high');
        html += `<div class="report-map-item ${indicator}">
          <span class="report-map-name">${lmConfig.name}</span>
          <span class="report-map-value">${label}</span>
        </div>`;
      }
      html += '</div>';
    }
    html += '</div></div>';

    // Contraction summary
    if (contractionResult) {
      const allIssues = [];
      if (contractionResult.upper) {
        allIssues.push(...contractionResult.upper.contractions.map(c => ({ ...c, bodyPart: '上半身' })));
        allIssues.push(...contractionResult.upper.tensions.map(t => ({ ...t, bodyPart: '上半身' })));
      }
      if (contractionResult.lower) {
        allIssues.push(...contractionResult.lower.contractions.map(c => ({ ...c, bodyPart: '下半身' })));
        allIssues.push(...contractionResult.lower.tensions.map(t => ({ ...t, bodyPart: '下半身' })));
      }

      if (allIssues.length > 0) {
        html += '<div class="report-issues">';
        html += '<h3>検出された問題箇所</h3>';
        html += '<div class="report-issues-grid">';
        for (const issue of allIssues) {
          const typeLabel = issue.type === 'contraction' ? '縮こまり' : '引っ張り';
          const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
          const typeClass = issue.type === 'contraction' ? 'contraction' : 'tension';
          html += `<div class="report-issue-item ${typeClass}">
            <div class="report-issue-type">${typeLabel}</div>
            <div class="report-issue-area">${issue.area}</div>
            <div class="report-issue-side">${sideLabel} / ${issue.bodyPart}</div>
          </div>`;
        }
        html += '</div></div>';
      }
    }

    // Before/after comparison (if previous data exists)
    const pid = selectedPatientId || Storage.findPatientIdByName(patientName);
    if (pid) {
      const history = Storage.getHistoryByPatient(pid);
      if (history.length > 0) {
        const prevEntry = history[0];
        const prevDate = new Date(prevEntry.date);
        const prevDateStr = `${prevDate.getFullYear()}/${String(prevDate.getMonth() + 1).padStart(2, '0')}/${String(prevDate.getDate()).padStart(2, '0')}`;
        const prevCause = InspectionLogic.causeLabels[prevEntry.diagnosisResult?.primaryCause];

        html += '<div class="report-comparison">';
        html += '<h3>前回との比較</h3>';
        html += `<div class="report-comparison-summary">
          <div class="report-comp-prev">
            <span class="report-comp-label">前回 (${prevDateStr})</span>
            <span class="report-comp-value">${prevCause ? prevCause.icon + ' ' + prevCause.label : '-'}</span>
          </div>
          <div class="report-comp-arrow">→</div>
          <div class="report-comp-curr">
            <span class="report-comp-label">今回</span>
            <span class="report-comp-value">${causeInfo.icon} ${causeInfo.label}</span>
          </div>
        </div>`;

        // Landmark changes
        let changeCount = 0;
        let improvedCount = 0;
        for (const pos of ['standing', 'seated', 'upperBody']) {
          const prevData = prevEntry.examData?.[pos];
          const currData = examData[pos];
          if (!prevData || !currData) continue;
          for (const lmKey of Object.keys(InspectionLogic.landmarks)) {
            const pv = prevData[lmKey] || 0;
            const cv = currData[lmKey] || 0;
            if (pv !== cv) {
              changeCount++;
              if (cv === 0 || Math.abs(cv) < Math.abs(pv)) improvedCount++;
            }
          }
        }
        if (changeCount > 0) {
          html += `<div class="report-comp-stats">
            <div class="report-stat"><span class="report-stat-num">${changeCount}</span><span class="report-stat-label">箇所変化</span></div>
            <div class="report-stat improved"><span class="report-stat-num">${improvedCount}</span><span class="report-stat-label">箇所改善</span></div>
          </div>`;
        } else {
          html += '<p class="report-comp-no-change">前回と同じ状態です。</p>';
        }
        html += '</div>';
      }
    }

    // Selfcare summary
    if (contractionResult) {
      const allIssues = [];
      if (contractionResult.upper) {
        allIssues.push(...contractionResult.upper.contractions, ...contractionResult.upper.tensions);
      }
      if (contractionResult.lower) {
        allIssues.push(...contractionResult.lower.contractions, ...contractionResult.lower.tensions);
      }

      if (allIssues.length > 0 && typeof SelfcareDatabase !== 'undefined') {
        const rendered = new Set();
        const exercises = [];
        for (const issue of allIssues) {
          const cacheKey = `${issue.areaShort}_${issue.type}`;
          if (rendered.has(cacheKey)) continue;
          rendered.add(cacheKey);
          const exercise = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
          if (exercise) exercises.push(exercise);
        }

        if (exercises.length > 0) {
          html += '<div class="report-selfcare">';
          html += '<h3>セルフケアのおすすめ</h3>';
          html += '<div class="report-selfcare-list">';
          for (const ex of exercises) {
            html += `<div class="report-selfcare-item">
              <span class="report-sc-name">${ex.name}</span>
              <span class="report-sc-freq">${ex.frequency || ex.duration || ''}</span>
            </div>`;
          }
          html += '</div></div>';
        }
      }
    }

    container.innerHTML = html;
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
    selectedPatientId = null;

    document.querySelectorAll('.landmark-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('patientName').value = '';
    document.getElementById('inspectionMemo').value = '';
    document.getElementById('patientSearch').value = '';
    const examCountDiv = document.getElementById('patientExamCount');
    if (examCountDiv) {
      examCountDiv.style.display = 'none';
      examCountDiv.textContent = '';
    }
    setDefaultDate();

    document.getElementById('seatedComparison').style.display = 'none';
    document.getElementById('diagnosisContent').innerHTML = '';
    document.getElementById('diagnosisActions').style.display = 'none';
    document.getElementById('detailedExamSection').style.display = 'none';
    document.getElementById('contractionAnalysis').style.display = 'none';

    const compSection = document.getElementById('comparisonSection');
    if (compSection) compSection.style.display = 'none';
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
      compareBtn.style.display = 'none';
      compareBtn.textContent = '前回と比較';
    }

    const selfcareDiv = document.getElementById('selfcareSection');
    if (selfcareDiv) selfcareDiv.style.display = 'none';
    const selfcareBtn = document.getElementById('showSelfcareBtn');
    if (selfcareBtn) {
      selfcareBtn.style.display = 'none';
      selfcareBtn.textContent = 'セルフケア提案';
    }

    // Reset protocol
    const protocolSection = document.getElementById('treatmentProtocolSection');
    if (protocolSection) protocolSection.style.display = 'none';
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) {
      protocolBtn.style.display = 'none';
      protocolBtn.textContent = '施術プロトコル';
    }

    // Reset report
    const reportContent = document.getElementById('reportContent');
    if (reportContent) reportContent.innerHTML = '';

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
    if (entry.patientId) {
      selectedPatientId = entry.patientId;
    }

    document.getElementById('patientName').value = entry.patientName || '';
    if (entry.memo) {
      document.getElementById('inspectionMemo').value = entry.memo;
    }

    // 患者検査回数を表示
    if (entry.patientId) {
      const history = Storage.getHistoryByPatient(entry.patientId);
      const examCountDiv = document.getElementById('patientExamCount');
      if (examCountDiv && history.length > 0) {
        examCountDiv.textContent = `過去${history.length}回の検査記録があります`;
        examCountDiv.style.display = 'block';
      }
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

    // プロトコルボタン表示
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';

    // 比較ボタンを更新
    updateCompareButton();
    updateTrendButton();

    // レポート更新
    renderReport();

    switchTab('diagnosis');
  }

  // ===== DOM準備完了時に初期化 =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
