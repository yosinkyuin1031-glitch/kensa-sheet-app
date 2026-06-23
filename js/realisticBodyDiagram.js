// ===== リアル人体画像＋オーバーレイ方式の身体図 =====
// 既存の SVG bodyDiagram と並列で利用。結果ページの後面図のみ差し替え。
// gender: 'male' | 'female' | 'other'（other は male 画像）
// 画像サイズ: 755x1041 (aspect ≒ 0.7253)
//
// 入力データ:
//   standing: { mastoid, scapulaInferior, iliacCrest } (-1/0/1)
//     ※ scapulaInferior キーは既存仕様維持。表示ラベルは「肩甲下角」。
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
  // 体中心 cx ≒ 55.48%、上端 y=1.1%、下端 y=96.1%
  // 2026-05-13 シルエット解析(/tmp/analyze_body6.py)で実測した座標に更新
  // 解析手順: 各 y の非背景セグメントから 首/肩/腕/腰/脚 を領域分離→ピクセル特定
  positions: {
    standing: {
      // 乳様突起：耳の付け根（背面図で頭の側面下端）
      mastoid:         { left: { x: 51.8, y: 11.5 }, right: { x: 59.0, y: 11.5 }, label: '乳様突起' },
      // 肩甲下角：肩甲骨の下端・T7-T8レベル。胸郭の中ほどから下、脊柱から外側
      scapulaInferior: { left: { x: 45.0, y: 37.0 }, right: { x: 61.0, y: 37.0 }, label: '肩甲下角' },
      // 腸骨稜：骨盤上端、お尻側から少し外へ
      iliacCrest:      { left: { x: 41.0, y: 49.5 }, right: { x: 69.0, y: 49.5 }, label: '腸骨稜' }
    },
    upper: {
      // 肩峰：肩甲骨の上外側端＝肩線の少し外側
      acromion:      { left: { x: 40.5, y: 25.5 }, right: { x: 65.5, y: 25.5 }, label: '肩峰' },
      // 肘頭：腕が体側にある自然姿勢で、肘の位置はおおむね腰やや上
      mastoidDetail: { left: { x: 33.5, y: 41.0 }, right: { x: 67.5, y: 41.0 }, label: '肘頭' },
      // 橈骨茎状突起：手首、大転子よりさらに下のレベルで手首側
      radialStyloid: { left: { x: 34.0, y: 60.5 }, right: { x: 66.5, y: 60.5 }, label: '茎状突起' }
    },
    lower: {
      // 大転子：骨盤外側、腸骨稜から少し下＋わずか外側
      greaterTrochanter: { left: { x: 40.5, y: 55.5 }, right: { x: 69.5, y: 55.5 }, label: '大転子' },
      // 膝蓋骨上端：脚の中央
      patellaUpper:      { left: { x: 46.6, y: 75.3 }, right: { x: 63.3, y: 75.3 }, label: '膝蓋骨上端' },
      // 外果：足首の外側、足の最下端付近
      lateralMalleolus:  { left: { x: 44.9, y: 93.0 }, right: { x: 64.6, y: 93.0 }, label: '外果' }
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

    // SVG（ゾーン用、画像の上・マーカーの下に配置）
    const zoneSvg = document.createElementNS(NS, 'svg');
    zoneSvg.setAttribute('class', 'rbd-zone-svg');
    zoneSvg.setAttribute('viewBox', '0 0 100 100');
    zoneSvg.setAttribute('preserveAspectRatio', 'none');
    stage.appendChild(zoneSvg);

    // ===== 衝突回避用：配置済みアイテムのbboxを保持 =====
    // bbox = { x, y, w, h }  (画像サイズに対する%基準・中心点x,yに対する幅高)
    const placed = { left: [], right: [], center: [] };
    // 既配置のラベル(stageWrap側) のY範囲も別途記録（左/右）
    const labelGuard = { left: [], right: [] };

    // 中央線（左右の分離境界）：解剖学的に体の中心 ≒ 55.5%
    const CENTER_LINE = 55.5;

    // bbox重なり判定
    const overlaps = (a, b) => {
      return Math.abs(a.x - b.x) * 2 < (a.w + b.w) &&
             Math.abs(a.y - b.y) * 2 < (a.h + b.h);
    };

    // side: 'left'|'right'|'center' に対し、初期(x,y,w,h)から衝突を避けて
    // 縦方向±に最大4回（5%ずつ）、ダメなら横方向±に最大2回（5%ずつ）逃がす
    // side='left' は左側方向（xを減らす）、'right' は右側方向（xを増やす）に逃がす
    const placeNoOverlap = (side, x, y, w, h, opts) => {
      opts = opts || {};
      const minX = opts.minX != null ? opts.minX : 1.5;
      const maxX = opts.maxX != null ? opts.maxX : 98.5;
      const list = placed[side] || placed.center;
      const candidates = [];
      // 縦オフセット候補（中心優先、上下交互）
      const yOffsets = [0, 5, -5, 10, -10, 15, -15, 20];
      // 横オフセット候補（外側方向への逃がし）
      const xDir = side === 'left' ? -1 : (side === 'right' ? 1 : 0);
      const xOffsets = [0, 5 * xDir, 10 * xDir];
      for (const xo of xOffsets) {
        for (const yo of yOffsets) {
          const cx = Math.max(minX, Math.min(maxX, x + xo));
          const cy = y + yo;
          candidates.push({ x: cx, y: cy, w, h });
        }
      }
      // 中央分離も尊重：side==='left' は CENTER_LINE 以下、'right' は CENTER_LINE 以上に
      for (const c of candidates) {
        if (side === 'left' && c.x + c.w / 2 > CENTER_LINE - 1) continue;
        if (side === 'right' && c.x - c.w / 2 < CENTER_LINE + 1) continue;
        let collide = false;
        // 全sideのbboxとチェック（バッジ同士が左右で被ることはほぼ無いが念のため全件）
        const all = [...placed.left, ...placed.right, ...placed.center];
        for (const b of all) {
          if (overlaps(c, b)) { collide = true; break; }
        }
        if (!collide) {
          list.push(c);
          return c;
        }
      }
      // どこも空かなければ最後の候補（最大ずれ位置）を採用
      const fallback = candidates[candidates.length - 1];
      list.push(fallback);
      return fallback;
    };

    // 解剖ラベルY重複回避（左外/右外、stageWrap基準）
    const reserveLabelY = (side, y) => {
      const list = labelGuard[side];
      const minGap = 5.0; // %（3.2 → 5.0 に強化）
      let yy = y;
      let safety = 60;
      while (safety-- > 0 && list.some(v => Math.abs(v - yy) < minGap)) {
        yy += minGap;
      }
      list.push(yy);
      return yy;
    };

    // バッジの想定サイズ（%基準・概算）
    // 1文字「縮」のみ表示。ただし衝突回避を強くするため見かけより大きめの判定領域を取る
    const BADGE_W = 5.5;
    const BADGE_H = 5.5;
    // ドット/矢印のサイズ
    const DOT_W = 2.0, DOT_H = 2.0;
    const ARROW_W = 2.5, ARROW_H = 3.0;

    // ===== 隣接ランドマーク間のゾーン描画（短縮=赤・伸長=青）=====
    // グループごとにゾーンの内側端を切り替えて、体幹と腕が被らないように分離する。
    // 体幹(standing) : 中心線 ←→ 体側
    // 上肢(upper)    : 体側ライン ←→ 腕（細い帯）
    // 下肢(lower)    : 中心線 ←→ 脚
    const zonePairs = [
      { group: 'standing', a: 'mastoid',         b: 'scapulaInferior' },
      { group: 'standing', a: 'scapulaInferior', b: 'iliacCrest' },
      { group: 'upper',    a: 'acromion',        b: 'mastoidDetail' },
      { group: 'upper',    a: 'mastoidDetail',   b: 'radialStyloid' },
      { group: 'lower',    a: 'greaterTrochanter', b: 'patellaUpper' },
      { group: 'lower',    a: 'patellaUpper',     b: 'lateralMalleolus' }
    ];
    const groupData = { standing, upper, lower };
    // 体側ライン（肩甲下角・腸骨稜のx座標を区間ごとに線形補間する用）
    const trunkLeftAtY = (yPct) => {
      const s = this.positions.standing.scapulaInferior;
      const i = this.positions.standing.iliacCrest;
      const t = Math.max(0, Math.min(1, (yPct - s.left.y) / (i.left.y - s.left.y)));
      return s.left.x + (i.left.x - s.left.x) * t;
    };
    const trunkRightAtY = (yPct) => {
      const s = this.positions.standing.scapulaInferior;
      const i = this.positions.standing.iliacCrest;
      const t = Math.max(0, Math.min(1, (yPct - s.right.y) / (i.right.y - s.right.y)));
      return s.right.x + (i.right.x - s.right.x) * t;
    };
    for (const { group, a, b } of zonePairs) {
      const data = groupData[group];
      if (!data) continue;
      const valA = data[a];
      const valB = data[b];
      const safeA = valA || 0;
      const safeB = valB || 0;
      if (safeA === 0 && safeB === 0) continue;
      const posA = this.positions[group][a];
      const posB = this.positions[group][b];
      if (!posA || !posB) continue;
      const aLY = posA.left.y  + this._leftYShift(safeA);
      const bLY = posB.left.y  + this._leftYShift(safeB);
      const aRY = posA.right.y + this._rightYShift(safeA);
      const bRY = posB.right.y + this._rightYShift(safeB);
      // 短縮側判定（左ゾーン）
      const leftSum  = (safeA === -1 ? 1 : safeA === 1 ? -1 : 0) + (safeB === -1 ? 1 : safeB === 1 ? -1 : 0);
      const rightSum = -leftSum;

      // グループごとに内側端を決定
      let innerLeftA, innerLeftB, innerRightA, innerRightB;
      if (group === 'upper') {
        // 腕ゾーンは「体側ライン」と「腕」の間の細い帯
        innerLeftA  = trunkLeftAtY(posA.left.y) - 0.3;
        innerLeftB  = trunkLeftAtY(posB.left.y) - 0.3;
        innerRightA = trunkRightAtY(posA.right.y) + 0.3;
        innerRightB = trunkRightAtY(posB.right.y) + 0.3;
      } else {
        innerLeftA  = CENTER_LINE;
        innerLeftB  = CENTER_LINE;
        innerRightA = CENTER_LINE;
        innerRightB = CENTER_LINE;
      }

      const drawZone = (sideX1, y1, sideX2, y2, innerX1, innerX2, isShort) => {
        const fill   = isShort ? 'rgba(239,68,68,0.34)' : 'rgba(14,165,233,0.42)';
        const stroke = isShort ? 'rgba(239,68,68,0.65)' : 'rgba(14,165,233,0.78)';
        const poly = document.createElementNS(NS, 'polygon');
        poly.setAttribute('points', `${sideX1},${y1} ${innerX1},${y1} ${innerX2},${y2} ${sideX2},${y2}`);
        poly.setAttribute('fill', fill);
        poly.setAttribute('stroke', stroke);
        poly.setAttribute('stroke-width', '0.3');
        poly.setAttribute('stroke-dasharray', '1.2,0.8');
        zoneSvg.appendChild(poly);
      };
      if (leftSum !== 0)  drawZone(posA.left.x,  aLY, posB.left.x,  bLY, innerLeftA,  innerLeftB,  leftSum  > 0);
      if (rightSum !== 0) drawZone(posA.right.x, aRY, posB.right.x, bRY, innerRightA, innerRightB, rightSum > 0);
    }

    // 各ランドマークを描画
    for (const { map, data } of allMaps) {
      for (const [key, pos] of Object.entries(map)) {
        const val = data ? data[key] : null;
        if (val === null || val === undefined) continue;

        const lY = pos.left.y  + this._leftYShift(val);
        const rY = pos.right.y + this._rightYShift(val);

        // 短縮側=低い側 = 「下」になっている方
        let shortSide = null; // 'left'|'right'|null
        if (val === -1) shortSide = 'right';
        else if (val === 1) shortSide = 'left';

        // 荷重側決定（重心結果優先、なければ短縮側＝荷重側仮説）
        const loadSide = gravitySide && gravitySide !== 'even' ? gravitySide : shortSide;

        // ===== 左右ドット（衝突管理に登録） =====
        placed.left.push({ x: pos.left.x, y: lY, w: DOT_W, h: DOT_H });
        placed.right.push({ x: pos.right.x, y: rY, w: DOT_W, h: DOT_H });

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

        // ===== 短縮側に赤いオーラを追加（イラスト版のゾーンに相当） =====
        if (val !== 0) {
          const auraSide = shortSide; // 'left' or 'right'
          const auraX = auraSide === 'left' ? pos.left.x : pos.right.x;
          const auraY = auraSide === 'left' ? lY : rY;
          const aura = document.createElement('div');
          aura.className = 'rbd-aura';
          aura.style.left = auraX + '%';
          aura.style.top  = auraY + '%';
          stage.appendChild(aura);
        }

        // ===== 矢印（短縮=下向き赤、伸長=上向き青） =====
        if (val !== 0) {
          placed.left.push({ x: pos.left.x, y: lY - 2.4, w: ARROW_W, h: ARROW_H });
          placed.right.push({ x: pos.right.x, y: rY - 2.4, w: ARROW_W, h: ARROW_H });

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

        // ===== 状態バッジは廃止（左右ラベルに状態を併記する方式に変更） =====
        // 体図上は色付きドット＋矢印のみ。状態（縮/伸）はサイド外側のラベルで読み取る。

        // ===== 解剖ラベル（状態を併記） =====
        const lLabelY = reserveLabelY('left',  lY);
        const rLabelY = reserveLabelY('right', rY);

        // 状態テキスト: val=-1→左が高い=右が短縮 / val=1→右が高い=左が短縮 / val=0→均等
        const leftStatusText  = val === 0 ? '均等' : (shortSide === 'left'  ? '縮' : '伸');
        const rightStatusText = val === 0 ? '均等' : (shortSide === 'right' ? '縮' : '伸');
        const leftStatusCls   = val === 0 ? 'even' : (shortSide === 'left'  ? 'short' : 'long');
        const rightStatusCls  = val === 0 ? 'even' : (shortSide === 'right' ? 'short' : 'long');

        const lLabel = document.createElement('div');
        lLabel.className = 'rbd-label rbd-label-left rbd-label-with-status';
        lLabel.style.top = lLabelY + '%';
        lLabel.innerHTML = `<span class="rbd-label-name">${pos.label}</span><span class="rbd-label-status ${leftStatusCls}">${leftStatusText}</span>`;
        stageWrap.appendChild(lLabel);

        const rLabel = document.createElement('div');
        rLabel.className = 'rbd-label rbd-label-right rbd-label-with-status';
        rLabel.style.top = rLabelY + '%';
        rLabel.innerHTML = `<span class="rbd-label-status ${rightStatusCls}">${rightStatusText}</span><span class="rbd-label-name">${pos.label}</span>`;
        stageWrap.appendChild(rLabel);

        // ===== リーダー線（点線・SVG） =====
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
