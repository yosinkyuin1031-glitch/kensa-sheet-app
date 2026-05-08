// ===== リアル人体画像＋オーバーレイ方式の身体図（テスト実装） =====
// 既存の SVG bodyDiagram と並列で利用。結果ページの後面図のみ差し替え。
// gender: 'male' | 'female' | 'other'（other は male 画像）
// 画像サイズ: 1080x1456（aspect ratio ≒ 0.7418）
//
// 入力データ:
//   standingData: { mastoid, scapulaInferior, iliacCrest } (-1/0/1)
//   upperDetail:  { acromion, mastoidDetail(肘頭), radialStyloid }
//   lowerDetail:  { greaterTrochanter, patellaUpper, lateralMalleolus }
//
// 値の意味（既存仕様）: -1=左が高い / 0=同じ / 1=右が高い
//   下にある側（低い側）= 縮こまっている（短縮）として描画する。
//   荷重側 = 「下」になっている側（短縮側）と仮定（資料: オレンジ=荷重側）。
//   ただし重心結果（gravityResult.side）が指定されていればそちらを優先。

const RealisticBodyDiagram = {
  IMG_W: 1080,
  IMG_H: 1456,
  ASPECT: 1080 / 1456,

  // ランドマーク基準位置（画像に対する%・左上原点）
  // ユーザー指示の推定値をそのまま採用
  positions: {
    standing: {
      mastoid:         { left: { x: 47.5, y:  7.5 }, right: { x: 52.5, y:  7.5 }, label: '乳様突起' },
      scapulaInferior: { left: { x: 41.0, y: 31.0 }, right: { x: 59.0, y: 31.0 }, label: '肩甲下角' },
      iliacCrest:      { left: { x: 41.0, y: 46.0 }, right: { x: 59.0, y: 46.0 }, label: '腸骨稜' }
    },
    upper: {
      acromion:      { left: { x: 36.0, y: 17.0 }, right: { x: 64.0, y: 17.0 }, label: '肩峰' },
      mastoidDetail: { left: { x: 26.0, y: 35.0 }, right: { x: 74.0, y: 35.0 }, label: '肘頭' },
      radialStyloid: { left: { x: 24.0, y: 49.0 }, right: { x: 76.0, y: 49.0 }, label: '茎状突起' }
    },
    lower: {
      greaterTrochanter: { left: { x: 36.0, y: 53.0 }, right: { x: 64.0, y: 53.0 }, label: '大転子' },
      patellaUpper:      { left: { x: 41.0, y: 73.0 }, right: { x: 59.0, y: 73.0 }, label: '膝蓋骨上端' },
      lateralMalleolus:  { left: { x: 45.0, y: 95.0 }, right: { x: 55.0, y: 95.0 }, label: '外果' }
    }
  },

  // 画像URL
  imageFor(gender) {
    if (gender === 'female') return 'img/body/body_female_back_clean.png';
    return 'img/body/body_male_back_clean.png';
  },

  // 値→tilt: -1で左下/右上、+1で左上/右下（短縮側=低い側）
  // 視覚的に8%程度の縦シフトを加える（画像高さに対する%）
  TILT_PCT: 1.6,
  _leftYShift(val) { return  (val || 0) * this.TILT_PCT; },
  _rightYShift(val) { return -(val || 0) * this.TILT_PCT; },

  // メインレンダラ
  // containerEl: 描画先 div
  // payload: { standing, upper, lower, gravitySide ('left'|'right'|'even'|null) }
  // gender: 'male'|'female'|'other'
  render(containerEl, payload, gender) {
    if (!containerEl) return;
    const standing = payload && payload.standing ? payload.standing : {};
    const upper    = payload && payload.upper    ? payload.upper    : {};
    const lower    = payload && payload.lower    ? payload.lower    : {};
    const gravitySide = payload && payload.gravitySide ? payload.gravitySide : null;
    const imgSrc = this.imageFor(gender);

    // データを結合
    const allMaps = [
      { groupKey: 'standing', map: this.positions.standing, data: standing },
      { groupKey: 'upper',    map: this.positions.upper,    data: upper },
      { groupKey: 'lower',    map: this.positions.lower,    data: lower }
    ];

    // 描画ノード組み立て
    containerEl.innerHTML = '';
    containerEl.classList.add('realistic-body-diagram');
    containerEl.setAttribute('data-view', 'back');

    // ヘッダー（左右ラベル）
    const header = document.createElement('div');
    header.className = 'rbd-header';
    header.innerHTML = '<span class="rbd-side-label rbd-left">左</span>' +
                       '<span class="rbd-side-label rbd-right">右</span>';
    containerEl.appendChild(header);

    // ステージ外側ラッパ（左右の解剖ラベル領域を含む）
    const stageWrap = document.createElement('div');
    stageWrap.className = 'rbd-stage-wrap';

    // ステージ（画像と同じ矩形・マーカー配置基準）
    const stage = document.createElement('div');
    stage.className = 'rbd-stage';
    stage.style.aspectRatio = this.IMG_W + ' / ' + this.IMG_H;

    // 背景画像
    const img = document.createElement('img');
    img.className = 'rbd-bg';
    img.alt = '背面図';
    img.src = imgSrc;
    img.decoding = 'async';
    img.loading = 'lazy';
    stage.appendChild(img);

    // SVG（リーダー線用、画像と同じ座標系で 0..100）
    const NS = 'http://www.w3.org/2000/svg';
    const lineSvg = document.createElementNS(NS, 'svg');
    lineSvg.setAttribute('class', 'rbd-leader-svg');
    lineSvg.setAttribute('viewBox', '0 0 100 100');
    lineSvg.setAttribute('preserveAspectRatio', 'none');
    stage.appendChild(lineSvg);

    // ラベルY配置の重複回避（左外/右外それぞれ管理）
    const labelGuard = { left: [], right: [] };
    const reserveY = (side, y) => {
      const list = labelGuard[side];
      const minGap = 3.0; // %
      let yy = y;
      let safety = 50;
      while (safety-- > 0 && list.some(v => Math.abs(v - yy) < minGap)) {
        yy += minGap;
      }
      list.push(yy);
      return yy;
    };

    // 各ランドマークを描画
    for (const { map, data } of allMaps) {
      for (const [key, pos] of Object.entries(map)) {
        const val = data ? data[key] : null;
        if (val === null || val === undefined) continue;

        const lY = pos.left.y  + this._leftYShift(val);
        const rY = pos.right.y + this._rightYShift(val);

        // 短縮側=低い側 = 「下」になっている方
        // val=-1: 左が高い → 右が低い → 右が短縮
        // val=+1: 右が高い → 左が低い → 左が短縮
        let shortSide = null; // 'left'|'right'|null
        if (val === -1) shortSide = 'right';
        else if (val === 1) shortSide = 'left';

        // 荷重側決定（重心結果優先、なければ短縮側＝荷重側仮説）
        const loadSide = gravitySide && gravitySide !== 'even' ? gravitySide : shortSide;

        // ===== 左右ドット =====
        const lDot = document.createElement('div');
        lDot.className = 'rbd-marker rbd-dot ' + (loadSide === 'left' ? 'orange' : (val !== 0 ? 'blue' : 'green'));
        lDot.style.left = pos.left.x + '%';
        lDot.style.top  = lY + '%';
        lDot.title = pos.label + '（左）';
        stage.appendChild(lDot);

        const rDot = document.createElement('div');
        rDot.className = 'rbd-marker rbd-dot ' + (loadSide === 'right' ? 'orange' : (val !== 0 ? 'blue' : 'green'));
        rDot.style.left = pos.right.x + '%';
        rDot.style.top  = rY + '%';
        rDot.title = pos.label + '（右）';
        stage.appendChild(rDot);

        // ===== 矢印（短縮=下向き赤、伸長=上向き青） =====
        if (val !== 0) {
          // 左側矢印
          const lArrow = document.createElement('div');
          const lShort = (shortSide === 'left');
          lArrow.className = 'rbd-marker rbd-arrow ' + (lShort ? 'down red' : 'up blue');
          lArrow.style.left = pos.left.x + '%';
          lArrow.style.top  = (lY - 2.2) + '%';
          lArrow.textContent = lShort ? '↓' : '↑';
          stage.appendChild(lArrow);

          const rArrow = document.createElement('div');
          const rShort = (shortSide === 'right');
          rArrow.className = 'rbd-marker rbd-arrow ' + (rShort ? 'down red' : 'up blue');
          rArrow.style.left = pos.right.x + '%';
          rArrow.style.top  = (rY - 2.2) + '%';
          rArrow.textContent = rShort ? '↓' : '↑';
          stage.appendChild(rArrow);
        }

        // ===== 状態バッジ（中央側） =====
        // 短縮側＝赤バッジ「左縮/右縮」、伸長側＝紫バッジ「左伸/右伸」
        if (val !== 0) {
          // 左ドット用バッジ（中央寄りに配置）
          const lBadge = document.createElement('div');
          const lIsShort = (shortSide === 'left');
          lBadge.className = 'rbd-marker rbd-badge ' + (lIsShort ? 'red' : 'purple');
          lBadge.textContent = '左' + (lIsShort ? '縮' : '伸');
          lBadge.style.left = (pos.left.x + 6) + '%';
          lBadge.style.top  = lY + '%';
          stage.appendChild(lBadge);

          // 右ドット用バッジ（中央寄りに配置）
          const rBadge = document.createElement('div');
          const rIsShort = (shortSide === 'right');
          rBadge.className = 'rbd-marker rbd-badge ' + (rIsShort ? 'red' : 'purple');
          rBadge.textContent = '右' + (rIsShort ? '縮' : '伸');
          rBadge.style.left = (pos.right.x - 6) + '%';
          rBadge.style.top  = rY + '%';
          stage.appendChild(rBadge);
        }

        // ===== 解剖ラベル（左外側 / 右外側、stageWrap直下に配置） =====
        const lLabelY = reserveY('left',  lY);
        const rLabelY = reserveY('right', rY);

        const lLabel = document.createElement('div');
        lLabel.className = 'rbd-label rbd-label-left';
        lLabel.style.top = lLabelY + '%';
        lLabel.textContent = pos.label;
        stageWrap.appendChild(lLabel);

        const rLabel = document.createElement('div');
        rLabel.className = 'rbd-label rbd-label-right';
        rLabel.style.top = rLabelY + '%';
        rLabel.textContent = pos.label;
        stageWrap.appendChild(rLabel);

        // ===== リーダー線（点線・SVG） =====
        // 左ラベル中央(0%)→ドット位置
        const lLine = document.createElementNS(NS, 'line');
        lLine.setAttribute('x1', '0');
        lLine.setAttribute('y1', String(lLabelY));
        lLine.setAttribute('x2', String(pos.left.x));
        lLine.setAttribute('y2', String(lY));
        lLine.setAttribute('class', 'rbd-leader');
        lineSvg.appendChild(lLine);

        const rLine = document.createElementNS(NS, 'line');
        rLine.setAttribute('x1', '100');
        rLine.setAttribute('y1', String(rLabelY));
        rLine.setAttribute('x2', String(pos.right.x));
        rLine.setAttribute('y2', String(rY));
        rLine.setAttribute('class', 'rbd-leader');
        lineSvg.appendChild(rLine);
      }
    }

    stageWrap.appendChild(stage);
    containerEl.appendChild(stageWrap);

    // フッター
    const footer = document.createElement('div');
    footer.className = 'rbd-footer';
    footer.textContent = '背面図（患者目線）';
    containerEl.appendChild(footer);
  }
};

// グローバル公開
if (typeof window !== 'undefined') {
  window.RealisticBodyDiagram = RealisticBodyDiagram;
}
