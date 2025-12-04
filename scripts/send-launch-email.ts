import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: process.env.NODEMAILER_SECURE === 'true',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})

async function sendLaunchEmails() {
  // Check if running in test mode
  const isTestMode = process.argv.includes('--test')
  const testEmail = 'sorilc@hotmail.com'

  if (isTestMode) {
    console.log('🧪 Running in TEST MODE - sending only to:', testEmail)
    console.log('   To send to all waitlist users, run without --test flag\n')
  } else {
    console.log('🚀 Starting launch email campaign...\n')
  }

  try {
    let waitlistUsers

    if (isTestMode) {
      // Test mode: only send to the test email
      waitlistUsers = [{ email: testEmail, created_at: new Date().toISOString() }]
    } else {
      // Production mode: fetch all waitlist users
      const { data, error } = await supabase
        .from('waitlist')
        .select('email, created_at')
        .order('created_at', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch waitlist: ${error.message}`)
      }

      if (!data || data.length === 0) {
        console.log('❌ No waitlist users found')
        return
      }

      waitlistUsers = data
    }

    console.log(`📊 Sending to ${waitlistUsers.length} ${isTestMode ? 'test' : ''} user(s)\n`)

    let successCount = 0
    let failCount = 0
    const failed: string[] = []

    // Send email to each user
    for (const user of waitlistUsers) {
      try {
        await transporter.sendMail({
          from: '"MiroMiro" <noreply@miromiro.com>',
          to: user.email,
          subject: "🎉 MiroMiro is Live! Claim Your Exclusive 20% Discount",
          html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .discount-code {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      border: 3px dashed white;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    .features {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .feature {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .feature:last-child {
      border-bottom: none;
    }
    .feature strong {
      color: #764ba2;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 MiroMiro is Live!</h1>
  </div>

  <div class="content">
    <p style="font-size: 18px;">Hi there!</p>

    <p style="font-size: 16px;">
      We're thrilled to announce that <strong>MiroMiro is officially live!</strong> 🚀
    </p>

    <p style="font-size: 16px;">
      As one of our earliest supporters who joined the waitlist, we want to thank you with an exclusive offer:
    </p>

    <div class="discount-code">
      WAITLIST20
    </div>

    <p style="text-align: center; font-size: 16px; margin-top: 0;">
      <strong>Get 20% OFF forever on any plan!</strong>
    </p>

    <div class="features">
      <h3 style="margin-top: 0; color: #764ba2;">What can you do with MiroMiro?</h3>
      <div class="feature">
        ✨ <strong>Extract Assets Instantly</strong> - Download images, icons, and graphics from any website
      </div>
      <div class="feature">
        🎨 <strong>Generate Design Systems</strong> - Automatically extract colors, typography, and spacing
      </div>
      <div class="feature">
        📊 <strong>Contrast Checker</strong> - Ensure your designs meet accessibility standards
      </div>
      <div class="feature">
        🎬 <strong>Lottie Animations</strong> - Extract and download Lottie animations
      </div>
      <div class="feature">
        📦 <strong>Bulk Export</strong> - Download multiple assets at once
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://miromiro.app/signup" class="cta-button">
        Start Using MiroMiro Now →
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      <strong>How to use your discount:</strong><br>
      1. Sign up at <a href="https://miromiro.app/signup">miromiro.app/signup</a><br>
      2. Choose your plan<br>
      3. Enter code <strong>WAITLIST20</strong> at checkout<br>
      4. Enjoy 20% off forever! 🎉
    </p>
  </div>

  <div class="footer">
    <p>
      Thank you for being part of our journey!<br>
      <strong>The MiroMiro Team</strong>
    </p>
    <p style="margin-top: 20px;">
      <a href="https://miromiro.app" style="color: #764ba2;">Visit MiroMiro</a> |
      <a href="https://miromiro.app/contact" style="color: #764ba2;">Contact Us</a>
    </p>
  </div>
</body>
</html>
          `
        })

        successCount++
        console.log(`✅ Sent to: ${user.email}`)

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        failCount++
        failed.push(user.email)
        console.error(`❌ Failed to send to ${user.email}:`, error)
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Campaign Summary:')
    console.log('='.repeat(50))
    console.log(`✅ Successfully sent: ${successCount}`)
    console.log(`❌ Failed: ${failCount}`)
    console.log(`📧 Total: ${waitlistUsers.length}`)

    if (failed.length > 0) {
      console.log('\n❌ Failed emails:')
      failed.forEach(email => console.log(`  - ${email}`))
    }

    console.log('\n🎉 Launch email campaign completed!')
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
sendLaunchEmails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
