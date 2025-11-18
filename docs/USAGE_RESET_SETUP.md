# Monthly Usage Reset Setup Guide

This guide explains how to set up automated monthly usage resets for your MiroMiro application.

## How It Works

The usage reset system works as follows:

### For Paying Users (Starter/Pro)
- Resets are **billing cycle-based**
- When a user's `current_period_end` date passes, their usage counters are reset
- Billing periods are automatically updated via Stripe webhooks on each payment
- Counters reset: `asset_extractions`, `contrast_checks`, `lottie_extractions`, `ai_generations`

### For Free Users
- Resets happen on the **1st of every month** (calendar month)
- Same counters are reset as paid users

## Setup Instructions

### 1. Generate a Secure CRON_SECRET

First, generate a secure random secret for your cron job authentication:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update your `.env` file:

```env
CRON_SECRET="paste-your-generated-secret-here"
```

**Important**: Also add this to your production environment variables (Vercel, Netlify, etc.)

### 2. Choose a Cron Solution

You have multiple options for scheduling the cron job. Choose one that fits your deployment:

---

## Option A: GitHub Actions (Recommended - Free)

Create `.github/workflows/reset-usage.yml`:

```yaml
name: Reset Monthly Usage

on:
  schedule:
    # Run daily at 2:00 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  reset-usage:
    runs-on: ubuntu-latest
    steps:
      - name: Call Usage Reset Endpoint
        run: |
          curl -X POST https://miromiro.app/api/cron/reset-usage \
            -H "Content-Type: application/json" \
            -d '{"secret": "${{ secrets.CRON_SECRET }}"}'

```

**Setup:**
1. Create the file above in your repository
2. Go to GitHub Settings → Secrets and Variables → Actions
3. Add a new secret named `CRON_SECRET` with your generated secret
4. Commit and push the workflow file

**Note**: GitHub Actions cron jobs run daily and check if resets are needed.

---

## Option B: Vercel Cron (If using Vercel)

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-usage",
      "schedule": "0 2 * * *"
    }
  ]
}
```

For Vercel Cron, you'll need to modify the endpoint to accept the secret from environment:

Update `server/api/cron/reset-usage.post.ts` to accept secret from headers:

```typescript
const cronSecret = body?.secret || event.node.req.headers['x-cron-secret'] || config.cronSecret
```

Then in Vercel dashboard:
1. Add `CRON_SECRET` environment variable
2. Deploy your app
3. Vercel will automatically run the cron job

**Limitations**: Vercel Cron is only available on Pro plans.

---

## Option C: Supabase pg_cron

If you're using Supabase, you can use their built-in cron extension:

1. Enable the `pg_cron` extension in Supabase Dashboard → Database → Extensions

2. Create a SQL function to call your API:

```sql
-- Create the cron job
SELECT cron.schedule(
  'reset-monthly-usage',
  '0 2 * * *', -- Run at 2 AM UTC daily
  $$
  SELECT
    net.http_post(
      url := 'https://miromiro.app/api/cron/reset-usage',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := concat('{"secret": "', current_setting('app.cron_secret'), '"}')::jsonb
    ) as request_id;
  $$
);
```

3. Set the secret in Supabase:

```sql
ALTER DATABASE postgres SET app.cron_secret = 'your-cron-secret-here';
```

**Note**: Make sure to restart your database after setting the secret.

---

## Option D: External Cron Service

You can use any external cron service like:
- [cron-job.org](https://cron-job.org) (Free)
- [EasyCron](https://www.easycron.com)
- [Cronitor](https://cronitor.io)

Configuration:
- **URL**: `https://miromiro.app/api/cron/reset-usage`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**: `{"secret": "your-cron-secret"}`
- **Schedule**: Daily at 2:00 AM (or your preferred time)

---

## 3. Configure Stripe Webhooks

Make sure your Stripe webhook is listening to these events:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add/Edit your webhook endpoint: `https://miromiro.app/api/stripe/webhook`
3. Ensure these events are enabled:
   - `checkout.session.completed` ✅ (already configured)
   - `customer.subscription.updated` ✅ (already configured)
   - `customer.subscription.deleted` ✅ (already configured)
   - `invoice.payment_succeeded` ⭐ **NEW - ADD THIS**

The `invoice.payment_succeeded` event is crucial as it fires on subscription renewals and updates the billing period.

---

## 4. Testing

### Manual Test
You can manually trigger the reset endpoint to test:

```bash
curl -X POST https://miromiro.app/api/cron/reset-usage \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-cron-secret"}'
```

### Expected Response

```json
{
  "success": true,
  "message": "Usage reset completed",
  "results": {
    "paidUsersReset": 5,
    "freeUsersReset": 120,
    "errors": []
  },
  "timestamp": "2025-11-18T12:00:00.000Z"
}
```

### Check Logs
Monitor your server logs to see the reset activity:
- `🔄 Starting monthly usage reset...`
- `💳 Paid user email@example.com: billing period ended`
- `🆓 Free user email@example.com: monthly reset (1st of month)`
- `✅ Reset counters for email@example.com`

---

## Important Notes

### Security
- **Never commit** your `CRON_SECRET` to version control
- Use environment variables for all secrets
- The endpoint will return 401 if the secret is invalid

### Timing
- The cron job runs **daily** and checks if resets are needed
- For paid users: Reset only when `current_period_end` has passed
- For free users: Reset only on the 1st of the month
- This means users won't see immediate resets - they happen when conditions are met

### Monitoring
Consider setting up monitoring/alerts:
- Check if the cron job runs successfully
- Monitor for errors in the response
- Set up notifications if resets fail

### First-Time Setup for Existing Users

For users who already have a premium subscription but don't have `current_period_start` and `current_period_end` set:

1. They will be automatically updated on their next invoice payment
2. OR you can manually fetch and update via Stripe API:

```typescript
// One-time script to backfill billing periods
const stripe = require('stripe')('your-stripe-secret-key');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('your-supabase-url', 'your-service-role-key');

async function backfillBillingPeriods() {
  const { data: users } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('premium_status', true)
    .is('current_period_start', null);

  for (const user of users) {
    if (user.stripe_subscription_id) {
      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

      await supabase
        .from('user_profiles')
        .update({
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', user.id);

      console.log(`Updated ${user.email}`);
    }
  }
}

backfillBillingPeriods();
```

---

## Troubleshooting

### Issue: Users not being reset
- Check if `current_period_end` is properly set for paid users
- Verify Stripe webhook is receiving `invoice.payment_succeeded` events
- Check server logs for errors

### Issue: 401 Unauthorized
- Verify `CRON_SECRET` matches in both `.env` and your cron service
- Ensure environment variables are properly set in production

### Issue: Cron job not running
- For GitHub Actions: Check Actions tab for workflow runs
- For Vercel: Check Vercel logs
- For Supabase: Query `cron.job_run_details` table

---

## Next Steps

1. ✅ Generate and set your `CRON_SECRET`
2. ✅ Choose and configure a cron solution
3. ✅ Add `invoice.payment_succeeded` to Stripe webhooks
4. ✅ Test the endpoint manually
5. ✅ Monitor the first automated run
6. ✅ (Optional) Backfill existing users' billing periods

For questions or issues, check the server logs or contact support.
