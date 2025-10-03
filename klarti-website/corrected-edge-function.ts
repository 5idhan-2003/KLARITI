// CORRECTED Supabase Edge Function for KLARTI+ Email Notifications
// Copy this entire code to replace your current Edge Function

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers for web requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the API key from environment variable (NOT hardcoded)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable not found');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the incoming request - expect form data from your website
    const { institutionName, email, institutionType, message } = await req.json();

    // Validate required fields
    if (!institutionName || !email || !institutionType || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create professional email content
    const emailSubject = `🚀 New Demo Request from ${institutionName}`;
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
          <p style="margin: 0;"><strong>⚡ Action Required:</strong> Please follow up with this lead!</p>
        </div>

        <p style="color: #666; font-size: 12px; text-align: center;">
          This email was sent automatically from your KLARTI+ website.
        </p>
      </div>
    `;

    console.log('Sending email with API key:', RESEND_API_KEY ? 'Key present' : 'Key missing');

    // Send email via Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}` // Correct usage of environment variable
      },
      body: JSON.stringify({
        from: 'KLARTI+ Website <onboarding@resend.dev>', // Use Resend's default domain for testing
        to: ['prasanna.sidhan2003@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
        reply_to: email // Allow you to reply directly to the lead
      })
    });

    const data = await res.json();

    console.log('Resend API response:', data);

    if (!res.ok) {
      console.error('Resend API error:', data);
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: data,
          status: res.status
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully!',
        emailId: data.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});