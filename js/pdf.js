// ===== PDF出力（患者用 + 施術者用） =====

const PdfExport = {
  // ===== 患者説明用PDF =====
  async exportPatientPdf(patientName, inspectionDate, diagnosisResult, contractionResult, selfcareData) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];
      let y = 0;

      // --- Header ---
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Body Check Report', 105, 14, { align: 'center' });
      doc.setFontSize(10);
      doc.text('- For Patient -', 105, 22, { align: 'center' });

      // --- Patient Info ---
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      y = 40;
      doc.text(`Name: ${patientName || '-'}`, 15, y);
      doc.text(`Date: ${inspectionDate || new Date().toLocaleDateString('ja-JP')}`, 130, y);
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
      doc.text('Body Status', 15, y);
      y += 3;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 80, y);
      doc.setLineWidth(0.2);
      y += 8;

      doc.setFontSize(10);
      if (diagnosisResult.treatmentArea && diagnosisResult.treatmentArea !== 'none') {
        doc.text(`Treatment Focus: ${diagnosisResult.treatmentArea}`, 20, y);
        y += 7;
      }

      // Body map text summary
      if (diagnosisResult.pattern) {
        const patternDesc = diagnosisResult.pattern.description || '';
        if (patternDesc) {
          doc.text(`Pattern: ${patternDesc}`, 20, y);
          y += 7;
        }
      }

      // --- Contraction summary for patient ---
      if (contractionResult) {
        const allIssues = [];
        if (contractionResult.upper) {
          allIssues.push(...contractionResult.upper.contractions.map(c => ({ ...c, part: 'Upper' })));
          allIssues.push(...contractionResult.upper.tensions.map(t => ({ ...t, part: 'Upper' })));
        }
        if (contractionResult.lower) {
          allIssues.push(...contractionResult.lower.contractions.map(c => ({ ...c, part: 'Lower' })));
          allIssues.push(...contractionResult.lower.tensions.map(t => ({ ...t, part: 'Lower' })));
        }

        if (allIssues.length > 0) {
          y += 4;
          doc.setFontSize(13);
          doc.text('Problem Areas', 15, y);
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
            const typeLabel = issue.type === 'contraction' ? 'Tight/Contracted' : 'Stretched/Tensioned';
            const sideLabel = issue.side === 'both' ? 'Both sides' : issue.side === 'right' ? 'Right' : 'Left';
            doc.setFillColor(254, 242, 242);
            doc.roundedRect(15, y - 4, 180, 10, 2, 2, 'F');
            doc.setTextColor(220, 38, 38);
            doc.text(`${issue.area} (${sideLabel}) - ${typeLabel}`, 20, y + 2);
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
        doc.text('Selfcare Exercises', 15, y);
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
          if (exercise.duration) {
            doc.text(`Duration: ${exercise.duration}`, 20, y + 16);
          }
          y += 28;
        }
      }

      // --- Footer ---
      this._addFooter(doc, 'Patient Report');

      // Save
      const dateStr = (inspectionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      doc.save(`PatientReport_${dateStr}${nameStr}.pdf`);
      return true;
    } catch (e) {
      console.error('Patient PDF export failed:', e);
      alert('PDF export failed. Please try again.');
      return false;
    }
  },

  // ===== 施術者用PDF（Clinical） =====
  async exportClinicalPdf(patientName, inspectionDate, diagnosisResult, contractionResult, detailData, weightBalance) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];
      let y = 0;

      // --- Header ---
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('Clinical Inspection Report', 105, 10, { align: 'center' });
      doc.setFontSize(8);
      doc.text('Practitioner Use Only', 105, 17, { align: 'center' });

      // --- Patient Info ---
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      y = 33;
      doc.text(`Name: ${patientName || '-'}`, 15, y);
      doc.text(`Date: ${inspectionDate || new Date().toLocaleDateString('ja-JP')}`, 130, y);
      if (weightBalance) {
        y += 6;
        const wbLabel = weightBalance === 'right' ? 'Right' : weightBalance === 'left' ? 'Left' : 'Even';
        doc.text(`Weight Balance: ${wbLabel}`, 15, y);
      }
      y += 3;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, 195, y);
      y += 8;

      // --- Diagnosis Summary ---
      doc.setFontSize(12);
      doc.text('Diagnosis', 15, y);
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
        doc.text(`Treatment Area: ${diagnosisResult.treatmentArea}`, 20, y);
        y += 7;
      }

      // --- Examination Data Table ---
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('Examination Data', 15, y);
      y += 2;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 80, y);
      doc.setLineWidth(0.2);
      y += 7;

      // Table header
      doc.setFontSize(8);
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y - 4, 180, 8, 'F');
      const headers = ['Landmark'];
      const colWidth = 40;
      for (const step of diagnosisResult.steps) {
        headers.push(step.name);
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
        doc.text(config.name, x + 2, y);
        x += colWidth;
        for (const step of diagnosisResult.steps) {
          const val = step.data[landmark] || 0;
          const label = InspectionLogic.valueLabels[val.toString()];
          if (val < 0) doc.setTextColor(59, 130, 246);
          else if (val > 0) doc.setTextColor(249, 115, 22);
          else doc.setTextColor(34, 197, 94);
          doc.text(label, x + 2, y);
          doc.setTextColor(30, 41, 59);
          x += colWidth;
        }
        y += 6;
      }
      y += 5;

      // --- Step-by-Step Analysis ---
      doc.setFontSize(12);
      doc.text('Step Analysis', 15, y);
      y += 2;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.8);
      doc.line(15, y, 70, y);
      doc.setLineWidth(0.2);
      y += 7;

      doc.setFontSize(9);
      if (diagnosisResult.steps.length >= 2 && diagnosisResult.steps[1].comparison) {
        const comp = diagnosisResult.steps[1].comparison;
        doc.text(`Step 1 (Standing -> Seated): ${comp.hasFootInfluence ? 'CHANGE DETECTED - Foot influence' : 'No change - Not foot-related'}`, 20, y);
        y += 6;
      }
      if (diagnosisResult.steps.length >= 3 && diagnosisResult.steps[2].comparison) {
        const comp = diagnosisResult.steps[2].comparison;
        doc.text(`Step 2 (Seated -> Upper Body): ${comp.hasUpperBodyInfluence ? 'CHANGE DETECTED - Upper body influence' : 'No change - Not upper body-related'}`, 20, y);
        y += 6;
      }
      if (diagnosisResult.pattern && diagnosisResult.pattern.pattern !== 'normal') {
        doc.text(`Pattern: ${diagnosisResult.pattern.description}`, 20, y);
        y += 6;
      }
      y += 5;

      // --- Contraction Analysis ---
      if (contractionResult) {
        if (y > 220) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.text('Contraction / Tension Analysis', 15, y);
        y += 2;
        doc.setDrawColor(139, 92, 246);
        doc.setLineWidth(0.8);
        doc.line(15, y, 100, y);
        doc.setLineWidth(0.2);
        y += 7;

        // Upper body detail
        if (contractionResult.upper) {
          doc.setFontSize(10);
          doc.text('Upper Body Landmarks:', 15, y);
          y += 6;
          doc.setFontSize(8);

          for (const lm of contractionResult.upper.landmarks) {
            const valLabel = InspectionLogic.valueLabels[lm.value.toString()];
            doc.text(`  ${lm.name}: ${valLabel}`, 20, y);
            y += 5;
          }
          y += 3;

          for (const c of contractionResult.upper.contractions) {
            const sideLabel = c.side === 'both' ? 'Both' : c.side === 'right' ? 'Right' : 'Left';
            doc.setTextColor(220, 38, 38);
            doc.text(`  CONTRACTION: ${c.area} (${sideLabel})`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
          for (const t of contractionResult.upper.tensions) {
            const sideLabel = t.side === 'both' ? 'Both' : t.side === 'right' ? 'Right' : 'Left';
            doc.setTextColor(139, 92, 246);
            doc.text(`  TENSION: ${t.area} (${sideLabel})`, 20, y);
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
          doc.text('Lower Body Landmarks:', 15, y);
          y += 6;
          doc.setFontSize(8);

          for (const lm of contractionResult.lower.landmarks) {
            const valLabel = InspectionLogic.valueLabels[lm.value.toString()];
            doc.text(`  ${lm.name}: ${valLabel}`, 20, y);
            y += 5;
          }
          y += 3;

          for (const c of contractionResult.lower.contractions) {
            const sideLabel = c.side === 'both' ? 'Both' : c.side === 'right' ? 'Right' : 'Left';
            doc.setTextColor(220, 38, 38);
            doc.text(`  CONTRACTION: ${c.area} (${sideLabel})`, 20, y);
            doc.setTextColor(30, 41, 59);
            y += 5;
          }
          for (const t of contractionResult.lower.tensions) {
            const sideLabel = t.side === 'both' ? 'Both' : t.side === 'right' ? 'Right' : 'Left';
            doc.setTextColor(139, 92, 246);
            doc.text(`  TENSION: ${t.area} (${sideLabel})`, 20, y);
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
          doc.text('Detailed Landmark Data:', 15, y);
          y += 7;
          doc.setFontSize(8);

          if (detailData.upperDetail) {
            for (const lm of InspectionLogic.upperDetailLandmarks) {
              const val = detailData.upperDetail[lm.key];
              if (val !== null && val !== undefined) {
                doc.text(`  ${lm.name}: ${InspectionLogic.valueLabels[val.toString()]}`, 20, y);
                y += 5;
              }
            }
          }
          if (detailData.lowerDetail) {
            for (const lm of InspectionLogic.lowerDetailLandmarks) {
              const val = detailData.lowerDetail[lm.key];
              if (val !== null && val !== undefined) {
                doc.text(`  ${lm.name}: ${InspectionLogic.valueLabels[val.toString()]}`, 20, y);
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
      doc.text('Treatment Recommendations', 15, y);
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
          doc.text(`Main Protocol: ${plan.mainProtocol.title}`, 20, y);
          y += 6;
          for (const tech of plan.mainProtocol.techniques) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(`  - ${tech.name} (${tech.target}) [${tech.duration}]`, 25, y);
            y += 5;
          }
          y += 3;
          if (plan.mainProtocol.checkpoints && plan.mainProtocol.checkpoints.length > 0) {
            doc.text('Checkpoints:', 20, y);
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
              doc.text(`  - ${tech.name} (${tech.target}) [${tech.duration}]`, 25, y);
              y += 5;
            }
            y += 3;
          }
        }

        if (plan.estimatedTime > 0) {
          doc.text(`Estimated Total Time: ${plan.estimatedTime} min`, 20, y);
          y += 6;
        }
      } else {
        doc.text(`Primary cause: ${causeInfo.label}`, 20, y);
        y += 6;
        doc.text(`Focus: ${diagnosisResult.treatmentArea || '-'}`, 20, y);
      }

      // --- Footer ---
      this._addFooter(doc, 'Clinical Report');

      // Save
      const dateStr = (inspectionDate || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      const nameStr = patientName ? `_${patientName}` : '';
      doc.save(`ClinicalReport_${dateStr}${nameStr}.pdf`);
      return true;
    } catch (e) {
      console.error('Clinical PDF export failed:', e);
      alert('PDF export failed. Please try again.');
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
      doc.text(`Body Check Pro - ${reportType} - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
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
      foot: 'Foot Balance Issue',
      upperBody: 'Upper Body Balance Issue',
      cranialPelvic: 'Whole Body Alignment',
      spine: 'Spine Alignment',
      none: 'Good Condition'
    };
    return labels[cause] || cause;
  },

  _getPatientSummary(result) {
    const summaries = {
      foot: 'The way your feet contact the ground is affecting your body balance. Adjusting from the feet up can help improve alignment.',
      upperBody: 'Your shoulder and arm position is affecting your body balance. Upper body adjustment can help.',
      cranialPelvic: 'Your body tends to lean to one side. Cranial and pelvic alignment treatment is recommended.',
      spine: 'Your body shows alternating misalignment. Spine adjustment can help restore balance.',
      none: 'No significant misalignment detected. Keep maintaining good posture.'
    };
    return summaries[result.primaryCause] || result.summary;
  }
};
