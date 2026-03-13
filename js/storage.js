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

  save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance) {
    const history = this.getAll();
    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      patientName: patientName || '名前未入力',
      memo: memo || '',
      examData,
      diagnosisResult,
      detailData: detailData || null,
      contractionResult: contractionResult || null,
      weightBalance: weightBalance || null,
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

    container.innerHTML = history.map(entry => {
      const date = new Date(entry.date);
      const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

      return `
      <div class="history-item" data-id="${entry.id}">
        <div class="history-info">
          <div class="history-date">${dateStr}</div>
          <div class="history-name">${entry.patientName}</div>
          <div class="history-summary">${entry.summary || ''}</div>
        </div>
        <div class="history-actions">
          <button class="history-btn load-btn" data-id="${entry.id}">読み込み</button>
          <button class="history-btn delete" data-id="${entry.id}">削除</button>
        </div>
      </div>`;
    }).join('');

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
