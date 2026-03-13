// ===== SVG人体図の描画と色付け =====

const BodyMap = {
  severityColors: {
    0: { fill: '#dcfce7', stroke: '#22c55e' }, // 正常（緑）
    1: { fill: '#fef3c7', stroke: '#f59e0b' }, // 注意（黄）
    2: { fill: '#fecaca', stroke: '#ef4444' }, // 要改善（赤）
    none: { fill: '#f1f5f9', stroke: '#cbd5e1' } // 未評価（グレー）
  },

  // 前面のSVGを生成
  createFrontSVG() {
    return `
    <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
      <!-- 頭 -->
      <ellipse cx="100" cy="30" rx="22" ry="26" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" data-part="head"/>

      <!-- 首（頸椎） -->
      <rect data-part="cervical" class="body-part" x="90" y="56" width="20" height="18" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左肩 -->
      <ellipse data-part="leftShoulder" class="body-part" cx="58" cy="85" rx="18" ry="12" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右肩 -->
      <ellipse data-part="rightShoulder" class="body-part" cx="142" cy="85" rx="18" ry="12" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 胸部（胸椎対応エリア） -->
      <rect data-part="thoracic" class="body-part" x="68" y="74" width="64" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左上腕 -->
      <rect data-part="leftElbow" class="body-part" x="35" y="95" width="18" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右上腕 -->
      <rect data-part="rightElbow" class="body-part" x="147" y="95" width="18" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左前腕・手首 -->
      <rect data-part="leftWrist" class="body-part" x="28" y="152" width="16" height="50" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右前腕・手首 -->
      <rect data-part="rightWrist" class="body-part" x="156" y="152" width="16" height="50" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 腹部（腰椎対応エリア） -->
      <rect data-part="lumbar" class="body-part" x="72" y="130" width="56" height="40" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 骨盤 -->
      <path data-part="pelvis" class="body-part" d="M68,170 Q68,195 82,200 L118,200 Q132,195 132,170 Z" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左大腿 -->
      <rect x="72" y="202" width="22" height="70" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 右大腿 -->
      <rect x="106" y="202" width="22" height="70" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 左膝 -->
      <ellipse data-part="leftKnee" class="body-part" cx="83" cy="278" rx="14" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右膝 -->
      <ellipse data-part="rightKnee" class="body-part" cx="117" cy="278" rx="14" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左下腿 -->
      <rect x="74" y="290" width="18" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 右下腿 -->
      <rect x="108" y="290" width="18" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 左足 -->
      <ellipse data-part="leftFoot" class="body-part" cx="83" cy="365" rx="16" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右足 -->
      <ellipse data-part="rightFoot" class="body-part" cx="117" cy="365" rx="16" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 重心マーカー -->
      <circle data-part="balanceCenter" class="body-part" cx="100" cy="210" r="8" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,2"/>

      <!-- ラベル -->
      <text x="100" y="396" text-anchor="middle" font-size="10" fill="#94a3b8">前面</text>
    </svg>`;
  },

  // 背面のSVGを生成
  createBackSVG() {
    return `
    <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
      <!-- 頭 -->
      <ellipse cx="100" cy="30" rx="22" ry="26" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" data-part="head"/>

      <!-- 首（頸椎） -->
      <rect data-part="cervical" class="body-part" x="90" y="56" width="20" height="18" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左肩甲骨 -->
      <path data-part="leftScapula" class="body-part" d="M62,82 L78,78 L82,110 L65,115 Z" fill="#f1f5f9" stroke="#cbd5e1" rx="4"/>

      <!-- 右肩甲骨 -->
      <path data-part="rightScapula" class="body-part" d="M138,82 L122,78 L118,110 L135,115 Z" fill="#f1f5f9" stroke="#cbd5e1" rx="4"/>

      <!-- 左肩 -->
      <ellipse data-part="leftShoulder" class="body-part" cx="55" cy="85" rx="16" ry="12" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右肩 -->
      <ellipse data-part="rightShoulder" class="body-part" cx="145" cy="85" rx="16" ry="12" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 背中上部（胸椎） -->
      <rect data-part="thoracic" class="body-part" x="82" y="74" width="36" height="50" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左上腕 -->
      <rect data-part="leftElbow" class="body-part" x="32" y="95" width="18" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右上腕 -->
      <rect data-part="rightElbow" class="body-part" x="150" y="95" width="18" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左前腕 -->
      <rect data-part="leftWrist" class="body-part" x="25" y="152" width="16" height="50" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右前腕 -->
      <rect data-part="rightWrist" class="body-part" x="159" y="152" width="16" height="50" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 腰部（腰椎） -->
      <rect data-part="lumbar" class="body-part" x="78" y="125" width="44" height="45" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 骨盤（後面） -->
      <path data-part="pelvis" class="body-part" d="M68,170 Q68,198 84,202 L116,202 Q132,198 132,170 Z" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左大腿 -->
      <rect x="72" y="204" width="22" height="68" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 右大腿 -->
      <rect x="106" y="204" width="22" height="68" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 左膝 -->
      <ellipse data-part="leftKnee" class="body-part" cx="83" cy="278" rx="14" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右膝 -->
      <ellipse data-part="rightKnee" class="body-part" cx="117" cy="278" rx="14" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 左下腿 -->
      <rect x="74" y="290" width="18" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 右下腿 -->
      <rect x="108" y="290" width="18" height="65" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>

      <!-- 左足 -->
      <ellipse data-part="leftFoot" class="body-part" cx="83" cy="365" rx="16" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 右足 -->
      <ellipse data-part="rightFoot" class="body-part" cx="117" cy="365" rx="16" ry="10" fill="#f1f5f9" stroke="#cbd5e1"/>

      <!-- 重心マーカー -->
      <circle data-part="balanceCenter" class="body-part" cx="100" cy="210" r="8" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,2"/>

      <!-- ラベル -->
      <text x="100" y="396" text-anchor="middle" font-size="10" fill="#94a3b8">背面</text>
    </svg>`;
  },

  // 人体図を初期化
  init() {
    const frontEl = document.getElementById('bodyMapFront');
    const backEl = document.getElementById('bodyMapBack');
    if (frontEl) frontEl.innerHTML = this.createFrontSVG();
    if (backEl) backEl.innerHTML = this.createBackSVG();
  },

  // 結果に基づいて人体図を色付け
  updateColors(bodyPartSeverity) {
    // 全パーツの色をリセット
    document.querySelectorAll('.body-part').forEach(el => {
      const partName = el.getAttribute('data-part');
      const severity = bodyPartSeverity[partName];
      const colors = severity !== undefined ? this.severityColors[severity] : this.severityColors.none;

      el.setAttribute('fill', colors.fill);
      el.setAttribute('stroke', colors.stroke);

      // CSSクラスも設定
      el.classList.remove('severity-normal', 'severity-moderate', 'severity-severe', 'severity-none');
      if (severity === 0) el.classList.add('severity-normal');
      else if (severity === 1) el.classList.add('severity-moderate');
      else if (severity === 2) el.classList.add('severity-severe');
      else el.classList.add('severity-none');
    });

    // 重心マーカーの特別表示
    const balanceSeverity = bodyPartSeverity.balanceCenter;
    if (balanceSeverity !== undefined && balanceSeverity > 0) {
      const colors = this.severityColors[balanceSeverity];
      document.querySelectorAll('[data-part="balanceCenter"]').forEach(el => {
        el.setAttribute('stroke', colors.stroke);
        el.setAttribute('fill', colors.fill);
        el.setAttribute('stroke-dasharray', '');
        el.setAttribute('stroke-width', '3');
      });
    }
  },

  // パーツクリック時のイベントハンドラを設定
  setupClickHandlers(results, isPro) {
    document.querySelectorAll('.body-part').forEach(el => {
      el.addEventListener('click', (e) => {
        const partName = el.getAttribute('data-part');
        this.showPartDetail(partName, results, isPro);
      });
    });
  },

  // パーツの詳細をポップアップ表示
  showPartDetail(partName, results, isPro) {
    const relatedResults = results.filter(r => r.bodyParts.includes(partName));
    if (relatedResults.length === 0) return;

    const partLabels = {
      head: '頭部', cervical: isPro ? '頸椎' : '首',
      leftShoulder: '左肩', rightShoulder: '右肩',
      leftScapula: '左肩甲骨', rightScapula: '右肩甲骨',
      thoracic: isPro ? '胸椎' : '背中上部',
      leftElbow: isPro ? '左肘頭' : '左肘',
      rightElbow: isPro ? '右肘頭' : '右肘',
      leftWrist: isPro ? '左橈骨茎状突起' : '左手首',
      rightWrist: isPro ? '右橈骨茎状突起' : '右手首',
      lumbar: isPro ? '腰椎' : '腰',
      pelvis: isPro ? '骨盤' : '骨盤',
      leftKnee: '左膝', rightKnee: '右膝',
      leftFoot: '左足', rightFoot: '右足',
      balanceCenter: '重心'
    };

    const popup = document.getElementById('detailPopup');
    const title = document.getElementById('popupTitle');
    const body = document.getElementById('popupBody');

    title.textContent = partLabels[partName] || partName;

    let html = '';
    for (const result of relatedResults) {
      const severityInfo = InspectionConfig.severityLabels[result.severity];
      const text = InspectionConfig.getResultText(result.fieldName, result.value, isPro);
      html += `
        <div style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
          <span>${severityInfo.icon}</span>
          <strong>${text}</strong>
        </div>`;
    }

    body.innerHTML = html;
    popup.style.display = 'flex';
  }
};
