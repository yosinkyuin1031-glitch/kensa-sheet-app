// ===== デモ用モック: Supabase不要、セッション限定 =====
// データは保存されません（ページを閉じるとリセット）

// 起動時にデモデータをクリア
localStorage.removeItem('karadamap_demo_data');

// Supabaseクエリチェーンのモック
// from().select().eq().eq().order() 等すべてのメソッドチェーンに対応
// awaitで { data: [], error: null } を返す
function _mockQueryChain() {
  const result = Promise.resolve({ data: [], error: null });
  const handler = {
    get(target, prop) {
      // awaitされた時にPromiseとして振る舞う
      if (prop === 'then') return result.then.bind(result);
      if (prop === 'catch') return result.catch.bind(result);
      if (prop === 'finally') return result.finally.bind(result);
      // data/errorプロパティ直接アクセス
      if (prop === 'data') return [];
      if (prop === 'error') return null;
      // それ以外のメソッド呼び出しは自身を返す（チェーン継続）
      return () => new Proxy({}, handler);
    }
  };
  return new Proxy({}, handler);
}

// SupabaseAuth モック（varでグローバルに公開）
var SupabaseAuth = {
  client: _mockQueryChain(),
  currentUser: { id: 'demo-user-001', email: 'demo@example.com', user_metadata: { display_name: 'デモユーザー' } },
  currentClinicId: 'demo-clinic-001',

  async init() { return null; },
  async getSession() { return { user: this.currentUser }; },
  async login() { return { user: this.currentUser }; },
  async signup() { return { user: this.currentUser }; },
  async resetPassword() {},
  async logout() { window.location.href = 'https://clinic-saas-lp.vercel.app/systems/kensa'; },
  async _loadClinicId() {},
  getClinicId() { return this.currentClinicId; },
  getUserId() { return this.currentUser.id; },
  getDisplayName() { return 'デモユーザー'; }
};

// Storage モック（localStorage版・varでグローバルに公開）
var Storage = {
  _STORAGE_KEY: 'karadamap_demo_data',
  _cache: null,

  _loadAll() {
    try {
      return JSON.parse(localStorage.getItem(this._STORAGE_KEY) || '[]');
    } catch { return []; }
  },

  _saveAll(data) {
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(data));
    this._cache = null;
  },

  async getAll() {
    return this._loadAll().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  },

  async getPatientList() {
    const history = await this.getAll();
    const map = {};
    for (const entry of history) {
      const pid = entry.patientId;
      if (!pid) continue;
      if (!map[pid]) {
        map[pid] = { patientId: pid, patientName: entry.patientName || '名前未入力', examCount: 0, lastDate: entry.date };
      }
      map[pid].examCount++;
      if (entry.date > map[pid].lastDate) map[pid].lastDate = entry.date;
    }
    return Object.values(map).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  },

  async getHistoryByPatient(patientId) {
    const history = await this.getAll();
    return history.filter(e => e.patientId === patientId);
  },

  async searchPatients(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const patients = await this.getPatientList();
    return patients.filter(p => p.patientName.toLowerCase().includes(q));
  },

  async findPatientIdByName(name) {
    const history = await this.getAll();
    for (const entry of history) {
      if (entry.patientName === name && entry.patientId) return entry.patientId;
    }
    return null;
  },

  async save() {
    alert('デモ版ではデータの保存はできません。\n製品版では患者カルテとして保存・管理が可能です。');
    return false;
  },

  async delete(id) {
    const all = this._loadAll().filter(e => e.id !== id);
    this._saveAll(all);
    return true;
  },

  async getById(id) {
    return this._loadAll().find(e => e.id === id) || null;
  },

  // カルテ表示（本体app.jsから呼ばれる）
  async renderKarteList(onLoad, onDelete, filterQuery) {
    const history = await this.getAll();
    const container = document.getElementById('kartePatientList');
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = '<div class="history-empty"><p>まだカルテがありません</p><p>検査結果を保存すると、ここに患者一覧が表示されます</p></div>';
      return;
    }

    const groups = {};
    const groupOrder = [];
    for (const entry of history) {
      const pid = entry.patientId || 'unknown_' + entry.id;
      if (!groups[pid]) {
        groups[pid] = { patientId: pid, patientName: entry.patientName || '名前未入力', entries: [], lastDate: entry.date, lastSummary: entry.summary || '' };
        groupOrder.push(pid);
      }
      groups[pid].entries.push(entry);
      if (entry.date > groups[pid].lastDate) { groups[pid].lastDate = entry.date; groups[pid].lastSummary = entry.summary || ''; }
    }

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
      const d = new Date(group.lastDate);
      const ds = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
      html += `<div class="karte-patient-card" data-patient-id="${group.patientId}">
        <div class="karte-patient-icon">${group.patientName.charAt(0)}</div>
        <div class="karte-patient-body">
          <div class="karte-patient-name">${group.patientName}</div>
          <div class="karte-patient-sub"><span>検査 ${group.entries.length}回</span><span>最終: ${ds}</span></div>
          <div class="karte-patient-last">${group.lastSummary}</div>
        </div>
        <div class="karte-patient-arrow">›</div>
      </div>`;
    }
    container.innerHTML = html;

    container.querySelectorAll('.karte-patient-card').forEach(card => {
      card.addEventListener('click', () => this.renderKarteDetail(card.dataset.patientId, onLoad, onDelete));
    });
    this._onLoad = onLoad;
    this._onDelete = onDelete;
  },

  async renderKarteDetail(patientId, onLoad, onDelete) {
    const listView = document.getElementById('karteListView');
    const detailView = document.getElementById('karteDetailView');
    const infoDiv = document.getElementById('karteDetailPatientInfo');
    const listDiv = document.getElementById('karteDetailList');
    if (!listView || !detailView) return;

    const entries = (await this.getHistoryByPatient(patientId)).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (entries.length === 0) return;

    const patientName = entries[0].patientName || '名前未入力';
    infoDiv.innerHTML = `<div class="karte-detail-name">${patientName}</div><div class="karte-detail-stats"><span>検査 ${entries.length}回</span></div>`;

    let html = '';
    for (const entry of entries) {
      const date = new Date(entry.date);
      const dateStr = `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}`;
      const timeStr = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
      const causeInfo = entry.diagnosisResult ? (InspectionLogic.causeLabels[entry.diagnosisResult.primaryCause] || {}) : {};
      const painStr = entry.painLevel != null ? `NRS: ${entry.painLevel}/10` : '';
      const complaints = entry.chiefComplaints && entry.chiefComplaints.length > 0 ? entry.chiefComplaints.join('・') : '';

      html += `<div class="karte-record-card">
        <div class="karte-record-header">
          <div class="karte-record-date"><span class="karte-date-main">${dateStr}</span><span class="karte-date-time">${timeStr}</span></div>
          <div class="karte-record-badge" style="background:${causeInfo.color || '#94a3b8'}">${causeInfo.icon || '?'} ${causeInfo.label || '未診断'}</div>
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

    listView.style.display = 'none';
    detailView.style.display = 'block';

    const backBtn = document.getElementById('karteBackBtn');
    if (backBtn) backBtn.onclick = () => { detailView.style.display = 'none'; listView.style.display = 'block'; };

    listDiv.querySelectorAll('.karte-load-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); if (onLoad) onLoad(btn.dataset.id); });
    });
    listDiv.querySelectorAll('.karte-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('この検査記録を削除しますか？')) {
          if (onDelete) await onDelete(btn.dataset.id);
          await this.renderKarteDetail(patientId, onLoad, onDelete);
        }
      });
    });
  }
};

// SelfcareDatabase / TreatmentProtocol のSupabase呼び出しを無効化
// selfcare.js / inspection.js の読み込み後に上書き
(function mockDependencies() {
  function applyMocks() {
    if (typeof SelfcareDatabase !== 'undefined') {
      SelfcareDatabase.loadCustomItems = async function() {};
      SelfcareDatabase.saveCustomItem = async function() {};
      SelfcareDatabase.deleteCustomItem = async function() {};
      SelfcareDatabase.toggleCustomItem = async function() {};
    }
    if (typeof TreatmentProtocol !== 'undefined') {
      TreatmentProtocol.loadCustomProtocols = async function() {};
      TreatmentProtocol.saveCustomProtocol = async function() {};
      TreatmentProtocol.deleteCustomProtocol = async function() {};
      TreatmentProtocol.toggleCustomProtocol = async function() {};
    }
  }
  applyMocks();
  document.addEventListener('DOMContentLoaded', applyMocks);
  window.addEventListener('load', applyMocks);
})();
