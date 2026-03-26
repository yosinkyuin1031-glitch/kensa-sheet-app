const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Supabase Admin Client（Service Role Key で RLS バイパス）
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ランダムパスワード生成（16文字）
function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Raw body を読み取る（署名検証用）
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// checkout.session.completed: アカウント自動発行
async function handleCheckoutCompleted(session) {
  const { clinic_name, email, plan } = session.metadata || {};

  if (!clinic_name || !email || !plan) {
    console.error('metadata不足:', session.metadata);
    throw new Error('必須metadata（clinic_name, email, plan）が不足しています');
  }

  const stripeCustomerId = session.customer;
  const password = generatePassword();

  // 1. Supabase Auth でユーザー作成
  let userId;
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // メール確認済みとして作成
    user_metadata: { clinic_name: clinic_name, role: 'owner' }
  });

  if (userError) {
    // 既存ユーザーの場合はIDを取得
    if (userError.message && userError.message.includes('already')) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);
      if (!existingUser) throw userError;
      userId = existingUser.id;
      console.log('既存ユーザーを使用:', email);
    } else {
      console.error('ユーザー作成エラー:', userError);
      throw userError;
    }
  } else {
    userId = userData.user.id;
  }

  // 2. clinics テーブルにレコード作成
  const { data: clinicData, error: clinicError } = await supabaseAdmin
    .from('clinics')
    .insert({
      name: clinic_name,
      plan: plan,
      stripe_customer_id: stripeCustomerId,
      email: email,
      owner_id: userId,
      is_active: true
    })
    .select('id')
    .single();

  if (clinicError) {
    console.error('clinic作成エラー:', clinicError);
    throw clinicError;
  }

  const clinicId = clinicData.id;

  // 3. clinic_members テーブルに owner 紐付け
  const { error: memberError } = await supabaseAdmin
    .from('clinic_members')
    .insert({
      clinic_id: clinicId,
      user_id: userId,
      role: 'owner',
      is_active: true
    });

  if (memberError) {
    console.error('clinic_member作成エラー:', memberError);
    throw memberError;
  }

  // 4. 招待メール送信（Supabase の invite 機能）
  const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { clinic_name: clinic_name, clinic_id: clinicId }
  });

  if (inviteError) {
    // invite失敗はログのみ（ユーザーは既に作成済み）
    console.warn('招待メール送信に失敗（ユーザーは作成済み）:', inviteError.message);
  }

  console.log(`アカウント発行完了: ${clinic_name} (${email}), plan=${plan}, clinic_id=${clinicId}`);
  return { userId, clinicId, plan };
}

// customer.subscription.deleted: サブスク解約処理
async function handleSubscriptionDeleted(subscription) {
  const stripeCustomerId = subscription.customer;

  // clinics テーブルの plan を free に変更
  const { data: clinicData, error: clinicError } = await supabaseAdmin
    .from('clinics')
    .update({ plan: 'free' })
    .eq('stripe_customer_id', stripeCustomerId)
    .select('id')
    .single();

  if (clinicError) {
    console.error('clinic更新エラー:', clinicError);
    throw clinicError;
  }

  if (!clinicData) {
    console.warn('対象clinicが見つかりません: customer=', stripeCustomerId);
    return;
  }

  // clinic_members の is_active を false に
  const { error: memberError } = await supabaseAdmin
    .from('clinic_members')
    .update({ is_active: false })
    .eq('clinic_id', clinicData.id);

  if (memberError) {
    console.error('clinic_members更新エラー:', memberError);
    throw memberError;
  }

  console.log(`サブスク解約処理完了: clinic_id=${clinicData.id}, customer=${stripeCustomerId}`);
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'stripe-signature ヘッダーがありません' });
  }

  let event;
  try {
    // vercel.json で bodyParser: false にしているため req.body は raw Buffer
    const rawBody = req.body ? req.body : await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook署名検証エラー:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`Webhookイベント受信: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`未処理のイベント: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(`イベント処理エラー (${event.type}):`, err);
    return res.status(500).json({ error: 'Webhook処理中にエラーが発生しました' });
  }
}

module.exports = handler;

// Vercel: bodyParser を無効化（Stripe署名検証に raw body が必要）
module.exports.config = {
  api: {
    bodyParser: false
  }
};
