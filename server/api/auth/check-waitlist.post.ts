import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const serviceClient = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const email = user.email?.toLowerCase().trim()

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User email not found'
      })
    }

    // Check if email is in waitlist
    const { data: waitlistEntry } = await client
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    const isFromWaitlist = !!waitlistEntry
    const discountPercentage = isFromWaitlist ? 20 : 0

    if (isFromWaitlist) {
      // Update user profile with waitlist discount (use service role to bypass RLS)
      const { error: updateError } = await serviceClient
        .from('user_profiles')
        .update({
          has_waitlist_discount: true,
          discount_percentage: discountPercentage
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Failed to update user profile with waitlist discount:', updateError)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to apply waitlist discount'
        })
      }

      // Also update user metadata
      const { error: metadataError } = await serviceClient.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            has_waitlist_discount: true,
            discount_percentage: discountPercentage
          }
        }
      )

      if (metadataError) {
        console.error('Failed to update user metadata:', metadataError)
      }
    }

    return {
      success: true,
      has_waitlist_discount: isFromWaitlist,
      discount_percentage: discountPercentage
    }
  } catch (error: any) {
    console.error('Check waitlist error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to check waitlist'
    })
  }
})
