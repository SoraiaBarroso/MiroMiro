/**
 * One-time script to backfill billing periods for existing premium users
 *
 * This script fetches all premium users who don't have current_period_end set,
 * retrieves their subscription data from Stripe, and updates the database.
 *
 * Usage:
 *   npx tsx scripts/backfill-billing-periods.ts
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') })

// Load environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY
const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID
const STRIPE_STARTER_YEARLY_PRICE_ID = process.env.STRIPE_STARTER_YEARLY_PRICE_ID
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID
const STRIPE_PRO_YEARLY_PRICE_ID = process.env.STRIPE_PRO_YEARLY_PRICE_ID

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing required environment variables')
  console.error('Required: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SECRET_KEY')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia'
})

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY)

async function backfillBillingPeriods() {
  console.log('🔍 Fetching premium users without billing periods...\n')

  // Fetch users who are premium but don't have billing period set
  const { data: users, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id, email, premium_status, premium_tier, stripe_subscription_id, current_period_end')
    .eq('premium_status', true)
    .is('current_period_end', null)

  if (fetchError) {
    console.error('❌ Error fetching users:', fetchError)
    process.exit(1)
  }

  if (!users || users.length === 0) {
    console.log('✅ No users need backfilling. All premium users have billing periods set.')
    return
  }

  console.log(`📊 Found ${users.length} premium users without billing periods:\n`)

  let successCount = 0
  let failCount = 0
  const errors: string[] = []

  for (const user of users) {
    console.log(`Processing: ${user.email} (${user.premium_tier})`)

    if (!user.stripe_subscription_id) {
      const msg = `  ⚠️  No Stripe subscription ID found for ${user.email} - skipping`
      console.log(msg)
      errors.push(msg)
      failCount++
      continue
    }

    try {
      // Fetch subscription from Stripe
      console.log(`  📡 Fetching subscription ${user.stripe_subscription_id} from Stripe...`)
      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id)

      if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        const msg = `  ⚠️  Subscription is ${subscription.status} for ${user.email} - skipping`
        console.log(msg)
        errors.push(msg)
        failCount++
        continue
      }

      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

      console.log(`  📅 Period ends: ${periodEnd}`)

      // Determine the correct tier from the subscription price ID
      let correctTier = 'free'
      const priceId = subscription.items.data[0]?.price.id

      if (priceId === STRIPE_STARTER_PRICE_ID || priceId === STRIPE_STARTER_YEARLY_PRICE_ID) {
        correctTier = 'starter'
      } else if (priceId === STRIPE_PRO_PRICE_ID || priceId === STRIPE_PRO_YEARLY_PRICE_ID) {
        correctTier = 'pro'
      }

      if (correctTier !== user.premium_tier) {
        console.log(`  🔄 Updating tier from "${user.premium_tier}" to "${correctTier}"`)
      }

      // Update database
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          premium_tier: correctTier,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        const msg = `  ❌ Failed to update ${user.email}: ${updateError.message}`
        console.log(msg)
        errors.push(msg)
        failCount++
        continue
      }

      console.log(`  ✅ Successfully updated ${user.email}\n`)
      successCount++

      // Rate limit to avoid hitting Stripe API limits
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error: unknown) {
      const msg = `  ❌ Error processing ${user.email}: ${error instanceof Error ? error.message : String(error)}`
      console.log(msg)
      errors.push(msg)
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 BACKFILL SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total users processed: ${users.length}`)
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)

  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS:')
    errors.forEach(err => console.log(err))
  }

  console.log('\n✨ Backfill complete!')
}

// Run the script
backfillBillingPeriods()
  .then(() => {
    console.log('\n👋 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed with error:', error)
    process.exit(1)
  })
