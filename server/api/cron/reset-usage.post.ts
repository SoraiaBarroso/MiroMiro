import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

/*
  It fetches every user from the user_profiles table and checks:

  For Paid Users (Starter/Pro):
  Is today's date >= their current_period_end?
  ├─ YES → Reset their usage counters to 0
  └─ NO → Skip (billing period not ended yet)

  For Free Users:
  Is today the 1st of the month?
  ├─ YES → Reset their usage counters to 0
  └─ NO → Skip (not time to reset yet)

 When it's time, it sets these fields to 0:
  - asset_extractions
  - contrast_checks
  - lottie_extractions
  - ai_generations
*/
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = serverSupabaseServiceRole(event)

  // Security: Verify the request is coming from your cron service
  // You can use a secret token or API key
  const body = await readBody(event)
  const cronSecret = body?.secret || event.node.req.headers['x-cron-secret']

  if (cronSecret !== config.cronSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid cron secret'
    })
  }

  console.log('🔄 Starting monthly usage reset...')

  const now = new Date()
  const resetResults = {
    paidUsersReset: 0,
    freeUsersReset: 0,
    errors: [] as string[]
  }

  try {
    // Fetch all users
    const { data: users, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, email, premium_status, premium_tier, current_period_end, stripe_subscription_id')

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`)
    }

    if (!users || users.length === 0) {
      console.log('No users found to reset')
      return {
        success: true,
        message: 'No users to reset',
        results: resetResults
      }
    }

    console.log(`📊 Processing ${users.length} users...`)

    // Process each user
    for (const user of users) {
      try {
        let shouldReset = false

        if (user.premium_status && user.current_period_end) {
          // PAID USERS: Check if billing cycle has ended
          const periodEnd = new Date(user.current_period_end)

          if (now >= periodEnd) {
            shouldReset = true
            console.log(`💳 Paid user ${user.email}: billing period ended (${periodEnd.toISOString()})`)

            // For paid users, we also need to update the billing period
            // This will be fetched from Stripe in a separate process
            // For now, we'll just reset the counters
            resetResults.paidUsersReset++
          }
        } else if (!user.premium_status) {
          // FREE USERS: Reset on the 1st of each month
          // Check if we're on the 1st day of the month
          const isFirstDayOfMonth = now.getDate() === 1

          if (isFirstDayOfMonth) {
            shouldReset = true
            console.log(`🆓 Free user ${user.email}: monthly reset (1st of month)`)
            resetResults.freeUsersReset++
          }
        }

        // Reset usage counters if needed
        if (shouldReset) {
          const { error: resetError } = await supabase
            .from('user_profiles')
            .update({
              asset_extractions: 0,
              contrast_checks: 0,
              lottie_extractions: 0,
              ai_generations: 0,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

          if (resetError) {
            const errorMsg = `Failed to reset ${user.email}: ${resetError.message}`
            console.error(errorMsg)
            resetResults.errors.push(errorMsg)
          } else {
            console.log(`✅ Reset counters for ${user.email}`)
          }
        }
      } catch (userError: unknown) {
        const errorMsg = `Error processing user ${user.email}: ${userError instanceof Error ? userError.message : String(userError)}`
        console.error(errorMsg)
        resetResults.errors.push(errorMsg)
      }
    }

    console.log('✅ Usage reset completed')
    console.log(`📊 Results: ${resetResults.paidUsersReset} paid users, ${resetResults.freeUsersReset} free users reset`)

    if (resetResults.errors.length > 0) {
      console.error(`⚠️ ${resetResults.errors.length} errors occurred`)
    }

    return {
      success: true,
      message: 'Usage reset completed',
      results: resetResults,
      timestamp: now.toISOString()
    }
  } catch (error: unknown) {
    console.error('❌ Fatal error during usage reset:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Usage reset failed: ${error instanceof Error ? error.message : String(error)}`
    })
  }
})
