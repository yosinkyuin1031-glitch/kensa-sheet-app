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

  // ===== カルテ方式：患者一覧 → 個別フォルダ =====
  renderKarteList(onLoad, onDelete, filterQuery) {
    const history = this.getAll();
    const container = document.getElementById('kartePatientList');
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="history-empty">
          <p>まだカルテがありません</p>
          <p>検査結果を保存すると、ここに患者一覧が表示されます</p>
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
          lastDate: entry.date,
          lastSummary: entry.summary || ''
        };
        groupOrder.push(pid);
      }
      groups[pid].entries.push(entry);
      if (entry.date > groups[pid].lastDate) {
        groups[pid].lastDate = entry.date;
        groups[pid].lastSummary = entry.summary || '';
      }
    }

    // フィルタ
    let patients = groupOrder.map(pid => groups[pid]);
    if (filterQuery && filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase();
      patients = patients.filter(p => p.patientName.toLowerCase().includes(q));
    }

    if (patients.length === 0) {
      container.innerHTML = '<div class="history-empty"><p>該当する患者が見つかりません</p></div>';
      return;
    }

    let html = '';
    for (const group of patients) {
      const lastDate = new Date(group.lastDate);
      const lastDateStr = `${lastDate.getFullYear()}/${String(lastDate.getMonth() + 1).padStart(2, '0')}/${String(lastDate.getDate()).padStart(2, '0')}`;

      html += `<div class="karte-patient-card" data-patient-id="${group.patientId}">
        <div class="karte-patient-icon">${group.patientName.charAt(0)}</div>
        <div class="karte-patient-body">
          <div class="karte-patient-name">${group.patientName}</div>
          <div class="karte-patient-sub">
            <span>検査 ${group.entries.length}回</span>
            <span>最終: ${lastDateStr}</span>
          </div>
          <div class="karte-patient-last">${group.lastSummary}</div>
        </div>
        <div class="karte-patient-arrow">›</div>
      </div>`;
    }
    container.innerHTML = html;

    // カードタップ → 個別カルテを開く
    container.querySelectorAll('.karte-patient-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.dataset.patientId;
        this.renderKarteDetail(pid, onLoad, onDelete);
      });
    });

    // コールバックを保持
    this._onLoad = onLoad;
    this._onDelete = onDelete;
  },

  // ===== 個別患者のカルテフォルダ =====
  renderKarteDetail(patientId, onLoad, onDelete) {
    const listView = document.getElementById('karteListView');
    const detailView = document.getElementById('karteDetailView');
    const infoDiv = document.getElementById('karteDetailPatientInfo');
    const listDiv = document.getElementById('karteDetailList');
    if (!listView || !detailView) return;

    const entries = this.getHistoryByPatient(patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (entries.length === 0) return;

    const patientName = entries[0].patientName || '名前未入力';

    // ヘッダー情報
    infoDiv.innerHTML = `
      <div class="karte-detail-name">${patientName}</div>
      <div class="karte-detail-stats">
        <span>検査 ${entries.length}回</span>
      </div>`;

    // 検査カード一覧
    let html = '';
    for (const entry of entries) {
      const date = new Date(entry.date);
      const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      const causeInfo = entry.diagnosisResult
        ? (InspectionLogic.causeLabels[entry.diagnosisResult.primaryCause] || {})
        : {};
      const painStr = entry.painLevel != null ? `NRS: ${entry.painLevel}/10` : '';
      const complaints = entry.chiefComplaints && entry.chiefComplaints.length > 0
        ? entry.chiefComplaints.join('・') : '';

      html += `<div class="karte-record-card">
        <div class="karte-record-header">
          <div class="karte-record-date">
            <span class="karte-date-main">${dateStr}</span>
            <span class="karte-date-time">${timeStr}</span>
          </div>
          <div class="karte-record-badge" style="background:${causeInfo.color || '#94a3b8'}">
            ${causeInfo.icon || '?'} ${causeInfo.label || '未診断'}
          </div>
        </div>
        <div class="karte-record-body">
          ${complaints ? `<div class="karte-record-row">主訴: ${complaints}</div>` : ''}
          ${painStr ? `<div class="karte-record-row">${painStr}</div>` : ''}
          ${entry.memo ? `<div class="karte-record-row memo">メモ: ${entry.memo}</div>` : ''}
        </div>
        <div class="karte-record-actions">
          <button type="button" class="btn btn-sm btn-primary karte-load-btn" data-id="${entry.id}">読み込み</button>
          <button type="button" class="btn btn-sm btn-secondary karte-delete-btn" data-id="${entry.id}">削除</button>
        </div>
      </div>`;
    }
    listDiv.innerHTML = html;

    // ビュー切り替え
    listView.style.display = 'none';
    detailView.style.display = 'block';

    // 戻るボタン
    const backBtn = document.getElementById('karteBackBtn');
    if (backBtn) {
      backBtn.onclick = () => {
        detailView.style.display = 'none';
        listView.style.display = 'block';
      };
    }

    // 読み込み・削除ボタン
    listDiv.querySelectorAll('.karte-load-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onLoad) onLoad(btn.dataset.id);
      });
    });
    listDiv.querySelectorAll('.karte-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('この検査記録を削除しますか？')) {
          if (onDelete) onDelete(btn.dataset.id);
          // 再描画
          this.renderKarteDetail(patientId, onLoad, onDelete);
        }
      });
    });
  }
};
