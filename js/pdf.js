// ===== PDF出力（段階的検査対応版） =====

const PdfExport = {
  async exportDiagnosis(patientName, inspectionDate, result) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const causeInfo = InspectionLogic.causeLabels[result.primaryCause];

      // ヘッダー
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('Inspection Report', 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.text('Step-by-Step Diagnosis', 105, 19, { align: 'center' });

      // 患者情報
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      let y = 35;
      doc.text(`Name: ${patientName || '-'}`, 15, y);
      doc.text(`Date: ${inspectionDate || new Date().toLocaleDateString('ja-JP')}`, 120, y);
      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, 195, y);
      y += 10;

      // 診断結果のキャプチャ
      const diagnosisEl = document.getElementById('diagnosisContent');
      if (diagnosisEl) {
        try {
          const canvas = await html2canvas(diagnosisEl, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true
          });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 180;
          const imgHeight = (canvas.height / canvas.width) * imgWidth;

          // 複数ページに分割
          const maxHeight = 240;
          if (imgHeight <= maxHeight) {
            doc.addImage(imgData, 'PNG', 15, y, imgWidth, imgHeight);
            y += imgHeight + 10;
          } else {
            // 最初のページ
            doc.addImage(imgData, 'PNG', 15, y, imgWidth, imgHeight);
          }
        } catch (e) {
          console.warn('Diagnosis capture failed:', e);
          // フォールバック: テキストベースの出力
          doc.setFontSize(12);
          doc.text(`Diagnosis: ${causeInfo.label}`, 15, y);
          y += 8;
          doc.setFontSize(9);

          const summaryLines = doc.splitTextToSize(result.summary, 170);
          doc.text(summaryLines, 15, y);
          y += summaryLines.length * 5 + 5;

          if (result.treatmentArea !== 'none') {
            doc.text(`Treatment Area: ${result.treatmentArea}`, 15, y);
            y += 10;
          }

          // 検査データテーブル
          doc.setFontSize(10);
          doc.text('Examination Data', 15, y);
          y += 7;

          const headers = ['Landmark'];
          const positions = [];
          for (const step of result.steps) {
            headers.push(step.name);
            positions.push(step.data);
          }

          doc.setFontSize(8);
          let x = 15;
          for (const header of headers) {
            doc.text(header, x, y);
            x += 45;
          }
          y += 5;

          for (const [landmark, config] of Object.entries(InspectionLogic.landmarks)) {
            x = 15;
            doc.text(config.name, x, y);
            x += 45;
            for (const posData of positions) {
              const val = posData[landmark] || 0;
              doc.text(InspectionLogic.valueLabels[val.toString()], x, y);
              x += 45;
            }
            y += 5;
          }
        }
      }

      // フッター
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Inspection Report - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
      }

      // ファイル名
      const dateStr = (inspectionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      doc.save(`Inspection_${dateStr}${nameStr}.pdf`);

      return true;
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF出力に失敗しました。もう一度お試しください。');
      return false;
    }
  }
};
