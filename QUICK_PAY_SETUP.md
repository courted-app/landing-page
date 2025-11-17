# Square Quick Pay Direct Checkout Setup

## Problem
Your current checkout link (`checkout.square.site/merchant/...`) shows an event description page first before allowing payment. You want it to go directly to the payment form.

## Solution
Create a **Quick Pay Link** in Square Dashboard, which goes directly to payment without showing a description page.

---

## Step-by-Step: Create Quick Pay Link

### Step 1: Access Payment Links in Square Dashboard

1. Go to **https://squareup.com/dashboard**
2. Sign in to your Square account
3. In the left sidebar, look for:
   - **Payment Links** (under "Orders & Payments"), OR
   - **Online** → **Payment Links**, OR
   - **More** → **Payment Links**
4. Click on **"Payment Links"**

### Step 2: Create a New Payment Link

1. Click the **"Create a link"** or **"New Payment Link"** button
2. Select **"Collect a payment"** (this creates a Quick Pay link)
3. Fill in the payment details:
   - **Item Name**: "Courted Kick Off Event" (or your event name)
   - **Price**: $40.00 (or your event price)
   - **Description**: (Optional - can leave blank or add brief description)
   - **Image**: (Optional - can add event image if desired)
4. Click **"Create link"** or **"Generate Link"**

### Step 3: Copy the Quick Pay Link

1. Square will generate a **Quick Pay link**
2. The link will look like:
   ```
   https://square.link/u/abc123xyz
   ```
   or
   ```
   https://square.link/u/1ABC123DEF456
   ```
3. **Copy the entire URL**

### Step 4: Add the Link to Your Code

**Option A: Using Environment Variable (Recommended)**

1. Open or create `.env` file in your project root
2. Add your Quick Pay link:
   ```env
   VITE_SQUARE_PAYMENT_LINK=https://square.link/u/YOUR_QUICK_PAY_ID
   ```
   Replace `YOUR_QUICK_PAY_ID` with your actual Quick Pay link ID.

3. Save the file
4. Restart your development server if running

**Option B: Direct in Code**

1. Open `src/App.jsx`
2. Find line 32:
   ```javascript
   const SQUARE_PAYMENT_LINK = import.meta.env.VITE_SQUARE_PAYMENT_LINK || 'https://checkout.square.site/merchant/MLD32S2SNH90V/checkout/SC75J2AEY7BT4PW7D7JS454F'
   ```
3. Replace with your Quick Pay link:
   ```javascript
   const SQUARE_PAYMENT_LINK = import.meta.env.VITE_SQUARE_PAYMENT_LINK || 'https://square.link/u/YOUR_QUICK_PAY_ID'
   ```
4. Save the file

### Step 5: Test the Link

1. Start your development server: `npm run dev`
2. Go to the Events section
3. Click "Pay Now"
4. **Verify**: You should go directly to the payment form (no description page)

---

## Alternative: Use Square's Payment API

If you want more control, you can use Square's Payment Links API to programmatically create Quick Pay links that go directly to payment.

### Using Square Payment Links API

1. **Get your Square API credentials**:
   - Go to Square Developer Dashboard: https://developer.squareup.com
   - Create an application
   - Get your Access Token and Application ID

2. **Create a payment link via API**:
   ```bash
   curl -X POST \
     'https://connect.squareup.com/v2/online-checkout/payment-links' \
     -H 'Square-Version: 2024-01-18' \
     -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
     -H 'Content-Type: application/json' \
     -d '{
       "idempotency_key": "unique-key-123",
       "quick_pay": {
         "name": "Courted Kick Off Event",
         "price_money": {
           "amount": 4000,
           "currency": "CAD"
         }
       }
     }'
   ```

3. **Response will include a payment link URL** that goes directly to payment

---

## Difference Between Checkout Types

### Square Online Checkout (Current - Shows Description Page)
- URL Format: `checkout.square.site/merchant/.../checkout/...`
- Shows event/product description page first
- Users click "Buy" or "Checkout" to proceed to payment
- Better for showcasing event details

### Square Quick Pay (What You Want - Direct to Payment)
- URL Format: `square.link/u/...`
- Goes directly to payment form
- No description page
- Faster checkout experience

---

## Troubleshooting

### Can't find Payment Links in Square Dashboard
- **Check**: Make sure you're using a Square account (not just a test account)
- **Check**: Look under "Orders & Payments" → "Payment Links"
- **Check**: Try searching for "Payment Links" in the dashboard search bar

### Quick Pay link still shows description
- **Check**: Make sure you created a "Quick Pay" link, not a "Checkout" link
- **Check**: Quick Pay links use `square.link/u/...` format
- **Check**: Test the link directly in your browser first

### Payment link not working
- **Check**: Verify the link is correct (starts with `https://square.link/u/`)
- **Check**: Test the link directly in your browser
- **Check**: Make sure your Square account is activated

---

## Summary

1. ✅ Go to Square Dashboard → Payment Links
2. ✅ Create a "Collect a payment" link (Quick Pay)
3. ✅ Enter event name and price
4. ✅ Copy the `square.link/u/...` URL
5. ✅ Add to your code (`.env` file or directly in `App.jsx`)
6. ✅ Test - should go directly to payment form

Your Quick Pay link will go directly to the payment form without showing a description page! 🎉

---

## Need Help?

- **Square Support**: https://squareup.com/help
- **Square Payment Links Guide**: https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links
- **Square Developer Docs**: https://developer.squareup.com/docs

