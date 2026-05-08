// ===== リアル人体画像＋オーバーレイ方式の身体図 =====
// 既存の SVG bodyDiagram と並列で利用。結果ページの後面図のみ差し替え。
// gender: 'male' | 'female' | 'other'（other は male 画像）
// 画像サイズ: 755x1041 (aspect ≒ 0.7253)
//
// 入力データ:
//   standing: { mastoid, scapulaInferior, iliacCrest } (-1/0/1)
//     ※ scapulaInferior キーは既存仕様維持。表示ラベルは「肩甲棘」へ更新。
//   upper:   { acromion, mastoidDetail(肘頭), radialStyloid }
//   lower:   { greaterTrochanter, patellaUpper, lateralMalleolus }
//
// 値の意味（既存仕様）: -1=左が高い / 0=同じ / 1=右が高い
//   下にある側（低い側）= 縮こまっている（短縮）として描画する。
//   荷重側 = 「下」になっている側（短縮側）と仮定（資料: オレンジ=荷重側）。
//   ただし重心結果（gravityResult.side）が指定されていればそちらを優先。
//
// === 描画方式（2026-04-30 全面リライト）===
// stage は CSS で aspect-ratio: 755/1041 を固定し、
// img を absolute + inset:0 + object-fit:contain で stage 内に厳密に収める。
// これにより stage の表示矩形 = img の表示矩形 となり、
// マーカー(top:Y%/left:X%) が常に画像座標と一致する。
// JS による高さ同期や ResizeObserver は不要。

const RealisticBodyDiagram = {
  IMG_W: 755,
  IMG_H: 1041,

  // ランドマーク基準位置（画像 755×1041 に対する%・左上原点）
  // 体の中心 cx ≒ 55.5%、上端 y=1.0%、下端 y=96.1% （シルエット解析より）
  positions: {
    standing: {
      // 乳様突起：頭部下端、耳の付け根。首の細部 (y=140 → 13.5%) より少し上
      mastoid:         { left: { x: 52.0, y: 12.5 }, right: { x: 59.0, y: 12.5 }, label: '乳様突起' },
      // 肩甲棘：肩甲骨上縁、脊柱から外側。肩峰のすぐ下 (y=285 → 27.4%)
      // ※ データキーは互換性のため scapulaInferior のまま。表示は「肩甲棘」。
      scapulaInferior: { left: { x: 48.0, y: 27.5 }, right: { x: 63.0, y: 27.5 }, label: '肩甲棘' },
      // 腸骨稜：骨盤上端、脊柱から外側 (y=525 → 50.4%)
      iliacCrest:      { left: { x: 48.5, y: 50.5 }, right: { x: 62.5, y: 50.5 }, label: '腸骨稜' }
    },
    upper: {
      // 肩峰：肩の最外側 (y=250 → 24.0%, 左右 37.6%/73.4%)
      acromion:      { left: { x: 37.5, y: 24.0 }, right: { x: 73.5, y: 24.0 }, label: '肩峰' },
      // 肘頭：腕が体側につく状態の体最外側 (y=505 → 48.5%, 左右 34.0%/76.7%)
      mastoidDetail: { left: { x: 34.0, y: 48.5 }, right: { x: 76.5, y: 48.5 }, label: '肘頭' },
      // 橈骨茎状突起：手首親指側 (y=605 → 58.1%, 左右 37.0%/74.0%)
      radialStyloid: { left: { x: 37.0, y: 58.0 }, right: { x: 74.0, y: 58.0 }, label: '茎状突起' }
    },
    lower: {
      // 大転子：腰最外側 (y=560 → 53.8%, 左右 33.9%/76.8%)
      greaterTrochanter: { left: { x: 34.0, y: 53.8 }, right: { x: 76.5, y: 53.8 }, label: '大転子' },
      // 膝蓋骨上端：脚中央 (y=740 → 71.1%、左右の脚中心 46.9%/63.0%)
      patellaUpper:      { left: { x: 46.9, y: 71.0 }, right: { x: 63.0, y: 71.0 }, label: '膝蓋骨上端' },
      // 外果：足首外側 (y=920 → 88.4%、各脚最外 44.6%/64.9%)
      lateralMalleolus:  { left: { x: 44.6, y: 88.4 }, right: { x: 64.9, y: 88.4 }, label: '外果' }
    }
  },

  // 画像URL
  imageFor(gender) {
    if (gender === 'female') return 'img/body/body_female_back_clean.png';
    return 'img/body/body_male_back_clean.png';
  },

  // 値→tilt: -1で左下/右上、+1で左上/右下（短縮側=低い側）
  // 視覚的に縦シフトを加える（画像高さに対する%）
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

    // ステージ：img と同じ矩形を保証するため CSS で aspect-ratio: 755/1041 を固定。
    // img は absolute + inset:0 + object-fit:contain で stage 内に厳密に収まる。
    // これにより stage と img の表示矩形が常に一致し、%座標が正しく機能する。
    const stage = document.createElement('div');
    stage.className = 'rbd-stage';

    // 背景画像
    const img = document.createElement('img');
    img.className = 'rbd-bg';
    img.alt = '背面図';
    img.src = imgSrc;
    img.decoding = 'async';
    img.loading = 'eager';
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
      const minGap = 3.2; // %
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
          // 左側矢印（ドット上）
          const lArrow = document.createElement('div');
          const lShort = (shortSide === 'left');
          lArrow.className = 'rbd-marker rbd-arrow ' + (lShort ? 'down red' : 'up blue');
          lArrow.style.left = pos.left.x + '%';
          lArrow.style.top  = (lY - 2.4) + '%';
          lArrow.textContent = lShort ? '↓' : '↑';
          stage.appendChild(lArrow);

          const rArrow = document.createElement('div');
          const rShort = (shortSide === 'right');
          rArrow.className = 'rbd-marker rbd-arrow ' + (rShort ? 'down red' : 'up blue');
          rArrow.style.left = pos.right.x + '%';
          rArrow.style.top  = (rY - 2.4) + '%';
          rArrow.textContent = rShort ? '↓' : '↑';
          stage.appendChild(rArrow);
        }

        // ===== 状態バッジ（外側に配置・体に被らない） =====
        // 短縮側＝赤バッジ「左縮/右縮」、伸長側＝紫バッジ「左伸/右伸」
        // 旧実装は中央側 (体内側) に配置していたが、画像のラベル領域に被るため
        // ドットの「外側方向」に配置する仕様へ変更。
        if (val !== 0) {
          // 左ドットの外側 = 画像の左方向 (xを減らす)
          const lBadge = document.createElement('div');
          const lIsShort = (shortSide === 'left');
          lBadge.className = 'rbd-marker rbd-badge ' + (lIsShort ? 'red' : 'purple');
          lBadge.textContent = '左' + (lIsShort ? '縮' : '伸');
          // ドットの外側（左方向）に逃がす
          lBadge.style.left = Math.max(2, pos.left.x - 7) + '%';
          lBadge.style.top  = (lY + 3.2) + '%';
          stage.appendChild(lBadge);

          // 右ドットの外側 = 画像の右方向 (xを増やす)
          const rBadge = document.createElement('div');
          const rIsShort = (shortSide === 'right');
          rBadge.className = 'rbd-marker rbd-badge ' + (rIsShort ? 'red' : 'purple');
          rBadge.textContent = '右' + (rIsShort ? '縮' : '伸');
          rBadge.style.left = Math.min(98, pos.right.x + 7) + '%';
          rBadge.style.top  = (rY + 3.2) + '%';
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

    // 古いブラウザ対策（aspect-ratio 非対応の保険）
    // stage の高さが 0 の場合のみ JS で計算してセット
    const fallbackSyncHeight = () => {
      if (!stage.isConnected) return;
      const w = stage.clientWidth;
      if (w > 0 && stage.clientHeight < 5) {
        stage.style.height = (w * (this.IMG_H / this.IMG_W)) + 'px';
      }
    };
    requestAnimationFrame(fallbackSyncHeight);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(fallbackSyncHeight);
      ro.observe(stage);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', fallbackSyncHeight, { passive: true });
    }
  }
};

// グローバル公開
if (typeof window !== 'undefined') {
  window.RealisticBodyDiagram = RealisticBodyDiagram;
}
