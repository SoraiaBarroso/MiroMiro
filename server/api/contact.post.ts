export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message } = body

    if (!message || !message.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    const { sendMail } = useNodeMailer()

    // Send the contact message to your email
    await sendMail({
      to: 'sorilc@hotmail.com',
      subject: 'New Contact Form Submission - MiroMiro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #333;">New Contact Form Message</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #333; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 14px; color: #999;">
            <strong>Date:</strong> ${new Date().toLocaleString()}<br/>
          </p>
        </div>
      `
    })

    return {
      success: true,
      message: 'Message sent successfully'
    }
  } catch (error: any) {
    console.error('Error sending contact message:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to send message'
    })
  }
})
