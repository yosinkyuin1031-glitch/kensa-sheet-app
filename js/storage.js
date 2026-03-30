// ===== Supabase クラウド保存・履歴管理（BtoB対応版） =====
// 旧localStorage版と同じ公開APIを維持

const Storage = {
  _cache: null,        // メモリキャッシュ
  _cacheTime: 0,       // キャッシュ更新時刻
  CACHE_TTL: 5000,     // キャッシュ有効期間(ms)

  _db() {
    return SupabaseAuth.client;
  },

  _clinicId() {
    return SupabaseAuth.getClinicId();
  },

  _userId() {
    return SupabaseAuth.getUserId();
  },

  _invalidateCache() {
    this._cache = null;
    this._cacheTime = 0;
  },

  // DB行 → 旧形式のentryオブジェクトに変換
  _rowToEntry(row) {
    return {
      id: row.id,
      date: row.exam_date || row.created_at,
      patientId: row.patient_id,
      patientName: row.patient_name || '名前未入力',
      memo: row.memo || '',
      examData: row.exam_data || {},
      diagnosisResult: row.diagnosis_result || null,
      detailData: row.detail_data || null,
      contractionResult: row.contraction_result || null,
      weightBalance: row.weight_balance || null,
      painLevel: row.pain_level != null ? row.pain_level : null,
      chiefComplaints: row.chief_complaints || [],
      summary: row.summary || '',
      patientAge: row.patient_age,
      patientGender: row.patient_gender,
      patientOccupation: row.patient_occupation,
      visitType: row.visit_type,
      medicalHistory: row.medical_history,
      symptomDetail: row.symptom_detail
    };
  },

  // 全件取得（キャッシュ付き）
  async getAll() {
    if (this._cache && (Date.now() - this._cacheTime < this.CACHE_TTL)) {
      return this._cache;
    }
    const clinicId = this._clinicId();
    if (!clinicId) return [];

    const { data, error } = await this._db()
      .from('ks_examinations')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('exam_date', { ascending: false })
      .limit(500);

    if (error) {
      console.error('データ取得エラー:', error);
      return [];
    }

    this._cache = (data || []).map(row => this._rowToEntry(row));
    this._cacheTime = Date.now();
    return this._cache;
  },

  // 患者IDを生成
  _generatePatientId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  },

  // 患者一覧（重複なし）
  async getPatientList() {
    const history = await this.getAll();
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
      if (entry.date > patientMap[pid].lastDate) {
        patientMap[pid].lastDate = entry.date;
      }
    }

    return Object.values(patientMap).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  },

  // 特定患者の履歴のみ返す
  async getHistoryByPatient(patientId) {
    const history = await this.getAll();
    return history.filter(entry => entry.patientId === patientId);
  },

  // 名前で患者を検索（部分一致）
  async searchPatients(query) {
    if (!query || query.trim() === '') return [];
    const q = query.trim().toLowerCase();
    const patients = await this.getPatientList();
    return patients.filter(p => p.patientName.toLowerCase().includes(q));
  },

  // 名前から既存の患者IDを探す（完全一致）
  async findPatientIdByName(name) {
    const history = await this.getAll();
    for (const entry of history) {
      if (entry.patientName === name && entry.patientId) {
        return entry.patientId;
      }
    }
    return null;
  },

  // 保存
  async save(examData, diagnosisResult, patientName, memo, detailData, contractionResult, weightBalance, patientId, painLevel, chiefComplaints, extraFields) {
    const clinicId = this._clinicId();
    const userId = this._userId();
    if (!clinicId) {
      console.error('clinic_idが取得できません');
      alert('エラー詳細: clinic_idが取得できません。ログアウトして再ログインしてください。');
      return false;
    }
    if (!userId) {
      console.error('user_idが取得できません');
      alert('エラー詳細: user_idが取得できません。ログアウトして再ログインしてください。');
      return false;
    }

    const causeInfo = InspectionLogic.causeLabels[diagnosisResult.primaryCause];

    // patientIdが渡されなかった場合、名前から探すか新規生成
    if (!patientId) {
      patientId = await this.findPatientIdByName(patientName || '名前未入力');
      if (!patientId) {
        patientId = this._generatePatientId();
      }
    }

    // ks_patients にupsert（患者マスタ）
    const patientRow = {
      clinic_id: clinicId,
      patient_id: patientId,
      name: patientName || '名前未入力'
    };
    if (extraFields) {
      if (extraFields.age) patientRow.age = extraFields.age;
      if (extraFields.gender) patientRow.gender = extraFields.gender;
      if (extraFields.occupation) patientRow.occupation = extraFields.occupation;
      if (extraFields.visitType) patientRow.visit_type = extraFields.visitType;
      if (extraFields.medicalHistory) patientRow.medical_history = extraFields.medicalHistory;
    }

    const { error: patientError } = await this._db()
      .from('ks_patients')
      .upsert(patientRow, { onConflict: 'clinic_id,patient_id' });

    if (patientError) {
      console.error('患者マスタ保存エラー:', patientError);
      alert(`エラー詳細（患者マスタ）: ${patientError.message}\ncode: ${patientError.code}\nhint: ${patientError.hint || 'なし'}`);
      return false;
    }

    // ks_examinations に挿入
    const row = {
      clinic_id: clinicId,
      patient_id: patientId,
      patient_name: patientName || '名前未入力',
      exam_date: new Date().toISOString(),
      exam_data: examData,
      diagnosis_result: diagnosisResult,
      detail_data: detailData || null,
      contraction_result: contractionResult || null,
      weight_balance: weightBalance || null,
      pain_level: painLevel != null ? painLevel : null,
      chief_complaints: chiefComplaints || [],
      memo: memo || '',
      summary: `${causeInfo.icon} ${causeInfo.label}`,
      created_by: userId
    };
    if (extraFields) {
      if (extraFields.age) row.patient_age = extraFields.age;
      if (extraFields.gender) row.patient_gender = extraFields.gender;
      if (extraFields.occupation) row.patient_occupation = extraFields.occupation;
      if (extraFields.visitType) row.visit_type = extraFields.visitType;
      if (extraFields.medicalHistory) row.medical_history = extraFields.medicalHistory;
      if (extraFields.symptomDetail) row.symptom_detail = extraFields.symptomDetail;
    }

    const { error } = await this._db()
      .from('ks_examinations')
      .insert(row);

    if (error) {
      console.error('保存エラー:', error);
      alert(`エラー詳細（検査データ）: ${error.message}\ncode: ${error.code}\nhint: ${error.hint || 'なし'}\ndetails: ${error.details || 'なし'}`);
      return false;
    }

    this._invalidateCache();
    return true;
  },

  // 削除
  async delete(id) {
    const { error } = await this._db()
      .from('ks_examinations')
      .delete()
      .eq('id', id)
      .eq('clinic_id', this._clinicId());

    if (error) {
      console.error('削除エラー:', error);
      return false;
    }
    this._invalidateCache();
    return true;
  },

  // ID指定で取得
  async getById(id) {
    const { data, error } = await this._db()
      .from('ks_examinations')
      .select('*')
      .eq('id', id)
      .eq('clinic_id', this._clinicId())
      .single();

    if (error || !data) return null;
    return this._rowToEntry(data);
  },

  // ===== カルテ方式：患者一覧 → 個別フォルダ =====
  async renderKarteList(onLoad, onDelete, filterQuery) {
    const history = await this.getAll();
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
  async renderKarteDetail(patientId, onLoad, onDelete) {
    const listView = document.getElementById('karteListView');
    const detailView = document.getElementById('karteDetailView');
    const infoDiv = document.getElementById('karteDetailPatientInfo');
    const listDiv = document.getElementById('karteDetailList');
    if (!listView || !detailView) return;

    const entries = (await this.getHistoryByPatient(patientId)).sort((a, b) => new Date(b.date) - new Date(a.date));
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
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('この検査記録を削除しますか？')) {
          if (onDelete) await onDelete(btn.dataset.id);
          // 再描画
          await this.renderKarteDetail(patientId, onLoad, onDelete);
        }
      });
    });
  }
};
