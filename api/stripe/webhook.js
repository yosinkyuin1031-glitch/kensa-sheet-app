/**
 * カラダマップ Stripe Webhook（ログ専用フォワーダー）
 *
 * メインのWebhook処理は clinic-saas-lp.vercel.app/api/webhooks/stripe で行われます。
 * このエンドポイントは署名検証とログ記録のみを行います。
 * アカウント作成・DB登録・メール送信はすべて clinic-saas-lp 側で処理されます。
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Raw body を読み取る（署名検証用）
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
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

  // Stripe署名を検証
  let event;
  try {
    const rawBody = req.body ? req.body : await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook署名検証エラー:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // ログだけ残して200を返す
  console.log(`[kensa-sheet-app] Webhookイベント受信: ${event.type} (${event.id})`);

  return res.status(200).json({ received: true });
}

module.exports = handler;

// Vercel: bodyParser を無効化（Stripe署名検証に raw body が必要）
module.exports.config = {
  api: {
    bodyParser: false
  }
};
