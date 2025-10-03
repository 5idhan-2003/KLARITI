# Setup Supabase Email Notifications for KLARTI+

## 🚀 Why Supabase is the Best Choice:

✅ **Server-side execution** - No browser security limitations
✅ **Built-in authentication** - Secure function calls
✅ **Same platform** - Manage everything in one place
✅ **Reliable delivery** - Professional email service
✅ **Cost effective** - Free tier includes generous usage

## 📧 Step-by-Step Setup:

### Step 1: Get Resend API Key (Free)
1. Go to **https://resend.com**
2. Sign up for free account
3. Verify your email
4. Go to **API Keys** section
5. Create new API key
6. Copy the key (starts with `re_...`)

### Step 2: Configure Domain (Optional but Recommended)
1. In Resend dashboard, go to **Domains**
2. Add your domain (or use their subdomain for testing)
3. Verify DNS records

### Step 3: Deploy Edge Function to Supabase
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link to your project: `supabase link --project-ref wirtaatvxdipwaqpfqrc`
4. Navigate to your project folder
5. Copy the `supabase` folder I created to your project root
6. Deploy function: `supabase functions deploy send-email-notification`

### Step 4: Set Environment Variables in Supabase
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **send-email-notification** function
3. Go to **Secrets** tab
4. Add secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key from Step 1

### Step 5: Update Website Code
The website will automatically call the Edge Function after form submission.

## 🔧 Alternative: Simple Setup Without CLI

If you don't want to use CLI, you can create the function directly in Supabase dashboard:

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **Create Function**
3. Name: `send-email-notification`
4. Copy-paste the code from `index.ts`
5. Deploy
6. Add the `RESEND_API_KEY` secret

## 💰 Cost Breakdown:
- **Resend**: 3,000 emails/month FREE
- **Supabase Edge Functions**: 500,000 invocations/month FREE
- **Total cost for typical usage**: $0/month

## ✅ Benefits of This Setup:
- **Instant notifications** to your Gmail
- **Professional HTML emails** with all form data
- **Reply-to functionality** - reply directly to leads
- **Reliable delivery** through Resend service
- **Integrated with your database** - perfect harmony

## 🎯 After Setup:
1. Form submission saves to database
2. Edge Function automatically triggered
3. Professional email sent to prasanna.sidhan2003@gmail.com
4. No page redirects or browser issues
5. All managed in Supabase dashboard

Would you like me to help you set this up step by step?