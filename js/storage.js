// ===== localStorage 保存・履歴管理（段階的検査対応版） =====

const Storage = {
  STORAGE_KEY: 'bodyCheckHistory_v2',

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('履歴の読み込みに失敗しました:', e);
      return [];
    }
  },

  // 患者IDを生成
  _generatePatientId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  },

  // 重複なしの患者一覧を返す（名前・ID・検査回数・最終検査日）
  getPatientList() {
    const history = this.getAll();
    const patientMap = {};

    for (const entry of history) {
      const pid = entry.patientId;
      const name = entry.patientName || '名前未入力';
      if (!pid) continue;

      if (!patientMap[pid]) {
        patientMap[pid] = {
          patientId: pid,
          patientName: name,
          examCount: 0,
          lastDate: entry.date
        };
      }
      patientMap[pid].examCount++;
      // 最新の日付を保持
      if (entry.date > patientMap[pid].lastDate) {
        patientMap[pid].lastDate = entry.date;
      }
    }

    return Object.values(patientMap).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  },

  // 特定患者の履歴のみ返す
  getHistoryByPatient(patientId) {
    return this.getAll().filter(entry => entry.patientId === patientId);
  },

  // 名前で患者を検索（部分一致）
  searchPatients(query) {
    if (!query || query.trim() === '') return [];
    const q = query.trim().toLowerCase();
    const patients = this.getPatientList();
    return patients.filter(p => p.patientName.toLowerCase().includes(q));
  },

  // 名前から既存の患者IDを探す（完全一致）
  findPatientIdByName(name) {
    const history = this.getAll();
    for (const entry of history) {
      if (entry.patientName === name && entry.patientId) {
        return entry.patientId;
      }
    }
    return null;
  },

  save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance, patientId, painLevel, chiefComplaints) {
    const history = this.getAll();
    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];

    // patientIdが渡されなかった場合、名前から探すか新規生成
    if (!patientId) {
      patientId = this.findPatientIdByName(patientName || '名前未入力');
      if (!patientId) {
        patientId = this._generatePatientId();
      }
    }

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      patientId: patientId,
      patientName: patientName || '名前未入力',
      memo: memo || '',
      examData,
      diagnosisResult,
      detailData: detailData || null,
      contractionResult: contractionResult || null,
      weightBalance: weightBalance || null,
      painLevel: painLevel != null ? painLevel : null,
      chiefComplaints: chiefComplaints || [],
      summary: `${causeInfo.icon} ${causeInfo.label}`
    };

    history.unshift(entry);
    if (history.length > 100) history.pop();

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.error('履歴の保存に失敗しました:', e);
      return false;
    }
  },

  delete(id) {
    const history = this.getAll();
    const filtered = history.filter(entry => entry.id !== id);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      return false;
    }
  },

  getById(id) {
    return this.getAll().find(entry => entry.id === id) || null;
  },

  // 患者ごとにグループ化した履歴表示
  renderHistoryList(onLoad, onDelete) {
    const history = this.getAll();
    const container = document.getElementById('historyList');

    if (history.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <p>まだ検査履歴がありません</p>
          <p>検査結果を保存すると、ここに表示されます</p>
        </div>`;
      return;
    }

    // 患者ごとにグループ化
    const groups = {};
    const groupOrder = [];

    for (const entry of history) {
      const pid = entry.patientId || 'unknown_' + entry.id;
      if (!groups[pid]) {
        groups[pid] = {
          patientId: pid,
          patientName: entry.patientName || '名前未入力',
          entries: [],
          lastDate: entry.date
        };
        groupOrder.push(pid);
      }
      groups[pid].entries.push(entry);
      if (entry.date > groups[pid].lastDate) {
        groups[pid].lastDate = entry.date;
      }
    }

    let html = '';

    for (const pid of groupOrder) {
      const group = groups[pid];
      const lastDate = new Date(group.lastDate);
      const lastDateStr = `${lastDate.getFullYear()}/${String(lastDate.getMonth() + 1).padStart(2, '0')}/${String(lastDate.getDate()).padStart(2, '0')}`;

      html += `<div class="history-patient-group" data-patient-id="${pid}">`;
      html += `<div class="history-patient-header" data-patient-id="${pid}">
        <div class="history-patient-info">
          <span class="history-patient-name">${group.patientName}</span>
          <span class="history-patient-meta">検査 ${group.entries.length}回 / 最終: ${lastDateStr}</span>
        </div>
        <span class="history-patient-toggle">▼</span>
      </div>`;

      html += `<div class="history-patient-items" data-patient-id="${pid}" style="display:none;">`;

      for (const entry of group.entries) {
        const date = new Date(entry.date);
        const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        html += `
        <div class="history-item" data-id="${entry.id}">
          <div class="history-info">
            <div class="history-date">${dateStr}</div>
            <div class="history-summary">${entry.summary || ''}</div>
          </div>
          <div class="history-actions">
            <button class="history-btn load-btn" data-id="${entry.id}">読み込み</button>
            <button class="history-btn delete" data-id="${entry.id}">削除</button>
          </div>
        </div>`;
      }

      html += '</div>'; // .history-patient-items
      html += '</div>'; // .history-patient-group
    }

    container.innerHTML = html;

    // 患者ヘッダーのトグル
    container.querySelectorAll('.history-patient-header').forEach(header => {
      header.addEventListener('click', () => {
        const pid = header.dataset.patientId;
        const items = container.querySelector(`.history-patient-items[data-patient-id="${pid}"]`);
        const toggle = header.querySelector('.history-patient-toggle');
        if (items.style.display === 'none') {
          items.style.display = 'block';
          toggle.textContent = '▲';
        } else {
          items.style.display = 'none';
          toggle.textContent = '▼';
        }
      });
    });

    container.querySelectorAll('.load-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onLoad(btn.dataset.id);
      });
    });

    container.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('この履歴を削除しますか？')) {
          onDelete(btn.dataset.id);
        }
      });
    });
  }
};
