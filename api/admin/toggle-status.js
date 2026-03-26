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

  const { clinicId, active } = req.body || {};

  if (!clinicId || typeof active !== 'boolean') {
    return res.status(400).json({ error: 'clinicId と active(boolean) は必須です' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://vzkfkazjylrkspqrnhnx.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const newStatus = active ? 'active' : 'suspended';

    // 1. Update clinics.status
    const { error: clinicError } = await supabase
      .from('clinics')
      .update({ status: newStatus })
      .eq('id', clinicId);

    if (clinicError) {
      console.error('Clinic status update error:', clinicError);
      // statusカラムがない場合はスキップ
    }

    // 2. Update clinic_members.is_active
    const { error: memberError } = await supabase
      .from('clinic_members')
      .update({ is_active: active })
      .eq('clinic_id', clinicId);

    if (memberError) {
      console.error('Member status update error:', memberError);
      return res.status(500).json({ error: 'メンバーステータス更新失敗: ' + memberError.message });
    }

    return res.status(200).json({
      success: true,
      clinicId,
      status: newStatus,
      is_active: active
    });

  } catch (e) {
    console.error('Unexpected error:', e);
    return res.status(500).json({ error: 'サーバーエラー: ' + e.message });
  }
};
