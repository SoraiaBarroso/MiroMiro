import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

/*
  Monthly usage reset for FREE users only.

  FREE USERS:
  - Reset on the 1st of each month
  - Resets: asset_extractions (50/month limit), contrast_checks (10/month limit)

  PAID USERS:
  - Usage counters are reset by the invoice.payment_succeeded webhook when they renew
  - This cron job does NOT handle paid users
*/
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = serverSupabaseServiceRole(event)

  // Security: Verify the request is coming from your cron service
  const body = await readBody(event)
  const cronSecret = body?.secret || event.node.req.headers['x-cron-secret']

  if (cronSecret !== config.cronSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid cron secret'
    })
  }

  console.log('🔄 Starting monthly usage reset for free users...')

  const now = new Date()

  // Only run on the 1st of the month
  if (now.getDate() !== 1) {
    console.log('⏭️ Not the 1st of the month - skipping')
    return {
      success: true,
      message: 'Only runs on 1st of month',
      date: now.toISOString()
    }
  }

  const resetResults = {
    freeUsersReset: 0,
    errors: [] as string[]
  }

  try {
    // Fetch all FREE users
    const { data: users, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('premium_status', false)

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`)
    }

    if (!users || users.length === 0) {
      console.log('No free users found to reset')
      return {
        success: true,
        message: 'No free users to reset',
        results: resetResults
      }
    }

    console.log(`📊 Processing ${users.length} free users...`)

    // Reset usage counters for all free users
    for (const user of users) {
      try {
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
          resetResults.freeUsersReset++
        }
      } catch (userError: unknown) {
        const errorMsg = `Error processing user ${user.email}: ${userError instanceof Error ? userError.message : String(userError)}`
        console.error(errorMsg)
        resetResults.errors.push(errorMsg)
      }
    }

    console.log('✅ Monthly usage reset completed')
    console.log(`📊 Results: ${resetResults.freeUsersReset} free users reset`)

    if (resetResults.errors.length > 0) {
      console.error(`⚠️ ${resetResults.errors.length} errors occurred`)
    }

    return {
      success: true,
      message: 'Monthly usage reset completed',
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
