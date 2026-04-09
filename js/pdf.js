// ===== PDF出力（患者用 + 施術者用） =====

const PdfExport = {
  // ===== 患者説明用PDF =====
  async exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareData) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause] || { icon: '?', label: '未判定', color: '#94a3b8' };
      let y = 0;

      // --- Header ---
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('検査レポート', 105, 14, { align: 'center' });
      doc.setFontSize(10);
      doc.text('- 患者様用 -', 105, 22, { align: 'center' });

      // --- Patient Info ---
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      y = 40;
      doc.text(`お名前: ${patientName || '-'}`, 15, y);
      doc.text(`検査日: ${inspectionDate || new Date().toLocaleDateString('ja-JP')}`, 130, y);
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, 195, y);
      y += 12;

      // --- Main Diagnosis ---
      doc.setFillColor(this._hexToRgb(causeInfo.color).r, this._hexToRgb(causeInfo.color).g, this._hexToRgb(causeInfo.color).b);
      doc.roundedRect(15, y, 180, 30, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(`${causeInfo.icon} ${this._getPatientLabel(diagnosisResult.primaryCause)}`, 105, y + 12, { align: 'center' });
      doc.setFontSize(9);
      const summaryLines = doc.splitTextToSize(this._getPatientSummary(diagnosisResult), 160);
      doc.text(summaryLines, 105, y + 20, { align: 'center' });
      y += 38;

      // --- Body Status Summary ---
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);
      doc.text('体の状態', 15, y);
      y += 3;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 80, y);
      doc.setLineWidth(0.2);
      y += 8;

      doc.setFontSize(10);
      if (diagnosisResult.treatmentArea && diagnosisResult.treatmentArea !== 'none') {
        doc.text(`施術の重点: ${diagnosisResult.treatmentArea}`, 20, y);
        y += 7;
      }

      // Body map text summary
      if (diagnosisResult.pattern) {
        const patternDesc = diagnosisResult.pattern.description || '';
        if (patternDesc) {
          doc.text(`パターン: ${patternDesc}`, 20, y);
          y += 7;
        }
      }

      // --- Gravity analysis ---
      if (diagnosisResult.gravityResult) {
        const gr = diagnosisResult.gravityResult;
        const gLabel = gr.side === 'left' ? '左重心' : gr.side === 'right' ? '右重心' : '均等';
        y += 4;
        doc.setFontSize(13);
        doc.text('重心バランス', 15, y);
        y += 3;
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.8);
        doc.line(15, y, 80, y);
        doc.setLineWidth(0.2);
        y += 8;
        doc.setFontSize(11);
        doc.text(`判定: ${gLabel}`, 20, y);
        y += 8;
      }

      // --- Contraction summary for patient ---
      if (contractionResult) {
        const allIssues = [];
        if (contractionResult.upper) {
          if (Array.isArray(contractionResult.upper.contractions)) allIssues.push(...contractionResult.upper.contractions.map(c => ({ ...c, part: '上半身' })));
          if (Array.isArray(contractionResult.upper.tensions)) allIssues.push(...contractionResult.upper.tensions.map(t => ({ ...t, part: '上半身' })));
        }
        if (contractionResult.lower) {
          if (Array.isArray(contractionResult.lower.contractions)) allIssues.push(...contractionResult.lower.contractions.map(c => ({ ...c, part: '下半身' })));
          if (Array.isArray(contractionResult.lower.tensions)) allIssues.push(...contractionResult.lower.tensions.map(t => ({ ...t, part: '下半身' })));
        }

        if (allIssues.length > 0) {
          y += 4;
          doc.setFontSize(13);
          doc.text('気になる箇所', 15, y);
          y += 3;
          doc.setDrawColor(239, 68, 68);
          doc.setLineWidth(0.8);
          doc.line(15, y, 80, y);
          doc.setLineWidth(0.2);
          y += 8;

          doc.setFontSize(10);
          for (const issue of allIssues) {
            if (y > 260) {
              doc.addPage();
              y = 20;
            }
            const typeLabel = issue.type === 'contraction' ? '収縮（硬くなっている）' : '伸長（引っ張られている）';
            const sideLabel = issue.side === 'both' ? '両側' : issue.side === 'right' ? '右側' : '左側';
            doc.setFillColor(254, 242, 242);
            doc.roundedRect(15, y - 4, 180, 10, 2, 2, 'F');
            doc.setTextColor(220, 38, 38);
            doc.text(`${issue.area}（${sideLabel}）- ${typeLabel}`, 20, y + 2);
            doc.setTextColor(30, 41, 59);
            y += 14;
          }
        }
      }

      // --- Selfcare section ---
      if (selfcareData && selfcareData.length > 0) {
        if (y > 230) {
          doc.addPage();
          y = 20;
        }
        y += 5;
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text('セルフケア', 15, y);
        y += 3;
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(0.8);
        doc.line(15, y, 90, y);
        doc.setLineWidth(0.2);
        y += 8;

        doc.setFontSize(10);
        for (const exercise of selfcareData) {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFillColor(240, 253, 244);
          doc.roundedRect(15, y - 4, 180, 24, 2, 2, 'F');
          doc.setTextColor(21, 128, 61);
          doc.setFontSize(11);
          doc.text(exercise.name || '', 20, y + 2);
          doc.setTextColor(30, 41, 59);
          doc.setFontSize(9);
          if (exercise.description) {
            const descLines = doc.splitTextToSize(exercise.description, 160);
            doc.text(descLines, 20, y + 9);
          }
          const setsInfo = [];
          if (exercise.sets) setsInfo.push(exercise.sets);
          if (exercise.duration) setsInfo.push(exercise.duration);
          if (setsInfo.length > 0) {
            doc.text(setsInfo.join(' / '), 20, y + 16);
          }
          y += 28;
        }
      }

      // --- Footer ---
      this._addFooter(doc, '患者様用レポート');

      // Save
      const dateStr = (inspectionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      doc.save(`検査レポート_${dateStr}${nameStr}.pdf`);
      return true;
    } catch (e) {
      console.error('患者用PDF出力エラー:', e);
      alert('PDFの出力に失敗しました。もう一度お試しください。');
      return false;
    }
  },

  // ===== 施術者用PDF（Clinical） =====
  async exportClinicalPdf(patientName, inspectionDate, diagnosisResult, contractionResult, detailData, weightBalance) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause] || { icon: '?', label: '未判定', color: '#94a3b8' };
      let y = 0;

      // --- Header ---
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('検査レポート（施術者用）', 105, 10, { align: 'center' });
      doc.setFontSize(8);
      doc.text('※ 施術者専用 - 患者様への配布不可', 105, 17, { align: 'center' });

      // --- Patient Info ---
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      y = 33;
      doc.text(`お名前: ${patientName || '-'}`, 15, y);
      doc.text(`検査日: ${inspectionDate || new Date().toLocaleDateString('ja-JP')}`, 130, y);
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, 195, y);
      y += 8;

      // --- Diagnosis Summary ---
      doc.setFontSize(12);
      doc.text('診断結果', 15, y);
      y += 2;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 60, y);
      doc.setLineWidth(0.2);
      y += 7;

      doc.setFontSize(11);
      doc.setTextColor(this._hexToRgb(causeInfo.color).r, this._hexToRgb(causeInfo.color).g, this._hexToRgb(causeInfo.color).b);
      doc.text(`${causeInfo.icon} ${causeInfo.label}`, 20, y);
      doc.setTextColor(30, 41, 59);
      y += 7;
      doc.setFontSize(9);
      const summaryLines = doc.splitTextToSize(diagnosisResult.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 5;

      if (diagnosisResult.treatmentArea && diagnosisResult.treatmentArea !== 'none') {
        doc.text(`施術の重点: ${diagnosisResult.treatmentArea}`, 20, y);
        y += 7;
      }

      // --- Examination Data Table ---
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('検査データ', 15, y);
      y += 2;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 80, y);
      doc.setLineWidth(0.2);
      y += 7;

      // Table header
      const steps = diagnosisResult.steps || [];
      if (steps.length > 0) {
        doc.setFontSize(8);
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y - 4, 180, 8, 'F');
        const headers = ['ランドマーク'];
        const colWidth = 40;
        for (const step of steps) {
          headers.push(step.name || '');
        }
        let x = 15;
        doc.setTextColor(100, 116, 139);
        for (const header of headers) {
          doc.text(header, x + 2, y);
          x += colWidth;
        }
        y += 6;

        // Table rows
        doc.setTextColor(30, 41, 59);
        for (const [landmark, config] of Object.entries(InspectionLogic.landmarks)) {
          x = 15;
          const lmLabel = config.simpleName ? `${config.name}（${config.simpleName}）` : config.name;
          doc.text(lmLabel, x + 2, y);
          x += colWidth;
          for (const step of steps) {
            const val = (step.data && step.data[landmark]) || 0;
            const label = InspectionLogic.valueLabels[val.toString()] || '-';
            if (val < 0) doc.setTextColor(59, 130, 246);
            else if (val > 0) doc.setTextColor(249, 115, 22);
            else doc.setTextColor(34, 197, 94);
            doc.text(label, x + 2, y);
            doc.setTextColor(30, 41, 59);
            x += colWidth;
          }
          y += 6;
        }
      }
      y += 5;

      // --- Step-by-Step Analysis ---
      doc.setFontSize(12);
      doc.text('段階別分析', 15, y);
      y += 2;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 70, y);
      doc.setLineWidth(0.2);
      y += 7;

      doc.setFontSize(9);
      if (steps.length >= 2 && steps[1].comparison) {
        const comp = steps[1].comparison;
        doc.text(`第1段階（立位→座位）: ${comp.hasFootInfluence ? '変化あり - 足部の影響' : '変化なし - 足部以外の要因'}`, 20, y);
        y += 6;
      }
      if (steps.length >= 3 && steps[2].comparison) {
        const comp = steps[2].comparison;
        doc.text(`第2段階（座位→上半身）: ${comp.hasUpperBodyInfluence ? '変化あり - 上半身の影響' : '変化なし - 上半身以外の要因'}`, 20, y);
        y += 6;
      }
      if (diagnosisResult.pattern && diagnosisResult.pattern.pattern !== 'normal') {
        doc.text(`パターン: ${diagnosisResult.pattern.description}`, 20, y);
        y += 6;
      }
      y += 5;

      // --- Gravity & Sagittal Analysis ---
      if (diagnosisResult.gravityResult) {
        if (y > 240) { doc.addPage(); y = 20; }
        const gr = diagnosisResult.gravityResult;
        const gLabel = gr.side === 'left' ? '左重心' : gr.side === 'right' ? '右重心' : '均等';
        y += 5;
        doc.setFontSize(12);
        doc.text('重心分析（構造医学的検査）', 15, y);
        y += 2;
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.8);
        doc.line(15, y, 120, y);
        doc.setLineWidth(0.2);
        y += 7;

        doc.setFontSize(11);
        const scoreLeft = (gr.score && gr.score.left) || 0;
        const scoreRight = (gr.score && gr.score.right) || 0;
        doc.text(`判定: ${gLabel}（左荷重: ${scoreLeft}項目 / 右荷重: ${scoreRight}項目）`, 20, y);
        y += 7;
        doc.setFontSize(9);
        for (const d of (gr.details || [])) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`  ${d.label}: ${d.desc}`, 20, y);
          y += 5;
        }
        y += 5;

        // Sagittal plane analysis
        if (typeof InspectionLogic !== 'undefined' && InspectionLogic.analyzeSagittal) {
          const sagittal = InspectionLogic.analyzeSagittal(gr, diagnosisResult.gravityData);
          if (sagittal) {
            if (y > 230) { doc.addPage(); y = 20; }
            doc.setFontSize(12);
            doc.text('矢状面分析（前後の状態）', 15, y);
            y += 2;
            doc.setDrawColor(139, 92, 246);
            doc.setLineWidth(0.8);
            doc.line(15, y, 120, y);
            doc.setLineWidth(0.2);
            y += 7;

            doc.setFontSize(9);
            const summaryLines = doc.splitTextToSize(sagittal.summary, 170);
            doc.text(summaryLines, 20, y);
            y += summaryLines.length * 5 + 3;

            doc.text(`骨盤: ${sagittal.pelvis.twist}`, 20, y); y += 5;
            doc.text(`背骨: ${sagittal.spine.rotation}`, 20, y); y += 5;
            doc.text(`肩: ${sagittal.shoulder.weightSide}`, 20, y); y += 5;
            doc.text(`首: ${sagittal.neck.description}`, 20, y); y += 5;

            doc.text(`前面収縮: ${sagittal.anterior.areas.join('・')}`, 20, y); y += 5;
            doc.text(`後面影響: ${sagittal.posterior.areas.join('・')}`, 20, y); y += 5;
            y += 3;
          }
        }
      }

      // --- Contraction Analysis ---
      if (contractionResult) {
        if (y > 220) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.text('収縮・伸長分析', 15, y);
        y += 2;
        doc.setDrawColor(139, 92, 246);
        doc.setLineWidth(0.8);
        doc.line(15, y, 100, y);
        doc.setLineWidth(0.2);
        y += 7;

        // Upper body detail
        if (contractionResult.upper) {
          doc.setFontSize(10);
          doc.text('上半身ランドマーク:', 15, y);
          y += 6;
          doc.setFontSize(8);

          for (const lm of (contractionResult.upper.landmarks || [])) {
            const valLabel = InspectionLogic.valueLabels[(lm.value || 0).toString()] || '-';
            doc.text(`  ${lm.name}: ${valLabel}`, 20, y);
            y += 5;
          }
          y += 3;

          for (const c of (contractionResult.upper.contractions || [])) {
            const sideLabel = c.side === 'both' ? '両側' : c.side === 'right' ? '右側' : '左側';
            doc.setTextColor(220, 38, 38);
            doc.text(`  収縮: ${c.area}（${sideLabel}）`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
          for (const t of (contractionResult.upper.tensions || [])) {
            const sideLabel = t.side === 'both' ? '両側' : t.side === 'right' ? '右側' : '左側';
            doc.setTextColor(139, 92, 246);
            doc.text(`  伸長: ${t.area}（${sideLabel}）`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
          y += 3;
        }

        // Lower body detail
        if (contractionResult.lower) {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(10);
          doc.text('下半身ランドマーク:', 15, y);
          y += 6;
          doc.setFontSize(8);

          for (const lm of (contractionResult.lower.landmarks || [])) {
            const valLabel = InspectionLogic.valueLabels[(lm.value || 0).toString()] || '-';
            doc.text(`  ${lm.name}: ${valLabel}`, 20, y);
            y += 5;
          }
          y += 3;

          for (const c of (contractionResult.lower.contractions || [])) {
            const sideLabel = c.side === 'both' ? '両側' : c.side === 'right' ? '右側' : '左側';
            doc.setTextColor(220, 38, 38);
            doc.text(`  収縮: ${c.area}（${sideLabel}）`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
          for (const t of (contractionResult.lower.tensions || [])) {
            const sideLabel = t.side === 'both' ? '両側' : t.side === 'right' ? '右側' : '左側';
            doc.setTextColor(139, 92, 246);
            doc.text(`  伸長: ${t.area}（${sideLabel}）`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
        }

        // Detail data table
        if (detailData) {
          if (y > 230) {
            doc.addPage();
            y = 20;
          }
          y += 5;
          doc.setFontSize(10);
          doc.text('詳細ランドマークデータ:', 15, y);
          y += 7;
          doc.setFontSize(8);

          if (detailData.upperDetail) {
            for (const lm of InspectionLogic.upperDetailLandmarks) {
              const val = detailData.upperDetail[lm.key];
              if (val !== null && val !== undefined) {
                const dlLabel = lm.simpleName ? `${lm.name}（${lm.simpleName}）` : lm.name;
                doc.text(`  ${dlLabel}: ${InspectionLogic.valueLabels[val.toString()]}`, 20, y);
                y += 5;
              }
            }
          }
          if (detailData.lowerDetail) {
            for (const lm of InspectionLogic.lowerDetailLandmarks) {
              const val = detailData.lowerDetail[lm.key];
              if (val !== null && val !== undefined) {
                const dlLabel = lm.simpleName ? `${lm.name}（${lm.simpleName}）` : lm.name;
                doc.text(`  ${dlLabel}: ${InspectionLogic.valueLabels[val.toString()]}`, 20, y);
                y += 5;
              }
            }
          }
        }
      }

      // --- Treatment Recommendations ---
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      y += 5;
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('施術プロトコル', 15, y);
      y += 2;
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.8);
      doc.line(15, y, 95, y);
      doc.setLineWidth(0.2);
      y += 7;

      doc.setFontSize(9);
      if (typeof TreatmentProtocol !== 'undefined') {
        const plan = TreatmentProtocol.generatePlan(diagnosisResult, contractionResult);
        if (plan.mainProtocol) {
          doc.text(`メインプロトコル: ${plan.mainProtocol.title}`, 20, y);
          y += 6;
          for (const tech of plan.mainProtocol.techniques) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(`  - ${tech.name}（${tech.target}）[${tech.duration}]`, 25, y);
            y += 5;
          }
          y += 3;
          if (plan.mainProtocol.checkpoints && plan.mainProtocol.checkpoints.length > 0) {
            doc.text('チェックポイント:', 20, y);
            y += 5;
            for (const cp of plan.mainProtocol.checkpoints) {
              doc.text(`  - ${cp}`, 25, y);
              y += 5;
            }
          }
          y += 3;
        }

        if (plan.areaProtocols.length > 0) {
          for (const ap of plan.areaProtocols) {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.text(`${ap.title}:`, 20, y);
            y += 6;
            for (const tech of ap.techniques) {
              if (y > 270) { doc.addPage(); y = 20; }
              doc.text(`  - ${tech.name}（${tech.target}）[${tech.duration}]`, 25, y);
              y += 5;
            }
            y += 3;
          }
        }

        if (plan.estimatedTime > 0) {
          doc.text(`推定施術時間: 約${plan.estimatedTime}分`, 20, y);
          y += 6;
        }
      } else {
        doc.text(`主原因: ${causeInfo.label}`, 20, y);
        y += 6;
        doc.text(`重点部位: ${diagnosisResult.treatmentArea || '-'}`, 20, y);
      }

      // --- Footer ---
      this._addFooter(doc, '施術者用レポート');

      // Save
      const dateStr = (inspectionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      doc.save(`検査レポート_施術者用_${dateStr}${nameStr}.pdf`);
      return true;
    } catch (e) {
      console.error('施術者用PDF出力エラー:', e);
      alert('PDFの出力に失敗しました。もう一度お試しください。');
      return false;
    }
  },

  // Legacy method for backward compatibility
  async exportDiagnosis(patientName, inspectionDate, result) {
    return this.exportClinicalPdf(patientName, inspectionDate, result, null, null, null);
  },

  // --- Helper methods ---
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
