// ===== PDF出力（患者用 + 施術者用） =====

const PdfExport = {
  _fontLoaded: false,
  _fontBase64: null,

  async _loadJapaneseFont(doc) {
    if (this._fontLoaded && this._fontBase64) {
      doc.addFileToVFS('NotoSansJP-Regular.ttf', this._fontBase64);
      doc.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
      doc.setFont('NotoSansJP');
      return;
    }
    try {
      const res = await fetch('fonts/NotoSansJP-Regular.ttf');
      if (!res.ok) throw new Error('Font fetch failed');
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      this._fontBase64 = btoa(binary);
      doc.addFileToVFS('NotoSansJP-Regular.ttf', this._fontBase64);
      doc.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
      doc.setFont('NotoSansJP');
      this._fontLoaded = true;
    } catch (e) {
      console.warn('Japanese font load failed, using default:', e);
    }
  },

  // PDF生成中のローディングオーバーレイ
  _showLoadingOverlay(message) {
    const existing = document.getElementById('pdfLoadingOverlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'pdfLoadingOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(15,23,42,0.7);display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:white;border-radius:16px;padding:28px 32px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
        <div class="pdf-spinner" style="width:40px;height:40px;border:4px solid #e2e8f0;border-top-color:#3b82f6;border-radius:50%;animation:pdfSpin 0.8s linear infinite;margin:0 auto 16px;"></div>
        <div style="font-size:15px;color:#1e293b;font-weight:600;">${message || 'PDF生成中...'}</div>
        <div style="font-size:11px;color:#94a3b8;margin-top:4px;">少々お待ちください</div>
      </div>
      <style>@keyframes pdfSpin{to{transform:rotate(360deg)}}</style>
    `;
    document.body.appendChild(overlay);
    return overlay;
  },

  _hideLoadingOverlay() {
    const overlay = document.getElementById('pdfLoadingOverlay');
    if (overlay) overlay.remove();
  },

  // html2canvas 読み込み待ち（defer属性対応）
  async _waitForHtml2Canvas(maxWaitMs) {
    const limit = maxWaitMs || 5000;
    const start = Date.now();
    while (typeof html2canvas === 'undefined') {
      if (Date.now() - start > limit) return false;
      await new Promise(r => setTimeout(r, 100));
    }
    return true;
  },

  // 印刷HTMLをhtml2canvasでPDFに変換する共通ロジック
  async _captureHtmlToPdf(filename) {
    const loadingOverlay = this._showLoadingOverlay('PDF生成中...');

    try {
      // html2canvasがロードされるまで待機
      const h2cReady = await this._waitForHtml2Canvas(8000);
      if (!h2cReady) {
        alert('PDF生成ライブラリの読み込みに失敗しました。通信環境を確認して再読み込みしてください。');
        return false;
      }

      if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        alert('PDF生成ライブラリ(jsPDF)が読み込まれていません。ページを再読み込みしてください。');
        return false;
      }

      const container = document.getElementById('printContainer');
      if (!container) {
        alert('印刷用コンテナが見つかりません。');
        return false;
      }

      // 一時的にオフスクリーンで可視化（画像撮影のため）
      const origStyle = container.getAttribute('style') || '';
      container.setAttribute('style',
        'display:block !important;position:fixed;top:0;left:-10000px;width:210mm;background:white;z-index:-1;');

      // 各 .print-page に「必ずA4に収める」ためのフィット処理を適用
      const pages = Array.from(container.querySelectorAll('.print-page'));
      const savedPageStyles = pages.map(p => p.getAttribute('style') || '');
      const savedInnerStyles = [];
      // 210mm × 297mm を 96dpi 基準で px に換算
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;

      // 内部コンテンツを scale で縮小するためのラッパーを挿入
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        // いったん A4 幅に固定して自然高さを計測
        page.setAttribute('style',
          'width:' + A4_WIDTH_PX + 'px !important;' +
          'min-height:' + A4_HEIGHT_PX + 'px !important;' +
          'max-height:' + A4_HEIGHT_PX + 'px !important;' +
          'height:' + A4_HEIGHT_PX + 'px !important;' +
          'box-sizing:border-box;overflow:hidden;' +
          'display:block;background:white;'
        );
        // 既存の子要素を1つのラッパーで包んで transform: scale を適用
        const inner = document.createElement('div');
        inner.className = 'pdf-fit-inner';
        inner.style.cssText = 'transform-origin:top left;width:' + A4_WIDTH_PX + 'px;';
        while (page.firstChild) inner.appendChild(page.firstChild);
        page.appendChild(inner);
        // 自然高さ計測
        const naturalH = inner.scrollHeight;
        savedInnerStyles.push({ page, inner, naturalH });
        // A4 高さを超える場合は scale で縮小
        if (naturalH > A4_HEIGHT_PX) {
          const factor = A4_HEIGHT_PX / naturalH;
          inner.style.transform = 'scale(' + factor + ')';
          // transformの分、ラッパー幅を逆スケールして中身がA4幅を使えるようにする
          inner.style.width = (A4_WIDTH_PX / factor) + 'px';
        }
      }

      try {
        if (pages.length === 0) {
          alert('印刷データが生成されていません。');
          return false;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidthMm = 210;
        const pageHeightMm = 297;

        // iPadのメモリ制限を考慮してスケールを調整
        const isIOS = this._isIOS();
        const primaryScale = isIOS ? 1.5 : 2;

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          let canvas;
          // 1回目: 通常スケール、失敗したら低スケールで再試行
          try {
            canvas = await html2canvas(page, {
              scale: primaryScale,
              useCORS: true,
              allowTaint: false,
              backgroundColor: '#ffffff',
              logging: false,
              imageTimeout: 8000,
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
              windowWidth: A4_WIDTH_PX,
              windowHeight: A4_HEIGHT_PX
            });
          } catch (h2cErr) {
            console.warn('html2canvas 1回目失敗、低解像度で再試行:', h2cErr);
            try {
              canvas = await html2canvas(page, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 8000,
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
                windowWidth: A4_WIDTH_PX,
                windowHeight: A4_HEIGHT_PX
              });
            } catch (retryErr) {
              console.error('html2canvas 再試行も失敗:', retryErr);
              alert('PDF画像化に失敗しました: ' + (retryErr.message || retryErr));
              return false;
            }
          }

          let imgData;
          try {
            imgData = canvas.toDataURL('image/jpeg', 0.92);
          } catch (dataErr) {
            console.error('canvas.toDataURL失敗:', dataErr);
            alert('PDF画像変換に失敗しました。画像がCORS制限に該当する可能性があります。');
            return false;
          }

          if (i > 0) doc.addPage();
          // 固定A4サイズで画像を貼り付け（縦横比は確実にA4）
          doc.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
        }

        this._hideLoadingOverlay();
        this._savePdf(doc, filename);
        return true;
      } finally {
        // ラッパーを解除し、元のスタイルに戻す
        for (let i = 0; i < savedInnerStyles.length; i++) {
          const { page, inner } = savedInnerStyles[i];
          while (inner.firstChild) page.appendChild(inner.firstChild);
          if (inner.parentNode === page) page.removeChild(inner);
          page.setAttribute('style', savedPageStyles[i]);
        }
        container.setAttribute('style', origStyle);
      }
    } catch (e) {
      console.error('PDF生成エラー:', e);
      alert('PDFの出力に失敗しました: ' + (e.message || e));
      return false;
    } finally {
      this._hideLoadingOverlay();
    }
  },

  // ===== 患者説明用PDF（印刷画面をそのままPDF化） =====
  async exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareData, opts) {
    try {
      // 印刷用HTMLをコンテナにレンダリング
      if (typeof window.renderPrintContainer !== 'function') {
        alert('印刷データの生成に失敗しました。ページを再読み込みしてください。');
        return false;
      }
      const date = inspectionDate || new Date().toISOString().split('T')[0];
      await window.renderPrintContainer(patientName || '患者名未入力', date);

      const dateStr = date.replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      return await this._captureHtmlToPdf(`検査レポート_${dateStr}${nameStr}.pdf`);
    } catch (e) {
      console.error('患者用PDF出力エラー:', e);
      alert('PDFの出力に失敗しました: ' + e.message);
      return false;
    }
  },

  // ===== 施術者用PDF（印刷画面をそのままPDF化 + 施術者ラベル） =====
  async exportClinicalPdf(patientName, inspectionDate, diagnosisResult, contractionResult, detailData, weightBalance) {
    try {
      if (typeof window.renderPrintContainer !== 'function') {
        alert('印刷データの生成に失敗しました。ページを再読み込みしてください。');
        return false;
      }
      const date = inspectionDate || new Date().toISOString().split('T')[0];
      await window.renderPrintContainer(patientName || '患者名未入力', date);

      const dateStr = String(date).replace(/[-\/]/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      return await this._captureHtmlToPdf(`検査レポート_施術者用_${dateStr}${nameStr}.pdf`);
    } catch (e) {
      console.error('施術者用PDF出力エラー:', e);
      alert('PDFの出力に失敗しました: ' + (e.message || e));
      return false;
    }
  },


  // Legacy method for backward compatibility
  async exportDiagnosis(patientName, inspectionDate, result) {
    return this.exportClinicalPdf(patientName, inspectionDate, result, null, null, null);
  },

  // --- Helper methods ---

  // SVG要素を画像(data URL)に変換
  async _svgToImage(svgElement, width, height) {
    return new Promise((resolve) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width * 2;  // 高解像度
          canvas.height = height * 2;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      } catch (e) {
        console.warn('SVG to image conversion failed:', e);
        resolve(null);
      }
    });
  },

  // 人体図をPDFに追加（DOM上 or オフスクリーン生成）
  async _addBodyDiagramToPdf(doc, y, containerId, examDataOverride, detailDataOverride) {
    let svg = null;
    let tempContainer = null;

    // まずDOM上のSVGを探す
    const container = document.getElementById(containerId);
    if (container) {
      svg = container.querySelector('svg');
    }

    // DOM上にない場合、オフスクリーンで生成
    if (!svg && typeof BodyDiagram !== 'undefined') {
      tempContainer = document.createElement('div');
      tempContainer.id = '_pdfTempDiagram';
      tempContainer.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:300px;height:580px;';
      document.body.appendChild(tempContainer);

      BodyDiagram.init('_pdfTempDiagram');

      const eData = examDataOverride || (typeof examData !== 'undefined' ? examData : null);
      const dData = detailDataOverride || (typeof detailData !== 'undefined' ? detailData : null);

      if (dData && dData.upperDetail && dData.upperDetail.acromion !== null && dData.upperDetail.acromion !== undefined) {
        BodyDiagram.updateUnified('_pdfTempDiagram', dData.upperDetail, dData.lowerDetail, eData?.standing);
      } else if (eData && eData.standing) {
        BodyDiagram.update('_pdfTempDiagram', 'firstStage', eData.standing);
      }

      svg = tempContainer.querySelector('svg');
    }

    if (!svg) return y;

    const imgData = await this._svgToImage(svg, 300, 580);

    // クリーンアップ
    if (tempContainer) tempContainer.remove();

    if (!imgData) return y;

    const imgW = 55;
    const imgH = imgW * (580 / 300);
    const imgX = (210 - imgW) / 2;

    if (y + imgH > 270) {
      doc.addPage();
      y = 20;
    }
    doc.addImage(imgData, 'PNG', imgX, y, imgW, imgH);
    return y + imgH + 5;
  },

  // iOS/iPadOS判定（iPadOS 13+のデスクトップモード含む）
  _isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  },

  // スマホ・タブレット判定（iPadOSデスクトップモード含む）
  _isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || this._isIOS();
  },

  // スマホ対応PDF保存（共有/印刷/保存対応）
  // 動作方針:
  //   PC         → doc.save() で即ダウンロード
  //   モバイル   → 完成通知オーバーレイを表示し、ユーザークリックで window.open / navigator.share を実行
  //                （iOS Safari のポップアップブロック・非同期コンテキスト問題を回避するため）
  _savePdf(doc, filename) {
    const isMobile = this._isMobile();

    if (!isMobile) {
      try {
        doc.save(filename);
      } catch (e) {
        console.error('PC PDF save error:', e);
        alert('PDF保存に失敗しました: ' + e.message);
      }
      return;
    }

    // モバイル: Blob 生成
    let blob, url;
    try {
      blob = doc.output('blob');
      url = URL.createObjectURL(blob);
    } catch (e) {
      console.error('PDF blob生成エラー:', e);
      alert('PDF生成に失敗しました: ' + e.message);
      return;
    }

    // 既存オーバーレイがあれば削除
    const existing = document.getElementById('pdfResultOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'pdfResultOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.88);display:flex;align-items:center;justify-content:center;padding:20px;-webkit-tap-highlight-color:transparent;';
    overlay.innerHTML = `
      <div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:100%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-height:90vh;overflow-y:auto;">
        <div style="font-size:56px;margin-bottom:12px;line-height:1;">📄</div>
        <h3 style="margin:0 0 8px;font-size:18px;color:#1e293b;font-weight:700;">PDFが完成しました</h3>
        <p style="margin:0 0 18px;font-size:12px;color:#64748b;word-break:break-all;line-height:1.4;">${filename}</p>
        <button id="pdfOpenBtn" type="button" style="display:block;width:100%;padding:14px;background:#3b82f6;color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;margin-bottom:10px;cursor:pointer;-webkit-appearance:none;">PDFを開く</button>
        <button id="pdfShareBtn" type="button" style="display:block;width:100%;padding:14px;background:#22c55e;color:white;border:none;border-radius:10px;font-size:16px;font-weight:600;margin-bottom:10px;cursor:pointer;-webkit-appearance:none;">共有 / 保存 / 印刷</button>
        <button id="pdfCloseBtn" type="button" style="display:block;width:100%;padding:12px;background:#f1f5f9;color:#64748b;border:none;border-radius:10px;font-size:14px;cursor:pointer;-webkit-appearance:none;">閉じる</button>
        <p style="margin:14px 0 0;font-size:11px;color:#94a3b8;line-height:1.6;text-align:left;">
          <strong>iPad/iPhone の場合</strong><br>
          「PDFを開く」で表示される画面の<br>
          共有ボタン（□↑）から<br>
          ・「ファイルに保存」で保存<br>
          ・「プリント」で印刷できます
        </p>
      </div>
    `;
    document.body.appendChild(overlay);

    const openBtn = overlay.querySelector('#pdfOpenBtn');
    const shareBtn = overlay.querySelector('#pdfShareBtn');
    const closeBtn = overlay.querySelector('#pdfCloseBtn');

    const cleanup = () => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      // URLは少し遅延させて解放（新規タブ読込後に失効しないよう）
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    };

    openBtn.addEventListener('click', () => {
      // ユーザークリックから直接呼ぶ → iOSのポップアップブロックを回避
      const win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        // ポップアップブロックされた場合は同タブで開く
        window.location.href = url;
      }
    });

    shareBtn.addEventListener('click', async () => {
      const file = new File([blob], filename, { type: 'application/pdf' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: filename });
          return;
        }
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.warn('navigator.share failed:', e);
      }
      // フォールバック: downloadリンクを試す
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        // 最終フォールバック: 新規タブで開く
        window.open(url, '_blank');
      }
    });

    closeBtn.addEventListener('click', cleanup);
  },

  _addFooter(doc, reportType) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`カラダマップ - ${reportType} - ${i}/${pageCount}ページ`, 105, 290, { align: 'center' });
    }
  },

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 37, g: 99, b: 235 };
  },

  _getPatientLabel(cause) {
    const labels = {
      foot: '足元のバランスの問題',
      upperBody: '上半身のバランスの問題',
      cranialPelvic: '全身のバランスの乱れ',
      spine: '背骨まわりのバランスの乱れ',
      none: '良好な状態'
    };
    return labels[cause] || cause;
  },

  _getPatientSummary(result) {
    const summaries = {
      foot: '足の接地の仕方が体全体のバランスに影響しています。足元から整えることで改善が期待できます。',
      upperBody: '肩や腕の位置が体のバランスに影響しています。上半身の調整で改善が期待できます。',
      cranialPelvic: '体が全体的に片側に傾く傾向があります。頭蓋骨と骨盤の調整をおすすめします。',
      spine: '体に互い違いのズレが見られます。背骨の調整でバランスの回復が期待できます。',
      none: '大きなズレは見られません。良い状態を維持していきましょう。'
    };
    return summaries[result.primaryCause] || result.summary;
  }
};
