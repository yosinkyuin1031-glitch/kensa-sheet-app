// ===== Supabase クライアント初期化・認証管理 =====

const SupabaseAuth = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  client: null,
  currentUser: null,
  currentClinicId: null,

  // 設定を読み込み（Vercel環境変数 → フォールバック）
  async _loadConfig() {
    try {
      const resp = await fetch('/api/config');
      if (resp.ok) {
        const cfg = await resp.json();
        if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
          this.SUPABASE_URL = cfg.supabaseUrl;
          this.SUPABASE_ANON_KEY = cfg.supabaseAnonKey;
          return;
        }
      }
    } catch (e) {
      // API取得失敗時はフォールバック
    }
    // フォールバック（ローカル開発・API未設定時）
    this.SUPABASE_URL = 'https://vzkfkazjylrkspqrnhnx.supabase.co';
    this.SUPABASE_ANON_KEY = 'sb_publishable_H1Ch2D2XIuSQMzNL-ns8zg_gAqrx7wL';
  },

  // Supabaseクライアント初期化
  async init() {
    try {
      await this._loadConfig();
      this.client = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
      return this.client;
    } catch (e) {
      console.error('Supabase初期化エラー:', e);
      const errEl = document.getElementById('loginError');
      if (errEl) {
        errEl.textContent = 'システム読み込みエラー: ' + e.message;
        errEl.style.display = 'block';
      }
      return null;
    }
  },

  // セッション確認
  async getSession() {
    const { data: { session }, error } = await this.client.auth.getSession();
    if (error) {
      console.error('セッション取得エラー:', error);
      return null;
    }
    if (session) {
      this.currentUser = session.user;
      await this._loadClinicId();
    }
    return session;
  },

  // ログイン
  async login(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message === 'Invalid login credentials'
        ? 'メールアドレスまたはパスワードが正しくありません'
        : error.message);
    }
    this.currentUser = data.user;
    await this._loadClinicId();
    return data;
  },

  // 新規登録
  async signup(email, password, clinicName, displayName) {
    // 1. ユーザー作成
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('このメールアドレスは既に登録されています');
      }
      throw new Error(error.message);
    }

    // メール確認が必要な場合
    if (!data.session) {
      throw new Error('確認メールを送信しました。メール内のリンクをクリックしてから、ログインしてください。');
    }

    this.currentUser = data.user;

    // 2. クリニック作成
    const clinicCode = 'KS' + Date.now().toString(36).toUpperCase();
    const { data: clinic, error: clinicError } = await this.client
      .from('clinics')
      .insert({
        name: clinicName || displayName + 'の院',
        code: clinicCode,
        owner_name: displayName,
        email: email,
        plan: 'free',
        max_staff: 5,
        max_exams_per_month: 100
      })
      .select()
      .single();

    if (clinicError) {
      console.error('クリニック作成エラー:', clinicError);
      throw new Error('院の登録に失敗しました。管理者にお問い合わせください。');
    }

    // 3. メンバー登録
    const { error: memberError } = await this.client
      .from('clinic_members')
      .insert({
        clinic_id: clinic.id,
        user_id: data.user.id,
        role: 'owner',
        display_name: displayName,
        is_active: true
      });

    if (memberError) {
      console.error('メンバー登録エラー:', memberError);
    }

    this.currentClinicId = clinic.id;
    return data;
  },

  // パスワードリセット
  async resetPassword(email) {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/',
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  // ログアウト
  async logout() {
    await this.client.auth.signOut();
    this.currentUser = null;
    this.currentClinicId = null;
  },

  // clinic_id を取得
  async _loadClinicId() {
    if (!this.currentUser) return;

    const { data, error } = await this.client
      .from('clinic_members')
      .select('clinic_id')
      .eq('user_id', this.currentUser.id)
      .eq('is_active', true)
      .limit(1)
      .single();

    if (!error && data) {
      this.currentClinicId = data.clinic_id;
    }
  },

  getClinicId() {
    return this.currentClinicId;
  },

  getUserId() {
    return this.currentUser ? this.currentUser.id : null;
  },

  getDisplayName() {
    return this.currentUser ? (this.currentUser.user_metadata?.display_name || this.currentUser.email) : '';
  }
};
