import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { email: rawEmail } = body

    // Normalize email to lowercase
    const email = rawEmail?.toLowerCase().trim()

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // Check if email already exists
    const { data: existingEmail } = await client
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single()

    if (existingEmail) {
      throw createError({
        statusCode: 409,
        statusMessage: 'You are already on the waitlist!'
      })
    }

    const { data } = await client.from('waitlist').insert({ email: email }).select().single()

    console.log('Current waitlist entries:', data)
    const { sendMail } = useNodeMailer()

    // Send email to the user
    await sendMail({
      to: email,
      subject: 'Welcome to MiroMiro Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to MiroMiro!</h1>
          <p style="font-size: 16px; color: #666;">
            Thank you for joining our waitlist! We're excited to have you on board.
          </p>
          <p style="font-size: 16px; color: #666;">
            You'll be among the first to know when we launch our Chrome extension that helps designers and developers extract assets, colors, typography, and generate complete design systems instantly.
          </p>
          <p style="font-size: 16px; color: #666;">
            Stay tuned for updates!
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            Best regards,<br/>
            The MiroMiro Team
          </p>
        </div>
      `
    })

    // Optionally, send a notification to yourself about the new signup
    await sendMail({
      to: 'sorilc@hotmail.com', // Your email
      subject: 'New Waitlist Signup',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    })

    return {
      success: true,
      message: 'Successfully joined the waitlist'
    }
  } catch (error: any) {
    console.error('Error sending email:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send email'
    })
  }
})
