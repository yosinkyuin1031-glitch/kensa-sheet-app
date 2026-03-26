const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clinicName, email, password, plan } = req.body || {};

  if (!clinicName || !email || !password) {
    return res.status(400).json({ error: '院名・メール・パスワードは必須です' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'パスワードは8文字以上にしてください' });
  }

  const validPlans = ['free', 'standard', 'advanced'];
  const selectedPlan = validPlans.includes(plan) ? plan : 'standard';

  // Service Role client (RLS bypass)
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://vzkfkazjylrkspqrnhnx.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: clinicName }
    });

    if (authError) {
      console.error('Auth create error:', authError);
      return res.status(400).json({ error: 'ユーザー作成失敗: ' + authError.message });
    }

    const userId = authData.user.id;

    // 2. Insert into clinics
    const clinicCode = 'KS' + Date.now().toString(36).toUpperCase();
    const planLimits = {
      free: { max_staff: 5, max_exams_per_month: 100 },
      standard: { max_staff: 10, max_exams_per_month: 500 },
      advanced: { max_staff: 30, max_exams_per_month: 2000 }
    };
    const limits = planLimits[selectedPlan] || planLimits.standard;

    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicName,
        code: clinicCode,
        owner_name: clinicName,
        email: email,
        plan: selectedPlan,
        status: 'active',
        max_staff: limits.max_staff,
        max_exams_per_month: limits.max_exams_per_month
      })
      .select()
      .single();

    if (clinicError) {
      console.error('Clinic insert error:', clinicError);
      // Cleanup: delete the auth user
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ error: 'クリニック作成失敗: ' + clinicError.message });
    }

    // 3. Insert into clinic_members
    const { error: memberError } = await supabase
      .from('clinic_members')
      .insert({
        clinic_id: clinic.id,
        user_id: userId,
        role: 'owner',
        display_name: clinicName,
        is_active: true
      });

    if (memberError) {
      console.error('Member insert error:', memberError);
      // Non-fatal, but log it
    }

    return res.status(200).json({
      success: true,
      clinic_id: clinic.id,
      user_id: userId,
      clinic_code: clinicCode
    });

  } catch (e) {
    console.error('Unexpected error:', e);
    return res.status(500).json({ error: 'サーバーエラー: ' + e.message });
  }
};
