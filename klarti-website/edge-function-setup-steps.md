# Fix Your Supabase Edge Function - Step by Step

## 🚨 Issues Found in Your Code:

1. **❌ Hardcoded API key** - Security risk and won't work
2. **❌ Wrong API key usage** - `Deno.env.get('re_fCoPTBtw...')` is incorrect
3. **❌ Missing CORS headers** - Blocks web requests
4. **❌ Wrong email format** - Expecting different data structure
5. **❌ Invalid from email** - `you@example.com` won't work

## ✅ Step-by-Step Fix:

### Step 1: Update Edge Function Code
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on your existing function
3. **Delete all current code**
4. **Copy and paste** the entire corrected code from `corrected-edge-function.ts`
5. Click **Save**

### Step 2: Set Up Environment Variable Properly
1. In the same Edge Function page, go to **Secrets** tab
2. Click **Add new secret**
3. **Name**: `RESEND_API_KEY`
4. **Value**: `re_fCoPTBtw_Gi6zBcDM1LkqVA9FCsQF7T9x` (your actual API key)
5. Click **Save**

### Step 3: Deploy the Function
1. Click **Deploy** button
2. Wait for deployment to complete

### Step 4: Test from Your Website
1. Go to your website
2. Fill out the form with test data
3. Submit
4. Check browser console for logs

## 🔍 How to Debug:

### Check Function Logs:
1. **Supabase Dashboard** → **Edge Functions**
2. Click your function → **Logs** tab
3. Look for error messages

### Check Browser Console:
1. Press F12 on your website
2. Go to **Console** tab
3. Submit form and watch for Edge Function responses

## ⚡ Quick Test Function:

You can test the function directly from Supabase:

1. Go to your Edge Function
2. Click **Invoke Function**
3. Use this test data:
```json
{
  "institutionName": "Test University",
  "email": "test@example.com",
  "institutionType": "university",
  "message": "This is a test message from Edge Function"
}
```
4. Click **Invoke**
5. Check if email is received

## 🎯 Expected Result:

After fixing:
1. ✅ Form submission saves to database
2. ✅ Edge Function is called automatically
3. ✅ Professional HTML email sent to prasanna.sidhan2003@gmail.com
4. ✅ No page redirects or errors

## 🚨 If Still Not Working:

Check these common issues:
1. **Resend API Key**: Make sure it's active and has permissions
2. **Function Deployment**: Ensure function deployed successfully
3. **CORS**: Function must have CORS headers for web requests
4. **Email Address**: Verify prasanna.sidhan2003@gmail.com is correct

The main issue was your API key wasn't being read from environment variables correctly. The corrected code fixes all these issues!