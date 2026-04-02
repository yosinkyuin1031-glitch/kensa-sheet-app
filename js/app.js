// ===== メインアプリケーション：ウィザード形式の検査フロー =====

(function() {
  'use strict';

  // ===== 状態管理 =====
  let currentStep = 0;
  const viewMode = 'practitioner'; // 施術者専用
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
  let loadedEntryId = null;      // 読み込んだ検査記録のID
  let loadedEntryDate = null;    // 読み込んだ検査記録の日付
  let painLevel = null;  // NRS 0-10
  let chiefComplaintText = '';  // 主訴テキスト
  let patientAge = null;
  let patientGender = '';
  let patientOccupation = '';
  let visitType = 'initial';
  let medicalHistory = '';

  // ===== 認証・初期化 =====
  async function initAuth() {
    try {
    await SupabaseAuth.init();
    } catch(e) {
      console.error('initAuth error:', e);
      const errEl = document.getElementById('loginError');
      if (errEl) { errEl.textContent = 'Init error: ' + e.message; errEl.style.display = 'block'; }
    }

    // ログイン/登録フォームの切り替え
    document.getElementById('showSignup').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('signupForm').style.display = 'block';
    });
    document.getElementById('showLogin').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    });

    // パスワードリセット表示
    document.getElementById('showResetPassword').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('resetPasswordForm').style.display = 'block';
      document.getElementById('resetError').style.display = 'none';
      document.getElementById('resetSuccess').style.display = 'none';
      document.getElementById('resetEmail').value = document.getElementById('loginEmail').value || '';
    });
    document.getElementById('backToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('resetPasswordForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    });

    // パスワードリセット送信
    document.getElementById('resetBtn').addEventListener('click', async () => {
      const email = document.getElementById('resetEmail').value.trim();
      const errorDiv = document.getElementById('resetError');
      const successDiv = document.getElementById('resetSuccess');
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      if (!email) {
        errorDiv.textContent = 'メールアドレスを入力してください';
        errorDiv.style.display = 'block';
        return;
      }
      try {
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('resetBtn').textContent = '送信中...';
        await SupabaseAuth.resetPassword(email);
        successDiv.textContent = 'リセット用メールを送信しました。メールを確認してパスワードを再設定してください。';
        successDiv.style.display = 'block';
        document.getElementById('resetBtn').textContent = '送信完了';
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('resetBtn').textContent = 'リセットメールを送信';
      }
    });

    // Enterキーでリセット送信
    document.getElementById('resetEmail').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('resetBtn').click();
    });

    // ログインボタン
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('loginError');
      if (!email || !password) {
        errorDiv.textContent = 'メールアドレスとパスワードを入力してください';
        errorDiv.style.display = 'block';
        return;
      }
      try {
        document.getElementById('loginBtn').disabled = true;
        document.getElementById('loginBtn').textContent = 'ログイン中...';
        await SupabaseAuth.login(email, password);
        showMainApp();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      } finally {
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').textContent = 'ログイン';
      }
    });

    // 登録ボタン
    document.getElementById('signupBtn').addEventListener('click', async () => {
      const name = document.getElementById('signupName').value.trim();
      const clinic = document.getElementById('signupClinic').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const errorDiv = document.getElementById('signupError');
      if (!name || !email || !password) {
        errorDiv.textContent = 'お名前・メールアドレス・パスワードは必須です';
        errorDiv.style.display = 'block';
        return;
      }
      if (password.length < 6) {
        errorDiv.textContent = 'パスワードは6文字以上にしてください';
        errorDiv.style.display = 'block';
        return;
      }
      try {
        document.getElementById('signupBtn').disabled = true;
        document.getElementById('signupBtn').textContent = '登録中...';
        await SupabaseAuth.signup(email, password, clinic, name);
        showMainApp();
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.style.display = 'block';
      } finally {
        document.getElementById('signupBtn').disabled = false;
        document.getElementById('signupBtn').textContent = '登録する';
      }
    });

    // Enterキーでログイン/登録
    document.getElementById('loginPassword').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('loginBtn').click();
    });
    document.getElementById('signupPassword').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('signupBtn').click();
    });

    // ログアウトボタン
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      if (confirm('ログアウトしますか？')) {
        await SupabaseAuth.logout();
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('authScreen').style.display = 'flex';
      }
    });

    // デモモード: ?demo=true でログイン画面スキップ
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
      try {
        await SupabaseAuth.login('demo@kensa-app.com', 'demo1234');
        showMainApp();
        return;
      } catch(e) {
        console.error('デモ自動ログインエラー:', e);
      }
    }

    // セッション確認
    const session = await SupabaseAuth.getSession();
    if (session) {
      showMainApp();
    }
  }

  async function showMainApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    await init();
  }

  async function init() {
    try {
    // カスタム項目をバックグラウンドで読み込み
    const clinicId = SupabaseAuth.getClinicId();
    if (clinicId) {
      SelfcareDatabase.loadCustomItems(clinicId);
      TreatmentProtocol.loadCustomProtocols(clinicId);
    }
    setupTabNavigation();
    setupWizardNavigation();
    setupLandmarkButtons();
    setupWeightBalanceButtons();
    setupNRSButtons();
    setupChiefComplaints();
    setupDiagnosisActions();
    setupPatientModeButtons();
    setupPrintButtons();
    setupDetailedExamButtons();
    setupPatientSearch();
    setupProtocolButton();
    setupCustomSettingsModal();
    setupBackupButtons();
    setupTrendButton();
    setDefaultDate();
    await refreshHistory();
    initDiagrams();
    registerServiceWorker();
    showTutorialIfNeeded();
    } catch(e) {
      console.error('init() error:', e);
      document.title = 'ERROR: ' + e.message;
      alert('初期化エラー: ' + e.message);
    }
  }

  // ===== Service Worker登録（キャッシュ問題のため無効化） =====
  function registerServiceWorker() {
    // SW登録は一旦停止（index.htmlで既存SWを自動解除済み）
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

    exportBtn.addEventListener('click', async () => {
      try {
        const history = await Storage.getAll();
        const exportData = {
          appName: 'KensaApp',
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
        a.download = `カラダマップ_バックアップ_${dateStr}.json`;
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
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target.result);

          // バリデーション
          if (!imported || !imported.appName || (imported.appName !== 'KensaApp' && imported.appName !== 'BodyCheckPro') || !Array.isArray(imported.data)) {
            alert('このファイルはカラダマップのバックアップデータではありません');
            return;
          }

          // データの基本構造チェック
          for (const entry of imported.data) {
            if (!entry.id || !entry.date || !entry.examData) {
              alert('データの形式が正しくありません。破損している可能性があります。');
              return;
            }
          }

          const existingData = await Storage.getAll();
          const existingIds = new Set(existingData.map(e => e.id));
          let newCount = 0;

          // 既存データとマージ（重複IDはクラウドにインポート）
          for (const entry of imported.data) {
            if (!existingIds.has(entry.id)) {
              // クラウドに保存
              const causeInfo = entry.diagnosisResult ? InspectionLogic.causeLabels[entry.diagnosisResult.primaryCause] : null;
              await Storage.save(
                entry.examData, entry.diagnosisResult,
                entry.patientName, entry.memo,
                entry.detailData, entry.contractionResult,
                entry.weightBalance, entry.patientId,
                entry.painLevel, entry.chiefComplaints
              );
              newCount++;
            }
          }

          await refreshHistory();

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

  async function updateTrendButton() {
    const trendBtn = document.getElementById('showTrendBtn');
    if (!trendBtn) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || await Storage.findPatientIdByName(patientName);
    if (!pid) {
      trendBtn.style.display = 'none';
      return;
    }
    const history = await Storage.getHistoryByPatient(pid);
    trendBtn.style.display = history.length >= 2 ? '' : 'none';
  }

  async function renderPatientTrend() {
    const trendSection = document.getElementById('trendSection');
    if (!trendSection) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || await Storage.findPatientIdByName(patientName);
    if (!pid) return;

    const history = await Storage.getHistoryByPatient(pid);
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
    svg += `<text x="14" y="${padTop + plotH / 2}" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90, 14, ${padTop + plotH / 2})">ずれ箇所数</text>`;

    // 矢印（改善方向を示す）
    svg += `<text x="${padLeft - 8}" y="${padTop - 8}" text-anchor="end" font-size="9" fill="#ef4444">↑歪み大</text>`;
    svg += `<text x="${padLeft - 8}" y="${padTop + plotH + 14}" text-anchor="end" font-size="9" fill="#22c55e">↓正常</text>`;

    svg += '</svg>';

    // 全体の変化判定
    const firstScore = exams[0].score;
    const lastScore = exams[exams.length - 1].score;
    const totalChange = lastScore - firstScore;
    let summaryText = '';
    if (totalChange < 0) {
      summaryText = `<span style="color:#22c55e;font-weight:700;">改善傾向</span>（9箇所中 ${firstScore}箇所→${lastScore}箇所）`;
    } else if (totalChange > 0) {
      summaryText = `<span style="color:#ef4444;font-weight:700;">悪化傾向</span>（9箇所中 ${firstScore}箇所→${lastScore}箇所）`;
    } else {
      summaryText = `<span style="color:#64748b;font-weight:700;">横ばい</span>（9箇所中${firstScore}箇所にずれ）`;
    }

    // HTML生成
    let html = '<div class="trend-card">';
    html += '<div class="trend-header">';
    html += '<h3>経過グラフ</h3>';
    html += `<p>${patientName || '患者'}さんの検査${exams.length}回分の推移</p>`;
    html += `<p style="margin-top:4px;">${summaryText}</p>`;
    html += '</div>';

    html += `<div class="trend-chart-wrapper">${svg}</div>`;

    html += '<div class="trend-guide" style="font-size:11px;color:#64748b;padding:6px 12px;background:#f8fafc;border-radius:8px;margin:8px 0;">';
    html += '📊 <strong>見方：</strong>9箇所のチェックポイントのうち、ずれている箇所数を表示。グラフが<span style="color:#22c55e;font-weight:600;">下がる</span>ほど改善。0が理想。';
    html += '</div>';

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
      btn.addEventListener('click', async () => {
        toggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.dataset.mode;
        document.body.setAttribute('data-view', viewMode);

        // 患者モード切替時のタブ処理
        if (viewMode === 'patient') {
          // 患者モード: 診断結果タブに自動切替
          switchToTab('diagnosis');
          // 患者用アクションバーの同期
          syncPatientActions();
          // 待機カード表示制御
          const waitCard = document.getElementById('patientWaiting');
          if (waitCard) waitCard.style.display = diagnosisResult ? 'none' : 'block';
        } else {
          // 施術者モード: 待機カード非表示
          const waitCard = document.getElementById('patientWaiting');
          if (waitCard) waitCard.style.display = 'none';
        }

        // 患者タブのイベント設定
        setupPatientTabs();

        // 既に表示済みの結果を再描画
        if (diagnosisResult) {
          await renderDiagnosis(diagnosisResult);
          if (contractionResult) {
            renderUnifiedAnalysis(contractionResult.upper, contractionResult.lower);
          }
          await renderReport();
        }
      });
    });
  }

  // 患者モード用タブ設定
  function setupPatientTabs() {
    const patientNav = document.querySelector('.patient-tab-nav');
    if (!patientNav) return;
    patientNav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        patientNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchToTab(btn.dataset.tab);
      };
    });
  }

  // タブ切替の共通処理
  function switchToTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(tabName + '-section');
    if (target) target.classList.add('active');

    // 施術者モードのタブボタン同期
    document.querySelectorAll('.tab-nav .tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });

    if (tabName === 'report') renderReport(); // async, no await needed in tab switch
  }

  // 患者モード用アクションバーの状態を同期
  function syncPatientActions() {
    const patientActions = document.getElementById('patientActions');
    if (!patientActions) return;
    patientActions.style.display = diagnosisResult ? 'flex' : 'none';

    // 印刷ボタン
    const patientPrintBtn = document.getElementById('patientPrintBtn');
    if (patientPrintBtn) patientPrintBtn.style.display = diagnosisResult ? '' : 'none';

    const selfcareBtn = document.getElementById('patientSelfcareBtn');
    if (selfcareBtn && contractionResult) {
      const allIssues = [
        ...(contractionResult.upper ? [...contractionResult.upper.contractions, ...contractionResult.upper.tensions] : []),
        ...(contractionResult.lower ? [...contractionResult.lower.contractions, ...contractionResult.lower.tensions] : [])
      ];
      selfcareBtn.style.display = allIssues.length > 0 ? '' : 'none';
    }
  }

  function initDiagrams() {
    BodyDiagram.init('diagram-standing');
    BodyDiagram.init('diagram-seated');
    BodyDiagram.init('diagram-upperBody');
    BodyDiagram.init('diagram-detailUnified');
  }

  function updateDiagram(position) {
    const diagramMap = {
      standing:    { id: 'diagram-standing',    type: 'firstStage', data: examData.standing },
      seated:      { id: 'diagram-seated',      type: 'firstStage', data: examData.seated },
      upperBody:   { id: 'diagram-upperBody',   type: 'firstStage', data: examData.upperBody }
    };
    const cfg = diagramMap[position];
    if (cfg) {
      BodyDiagram.update(cfg.id, cfg.type, cfg.data);
    }

    // 立位検査の入力時は全身統合ダイアグラムをリアルタイム更新
    if (position === 'upperDetail' || position === 'lowerDetail' || position === 'standing') {
      BodyDiagram.updateUnified('diagram-detailUnified', detailData.upperDetail, detailData.lowerDetail, examData.standing);
    }
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
      debounceTimer = setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
          suggestionsDiv.innerHTML = '';
          suggestionsDiv.style.display = 'none';
          return;
        }

        const results = await Storage.searchPatients(query);
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

  async function selectPatient(patientId, patientName) {
    selectedPatientId = patientId;
    document.getElementById('patientName').value = patientName;

    const history = await Storage.getHistoryByPatient(patientId);
    const examCountDiv = document.getElementById('patientExamCount');
    if (examCountDiv && history.length > 0) {
      examCountDiv.textContent = `過去${history.length}回の検査記録があります`;
      examCountDiv.style.display = 'block';
    }
  }

  // ===== タブナビゲーション =====
  function setupTabNavigation() {
    document.querySelectorAll('.tab-nav:not(.patient-tab-nav) .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    // 患者タブも初期設定
    setupPatientTabs();
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
        if (btn.disabled) return;
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

    const goToDiagnosisBtn = document.getElementById('goToDiagnosisBtn');
    if (goToDiagnosisBtn) {
      goToDiagnosisBtn.addEventListener('click', () => {
        switchTab('diagnosis');
      });
    }
  }

  function goToStep(step) {
    if (step < 0 || step > 4) return;
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
    updateNextButtonState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateCurrentStep() {
    return true; // ボタン無効化で制御するため常にtrue
  }

  // 現在のステップの全ランドマークが入力済みか判定し、次へボタンを有効/無効化
  function updateNextButtonState() {
    const panel = document.querySelector(`.wizard-panel[data-panel="${currentStep}"]`);
    if (!panel) return;

    const nextBtn = panel.querySelector('.wizard-next') || panel.querySelector('#diagnoseBtn');
    if (!nextBtn) return;

    let allFilled = true;

    if (currentStep === 1) {
      // Step 1: 詳細6 + 基本3 = 9ランドマーク
      for (const lm of InspectionLogic.upperDetailLandmarks) {
        if (detailData.upperDetail[lm.key] === null) { allFilled = false; break; }
      }
      if (allFilled) {
        for (const lm of InspectionLogic.lowerDetailLandmarks) {
          if (detailData.lowerDetail[lm.key] === null) { allFilled = false; break; }
        }
      }
      if (allFilled) {
        for (const landmark of Object.keys(InspectionLogic.landmarks)) {
          if (examData.standing[landmark] === null) { allFilled = false; break; }
        }
      }
    } else if (currentStep === 2 || currentStep === 3) {
      const position = currentStep === 2 ? 'seated' : 'upperBody';
      const data = examData[position];
      for (const landmark of Object.keys(InspectionLogic.landmarks)) {
        if (data[landmark] === null) { allFilled = false; break; }
      }
    } else {
      return; // Step 0, 4 はバリデーション不要
    }

    nextBtn.disabled = !allFilled;
    nextBtn.style.opacity = allFilled ? '1' : '0.4';
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

  // ===== 痛みスライダー =====
  function setupNRSButtons() {
    const slider = document.getElementById('painSlider');
    const valueDisplay = document.getElementById('painValue');
    if (!slider || !valueDisplay) return;
    function updateSlider() {
      const val = parseInt(slider.value);
      painLevel = val;
      valueDisplay.textContent = val;
      const pct = (val / 10) * 100;
      slider.style.background = `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
      valueDisplay.style.color = val <= 3 ? '#4f46e5' : val <= 6 ? '#f59e0b' : '#ef4444';
    }
    slider.addEventListener('input', updateSlider);
    updateSlider();
  }

  // ===== 主訴テキスト入力 =====
  function setupChiefComplaints() {
    const input = document.getElementById('chiefComplaintText');
    if (!input) return;
    input.addEventListener('input', () => {
      chiefComplaintText = input.value;
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
          updateNextButtonState();
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
  async function runDiagnosis() {
    // 患者追加情報を収集
    const ageInput = document.getElementById('patientAge');
    if (ageInput && ageInput.value) patientAge = parseInt(ageInput.value);
    const genderInput = document.getElementById('patientGender');
    if (genderInput) patientGender = genderInput.value;
    const occInput = document.getElementById('patientOccupation');
    if (occInput) patientOccupation = occInput.value;
    const visitInput = document.getElementById('visitType');
    if (visitInput) visitType = visitInput.value;
    const histInput = document.getElementById('medicalHistory');
    if (histInput) medicalHistory = histInput.value;

    diagnosisResult = InspectionLogic.diagnose(examData);
    await renderDiagnosis(diagnosisResult);
    showDetailedExam();
    await updateCompareButton();
    await updateTrendButton();
    // Show protocol button
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';
    // Auto-generate report
    await renderReport();
    // サマリーステップを飛ばして直接診断結果タブへ
    switchTab('diagnosis');
  }

  // ===== 比較ボタンの表示制御 =====
  async function updateCompareButton() {
    const compareBtn = document.getElementById('compareBtn');
    if (!compareBtn) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || await Storage.findPatientIdByName(patientName);

    if (!pid) {
      compareBtn.style.display = 'none';
      return;
    }

    const history = await Storage.getHistoryByPatient(pid);
    if (history.length > 0) {
      compareBtn.style.display = '';
    } else {
      compareBtn.style.display = 'none';
    }
  }

  // ===== ビフォーアフター比較 =====
  async function renderComparison() {
    const compSection = document.getElementById('comparisonSection');
    if (!compSection) return;

    const patientName = document.getElementById('patientName').value;
    const pid = selectedPatientId || await Storage.findPatientIdByName(patientName);
    if (!pid) return;

    const history = await Storage.getHistoryByPatient(pid);
    if (history.length === 0) return;

    // 読み込んだエントリをスキップして「前回」を探す
    let prevEntry = null;
    for (const entry of history) {
      if (loadedEntryId && entry.id === loadedEntryId) continue;
      if (entry.diagnosisResult) {
        prevEntry = entry;
        break;
      }
    }
    if (!prevEntry) return;

    const prevResult = prevEntry.diagnosisResult;
    const prevDetail = prevEntry.contractionResult;
    const prevDate = new Date(prevEntry.date);
    const prevDateStr = `${prevDate.getFullYear()}/${String(prevDate.getMonth() + 1).padStart(2, '0')}/${String(prevDate.getDate()).padStart(2, '0')} ${String(prevDate.getHours()).padStart(2, '0')}:${String(prevDate.getMinutes()).padStart(2, '0')}`;
    const currDate2 = loadedEntryDate ? new Date(loadedEntryDate) : new Date();
    const currDateStr2 = `${currDate2.getFullYear()}/${String(currDate2.getMonth() + 1).padStart(2, '0')}/${String(currDate2.getDate()).padStart(2, '0')} ${String(currDate2.getHours()).padStart(2, '0')}:${String(currDate2.getMinutes()).padStart(2, '0')}`;

    let html = '<div class="comparison-card">';
    html += '<div class="comparison-header">';
    html += '<h3>前回との比較（ビフォーアフター）</h3>';
    html += `<p class="comparison-date-info">前回: ${prevDateStr} → 今回: ${currDateStr2}</p>`;
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

      // 収縮・伸長の変化
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
    html += '<h4 class="comparison-position-title">収縮・伸長の変化</h4>';

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
          const typeLabel = prev.type === 'contraction' ? '収縮' : '伸長';
          text = `${area}: ${typeLabel}が解消`;
        } else if (!prev && curr) {
          cls = 'comparison-worsened';
          const typeLabel = curr.type === 'contraction' ? '収縮' : '伸長';
          text = `${area}: 新たに${typeLabel}が発生`;
        } else if (prev && curr) {
          if (prev.type === curr.type && prev.side === curr.side) {
            const typeLabel = curr.type === 'contraction' ? '収縮' : '伸長';
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
  async function renderDiagnosis(result) {
    const container = document.getElementById('diagnosisContent');
    const causeInfo = InspectionLogic.causeLabels[result.primaryCause];
    const isPatient = viewMode === 'patient';

    let html = '';

    // 全身統合人体図（診断結果画面上部に表示）
    html += `<div class="body-diagram-wrapper unified-diagram-wrapper">
      <div class="body-diagram-container" id="diagram-diagnosis-body"></div>
    </div>`;

    // メイン診断（両モード共通）
    html += `
    <div class="diagnosis-main" style="border-color: ${causeInfo.color}">
      <div class="diagnosis-icon">${causeInfo.icon}</div>
      <h3 class="diagnosis-label" style="color: ${causeInfo.color}">${isPatient ? getPatientFriendlyLabel(result.primaryCause) : causeInfo.label}</h3>
      <p class="diagnosis-summary">${isPatient ? getPatientFriendlySummary(result) : result.summary}</p>
      ${result.treatmentArea !== 'なし' ? `<div class="diagnosis-treatment">治療対象：<strong>${result.treatmentArea}</strong></div>` : ''}
      ${weightBalance ? `<div class="diagnosis-treatment" style="margin-top:8px;">重心バランス：<strong>${weightBalance === 'right' ? '右重心' : weightBalance === 'left' ? '左重心' : '均等'}</strong></div>` : ''}
    </div>`;

    // 前回比較（患者IDがあれば）
    html += await generatePreviousComparison();

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

    html += '</div>'; // .practitioner-only

    // === 患者モード：シンプルな説明 ===
    html += '<div class="patient-only">';
    html += renderPatientView(result);
    html += '</div>';

    container.innerHTML = html;

    // 診断結果画面の全身人体図を描画
    const diagBodyEl = document.getElementById('diagram-diagnosis-body');
    if (diagBodyEl) {
      BodyDiagram.init('diagram-diagnosis-body');
      // 詳細検査データがあれば全6ランドマーク表示、なければ基本3ランドマーク
      if (detailData.upperDetail.acromion !== null) {
        BodyDiagram.updateUnified('diagram-diagnosis-body', detailData.upperDetail, detailData.lowerDetail, examData.standing);
      } else {
        BodyDiagram.update('diagram-diagnosis-body', 'firstStage', examData.standing);
      }
    }

    // 前回比較の体図を描画
    await renderComparisonDiagrams();

    // アクションボタンは全身統合分析後に表示するため、ここでは非表示のまま
    document.getElementById('diagnosisActions').style.display = 'none';
    // 患者モード用アクションバーも非表示
    const patientActionsEl = document.getElementById('patientActions');
    if (patientActionsEl) patientActionsEl.style.display = 'none';
    // 患者待機カードを非表示
    const waitCard = document.getElementById('patientWaiting');
    if (waitCard) waitCard.style.display = 'none';
  }

  // ===== 前回比較セクション =====
  async function generatePreviousComparison() {
    if (!selectedPatientId || !diagnosisResult) return '';
    const history = await Storage.getHistoryByPatient(selectedPatientId);
    if (history.length < 2) return '';

    // 読み込んだエントリをスキップして「前回」を探す
    let prev = null;
    for (const entry of history) {
      if (loadedEntryId && entry.id === loadedEntryId) continue;
      if (entry.diagnosisResult) {
        prev = entry;
        break;
      }
    }
    if (!prev) return '';

    const prevCause = InspectionLogic.causeLabels[prev.diagnosisResult.primaryCause] || {};
    const currCause = InspectionLogic.causeLabels[diagnosisResult.primaryCause] || {};

    // NRS比較
    let nrsCompare = '';
    if (prev.painLevel != null && painLevel != null) {
      const diff = painLevel - prev.painLevel;
      const arrow = diff < 0 ? '↓ 改善' : diff > 0 ? '↑ 悪化' : '→ 変化なし';
      const color = diff < 0 ? '#22c55e' : diff > 0 ? '#ef4444' : '#64748b';
      nrsCompare = `<div class="compare-item"><span class="compare-label">痛みレベル</span><span style="color:${color};font-weight:700;">${prev.painLevel} → ${painLevel}（${arrow}）</span></div>`;
    }

    // 重心比較
    let wbCompare = '';
    if (prev.weightBalance && weightBalance) {
      const wbLabels = { right: '右重心', left: '左重心', even: '均等' };
      const changed = prev.weightBalance !== weightBalance;
      wbCompare = `<div class="compare-item"><span class="compare-label">重心</span><span>${wbLabels[prev.weightBalance] || '?'} → ${wbLabels[weightBalance] || '?'}${changed ? ' (変化あり)' : ''}</span></div>`;
    }

    const prevDate = new Date(prev.date);
    const prevDateStr = `${prevDate.getFullYear()}/${String(prevDate.getMonth()+1).padStart(2,'0')}/${String(prevDate.getDate()).padStart(2,'0')} ${String(prevDate.getHours()).padStart(2,'0')}:${String(prevDate.getMinutes()).padStart(2,'0')}`;
    const currDate = loadedEntryDate ? new Date(loadedEntryDate) : new Date();
    const currDateStr = `${currDate.getFullYear()}/${String(currDate.getMonth()+1).padStart(2,'0')}/${String(currDate.getDate()).padStart(2,'0')} ${String(currDate.getHours()).padStart(2,'0')}:${String(currDate.getMinutes()).padStart(2,'0')}`;

    // 前回・今回のバランススコア計算
    let prevScore = 0, currScore = 0;
    if (prev.examData) {
      for (const pos of ['standing', 'seated', 'upperBody']) {
        if (prev.examData[pos]) {
          for (const lm of Object.keys(prev.examData[pos])) {
            prevScore += Math.abs(prev.examData[pos][lm] || 0);
          }
        }
      }
    }
    for (const pos of ['standing', 'seated', 'upperBody']) {
      if (examData[pos]) {
        for (const lm of Object.keys(examData[pos])) {
          currScore += Math.abs(examData[pos][lm] || 0);
        }
      }
    }
    const scoreDiff = currScore - prevScore;
    const scoreArrow = scoreDiff < 0 ? '↓ 改善' : scoreDiff > 0 ? '↑ 悪化' : '→ 変化なし';
    const scoreColor = scoreDiff < 0 ? '#22c55e' : scoreDiff > 0 ? '#ef4444' : '#64748b';

    // 縮み・伸び箇所数をdetailDataから動的に計算
    function countContractionZones(dData, sData) {
      let contractions = 0, tensions = 0;
      if (!dData) return { contractions, tensions };

      const upper = dData.upperDetail || {};
      const lower = dData.lowerDetail || {};
      const standing = sData || {};

      // 隣接ランドマークのペアで互い違い（縮み/伸び）を判定
      const pairs = [
        [standing.mastoid, upper.acromion],
        [upper.acromion, standing.scapulaInferior],
        [standing.scapulaInferior, standing.iliacCrest],
        [standing.iliacCrest, lower.greaterTrochanter],
        [upper.acromion, upper.mastoidDetail],
        [upper.mastoidDetail, upper.radialStyloid],
        [lower.greaterTrochanter, lower.patellaUpper],
        [lower.patellaUpper, lower.lateralMalleolus]
      ];

      for (const [a, b] of pairs) {
        if (a == null || b == null || a === 0 || b === 0 || a === b) continue;
        // 互い違い = 片側が縮み、反対側が伸び
        contractions++;
        tensions++;
      }
      return { contractions, tensions };
    }

    const prevIssues = countContractionZones(prev.detailData, prev.examData?.standing);
    const currIssues = countContractionZones(detailData, examData.standing);

    // 縮み箇所の比較
    let contractionCompare = '';
    if (prevIssues.contractions > 0 || currIssues.contractions > 0) {
      const cDiff = currIssues.contractions - prevIssues.contractions;
      const cArrow = cDiff < 0 ? '↓ 改善' : cDiff > 0 ? '↑ 増加' : '→ 変化なし';
      const cColor = cDiff < 0 ? '#22c55e' : cDiff > 0 ? '#ef4444' : '#64748b';
      contractionCompare = `<div class="compare-item"><span class="compare-label">🔴 縮み箇所</span><span style="color:${cColor};font-weight:700;">${prevIssues.contractions}箇所 → ${currIssues.contractions}箇所（${cArrow}）</span></div>`;
    }

    // 伸び箇所の比較
    let tensionCompare = '';
    if (prevIssues.tensions > 0 || currIssues.tensions > 0) {
      const tDiff = currIssues.tensions - prevIssues.tensions;
      const tArrow = tDiff < 0 ? '↓ 改善' : tDiff > 0 ? '↑ 増加' : '→ 変化なし';
      const tColor = tDiff < 0 ? '#22c55e' : tDiff > 0 ? '#ef4444' : '#64748b';
      tensionCompare = `<div class="compare-item"><span class="compare-label">🟣 伸び箇所</span><span style="color:${tColor};font-weight:700;">${prevIssues.tensions}箇所 → ${currIssues.tensions}箇所（${tArrow}）</span></div>`;
    }

    // 前回の体図用ID（後でbodyDiagramを描画）
    const prevDiagramId = 'diagram-prev-compare';
    const currDiagramId = 'diagram-curr-compare';

    return `
    <div class="prev-comparison-card">
      <h4 class="prev-comparison-title">前回との比較</h4>
      <div class="compare-diagrams" style="display:flex;gap:8px;margin:12px 0;">
        <div style="flex:1;text-align:center;">
          <div style="font-size:12px;color:#64748b;margin-bottom:4px;font-weight:700;">前回<br><span style="font-size:10px;font-weight:400;">${prevDateStr}</span></div>
          <div class="body-diagram-container mini-diagram" id="${prevDiagramId}"></div>
          <div style="margin-top:4px;">
            <span style="font-size:12px;background:${prevCause.color || '#94a3b8'};color:white;padding:2px 8px;border-radius:8px;">${prevCause.icon || ''} ${prevCause.label || '?'}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;font-size:24px;color:#94a3b8;">→</div>
        <div style="flex:1;text-align:center;">
          <div style="font-size:12px;color:#64748b;margin-bottom:4px;font-weight:700;">今回<br><span style="font-size:10px;font-weight:400;">${currDateStr}</span></div>
          <div class="body-diagram-container mini-diagram" id="${currDiagramId}"></div>
          <div style="margin-top:4px;">
            <span style="font-size:12px;background:${currCause.color || '#94a3b8'};color:white;padding:2px 8px;border-radius:8px;">${currCause.icon || ''} ${currCause.label || '?'}</span>
          </div>
        </div>
      </div>
      <div class="compare-item">
        <span class="compare-label">ずれ箇所</span>
        <span style="color:${scoreColor};font-weight:700;">9箇所中${prevScore}箇所 → ${currScore}箇所（${scoreArrow}）</span>
      </div>
      ${contractionCompare}
      ${tensionCompare}
      ${nrsCompare}
      ${wbCompare}
    </div>`;
  }

  // 前回比較の体図を描画（renderDiagnosis後に呼ぶ）
  async function renderComparisonDiagrams() {
    if (!selectedPatientId || !diagnosisResult) return;
    const history = await Storage.getHistoryByPatient(selectedPatientId);
    if (history.length < 2) return;

    // 読み込んだエントリをスキップして前回を探す
    let prev = null;
    for (const entry of history) {
      if (loadedEntryId && entry.id === loadedEntryId) continue;
      if (entry.diagnosisResult) { prev = entry; break; }
    }
    if (!prev) return;

    // 前回の体図
    const prevEl = document.getElementById('diagram-prev-compare');
    if (prevEl) {
      BodyDiagram.init('diagram-prev-compare');
      if (prev.detailData && prev.detailData.upperDetail && prev.detailData.upperDetail.acromion !== null) {
        // detailDataがある場合（contractionResultから上半身・下半身を分解）
        const prevUpper = prev.contractionResult?.upper?.rawData || prev.detailData?.upperDetail || {};
        const prevLower = prev.contractionResult?.lower?.rawData || prev.detailData?.lowerDetail || {};
        BodyDiagram.updateUnified('diagram-prev-compare', prevUpper, prevLower, prev.examData?.standing || {});
      } else if (prev.examData?.standing) {
        BodyDiagram.update('diagram-prev-compare', 'firstStage', prev.examData.standing);
      }
    }

    // 今回の体図
    const currEl = document.getElementById('diagram-curr-compare');
    if (currEl) {
      BodyDiagram.init('diagram-curr-compare');
      if (detailData.upperDetail.acromion !== null) {
        BodyDiagram.updateUnified('diagram-curr-compare', detailData.upperDetail, detailData.lowerDetail, examData.standing);
      } else {
        BodyDiagram.update('diagram-curr-compare', 'firstStage', examData.standing);
      }
    }
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

    // 大きなアイコンとタイトル
    html += '<div class="patient-body-status">';
    html += '<h3 class="patient-status-title">お身体の状態</h3>';

    if (result.primaryCause === 'none') {
      html += `<div class="patient-status-card good">
        <div class="patient-status-icon">&#x2705;</div>
        <p class="patient-status-text">特に気になる歪みは見られませんでした。<br>良い状態です！</p>
      </div>`;
    } else {
      html += '<div class="patient-status-card">';

      // 重心バランス
      if (weightBalance && weightBalance !== 'even') {
        const wbLabel = weightBalance === 'right' ? '右側' : '左側';
        html += `<div class="patient-finding-item">
          <span class="finding-dot" style="background:#f59e0b;"></span>
          <p>体重が<strong>${wbLabel}</strong>にかかりやすい傾向があります</p>
        </div>`;
      }

      // 歪みの方向
      if (result.pattern && result.pattern.pattern !== 'normal') {
        if (result.pattern.pattern === 'zenran') {
          const dir = result.pattern.direction === 'right' ? '右側' : '左側';
          html += `<div class="patient-finding-item">
            <span class="finding-dot" style="background:#ef4444;"></span>
            <p>身体全体が<strong>${dir}</strong>に傾く傾向があります</p>
          </div>`;
        } else {
          html += `<div class="patient-finding-item">
            <span class="finding-dot" style="background:#8b5cf6;"></span>
            <p>身体の上と下で<strong>左右交互にずれ</strong>が見られます</p>
          </div>`;
        }
      }

      // 今後の施術方針（わかりやすく）
      html += `<div class="patient-treatment-hint">
        <p>施術で改善していきますので、ご安心ください。</p>
      </div>`;

      html += '</div>'; // .patient-status-card
    }

    html += '</div>';
    html += '</div>';
    return html;
  }

  // ===== 詳細検査：上半身＋下半身を表示 =====
  function showDetailedExam() {
    // 詳細データは立位検査で入力済み → 自動で統合分析を実行
    runComprehensiveAnalysis();
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
    // バリデーションなし：未入力でも進める
    return true;
  }

  // ===== 統合分析（上半身＋下半身） =====
  async function runComprehensiveAnalysis() {
    const upperResult = InspectionLogic.analyzeContraction(
      InspectionLogic.upperDetailLandmarks, detailData.upperDetail
    );
    const lowerResult = InspectionLogic.analyzeContraction(
      InspectionLogic.lowerDetailLandmarks, detailData.lowerDetail
    );

    contractionResult = { upper: upperResult, lower: lowerResult };

    // 全身統合ダイアグラム更新
    BodyDiagram.updateUnified('diagram-detailUnified', detailData.upperDetail, detailData.lowerDetail, examData.standing);

    renderUnifiedAnalysis(upperResult, lowerResult);

    // セルフケアを自動表示
    renderSelfcare(upperResult, lowerResult);

    // セルフケアボタンは非表示（自動表示のため不要）
    const selfcareBtn = document.getElementById('showSelfcareBtn');
    if (selfcareBtn) {
      selfcareBtn.style.display = 'none';
    }

    // プロトコルボタン表示
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';

    // 全身統合分析完了後にアクションボタンを表示
    const diagActions = document.getElementById('diagnosisActions');
    if (diagActions) diagActions.style.display = 'flex';
    const printBtn = document.getElementById('printSheetBtn');
    if (printBtn) printBtn.style.display = '';

    // 比較ボタンも更新
    updateCompareButton();
    updateTrendButton();

    // 患者モード用アクションバー同期
    syncPatientActions();

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

    // 診断結果上部のダイアグラムを更新
    const diagBodyEl = document.getElementById('diagram-diagnosis-body');
    if (diagBodyEl) {
      BodyDiagram.updateUnified('diagram-diagnosis-body', detailData.upperDetail, detailData.lowerDetail, examData.standing);
    }

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 治療家モード：詳細分析表示 =====
  function renderPractitionerAnalysis(allLandmarks, upperResult, lowerResult, allIssues) {
    let html = '';

    html += '<div class="contraction-section">';

    // テキスト版のランドマーク一覧
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

    // （全身統合ダイアグラムは診断結果上部に統合済みのため省略）

    // === 立位検査データからの体幹分析 ===
    html += renderStandingBodyAnalysis();

    // === 茎状突起・外果の注記 ===
    html += renderLowerLandmarkNotes();

    // 検出された問題一覧
    if (allIssues.length > 0) {
      html += '<div class="problem-areas"><h4>検出された問題</h4>';
      for (const issue of allIssues) {
        const typeLabel = issue.type === 'contraction' ? '収縮' : '伸長';
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
          <p>明確な収縮・伸長は検出されませんでした。</p>
        </div>
      </div>`;
    }

    html += '</div>'; // .contraction-section

    return html;
  }

  // ===== 立位検査データからの体幹4区間 詰まり/伸び分析 =====
  function renderStandingBodyAnalysis() {
    const mastVal = examData.standing.mastoid;
    const scapVal = examData.standing.scapulaInferior;
    const iliacVal = examData.standing.iliacCrest;
    const acromVal = detailData.upperDetail.acromion;
    const gtVal = detailData.lowerDetail.greaterTrochanter;

    let html = '';
    const analyses = [];

    const segments = [
      { valA: mastVal, valB: acromVal, area: '乳様突起〜肩峰', desc: '頸部' },
      { valA: acromVal, valB: scapVal, area: '肩峰〜肩甲下角', desc: '肩甲帯' },
      { valA: scapVal, valB: iliacVal, area: '肩甲下角〜腸骨稜', desc: '体幹' },
      { valA: iliacVal, valB: gtVal, area: '腸骨稜〜大転子', desc: '骨盤帯' }
    ];

    for (const seg of segments) {
      if (seg.valA == null || seg.valB == null) continue;
      if (seg.valA === 0 || seg.valB === 0) continue;
      if (seg.valA === seg.valB) continue;

      const leftCompressed = (seg.valA === 1 && seg.valB === -1);
      const rightCompressed = (seg.valA === -1 && seg.valB === 1);
      if (!leftCompressed && !rightCompressed) continue;

      const compSide = leftCompressed ? '左' : '右';
      const stretchSide = leftCompressed ? '右' : '左';
      analyses.push({
        area: `${seg.area}（${seg.desc}）`,
        compSide,
        stretchSide,
        desc: `${seg.area}の間で${compSide}側が収縮、${stretchSide}側が伸長している状態`
      });
    }

    if (analyses.length > 0) {
      html += '<div class="problem-areas"><h4>立位検査からの体幹分析</h4>';
      for (const a of analyses) {
        html += `<div class="problem-area-card">
          <span class="problem-icon">📐</span>
          <p><strong>${a.area}</strong><br>${a.desc}</p>
          <div style="display:flex;gap:8px;margin-top:6px;">
            <span style="background:#fef2f2;color:#dc2626;padding:2px 10px;border-radius:6px;font-size:12px;font-weight:700;">${a.compSide}側 収縮</span>
            <span style="background:#f5f3ff;color:#7c3aed;padding:2px 10px;border-radius:6px;font-size:12px;font-weight:700;">${a.stretchSide}側 伸長</span>
          </div>
        </div>`;
      }
      html += '</div>';
    }

    return html;
  }

  // ===== 茎状突起・外果：下がっている方の施術注記 =====
  function renderLowerLandmarkNotes() {
    let html = '';
    const notes = [];

    const radialVal = detailData.upperDetail.radialStyloid;
    if (radialVal != null && radialVal !== 0) {
      const downSide = radialVal === 1 ? '左' : '右';
      notes.push(`${downSide}側の茎状突起が下がっています → ${downSide}側の前腕〜手首も施術が必要です`);
    }

    const lateralVal = detailData.lowerDetail.lateralMalleolus;
    if (lateralVal != null && lateralVal !== 0) {
      const downSide = lateralVal === 1 ? '左' : '右';
      notes.push(`${downSide}側の外果が下がっています → ${downSide}側のすね〜足首も施術が必要です`);
    }

    if (notes.length > 0) {
      html += '<div class="problem-areas"><h4>施術の追加ポイント</h4>';
      for (const note of notes) {
        html += `<div class="problem-area-card" style="border-left:3px solid #f59e0b;">
          <span class="problem-icon">⚠️</span>
          <p>${note}</p>
        </div>`;
      }
      html += '</div>';
    }

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
        ? `（反対側：${contraction.tensionSide === 'right' ? '右側' : '左側'}伸長）`
        : '';
      return `
      <div class="diagram-between contracted">
        <span class="contraction-mark">✕ 収縮（${sideText}）${tensionInfo}</span>
        <span class="contraction-area">${contraction.area}</span>
      </div>`;
    } else if (tension) {
      const sideText = tension.side === 'both' ? '両側'
        : tension.side === 'right' ? '右側' : '左側';
      return `
      <div class="diagram-between tensioned">
        <span class="tension-mark">↕ 伸長（${sideText}）</span>
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
        <p>身体に大きな収縮や伸長は見られません。</p>
      </div>`;
    } else {
      html += `<div class="patient-result-card">
        <h3>気になる箇所が見つかりました</h3>
        <p>以下の部分にバランスの乱れがあります。施術で改善していきましょう。</p>
      </div>`;

      for (const issue of allIssues) {
        const typeLabel = issue.type === 'contraction' ? '硬くなっている' : '伸長している';
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
    }

    // （全身統合ダイアグラムは診断結果上部に統合済みのため省略）

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

    // 外果（lateralMalleolus）の左右差を確認 → 足裏ケア提案
    let footRollSide = null;
    if (detailData && detailData.lowerDetail) {
      const lateralVal = detailData.lowerDetail.lateralMalleolus;
      if (lateralVal === 1) {
        // 右が高い → 左が下がっている → 左足の足裏ケア
        footRollSide = 'left';
      } else if (lateralVal === -1) {
        // 左が高い → 右が下がっている → 右足の足裏ケア
        footRollSide = 'right';
      }
    }

    const hasIssues = allIssues.length > 0 || footRollSide;

    if (!hasIssues) {
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

      const exercises = SelfcareDatabase.getSelfcareForArea(areaKey, issueType);
      for (const exercise of exercises) {
        html += SelfcareDatabase.renderSelfcareCard(exercise, issue.side, patientGender);
      }
    }

    // 外果が下がっている側の足裏ケアを追加
    if (footRollSide) {
      const footExercises = SelfcareDatabase.getSelfcareForArea('足裏', 'contraction');
      for (const footExercise of footExercises) {
        html += SelfcareDatabase.renderSelfcareCard(footExercise, footRollSide, patientGender);
      }
    }

    html += '</div>';

    selfcareDiv.innerHTML = html;
    selfcareDiv.style.display = 'block';
    selfcareDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== 診断アクション =====
  function setupDiagnosisActions() {
    document.getElementById('saveHistoryBtn').addEventListener('click', async () => {
      try {
        if (!diagnosisResult) { alert('診断結果がありません'); return; }
        const patientName = document.getElementById('patientName').value;
        const memoEl = document.getElementById('inspectionMemo');
        const memo = memoEl ? memoEl.value : '';
        const extraFields = {
          age: patientAge,
          gender: patientGender,
          occupation: patientOccupation,
          visitType: visitType,
          medicalHistory: medicalHistory
        };
        const chiefComplaints = chiefComplaintText ? [chiefComplaintText] : [];
        const clinicId = SupabaseAuth.getClinicId();
        const userId = SupabaseAuth.getUserId();
        if (!clinicId || !userId) {
          alert(`保存エラー: 認証情報が不足しています\nclinic_id: ${clinicId || 'なし'}\nuser_id: ${userId || 'なし'}\n\nログアウトして再ログインしてください。`);
          return;
        }
        const success = await Storage.save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance, selectedPatientId, painLevel, chiefComplaints, extraFields);
        if (success) {
          alert('検査結果を保存しました');
          await updateCompareButton();
          await updateTrendButton();
        } else {
          alert('保存に失敗しました（Storage.saveがfalseを返しました）');
        }
      } catch (e) {
        console.error('保存処理で例外:', e);
        alert(`保存処理で例外が発生しました:\n${e.message}\n\n${e.stack ? e.stack.substring(0, 300) : ''}`);
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
            const exercises = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
            for (const exercise of exercises) {
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
      compareBtn.addEventListener('click', async () => {
        const compSection = document.getElementById('comparisonSection');
        if (compSection.style.display === 'block') {
          compSection.style.display = 'none';
          compareBtn.textContent = '前回と比較';
        } else {
          await renderComparison();
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

  // ===== 患者モードボタン =====
  function setupPatientModeButtons() {
    // 患者用PDFボタン
    const patientPdfBtn = document.getElementById('patientPdfBtn');
    if (patientPdfBtn) {
      patientPdfBtn.addEventListener('click', () => {
        if (!diagnosisResult) return;
        const patientName = document.getElementById('patientName').value;
        const inspectionDate = document.getElementById('inspectionDate').value;
        const selfcareItems = gatherSelfcareItems();
        PdfExport.exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareItems);
      });
    }

    // 患者用セルフケアボタン
    const patientSelfcareBtn = document.getElementById('patientSelfcareBtn');
    if (patientSelfcareBtn) {
      patientSelfcareBtn.addEventListener('click', () => {
        const selfcareDiv = document.getElementById('selfcareSection');
        if (selfcareDiv.style.display === 'block') {
          selfcareDiv.style.display = 'none';
          patientSelfcareBtn.textContent = 'セルフケアを見る';
        } else if (contractionResult) {
          renderSelfcare(contractionResult.upper, contractionResult.lower);
          patientSelfcareBtn.textContent = 'セルフケアを閉じる';
        }
      });
    }
  }

  // セルフケアデータ収集（共通）
  function gatherSelfcareItems() {
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
          const exercises = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
          for (const exercise of exercises) {
            selfcareItems.push({
              name: exercise.name,
              description: exercise.description || '',
              duration: exercise.frequency || exercise.duration || ''
            });
          }
        }
      }
    }
    // 足裏ケアも追加
    if (detailData && detailData.lowerDetail && detailData.lowerDetail.lateralMalleolus !== 0) {
      if (typeof SelfcareDatabase !== 'undefined') {
        const footExercises = SelfcareDatabase.getSelfcareForArea('足裏', 'contraction');
        for (const footExercise of footExercises) {
          selfcareItems.push({
            name: footExercise.name,
            description: footExercise.description || '',
            duration: footExercise.frequency || ''
          });
        }
      }
    }
    return selfcareItems;
  }

  // ===== 印刷機能 =====
  function setupPrintButtons() {
    const printBtn = document.getElementById('printSheetBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => printSheet());
    }
    const patientPrintBtn = document.getElementById('patientPrintBtn');
    if (patientPrintBtn) {
      patientPrintBtn.addEventListener('click', () => printSheet());
    }
  }

  function printSheet() {
    if (!diagnosisResult) return;

    const container = document.getElementById('printContainer');
    if (!container) return;

    const patientName = document.getElementById('patientName').value || '患者名未入力';
    const inspectionDate = document.getElementById('inspectionDate').value || new Date().toISOString().split('T')[0];

    // 印刷用HTML生成
    container.innerHTML = generatePrintPage1(patientName, inspectionDate)
                        + generatePrintPage2(patientName);

    // SVGダイアグラムを印刷用コンテナ内に描画
    const printDiagramEl = document.getElementById('print-diagram');
    if (printDiagramEl) {
      BodyDiagram.init('print-diagram');
      if (detailData.upperDetail.acromion !== null || detailData.lowerDetail.greaterTrochanter !== null) {
        BodyDiagram.updateUnified('print-diagram', detailData.upperDetail, detailData.lowerDetail, examData.standing);
      } else {
        BodyDiagram.update('print-diagram', 'firstStage', examData.standing);
      }
    }

    // 少し待ってからSVG描画完了後に印刷
    setTimeout(() => window.print(), 200);
  }

  // NRS痛みスケールSVG（印刷用）
  function generateNRSSvg(level) {
    if (level == null) return '';
    const color = level <= 2 ? '#22c55e' : level <= 4 ? '#eab308' : level <= 6 ? '#f97316' : '#ef4444';
    let circles = '';
    for (let i = 0; i <= 10; i++) {
      const x = 8 + i * 22;
      const fill = i <= level ? color : '#f1f5f9';
      const stroke = i <= level ? color : '#e2e8f0';
      circles += `<circle cx="${x}" cy="10" r="8" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      if (i === level) {
        circles += `<text x="${x}" y="14" text-anchor="middle" font-size="10" fill="white" font-weight="700">${i}</text>`;
      }
    }
    return `<svg viewBox="0 0 250 20" style="width:200px;height:20px;display:inline-block;vertical-align:middle;">${circles}</svg> <strong>${level}/10</strong>`;
  }

  // 重心バランスSVG（背景色不要で確実に印刷）
  function generateBalanceSVG(wb) {
    const dotX = wb === 'left' ? 45 : wb === 'right' ? 255 : 150;
    const dotColor = wb === 'left' ? '#3b82f6' : wb === 'right' ? '#f97316' : '#22c55e';
    return `<svg viewBox="0 0 300 36" style="width:100%;height:36px;display:block;">
      <text x="8" y="22" font-size="12" fill="#64748b" font-weight="700">左</text>
      <text x="280" y="22" font-size="12" fill="#64748b" font-weight="700">右</text>
      <rect x="30" y="12" width="240" height="12" rx="6" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
      <rect x="30" y="12" width="80" height="12" rx="6" fill="#dbeafe" opacity="0.5"/>
      <rect x="190" y="12" width="80" height="12" rx="6" fill="#ffedd5" opacity="0.5"/>
      <line x1="150" y1="10" x2="150" y2="26" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>
      <circle cx="${dotX}" cy="18" r="8" fill="${dotColor}" stroke="white" stroke-width="2"/>
    </svg>`;
  }

  // ===== 表面：身体の状態シート =====
  function generatePrintPage1(patientName, inspectionDate) {
    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause] || {};
    const wbLabel = weightBalance === 'right' ? '右重心' : weightBalance === 'left' ? '左重心' : weightBalance === 'even' ? '均等' : '未測定';

    // 左右差サマリー
    let alignmentRows = '';
    const landmarks = InspectionLogic.landmarks;
    const standData = examData.standing || {};
    for (const [key, config] of Object.entries(landmarks)) {
      const val = standData[key] || 0;
      const label = val === -1 ? '左が高い' : val === 1 ? '右が高い' : '均等';
      const cls = val === 0 ? 'print-even' : 'print-uneven';
      alignmentRows += `<tr><td>${config.name}</td><td class="${cls}">${label}</td></tr>`;
    }

    // 詳細ランドマーク（あれば）
    let detailRows = '';
    const hasDetail = detailData.upperDetail.acromion !== null;
    if (hasDetail) {
      const allDetailLandmarks = [
        ...InspectionLogic.upperDetailLandmarks,
        ...InspectionLogic.lowerDetailLandmarks
      ];
      const allDetailData = { ...detailData.upperDetail, ...detailData.lowerDetail };
      for (const lm of allDetailLandmarks) {
        const val = allDetailData[lm.key] || 0;
        const label = val === -1 ? '左が高い' : val === 1 ? '右が高い' : '均等';
        const cls = val === 0 ? 'print-even' : 'print-uneven';
        detailRows += `<tr><td>${lm.name}</td><td class="${cls}">${label}</td></tr>`;
      }
    }

    // 問題箇所リスト
    let issuesList = '';
    if (contractionResult) {
      const allIssues = [
        ...(contractionResult.upper ? [...contractionResult.upper.contractions, ...contractionResult.upper.tensions] : []),
        ...(contractionResult.lower ? [...contractionResult.lower.contractions, ...contractionResult.lower.tensions] : [])
      ];
      if (allIssues.length > 0) {
        for (const issue of allIssues) {
          const typeLabel = issue.type === 'contraction' ? '収縮' : '伸長';
          const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
          const borderColor = issue.type === 'contraction' ? '#ef4444' : '#8b5cf6';
          const dotSvg = `<svg width="10" height="10" viewBox="0 0 10 10" style="flex-shrink:0;margin-top:3px;"><circle cx="5" cy="5" r="5" fill="${borderColor}"/></svg>`;
          issuesList += `<div class="print-issue" style="border-left:3px solid ${borderColor};">${dotSvg}<span>${issue.area}（${sideLabel}）… ${typeLabel}</span></div>`;
        }
      } else {
        issuesList = '<div class="print-issue" style="border-left:3px solid #22c55e;"><svg width="10" height="10" viewBox="0 0 10 10" style="flex-shrink:0;margin-top:3px;"><circle cx="5" cy="5" r="5" fill="#22c55e"/></svg><span>明確な問題箇所は検出されませんでした</span></div>';
      }
    }

    return `
    <div class="print-page print-page-front">
      <div class="print-header">
        <div class="print-logo">Body Check Pro</div>
        <h1 class="print-title">からだの状態シート</h1>
      </div>

      <div class="print-patient-info">
        <div class="print-info-row">
          <span class="print-info-label">お名前</span>
          <span class="print-info-value">${patientName}</span>
        </div>
        <div class="print-info-row">
          <span class="print-info-label">検査日</span>
          <span class="print-info-value">${inspectionDate}</span>
        </div>
        ${painLevel != null ? `<div class="print-info-row">
          <span class="print-info-label">痛みレベル</span>
          <span class="print-info-value">${generateNRSSvg(painLevel)}</span>
        </div>` : ''}
        ${chiefComplaintText ? `<div class="print-info-row">
          <span class="print-info-label">主訴</span>
          <span class="print-info-value">${chiefComplaintText}</span>
        </div>` : ''}
      </div>

      <div class="print-body">
        <div class="print-left-col">
          <!-- 診断結果 -->
          <div class="print-section">
            <h2 class="print-section-title">総合判定</h2>
            <div class="print-diagnosis-box" style="border-color: ${causeInfo.color || '#64748b'}">
              <div class="print-diagnosis-label" style="color: ${causeInfo.color || '#64748b'}">${causeInfo.label || '判定なし'}</div>
              <p class="print-diagnosis-summary">${diagnosisResult.summary}</p>
            </div>
          </div>

          <!-- 重心バランス（SVG） -->
          <div class="print-section">
            <h2 class="print-section-title">重心バランス</h2>
            <div class="print-balance-box">
              ${generateBalanceSVG(weightBalance)}
              <div class="print-balance-text">${wbLabel}</div>
            </div>
          </div>

          <!-- 左右差一覧 -->
          <div class="print-section">
            <h2 class="print-section-title">左右差チェック${hasDetail ? '（基本）' : ''}</h2>
            <table class="print-table">
              <thead><tr><th>ランドマーク</th><th>結果</th></tr></thead>
              <tbody>${alignmentRows}</tbody>
            </table>
          </div>

          ${hasDetail ? `
          <div class="print-section">
            <h2 class="print-section-title">左右差チェック（詳細）</h2>
            <table class="print-table">
              <thead><tr><th>ランドマーク</th><th>結果</th></tr></thead>
              <tbody>${detailRows}</tbody>
            </table>
          </div>` : ''}
        </div>

        <div class="print-right-col">
          <!-- 人体図 -->
          <div class="print-section">
            <h2 class="print-section-title">身体バランス図</h2>
            <div class="print-diagram-box">
              <div class="body-diagram-container" id="print-diagram"></div>
            </div>
          </div>

          <!-- 検出された問題 -->
          <div class="print-section">
            <h2 class="print-section-title">検出された問題箇所</h2>
            <div class="print-issues">${issuesList}</div>
          </div>
        </div>
      </div>

      <div class="print-footer">
        <p>※この検査結果は施術時の参考情報です。裏面にセルフケアメニューがあります。</p>
      </div>
    </div>`;
  }

  // ===== 裏面：セルフケアシート =====
  function generatePrintPage2(patientName) {
    // セルフケアを収集（最大4つ）
    const selfcareItems = [];
    if (contractionResult) {
      const allIssues = [
        ...(contractionResult.upper ? [...contractionResult.upper.contractions, ...contractionResult.upper.tensions] : []),
        ...(contractionResult.lower ? [...contractionResult.lower.contractions, ...contractionResult.lower.tensions] : [])
      ];
      const rendered = new Set();
      for (const issue of allIssues) {
        if (selfcareItems.length >= 4) break;
        const cacheKey = `${issue.areaShort}_${issue.type}`;
        if (rendered.has(cacheKey)) continue;
        rendered.add(cacheKey);
        if (typeof SelfcareDatabase !== 'undefined') {
          const exercises = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
          for (const exercise of exercises) {
            if (selfcareItems.length >= 4) break;
            selfcareItems.push({ exercise, side: issue.side });
          }
        }
      }
    }

    if (selfcareItems.length === 0) {
      return `
      <div class="print-page print-page-back">
        <div class="print-header">
          <div class="print-logo">Body Check Pro</div>
          <h1 class="print-title">セルフケアメニュー</h1>
        </div>
        <div class="print-selfcare-empty">
          <p>現在、特定のセルフケアメニューはありません。<br>良い状態を維持できています。</p>
        </div>
        <div class="print-footer">
          <p>${patientName}様　※毎日のケアで身体のバランスを維持しましょう</p>
        </div>
      </div>`;
    }

    const gridClass = selfcareItems.length <= 2 ? 'print-selfcare-grid-2' : 'print-selfcare-grid-4';

    let cardsHtml = '';
    for (let i = 0; i < selfcareItems.length; i++) {
      const { exercise, side } = selfcareItems[i];
      const sideLabel = side === 'both' ? '両側' : side === 'right' ? '右側' : '左側';
      const illustSvg = typeof SelfcareDatabase !== 'undefined' ? SelfcareDatabase.getIllustration(exercise.illustration, patientGender) : '';

      cardsHtml += `
      <div class="print-selfcare-card">
        <div class="print-selfcare-num">${i + 1}</div>
        <h3 class="print-selfcare-name">${exercise.name}</h3>
        <div class="print-selfcare-meta">
          <span>${sideLabel}</span>
          <span>${exercise.sets}</span>
          <span>${exercise.frequency}</span>
        </div>

        ${illustSvg ? `<div class="print-selfcare-illust">${illustSvg}</div>` : ''}

        <ol class="print-selfcare-steps">
          ${exercise.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <div class="print-selfcare-caution">${exercise.caution}</div>
        ${exercise.evidence ? `<div class="print-selfcare-evidence">${exercise.evidence}</div>` : ''}
      </div>`;
    }

    return `
    <div class="print-page print-page-back">
      <div class="print-header">
        <div class="print-logo">Body Check Pro</div>
        <h1 class="print-title">セルフケアメニュー</h1>
      </div>
      <div class="print-patient-sub">${patientName}様専用メニュー</div>
      <div class="${gridClass}">
        ${cardsHtml}
      </div>
      <div class="print-footer">
        <p>※痛みが出た場合は無理をせず中止してください。次回の施術時にお伝えください。</p>
      </div>
    </div>`;
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
        const typeLabel = ap.issueType === 'contraction' ? '収縮' : '伸長';
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

  // ===== 検査結果サマリー（Step 5: 全データ統合表示） =====
  function renderExamSummary() {
    const container = document.getElementById('examSummaryContent');
    if (!container || !diagnosisResult) return;

    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];
    const patientName = document.getElementById('patientName').value || '名前未入力';
    const inspectionDate = document.getElementById('inspectionDate').value || '';
    const genderLabel = patientGender === 'male' ? '男性' : patientGender === 'female' ? '女性' : '';
    const visitLabel = visitType === 'initial' ? '初診' : '再診';

    let html = '';

    // --- 患者情報ヘッダー ---
    html += '<div class="summary-patient-card">';
    html += `<div class="summary-patient-name">${patientName}</div>`;
    html += '<div class="summary-patient-meta">';
    if (patientAge) html += `<span>${patientAge}歳</span>`;
    if (genderLabel) html += `<span>${genderLabel}</span>`;
    html += `<span>${visitLabel}</span>`;
    if (inspectionDate) html += `<span>${inspectionDate}</span>`;
    html += '</div>';
    if (patientOccupation) html += `<div class="summary-meta-row">職業: ${patientOccupation}</div>`;
    if (chiefComplaintText) html += `<div class="summary-meta-row">主訴: ${chiefComplaintText}</div>`;
    if (painLevel !== null) html += `<div class="summary-meta-row">痛みレベル: <strong>${painLevel}/10</strong></div>`;
    html += '</div>';

    // --- 総合判定 ---
    html += `<div class="summary-diagnosis-card" style="border-left: 4px solid ${causeInfo.color}">
      <div class="summary-diagnosis-icon">${causeInfo.icon}</div>
      <div>
        <div class="summary-diagnosis-label" style="color: ${causeInfo.color}">${causeInfo.label}</div>
        <p class="summary-diagnosis-text">${diagnosisResult.summary}</p>
        ${diagnosisResult.treatmentArea !== 'なし' ? `<div class="summary-treatment">治療対象: <strong>${diagnosisResult.treatmentArea}</strong></div>` : ''}
      </div>
    </div>`;

    // --- 重心バランス ---
    if (weightBalance) {
      const wbLabel = weightBalance === 'right' ? '右重心' : weightBalance === 'left' ? '左重心' : '均等';
      const wbColor = weightBalance === 'even' ? 'var(--normal)' : 'var(--moderate)';
      html += `<div class="summary-item"><span class="summary-item-label">重心バランス</span><span style="color:${wbColor};font-weight:600;">${wbLabel}</span></div>`;
    }

    // --- 検査データ一覧（立位・座位・上半身） ---
    html += '<div class="summary-exam-table">';
    html += '<h4 class="summary-section-title">検査結果一覧</h4>';
    html += '<table class="summary-table"><thead><tr><th>ランドマーク</th><th>立位</th><th>座位</th><th>上半身</th></tr></thead><tbody>';
    for (const [lmKey, lmConfig] of Object.entries(InspectionLogic.landmarks)) {
      html += `<tr><td><strong>${lmConfig.name}</strong></td>`;
      for (const pos of ['standing', 'seated', 'upperBody']) {
        const val = examData[pos][lmKey] || 0;
        const label = InspectionLogic.valueLabels[val.toString()];
        const cls = val === 0 ? 'val-even' : (val < 0 ? 'val-left' : 'val-right');
        html += `<td class="${cls}">${label}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    html += '</div>';

    // --- 段階的判定サマリー ---
    html += '<div class="summary-steps">';
    html += '<h4 class="summary-section-title">段階的判定</h4>';

    const footAnalysis = InspectionLogic.compareStandingSeated(examData.standing, examData.seated);
    html += `<div class="summary-step-item ${footAnalysis.hasFootInfluence ? 'has-influence' : 'no-influence'}">
      <span class="summary-step-num">1</span>
      <div>
        <strong>立位→座位</strong>
        <p>${footAnalysis.hasFootInfluence ? '足の影響あり' : '足の影響なし'}</p>
      </div>
    </div>`;

    if (diagnosisResult.steps.length >= 3 && diagnosisResult.steps[2].comparison) {
      const ubComp = diagnosisResult.steps[2].comparison;
      html += `<div class="summary-step-item ${ubComp.hasUpperBodyInfluence ? 'has-influence' : 'no-influence'}">
        <span class="summary-step-num">2</span>
        <div>
          <strong>座位→上半身</strong>
          <p>${ubComp.hasUpperBodyInfluence ? '上半身の影響あり' : '上半身の影響なし'}</p>
        </div>
      </div>`;
    }

    if (diagnosisResult.pattern && diagnosisResult.pattern.pattern !== 'normal') {
      html += `<div class="summary-step-item">
        <span class="summary-step-num">3</span>
        <div>
          <strong>パターン</strong>
          <p>${diagnosisResult.pattern.description}</p>
        </div>
      </div>`;
    }
    html += '</div>';

    // --- アクションボタン ---
    html += '<div class="summary-actions">';
    html += '<button type="button" class="btn btn-sm btn-secondary" id="summaryPdfBtn">PDF保存</button>';
    html += '<button type="button" class="btn btn-sm btn-secondary" id="summarySaveBtn">履歴に保存</button>';
    html += '</div>';

    container.innerHTML = html;

    // サマリー内ボタンのイベント
    const summaryPdfBtn = document.getElementById('summaryPdfBtn');
    if (summaryPdfBtn) {
      summaryPdfBtn.addEventListener('click', () => {
        const selfcareItems = gatherSelfcareItems();
        PdfExport.exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareItems);
      });
    }
    const summarySaveBtn = document.getElementById('summarySaveBtn');
    if (summarySaveBtn) {
      summarySaveBtn.addEventListener('click', async () => {
        if (!diagnosisResult) return;
        const memoEl = document.getElementById('inspectionMemo');
      const memo = memoEl ? memoEl.value : '';
        const extraFields = {
          age: patientAge,
          gender: patientGender,
          occupation: patientOccupation,
          visitType: visitType,
          medicalHistory: medicalHistory
        };
        const chiefComplaints2 = chiefComplaintText ? [chiefComplaintText] : [];
        const success = await Storage.save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance, selectedPatientId, painLevel, chiefComplaints2, extraFields);
        if (success) {
          alert('検査結果を保存しました');
          await updateCompareButton();
          await updateTrendButton();
        }
      });
    }
  }

  // ===== レポート描画 =====
  async function renderReport() {
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
          const typeLabel = issue.type === 'contraction' ? '収縮' : '伸長';
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
    const pid = selectedPatientId || await Storage.findPatientIdByName(patientName);
    if (pid) {
      const history = await Storage.getHistoryByPatient(pid);
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
          const exList = SelfcareDatabase.getSelfcareForArea(issue.areaShort, issue.type);
          for (const exercise of exList) exercises.push(exercise);
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
    painLevel = null;
    chiefComplaintText = '';
    patientAge = null;
    patientGender = '';
    patientOccupation = '';
    visitType = 'initial';
    medicalHistory = '';

    document.querySelectorAll('.landmark-btn').forEach(btn => btn.classList.remove('selected'));
    const painSliderEl = document.getElementById('painSlider');
    const painValueEl = document.getElementById('painValue');
    if (painSliderEl) { painSliderEl.value = 0; painSliderEl.style.background = 'linear-gradient(to right, #4f46e5 0%, #e5e7eb 0%)'; }
    if (painValueEl) { painValueEl.textContent = '0'; painValueEl.style.color = '#4f46e5'; }
    const chiefInput = document.getElementById('chiefComplaintText');
    if (chiefInput) chiefInput.value = '';
    document.getElementById('patientName').value = '';
    const memoResetEl = document.getElementById('inspectionMemo');
    if (memoResetEl) memoResetEl.value = '';
    document.getElementById('patientSearch').value = '';
    const ageInput = document.getElementById('patientAge');
    if (ageInput) ageInput.value = '';
    const genderInput = document.getElementById('patientGender');
    if (genderInput) genderInput.value = '';
    const occInput = document.getElementById('patientOccupation');
    if (occInput) occInput.value = '';
    const visitInput = document.getElementById('visitType');
    if (visitInput) visitInput.value = 'initial';
    const histInput = document.getElementById('medicalHistory');
    if (histInput) histInput.value = '';
    const examCountDiv = document.getElementById('patientExamCount');
    if (examCountDiv) {
      examCountDiv.style.display = 'none';
      examCountDiv.textContent = '';
    }
    setDefaultDate();

    document.getElementById('seatedComparison').style.display = 'none';
    document.getElementById('diagnosisContent').innerHTML = '';
    document.getElementById('diagnosisActions').style.display = 'none';
    const summaryContent = document.getElementById('examSummaryContent');
    if (summaryContent) summaryContent.innerHTML = '';
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

    // Reset patient mode
    const patientActions = document.getElementById('patientActions');
    if (patientActions) patientActions.style.display = 'none';
    const waitCard = document.getElementById('patientWaiting');
    if (waitCard && viewMode === 'patient') waitCard.style.display = 'block';

    initDiagrams();
    goToStep(0);
    switchTab(viewMode === 'patient' ? 'diagnosis' : 'exam');
  }

  // ===== カルテ =====
  async function refreshHistory() {
    await Storage.renderKarteList(
      (id) => loadFromHistory(id),
      async (id) => {
        await Storage.delete(id);
        await refreshHistory();
      }
    );
    // 検索バー
    const searchInput = document.getElementById('karteSearchInput');
    if (searchInput && !searchInput._karteListenerAdded) {
      searchInput._karteListenerAdded = true;
      let timer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          await Storage.renderKarteList(
            (id) => loadFromHistory(id),
            async (id) => { await Storage.delete(id); await refreshHistory(); },
            searchInput.value
          );
        }, 200);
      });
    }
  }

  async function loadFromHistory(id) {
    const entry = await Storage.getById(id);
    if (!entry) return;

    loadedEntryId = entry.id;
    loadedEntryDate = entry.date;

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
    if (entry.painLevel != null) {
      painLevel = entry.painLevel;
    }
    if (entry.chiefComplaints && entry.chiefComplaints.length > 0) {
      chiefComplaintText = entry.chiefComplaints.join('、');
    }

    document.getElementById('patientName').value = entry.patientName || '';
    const chiefInput = document.getElementById('chiefComplaintText');
    if (chiefInput) chiefInput.value = chiefComplaintText;

    // 患者検査回数を表示
    if (entry.patientId) {
      const history = await Storage.getHistoryByPatient(entry.patientId);
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

    // 痛みスライダーの復元
    if (entry.painLevel != null) {
      const painSliderEl = document.getElementById('painSlider');
      const painValueEl = document.getElementById('painValue');
      if (painSliderEl) {
        painSliderEl.value = entry.painLevel;
        const pct = (entry.painLevel / 10) * 100;
        painSliderEl.style.background = `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
      }
      if (painValueEl) {
        painValueEl.textContent = entry.painLevel;
        painValueEl.style.color = entry.painLevel <= 3 ? '#4f46e5' : entry.painLevel <= 6 ? '#f59e0b' : '#ef4444';
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
    await renderDiagnosis(diagnosisResult);
    showDetailedExam();

    // 収縮分析結果があれば復元
    if (entry.contractionResult && entry.contractionResult.upper && entry.contractionResult.lower) {
      contractionResult = entry.contractionResult;
      renderUnifiedAnalysis(contractionResult.upper, contractionResult.lower);

      const allIssues = [
        ...contractionResult.upper.contractions, ...contractionResult.upper.tensions,
        ...contractionResult.lower.contractions, ...contractionResult.lower.tensions
      ];
      // セルフケア自動表示
      renderSelfcare(contractionResult.upper, contractionResult.lower);
      const selfcareBtn = document.getElementById('showSelfcareBtn');
      if (selfcareBtn) selfcareBtn.style.display = 'none';
    }

    // プロトコルボタン表示
    const protocolBtn = document.getElementById('showProtocolBtn');
    if (protocolBtn) protocolBtn.style.display = '';

    // 比較ボタンを更新
    await updateCompareButton();
    await updateTrendButton();

    // レポート更新
    await renderReport();

    switchTab('diagnosis');
  }

  // ===== DOM準備完了時に認証初期化 =====
  // ===== カスタム設定モーダル =====
  function setupCustomSettingsModal() {
    const settingsBtn = document.getElementById('settingsBtn');
    const modal = document.getElementById('customSettingsModal');
    if (!settingsBtn || !modal) return;

    settingsBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      renderCustomLists();
    });

    document.getElementById('closeCustomModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // タブ切り替え
    modal.querySelectorAll('.custom-modal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        modal.querySelectorAll('.custom-modal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.customTab;
        document.getElementById('customSelfcarePanel').style.display = target === 'selfcare' ? 'block' : 'none';
        document.getElementById('customProtocolPanel').style.display = target === 'protocol' ? 'block' : 'none';
        // タブ切り替え時にフォームをクリア
        document.getElementById('selfcareFormArea').innerHTML = '';
        document.getElementById('protocolFormArea').innerHTML = '';
      });
    });

    // 追加ボタン
    document.getElementById('addCustomSelfcare').addEventListener('click', () => showSelfcareForm());
    document.getElementById('addCustomProtocol').addEventListener('click', () => showProtocolForm());
  }

  const AREA_KEYS = ['首〜肩','肩〜腕','前腕〜手首','股関節〜太もも','太もも〜膝','すね〜足首','足裏','体幹'];
  const PROTOCOL_KEYS_MAIN = ['foot','upperBody','cranialPelvic','spine'];
  const PROTOCOL_KEYS_MAIN_LABELS = { foot:'足部', upperBody:'上半身', cranialPelvic:'頭蓋骨・骨盤', spine:'脊柱' };

  function renderCustomLists() {
    // セルフケアリスト
    const selfcareList = document.getElementById('customSelfcareList');
    const items = SelfcareDatabase._customItems;
    if (items.length === 0) {
      selfcareList.innerHTML = '<p style="color:#888;font-size:12px;padding:8px 0;">カスタム項目はまだありません</p>';
    } else {
      selfcareList.innerHTML = items.map(item => `
        <div class="custom-item-card">
          <div class="custom-item-info">
            <strong>${item.name}</strong>
            <span class="custom-item-meta">${item.area_key} / ${item.issue_type === 'contraction' ? '収縮' : '伸長'}</span>
          </div>
          <div class="custom-item-actions">
            <button class="btn btn-sm btn-secondary" onclick="editSelfcareItem('${item.id}')">編集</button>
            <button class="btn btn-sm btn-danger" onclick="deleteSelfcareItem('${item.id}')">削除</button>
          </div>
        </div>
      `).join('');
    }

    // プロトコルリスト
    const protocolList = document.getElementById('customProtocolList');
    const protocols = TreatmentProtocol._customProtocols;
    if (protocols.length === 0) {
      protocolList.innerHTML = '<p style="color:#888;font-size:12px;padding:8px 0;">カスタムプロトコルはまだありません</p>';
    } else {
      protocolList.innerHTML = protocols.map(p => `
        <div class="custom-item-card">
          <div class="custom-item-info">
            <strong>${p.title}</strong>
            <span class="custom-item-meta">${p.protocol_type === 'main' ? 'メイン' : '部位別'}: ${PROTOCOL_KEYS_MAIN_LABELS[p.protocol_key] || p.protocol_key}</span>
          </div>
          <div class="custom-item-actions">
            <button class="btn btn-sm btn-secondary" onclick="editProtocolItem('${p.id}')">編集</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProtocolItem('${p.id}')">削除</button>
          </div>
        </div>
      `).join('');
    }
  }

  // ===== セルフケア追加/編集フォーム =====
  function showSelfcareForm(editItem) {
    const formArea = document.getElementById('selfcareFormArea');
    const isEdit = !!editItem;
    const steps = isEdit && editItem.steps ? (Array.isArray(editItem.steps) ? editItem.steps : JSON.parse(editItem.steps)) : [''];

    formArea.innerHTML = `
      <div class="custom-form">
        <h3 style="margin:0 0 12px;font-size:14px;">${isEdit ? 'セルフケア編集' : 'セルフケア追加'}</h3>
        <div class="custom-form-row">
          <label>部位</label>
          <select id="cf_area">${AREA_KEYS.map(k => `<option value="${k}" ${isEdit && editItem.area_key === k ? 'selected' : ''}>${k}</option>`).join('')}</select>
        </div>
        <div class="custom-form-row">
          <label>タイプ</label>
          <select id="cf_type">
            <option value="contraction" ${isEdit && editItem.issue_type === 'contraction' ? 'selected' : ''}>収縮</option>
            <option value="tension" ${isEdit && editItem.issue_type === 'tension' ? 'selected' : ''}>伸長</option>
          </select>
        </div>
        <div class="custom-form-row"><label>名前</label><input id="cf_name" value="${isEdit ? editItem.name : ''}"></div>
        <div class="custom-form-row"><label>対象筋</label><input id="cf_target" value="${isEdit ? editItem.target : ''}"></div>
        <div class="custom-form-row"><label>説明</label><textarea id="cf_desc" rows="2">${isEdit ? editItem.description : ''}</textarea></div>
        <div class="custom-form-row">
          <label>手順</label>
          <div id="cf_steps">${steps.map((s, i) => `<div class="step-row"><input value="${s}" class="cf-step-input"><button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">×</button></div>`).join('')}</div>
          <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('cf_steps').insertAdjacentHTML('beforeend','<div class=\\'step-row\\'><input class=\\'cf-step-input\\' value=\\'\\'><button type=\\'button\\' class=\\'btn btn-sm btn-danger\\' onclick=\\'this.parentElement.remove()\\'>×</button></div>')">手順を追加</button>
        </div>
        <div class="custom-form-row"><label>回数</label><input id="cf_sets" value="${isEdit ? editItem.sets : ''}"></div>
        <div class="custom-form-row"><label>頻度</label><input id="cf_frequency" value="${isEdit ? editItem.frequency : ''}"></div>
        <div class="custom-form-row"><label>注意事項</label><textarea id="cf_caution" rows="2">${isEdit ? (editItem.caution || '') : ''}</textarea></div>
        <div class="custom-form-row"><label>エビデンス</label><textarea id="cf_evidence" rows="2">${isEdit ? (editItem.evidence || '') : ''}</textarea></div>
        <div class="custom-form-row">
          <label>画像を挿入（任意）</label>
          <input type="file" id="cf_image_file" accept="image/*" style="margin-bottom:6px;">
          <div id="cf_image_preview" style="margin-top:6px;">${isEdit && editItem.illustration ? `<img src="${editItem.illustration}" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #ddd;">` : ''}</div>
          <input type="hidden" id="cf_image" value="${isEdit ? (editItem.illustration || '') : ''}">
          <p style="font-size:11px;color:#888;margin-top:4px;">画像ファイルを選択してください。空欄の場合はイラストなしで表示されます。</p>
        </div>
        <div class="custom-form-btns">
          <button class="btn btn-primary" id="cf_save">${isEdit ? '更新' : '保存'}</button>
          <button class="btn btn-secondary" onclick="document.getElementById('selfcareFormArea').innerHTML=''">キャンセル</button>
        </div>
      </div>
    `;
    formArea.scrollIntoView({ behavior: 'smooth' });

    // 画像ファイル選択時にBase64変換＋プレビュー
    document.getElementById('cf_image_file').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { alert('画像は2MB以下にしてください'); e.target.value = ''; return; }
      const reader = new FileReader();
      reader.onload = function(ev) {
        document.getElementById('cf_image').value = ev.target.result;
        document.getElementById('cf_image_preview').innerHTML = `<img src="${ev.target.result}" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #ddd;">`;
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('cf_save').addEventListener('click', async () => {
      const steps = [...document.querySelectorAll('.cf-step-input')].map(el => el.value).filter(v => v.trim());
      const data = {
        area_key: document.getElementById('cf_area').value,
        issue_type: document.getElementById('cf_type').value,
        name: document.getElementById('cf_name').value,
        target: document.getElementById('cf_target').value,
        description: document.getElementById('cf_desc').value,
        steps: JSON.stringify(steps),
        sets: document.getElementById('cf_sets').value,
        frequency: document.getElementById('cf_frequency').value,
        caution: document.getElementById('cf_caution').value,
        evidence: document.getElementById('cf_evidence').value,
        illustration: document.getElementById('cf_image').value || null,
      };
      if (!data.name || !data.target) { alert('名前と対象筋は必須です'); return; }
      try {
        if (isEdit) {
          await SelfcareDatabase.updateCustomItem(editItem.id, data);
        } else {
          await SelfcareDatabase.saveCustomItem(SupabaseAuth.getClinicId(), data);
        }
        formArea.innerHTML = '';
        renderCustomLists();
      } catch (e) { alert('保存エラー: ' + e.message); }
    });
  }

  // ===== プロトコル追加/編集フォーム =====
  function showProtocolForm(editItem) {
    const formArea = document.getElementById('protocolFormArea');
    const isEdit = !!editItem;
    const techs = isEdit && editItem.techniques ? (Array.isArray(editItem.techniques) ? editItem.techniques : JSON.parse(editItem.techniques)) : [{ name:'', target:'', description:'', duration:'' }];

    const mainOptions = PROTOCOL_KEYS_MAIN.map(k => `<option value="${k}" ${isEdit && editItem.protocol_key === k ? 'selected' : ''}>${PROTOCOL_KEYS_MAIN_LABELS[k]}</option>`).join('');
    const areaOptions = AREA_KEYS.map(k => `<option value="${k}" ${isEdit && editItem.protocol_key === k ? 'selected' : ''}>${k}</option>`).join('');

    formArea.innerHTML = `
      <div class="custom-form">
        <h3 style="margin:0 0 12px;font-size:14px;">${isEdit ? 'プロトコル編集' : 'プロトコル追加'}</h3>
        <div class="custom-form-row">
          <label>タイプ</label>
          <select id="pf_type" onchange="document.getElementById('pf_key_main').style.display=this.value==='main'?'block':'none';document.getElementById('pf_key_area').style.display=this.value==='area'?'block':'none';">
            <option value="main" ${isEdit && editItem.protocol_type === 'main' ? 'selected' : ''}>メイン（原因別）</option>
            <option value="area" ${isEdit && editItem.protocol_type === 'area' ? 'selected' : ''}>部位別（収縮）</option>
          </select>
        </div>
        <div class="custom-form-row">
          <label>対象</label>
          <select id="pf_key_main" style="display:${!isEdit || editItem.protocol_type === 'main' ? 'block' : 'none'}">${mainOptions}</select>
          <select id="pf_key_area" style="display:${isEdit && editItem.protocol_type === 'area' ? 'block' : 'none'}">${areaOptions}</select>
        </div>
        <div class="custom-form-row"><label>タイトル</label><input id="pf_title" value="${isEdit ? editItem.title : ''}"></div>
        <div class="custom-form-row">
          <label>テクニック</label>
          <div id="pf_techs">${techs.map((t, i) => `
            <div class="tech-row">
              <input placeholder="名前" value="${t.name || ''}" class="pf-tech-name">
              <input placeholder="対象" value="${t.target || ''}" class="pf-tech-target">
              <input placeholder="説明" value="${t.description || ''}" class="pf-tech-desc">
              <input placeholder="時間" value="${t.duration || ''}" class="pf-tech-dur" style="width:80px;">
              <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">×</button>
            </div>
          `).join('')}</div>
          <button type="button" class="btn btn-sm btn-secondary" id="pf_add_tech">テクニック追加</button>
        </div>
        <div class="custom-form-btns">
          <button class="btn btn-primary" id="pf_save">${isEdit ? '更新' : '保存'}</button>
          <button class="btn btn-secondary" onclick="document.getElementById('protocolFormArea').innerHTML=''">キャンセル</button>
        </div>
      </div>
    `;
    formArea.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('pf_add_tech').addEventListener('click', () => {
      document.getElementById('pf_techs').insertAdjacentHTML('beforeend', `
        <div class="tech-row">
          <input placeholder="名前" class="pf-tech-name">
          <input placeholder="対象" class="pf-tech-target">
          <input placeholder="説明" class="pf-tech-desc">
          <input placeholder="時間" class="pf-tech-dur" style="width:80px;">
          <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">×</button>
        </div>
      `);
    });

    document.getElementById('pf_save').addEventListener('click', async () => {
      const type = document.getElementById('pf_type').value;
      const key = type === 'main' ? document.getElementById('pf_key_main').value : document.getElementById('pf_key_area').value;
      const techniques = [...document.querySelectorAll('.tech-row')].map(row => ({
        name: row.querySelector('.pf-tech-name').value,
        target: row.querySelector('.pf-tech-target').value,
        description: row.querySelector('.pf-tech-desc').value,
        duration: row.querySelector('.pf-tech-dur').value,
      })).filter(t => t.name.trim());

      const data = {
        protocol_type: type,
        protocol_key: key,
        title: document.getElementById('pf_title').value,
        techniques: JSON.stringify(techniques),
      };
      if (!data.title) { alert('タイトルは必須です'); return; }
      try {
        if (isEdit) {
          await TreatmentProtocol.updateCustomProtocol(editItem.id, data);
        } else {
          await TreatmentProtocol.saveCustomProtocol(SupabaseAuth.getClinicId(), data);
        }
        formArea.innerHTML = '';
        renderCustomLists();
      } catch (e) { alert('保存エラー: ' + e.message); }
    });
  }

  // グローバルスコープに公開（onclick用）
  window.editSelfcareItem = function(id) {
    const item = SelfcareDatabase._customItems.find(i => i.id === id);
    if (item) showSelfcareForm(item);
  };
  window.deleteSelfcareItem = async function(id) {
    if (!confirm('削除しますか？')) return;
    await SelfcareDatabase.deleteCustomItem(id);
    renderCustomLists();
  };
  window.editProtocolItem = function(id) {
    const item = TreatmentProtocol._customProtocols.find(i => i.id === id);
    if (item) showProtocolForm(item);
  };
  window.deleteProtocolItem = async function(id) {
    if (!confirm('削除しますか？')) return;
    await TreatmentProtocol.deleteCustomProtocol(id);
    renderCustomLists();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
