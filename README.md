# Annereaux – Mini panier Stripe (Vercel)

## Variables d'environnement à ajouter sur Vercel
- `STRIPE_SECRET_KEY` = votre clé secrète (`sk_test_...` pour tester / `sk_live_...` en prod)
- *(optionnel)* `SUCCESS_URL`, `CANCEL_URL` pour personnaliser les redirections

## Déploiement
1. Importez ce repo sur Vercel (ou uploadez le ZIP).
2. Allez dans **Settings → Environment Variables** et ajoutez `STRIPE_SECRET_KEY`.
3. Redeploy.
4. Ouvrez l’URL publique, choisissez des quantités, cliquez **Payer**.

Si vous avez "Impossible de créer la session Stripe", vérifiez :
- `STRIPE_SECRET_KEY` est bien définie (pas `pk_...` !)
- La fonction `/api/create-checkout-session` s’exécute en Node 18 (géré par `vercel.json`)
- Les `price_...` dans `index.html` sont corrects
