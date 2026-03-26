const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // CORS対応
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { stripeCustomerId } = req.body;

    if (!stripeCustomerId) {
      return res.status(400).json({
        error: 'stripeCustomerId は必須です'
      });
    }

    // Billing Portal Session 作成
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${req.headers.origin || 'https://kensa-sheet.vercel.app'}/`
    });

    return res.status(200).json({
      url: session.url
    });
  } catch (err) {
    console.error('Portal Session作成エラー:', err);
    return res.status(500).json({
      error: 'Portal Session の作成に失敗しました',
      detail: err.message
    });
  }
};
