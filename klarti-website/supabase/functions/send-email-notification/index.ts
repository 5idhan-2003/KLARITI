// Supabase Edge Function for sending email notifications
// Deploy this to your Supabase project

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  institutionName: string
  email: string
  institutionType: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { institutionName, email, institutionType, message }: EmailRequest = await req.json()

    // Validate required fields
    if (!institutionName || !email || !institutionType || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare email content
    const emailSubject = `🚀 New Demo Request from ${institutionName}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
          New Demo Request - KLARTI+
        </h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #000;">Institution Details:</h3>
          <p><strong>Institution:</strong> ${institutionName}</p>
          <p><strong>Contact Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Institution Type:</strong> ${institutionType}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #000;">Message:</h3>
          <p style="line-height: 1.6;">${message}</p>
        </div>

        <div style="background: #000; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0;"><strong>Action Required:</strong> Please follow up with this lead!</p>
        </div>

        <p style="color: #666; font-size: 12px; text-align: center;">
          This email was sent automatically from your KLARTI+ website.<br>
          Check your Supabase dashboard for all form submissions.
        </p>
      </div>
    `

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'KLARTI+ Website <noreply@yourdomain.com>', // You'll need to configure this
        to: ['prasanna.sidhan2003@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
        reply_to: email // Allow you to reply directly to the lead
      }),
    })

    const emailResult = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('Email sending failed:', emailResult)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailResult }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Email sent successfully
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification sent successfully',
        emailId: emailResult.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-email-notification function:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})