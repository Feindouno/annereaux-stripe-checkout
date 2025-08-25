// api/create-checkout-session.js
const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.json({ error: 'Method not allowed' });
    return;
  }

  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      res.statusCode = 500;
      res.json({ error: 'STRIPE_SECRET_KEY manquante dans les variables d’environnement.' });
      return;
    }

    const stripe = new Stripe(secret);

    let body = req.body;
    if (typeof body !== 'object') {
      try { body = JSON.parse(req.body || '{}'); } catch (e) { body = {}; }
    }

    const items = Array.isArray(body.items) ? body.items : [];
    const line_items = items
      .filter(i => i && i.price && Number(i.qty) > 0)
      .map(i => ({ price: i.price, quantity: Number(i.qty) }));

    if (!line_items.length) {
      res.statusCode = 400;
      res.json({ error: 'Aucun article sélectionné.' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      allow_promotion_codes: true,
      success_url: process.env.SUCCESS_URL || 'https://example.com/success',
      cancel_url: process.env.CANCEL_URL || 'https://example.com/cancel',
    });

    res.statusCode = 200;
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.statusCode = 500;
    res.json({ error: 'Erreur serveur Stripe.' });
  }
};
