const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Fetch all clinics
    const { data: clinics, error: clinicError } = await supabase
      .from('clinics')
      .select('*')
      .order('created_at', { ascending: false });

    if (clinicError) {
      console.error('Clinics fetch error:', clinicError);
      return res.status(500).json({ error: 'クリニック取得失敗: ' + clinicError.message });
    }

    // Fetch all clinic_members
    const { data: members, error: memberError } = await supabase
      .from('clinic_members')
      .select('*');

    if (memberError) {
      console.error('Members fetch error:', memberError);
      // Non-fatal: return clinics without members
    }

    // Attach members to clinics
    const clinicsWithMembers = (clinics || []).map(clinic => {
      const clinicMembers = (members || []).filter(m => m.clinic_id === clinic.id);
      return { ...clinic, members: clinicMembers };
    });

    return res.status(200).json({
      success: true,
      clinics: clinicsWithMembers,
      total: clinicsWithMembers.length
    });

  } catch (e) {
    console.error('Unexpected error:', e);
    return res.status(500).json({ error: 'サーバーエラー: ' + e.message });
  }
};
