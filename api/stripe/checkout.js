const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// プラン別の料金設定（円）
const PLAN_PRICES = {
  standard: {
    amount: 3980,
    name: 'カラダマップ スタンダードプラン'
  },
  advanced: {
    amount: 5980,
    name: 'カラダマップ アドバンスドプラン'
  }
};

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
    const { clinicName, email, plan } = req.body;

    // バリデーション
    if (!clinicName || !email || !plan) {
      return res.status(400).json({
        error: 'clinicName, email, plan は必須です'
      });
    }

    const planConfig = PLAN_PRICES[plan];
    if (!planConfig) {
      return res.status(400).json({
        error: `無効なプラン: ${plan}（standard または advanced を指定してください）`
      });
    }

    // Stripe Checkout Session 作成
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          clinic_name: clinicName,
          email: email,
          plan: plan
        }
      },
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: planConfig.name,
              description: `${clinicName} - 14日間無料トライアル付き`
            },
            unit_amount: planConfig.amount,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        clinic_name: clinicName,
        email: email,
        plan: plan
      },
      success_url: `${req.headers.origin || 'https://kensa-sheet-app.vercel.app'}/lp/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://kensa-sheet-app.vercel.app'}/lp/`
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url
    });
  } catch (err) {
    console.error('Checkout Session作成エラー:', err);
    return res.status(500).json({
      error: 'Checkout Session の作成に失敗しました',
      detail: err.message
    });
  }
};
