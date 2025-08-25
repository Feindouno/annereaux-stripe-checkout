// api/create-checkout-session.js
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { items } = body;

    const line_items = (items || [])
      .filter(i => i && i.price && Number(i.qty) > 0)
      .map(i => ({ price: i.price, quantity: Number(i.qty) }));

    if (!line_items.length) return res.status(400).json({ error: 'Aucun article sélectionné.' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      allow_promotion_codes: true,
      success_url: process.env.SUCCESS_URL || 'https://example.com/success',
      cancel_url: process.env.CANCEL_URL || 'https://example.com/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur Stripe.' });
  }
}
