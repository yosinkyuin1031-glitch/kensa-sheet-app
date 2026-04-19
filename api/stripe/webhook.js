const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Supabase Admin Client（Service Role Key で RLS バイパス）
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Resend（メール送信）
const resend = new Resend(process.env.RESEND_API_KEY);

// 管理者メールアドレス（決済通知の送り先）
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'oguchiseitai@gmail.com';
const LOGIN_URL = 'https://kensa-sheet-app.vercel.app';

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

// お客さんへウェルカムメール送信
async function sendWelcomeEmail({ email, clinicName, password }) {
  const { error } = await resend.emails.send({
    from: 'カラダマップ <noreply@resend.dev>',
    to: email,
    subject: '【カラダマップ】アカウント発行のお知らせ',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a2e;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;color:#2563eb;margin:0;">カラダマップ</h1>
          <p style="font-size:13px;color:#64748b;margin-top:4px;">3分で、体の"いま"を見える化</p>
        </div>

        <p style="font-size:15px;line-height:1.8;">
          ${clinicName} 様<br><br>
          この度はカラダマップにお申し込みいただき、ありがとうございます。<br>
          アカウントの発行が完了しましたので、以下の情報でログインしてください。
        </p>

        <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:24px;margin:24px 0;">
          <h3 style="font-size:16px;color:#0369a1;margin:0 0 16px;">ログイン情���</h3>
          <table style="width:100%;font-size:14px;line-height:2;">
            <tr><td style="color:#64748b;width:120px;">ログインURL</td><td><a href="${LOGIN_URL}" style="color:#2563eb;">${LOGIN_URL}</a></td></tr>
            <tr><td style="color:#64748b;">メールアドレス</td><td><strong>${email}</strong></td></tr>
            <tr><td style="color:#64748b;">パスワード</td><td><strong>${password}</strong></td></tr>
          </table>
        </div>

        <p style="font-size:13px;color:#dc2626;line-height:1.8;">
          ※ パスワードはログイン後に変更することをおすすめします。<br>
          ※ このメールに記載されたパスワードは大切に保管してください。
        </p>

        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0;">
          <h4 style="font-size:14px;color:#1e40af;margin:0 0 8px;">ご利用開始までの流れ</h4>
          <ol style="font-size:14px;color:#475569;line-height:2;margin:0;padding-left:20px;">
            <li>上記URLにアクセス</li>
            <li>メールアドレスとパスワードでログイン</li>
            <li>患者情報を入力して検査開始</li>
          </ol>
        </div>

        <p style="font-size:14px;line-height:1.8;">
          ご不明な点がございましたら、お気軽にご連絡ください。<br>
          <a href="https://lin.ee/TC4uukz" style="color:#06c755;font-weight:600;">LINEでのお問い合わせはこちら</a>
        </p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
        <p style="font-size:12px;color:#94a3b8;text-align:center;">
          大口神経整体院 / カラダマップ<br>
          このメールはカラダマップのお申し込み時に自動送信されています。
        </p>
      </div>
    `
  });

  if (error) {
    console.error('ウェルカムメール送信エラー:', error);
    throw error;
  }
  console.log(`ウェルカムメール送信完了: ${email}`);
}

// 管理者（大口さん）への決済通知メール
async function sendAdminNotification({ clinicName, email, plan, amount }) {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const { error } = await resend.emails.send({
    from: 'カラダマップ <noreply@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `【決済通知】${clinicName} が申し込みました`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a2e;">
        <h2 style="font-size:20px;color:#2563eb;margin:0 0 24px;">新規申し込みがありました</h2>

        <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:24px;">
          <table style="width:100%;font-size:15px;line-height:2.2;">
            <tr><td style="color:#64748b;width:130px;">院名</td><td><strong>${clinicName}</strong></td></tr>
            <tr><td style="color:#64748b;">メールアドレス</td><td>${email}</td></tr>
            <tr><td style="color:#64748b;">プラン</td><td>${plan}</td></tr>
            <tr><td style="color:#64748b;">月額</td><td>${amount ? amount.toLocaleString() + '円' : '3,980円'}</td></tr>
            <tr><td style="color:#64748b;">申し込み日時</td><td>${now}</td></tr>
          </table>
        </div>

        <p style="font-size:14px;color:#475569;margin-top:20px;line-height:1.8;">
          アカウントは自動発行済みです。ログイン情報はお客さんにメールで送信しています。
        </p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:12px;color:#94a3b8;">カラダマップ 自動通知</p>
      </div>
    `
  });

  if (error) {
    console.error('管理者通知メール送信エラー:', error);
    // 管理者通知は失敗してもアカウント発行は続行
  } else {
    console.log(`管理者通知メール送信完了: ${ADMIN_EMAIL}`);
  }
}

// checkout.session.completed: アカウント自動発行 + メール送信
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
  let isNewUser = true;
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { clinic_name: clinic_name, role: 'owner' }
  });

  if (userError) {
    if (userError.message && userError.message.includes('already')) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);
      if (!existingUser) throw userError;
      userId = existingUser.id;
      isNewUser = false;
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

  // 4. お客さんへウェルカムメール送信
  if (isNewUser) {
    await sendWelcomeEmail({ email, clinicName: clinic_name, password });
  }

  // 5. 管理者（大口さん）へ決済通知メール
  await sendAdminNotification({
    clinicName: clinic_name,
    email: email,
    plan: plan,
    amount: session.amount_total
  });

  console.log(`アカウント発行完了: ${clinic_name} (${email}), plan=${plan}, clinic_id=${clinicId}`);
  return { userId, clinicId, plan };
}

// customer.subscription.deleted: サブスク解約処理
async function handleSubscriptionDeleted(subscription) {
  const stripeCustomerId = subscription.customer;

  const { data: clinicData, error: clinicError } = await supabaseAdmin
    .from('clinics')
    .update({ plan: 'free' })
    .eq('stripe_customer_id', stripeCustomerId)
    .select('id, name, email')
    .single();

  if (clinicError) {
    console.error('clinic更新エラー:', clinicError);
    throw clinicError;
  }

  if (!clinicData) {
    console.warn('対象clinicが見つかりません: customer=', stripeCustomerId);
    return;
  }

  const { error: memberError } = await supabaseAdmin
    .from('clinic_members')
    .update({ is_active: false })
    .eq('clinic_id', clinicData.id);

  if (memberError) {
    console.error('clinic_members更新エラー:', memberError);
    throw memberError;
  }

  // 解約通知を管理者に送信
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  await resend.emails.send({
    from: 'カラダマップ <noreply@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `【解約通知】${clinicData.name || '不明'} が解約しました`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#dc2626;">解約がありました</h2>
        <p>院名: <strong>${clinicData.name || '不明'}</strong></p>
        <p>メール: ${clinicData.email || '不明'}</p>
        <p>日時: ${now}</p>
        <p style="color:#64748b;font-size:13px;">アカウントは無効化済みです。</p>
      </div>
    `
  }).catch(err => console.error('解約通知メール送信エラー:', err));

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
