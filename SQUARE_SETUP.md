# Square Checkout Link Setup Guide

This guide will walk you through creating a Square checkout link and adding it to your landing page.

## Prerequisites

- A Square account (free to create at https://squareup.com)
- Access to your Square Dashboard

---

## Step 1: Create or Sign In to Your Square Account

1. Go to **https://squareup.com**
2. Click **"Sign Up"** (if you don't have an account) or **"Sign In"**
3. Complete the signup process if creating a new account
4. Verify your email address if required

---

## Step 2: Navigate to Checkout Links

1. Once logged in, go to your **Square Dashboard**
2. In the left sidebar, look for:
   - **Online** → **Checkout Links**, OR
   - **Payments** → **Checkout Links**, OR
   - **Online Checkout** → **Checkout Links**
3. Click on **"Checkout Links"** or **"Create Checkout Link"**

**Note:** The exact location may vary slightly depending on your Square Dashboard layout. If you can't find it, try searching for "Checkout Links" in the Square Dashboard search bar.

---

## Step 3: Create a New Checkout Link

1. Click the **"Create Checkout Link"** or **"New Checkout Link"** button
2. You'll see a form to create your checkout link. Fill in the following:

### Required Fields:
- **Item Name** (e.g., "Event Payment", "Pickleball Event Registration")
- **Price** (enter the amount, e.g., $50.00)
  - You can also leave this blank or set it to "Variable" if you want customers to enter their own amount

### Optional Fields:
- **Description** (optional - describe what the payment is for)
- **Image** (optional - add an image for the checkout page)
- **Quantity** (if you want to allow multiple purchases)

3. Review your settings:
   - **Customer Information**: Choose if you want to collect customer email/phone
   - **Receipt Settings**: Make sure digital receipts are enabled (Square does this by default)

4. Click **"Create Link"** or **"Generate Link"**

---

## Step 4: Copy Your Checkout Link

1. After creating the link, Square will show you a **Checkout URL**
2. The URL will look something like:
   ```
   https://square.link/u/abc123xyz
   ```
   or
   ```
   https://checkout.square.site/buy/...
   ```
3. Click the **"Copy Link"** button or manually copy the entire URL
4. **Important:** Save this URL somewhere safe - you'll need it for the next steps

---

## Step 5: Add the Link to Your Code

You have two options: Use an environment variable (recommended) or add it directly to the code.

### Option A: Using Environment Variable (Recommended)

This is the best practice as it keeps your payment link secure and makes it easy to change.

1. **Create a `.env` file** in your project root directory (same folder as `package.json`)
   - If the file doesn't exist, create it: `.env`
   - Make sure it's in the root directory: `/Users/stellali/Desktop/courted/landing-page/.env`

2. **Add your Square payment link** to the `.env` file:
   ```env
   VITE_SQUARE_PAYMENT_LINK=https://square.link/u/YOUR_LINK_ID
   ```
   Replace `YOUR_LINK_ID` with your actual Square checkout link.

   **Example:**
   ```env
   VITE_SQUARE_PAYMENT_LINK=https://square.link/u/abc123xyz
   ```

3. **Save the file**

4. **Restart your development server** if it's running:
   - Stop the server (Ctrl+C or Cmd+C)
   - Run `npm run dev` again

**Note:** The `.env` file is already in your `.gitignore`, so it won't be committed to git. This keeps your payment link private.

### Option B: Add Directly to Code (Quick Testing)

If you want to test quickly without setting up environment variables:

1. Open `src/App.jsx`
2. Find line 30:
   ```javascript
   const SQUARE_PAYMENT_LINK = import.meta.env.VITE_SQUARE_PAYMENT_LINK || 'https://square.link/YOUR_PAYMENT_LINK_ID'
   ```
3. Replace `'https://square.link/YOUR_PAYMENT_LINK_ID'` with your actual Square checkout URL:
   ```javascript
   const SQUARE_PAYMENT_LINK = import.meta.env.VITE_SQUARE_PAYMENT_LINK || 'https://square.link/u/abc123xyz'
   ```
4. Save the file

**Note:** This method is fine for testing, but using environment variables (Option A) is recommended for production.

---

## Step 6: Test Your Payment Link

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to `http://localhost:5173` (or the URL shown in your terminal)

3. **Navigate to the Events section**:
   - Scroll down to the "Events" section, or
   - Click "Events" in the navigation menu

4. **Click the "Pay Now" button**

5. **Verify**:
   - The button should open a new tab
   - You should see the Square checkout page
   - The checkout page should show your item name and price
   - You can test with Square's test card numbers (see Step 7)

---

## Step 7: Test Payment (Using Square Sandbox)

If you're using Square's sandbox/test environment:

1. On the Square checkout page, use these **test card numbers**:
   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Expiry Date**: Any future date (e.g., `12/25`)
   - **ZIP Code**: Any 5 digits (e.g., `12345`)

2. Complete the test payment

3. **Check your email** - You should receive a receipt email from Square

4. **Check Square Dashboard** - The payment should appear in your Square Dashboard

**Note:** For production, make sure you're using your production Square account, not the sandbox.

---

## Step 8: Enable Automatic Receipts (If Not Already Enabled)

Square automatically sends receipts, but let's verify:

1. Go to **Square Dashboard**
2. Click **Settings** (gear icon) in the top right
3. Go to **Receipts** or **Email Receipts**
4. Make sure **"Send digital receipts automatically"** is enabled
5. Configure your receipt preferences:
   - Choose email or SMS (or both)
   - Customize receipt template if desired
6. Click **"Save"**

---

## Step 9: Deploy to Netlify (If Using Netlify)

If you're deploying to Netlify, you need to add the environment variable there:

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Select your site**
3. **Go to Site Settings** → **Environment Variables**
4. **Click "Add variable"**
5. **Add the variable**:
   - **Key**: `VITE_SQUARE_PAYMENT_LINK`
   - **Value**: Your Square checkout URL (e.g., `https://square.link/u/abc123xyz`)
6. **Click "Save"**
7. **Redeploy your site**:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

**Note:** After adding the environment variable, you may need to trigger a new deployment for it to take effect.

---

## Troubleshooting

### Button doesn't work / Link is broken
- **Check**: Make sure you copied the entire Square checkout URL
- **Check**: Verify the URL starts with `https://` (not `http://`)
- **Check**: Test the URL directly in your browser to make sure it works

### Environment variable not working
- **Check**: Make sure the `.env` file is in the root directory (same folder as `package.json`)
- **Check**: Make sure the variable name is exactly `VITE_SQUARE_PAYMENT_LINK` (case-sensitive)
- **Check**: Restart your development server after adding the `.env` file
- **Check**: Make sure there are no spaces around the `=` sign in your `.env` file

### Payment not processing
- **Check**: Make sure you're using the correct Square account (sandbox vs production)
- **Check**: Verify your Square account is activated and in good standing
- **Check**: Test with Square's test card numbers if using sandbox

### Receipt emails not sending
- **Check**: Verify receipt settings in Square Dashboard (Settings → Receipts)
- **Check**: Make sure customers enter their email address during checkout
- **Check**: Check your spam folder for receipt emails

---

## Next Steps

- ✅ Your "Pay Now" button is now linked to Square checkout
- ✅ Customers can click the button to pay
- ✅ Square automatically sends receipt emails
- ✅ Payments appear in your Square Dashboard

**Optional Enhancements:**
- Add multiple payment links for different events
- Customize the button text or styling
- Add event details (date, location) to the events section
- Set up webhooks to track payments on your backend

---

## Need Help?

- **Square Support**: https://squareup.com/help
- **Square Developer Docs**: https://developer.squareup.com/docs
- **Square Checkout API**: https://developer.squareup.com/docs/checkout-api/overview

---

## Summary

1. ✅ Create/Square account
2. ✅ Create checkout link in Square Dashboard
3. ✅ Copy the checkout URL
4. ✅ Add to `.env` file as `VITE_SQUARE_PAYMENT_LINK`
5. ✅ Test locally
6. ✅ Deploy to Netlify (add env var in Netlify dashboard)
7. ✅ Enable automatic receipts in Square

Your payment button is now ready! 🎉

