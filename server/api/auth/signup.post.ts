import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const serviceClient = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    const { email: rawEmail, password } = body

    // Normalize email to lowercase
    const email = rawEmail?.toLowerCase().trim()

    // Validate input
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters'
      })
    }

    // Check if user already exists (use service role to bypass RLS)
    const { data: existingProfile } = await serviceClient
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    console.log('Existing profile check:', existingProfile)
    if (existingProfile) {
      throw createError({
        statusCode: 409,
        statusMessage: 'An account with this email already exists. Please sign in instead.',
        data: {
          errorType: 'duplicate_email',
          email
        }
      })
    }

    // Check if email is in waitlist
    const { data: waitlistEntry } = await client
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single()

    const isFromWaitlist = !!waitlistEntry
    const discountPercentage = isFromWaitlist ? 20 : 0 // 20% discount for waitlist users

    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getRequestURL(event).origin}/confirm`,
        data: {
          email,
          has_waitlist_discount: isFromWaitlist,
          discount_percentage: discountPercentage
        }
      }
    })

    if (authError) {
      // Handle duplicate email more gracefully
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        throw createError({
          statusCode: 409,
          statusMessage: 'An account with this email already exists. Please sign in instead.',
          data: {
            errorType: 'duplicate_email',
            email
          }
        })
      }

      throw createError({
        statusCode: 400,
        statusMessage: authError.message
      })
    }

    if (!authData.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user'
      })
    }

    // Profile will be automatically created by the database trigger (handle_new_user_profile)
    // The trigger inserts into user_profiles table with premium_status=false and premium_tier='free'
    // along with waitlist discount info from user metadata

    // Note: Supabase automatically sends a confirmation email
    // A welcome email can be sent after confirmation via a database trigger or webhook

    // Send notification email to admin about new signup
    try {
      const { sendMail } = useNodeMailer()
      await sendMail({
        to: 'sorilc@hotmail.com',
        subject: 'New User Signup - MiroMiro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #333;">New User Signed Up</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px; color: #333;"><strong>User ID:</strong> ${authData.user.id}</p>
              <p style="font-size: 16px; color: #333;"><strong>Waitlist Member:</strong> ${isFromWaitlist ? 'Yes' : 'No'}</p>
              ${isFromWaitlist ? `<p style="font-size: 16px; color: #333;"><strong>Discount:</strong> ${discountPercentage}%</p>` : ''}
            </div>
            <p style="font-size: 14px; color: #999;">
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        `
      })
    } catch (emailError) {
      // Don't fail the signup if email notification fails
      console.error('Failed to send signup notification email:', emailError)
    }

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        has_waitlist_discount: isFromWaitlist,
        discount_percentage: discountPercentage
      }
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to create account'
    })
  }
})
