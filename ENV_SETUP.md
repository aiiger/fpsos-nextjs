# Required Environment Variables

Add these to your `.env.local` file (for local development) and to Vercel environment variables (for production):

```bash
# Admin Authentication (REQUIRED - no fallback)
ADMIN_PASSWORD=your-secure-password-here

# PayPal Webhook Security (REQUIRED for production)
PAYPAL_WEBHOOK_ID=your-webhook-id-from-paypal-dashboard

# Optional: Skip webhook verification in development (NOT for production)
PAYPAL_WEBHOOK_SKIP_VERIFY=true  # Only for local testing
```

## How to Get PAYPAL_WEBHOOK_ID

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/)
2. Navigate to **Webhooks** section
3. Find your webhook URL or create a new one
4. Copy the **Webhook ID** (shown in the webhook details)
5. Add it to your environment variables

## Setting Environment Variables in Vercel

```bash
# Via CLI
vercel env add ADMIN_PASSWORD production
vercel env add PAYPAL_WEBHOOK_ID production

# Or via Vercel Dashboard:
# Project Settings → Environment Variables → Add
```
