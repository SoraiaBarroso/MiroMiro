import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const body = await readBody(event)
    const { method } = body // 'password', 'google', 'github'

    // Send notification email to admin about sign in
    try {
      const { sendMail } = useNodeMailer()
      await sendMail({
        to: 'sorilc@hotmail.com',
        subject: 'User Sign In - MiroMiro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #333;">User Signed In</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${user.email}</p>
              <p style="font-size: 16px; color: #333;"><strong>User ID:</strong> ${user.id}</p>
              <p style="font-size: 16px; color: #333;"><strong>Sign In Method:</strong> ${method || 'password'}</p>
            </div>
            <p style="font-size: 14px; color: #999;">
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        `
      })
    } catch (emailError) {
      // Don't fail if email notification fails
      console.error('Failed to send signin notification email:', emailError)
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Signin notification error:', error)
    // Return success anyway to not disrupt user flow
    return {
      success: false
    }
  }
})
