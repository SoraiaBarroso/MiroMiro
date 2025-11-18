# Quick Start: Monthly Usage Reset

This guide will help you get the monthly usage reset system up and running quickly.

## What Was Implemented

1. **Automated Usage Reset System**
   - Resets usage counters monthly for all users
   - Paid users: Reset based on billing cycle (when `current_period_end` passes)
   - Free users: Reset on 1st of each month

2. **Stripe Webhook Updates**
   - Now handles `invoice.payment_succeeded` to update billing periods on renewal
   - Properly clears billing periods when subscriptions are deleted

3. **Security**
   - Cron endpoint protected with `CRON_SECRET`
   - Already generated and saved in `.env`

## Immediate Next Steps

### 1. Install Dependencies

```bash
pnpm install
```

This will install:
- `tsx` - To run TypeScript scripts
- `@supabase/supabase-js` - For the backfill script
- `stripe` - For Stripe API interactions

### 2. Fix Your Existing User Data

Your user (sorixx222@gmail.com) currently has `current_period_start: null` and `current_period_end: null`. Run this script to fix it:

```bash
pnpm backfill-billing
```

This will:
- Find all premium users without billing periods
- Fetch their subscription data from Stripe
- Update the database with correct billing periods

**Expected output:**
```
🔍 Fetching premium users without billing periods...

📊 Found 1 premium users without billing periods:

Processing: sorixx222@gmail.com (starter)
  📡 Fetching subscription from Stripe...
  📅 Period: 2025-11-12T00:00:00.000Z to 2025-12-12T00:00:00.000Z
  ✅ Successfully updated sorixx222@gmail.com
```

### 3. Configure Stripe Webhook

Go to your Stripe Dashboard:

1. Navigate to: **Developers → Webhooks**
2. Click on your existing webhook (`https://miromiro.app/api/stripe/webhook`)
3. Click **"Add events"** or **"Select events"**
4. Search for and enable: **`invoice.payment_succeeded`**
5. Click **"Add events"** to save

This event fires when subscriptions renew and will update billing periods automatically.

### 4. Set Up GitHub Actions Cron Job

The GitHub Actions workflow file is already created at `.github/workflows/reset-usage.yml`.

To activate it:

1. **Add the secret to GitHub:**
   - Go to your repository on GitHub
   - Navigate to: **Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Name: `CRON_SECRET`
   - Value: Copy from your `.env` file (the value after `CRON_SECRET=`)
   - Click **"Add secret"**

2. **Push the workflow file:**
   ```bash
   git add .github/workflows/reset-usage.yml
   git commit -m "Add monthly usage reset cron job"
   git push
   ```

3. **Verify it's working:**
   - Go to **Actions** tab in your GitHub repository
   - You should see "Reset Monthly Usage" workflow
   - Click **"Run workflow"** to manually test it (optional)

### 5. Test the Reset Endpoint

You can manually test the reset endpoint:

```bash
curl -X POST https://miromiro.app/api/cron/reset-usage \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_CRON_SECRET_HERE"}'
```

Replace `YOUR_CRON_SECRET_HERE` with the value from your `.env` file.

**Expected response:**
```json
{
  "success": true,
  "message": "Usage reset completed",
  "results": {
    "paidUsersReset": 0,
    "freeUsersReset": 0,
    "errors": []
  },
  "timestamp": "2025-11-18T..."
}
```

**Note:** If today is not the 1st of the month and no paid users' billing periods have ended, both counters will be 0. This is normal!

## How It Works

### For Your User (sorixx222@gmail.com)

After running the backfill script, your user will have:
- `current_period_start`: Your subscription start date
- `current_period_end`: Your subscription end date

When the cron job runs daily:
1. It checks if `current_period_end` has passed
2. If YES: Resets `asset_extractions`, `contrast_checks`, `lottie_extractions`, `ai_generations` to 0
3. Stripe's `invoice.payment_succeeded` webhook automatically updates the billing period

### Schedule

The GitHub Actions workflow runs **daily at 2:00 AM UTC**. You can change this in `.github/workflows/reset-usage.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Minute Hour Day Month DayOfWeek
```

## Monitoring

### Check if it's working:

1. **GitHub Actions logs:**
   - Go to **Actions** tab
   - Click on the latest "Reset Monthly Usage" run
   - Check the logs

2. **Server logs:**
   - Check your Vercel/hosting logs for:
     - `🔄 Starting monthly usage reset...`
     - `✅ Usage reset completed`

3. **Database:**
   - Check `user_profiles` table
   - Verify usage counters are reset when expected

## Troubleshooting

### User still has null billing periods after backfill
- Make sure you have a valid `STRIPE_SECRET_KEY` in `.env`
- Verify the user has a `stripe_subscription_id` in the database
- Check if the subscription is active in Stripe Dashboard

### GitHub Actions not running
- Verify you added `CRON_SECRET` to GitHub repository secrets
- Check the workflow file is in `.github/workflows/` folder
- Make sure the workflow file is pushed to the main branch

### Reset endpoint returns 401
- Double-check the `CRON_SECRET` matches in both `.env` and GitHub secrets
- Ensure the secret is deployed to production (add it in Vercel/Netlify dashboard)

## Summary of Files Created/Modified

### New Files:
- ✅ `server/api/cron/reset-usage.post.ts` - Reset endpoint
- ✅ `.github/workflows/reset-usage.yml` - GitHub Actions cron job
- ✅ `scripts/backfill-billing-periods.ts` - One-time backfill script
- ✅ `docs/USAGE_RESET_SETUP.md` - Detailed setup guide
- ✅ `docs/QUICK_START_USAGE_RESET.md` - This file

### Modified Files:
- ✅ `server/api/stripe/webhook.post.ts` - Added `invoice.payment_succeeded` handler
- ✅ `.env` - Added `CRON_SECRET`
- ✅ `nuxt.config.ts` - Added `cronSecret` to runtimeConfig
- ✅ `package.json` - Added scripts and dependencies

## Next Steps

1. ✅ Run `pnpm install`
2. ✅ Run `pnpm backfill-billing` to fix existing user data
3. ✅ Add `invoice.payment_succeeded` to Stripe webhook
4. ✅ Add `CRON_SECRET` to GitHub repository secrets
5. ✅ Push `.github/workflows/reset-usage.yml` to GitHub
6. ✅ Test the endpoint manually (optional)
7. ✅ Monitor the first automated run

For more details, see `docs/USAGE_RESET_SETUP.md`.
