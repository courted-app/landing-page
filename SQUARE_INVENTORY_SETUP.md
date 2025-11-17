# Square Inventory Tracking Setup

Square has built-in inventory management that can automatically track and limit quantities for your payment links. This is much simpler than manual tracking!

## Important: Quick Pay vs Item-Based Payment Links

- **Quick Pay Links** (`square.link/u/...`) - Simple payment links, **DO NOT support inventory tracking**
- **Item-Based Payment Links** - Created from items in your Square catalog, **DO support inventory tracking**

To use Square's inventory tracking, you need to create a payment link from an **Item** in your Square catalog, not a Quick Pay link.

---

## Step-by-Step: Set Up Square Inventory Tracking

### Step 1: Create an Item in Square

1. Go to **https://squareup.com/dashboard**
2. Sign in to your Square account
3. Navigate to **Items & Services** → **Items**
4. Click **"Add Item"** or **"Create Item"**
5. Fill in the item details:
   - **Name**: "Event Ticket" (or your event name)
   - **Price**: $40.00 (or your ticket price)
   - **Description**: (Optional - describe your event)
   - **Image**: (Optional - add event image)
6. **IMPORTANT**: Scroll down to **"Manage Inventory"** section
7. Toggle **"Track Stock"** to **ON**
8. Set **"Stock Count"** to your total number of tickets (e.g., 50)
9. (Optional) Set **"Low Stock Alert"** if you want notifications
10. Click **"Save"**

### Step 2: Create Payment Link from the Item

1. Still in Square Dashboard, go to **Online** → **Payment Links** (or **Payment Links** in sidebar)
2. Click **"Create a link"** or **"New Payment Link"**
3. **Select "Sell an item"** (NOT "Collect a payment")
4. Choose the item you just created (the one with inventory tracking enabled)
5. Customize the link if needed
6. Click **"Create link"** or **"Generate Link"**
7. Copy the payment link URL

### Step 3: Update Your Code

Replace your Quick Pay link with the new item-based payment link:

**Option A: Using Environment Variable (Recommended)**

1. Open or update your `.env` file:
   ```env
   VITE_SQUARE_PAYMENT_LINK=https://square.link/u/YOUR_ITEM_BASED_LINK_ID
   ```

2. Restart your development server

**Option B: Direct in Code**

1. Open `src/App.jsx`
2. Find the `SQUARE_PAYMENT_LINK` constant
3. Update it with your new item-based payment link

---

## How It Works

✅ **Automatic Inventory Tracking**: Square automatically decrements inventory when someone purchases
✅ **Sold Out Protection**: Square will show "Out of Stock" or disable the link when inventory reaches 0
✅ **No Manual Updates**: You don't need to manually track inventory in Google Sheets
✅ **Real-time Updates**: Inventory updates immediately when purchases are made

---

## Benefits Over Manual Tracking

| Manual Tracking (Google Sheets) | Square Built-in Inventory |
|--------------------------------|---------------------------|
| Requires custom code | Built into Square |
| Race condition handling needed | Handled automatically |
| Manual updates required | Automatic updates |
| Can have sync issues | Always in sync |
| More complex setup | Simple setup |

---

## Important Notes

1. **Quick Pay Links Don't Support Inventory**: If you're using a Quick Pay link (`square.link/u/...` created via "Collect a payment"), it won't track inventory. You must create a payment link from an Item.

2. **Item Must Have Inventory Tracking Enabled**: Make sure you enable "Track Stock" on the item before creating the payment link.

3. **Inventory Updates Automatically**: When someone completes a purchase through the payment link, Square automatically:
   - Decrements the stock count
   - Prevents overselling
   - Shows "Out of Stock" when inventory reaches 0

4. **You Can Still View Inventory**: You can see current inventory levels in Square Dashboard under **Items & Services** → **Items** → Select your item → **Manage Inventory**

---

## Removing Manual Inventory Code (Optional)

If you switch to Square's built-in inventory tracking, you can:

1. **Keep the code** (it won't interfere, just won't be used)
2. **Remove it** to simplify your codebase:
   - Remove inventory state from `App.jsx`
   - Remove inventory fetching logic
   - Remove `handlePaymentClick` inventory reservation logic
   - Keep the payment link as a simple `<a>` tag

---

## Troubleshooting

### Payment link still allows purchases when out of stock
- **Check**: Make sure you created the link from an Item (not Quick Pay)
- **Check**: Verify "Track Stock" is enabled on the item
- **Check**: Check current stock count in Square Dashboard

### Can't find "Track Stock" option
- **Check**: Make sure you're editing an Item, not creating a Quick Pay link
- **Check**: Look under "Manage Inventory" section when editing the item
- **Check**: Some Square account types may have different interfaces

### Inventory not updating
- **Check**: Verify the payment link is created from the item with inventory tracking
- **Check**: Test a purchase and check if inventory decrements in Square Dashboard
- **Check**: Make sure you're using the correct payment link (item-based, not Quick Pay)

---

## Summary

1. ✅ Create an Item in Square Dashboard
2. ✅ Enable "Track Stock" and set initial quantity
3. ✅ Create Payment Link from that Item (not Quick Pay)
4. ✅ Use the new payment link in your code
5. ✅ Square automatically tracks inventory - no manual code needed!

---

## Need Help?

- **Square Support**: https://squareup.com/help
- **Square Inventory Guide**: https://squareup.com/help/us/en/article/6142-track-your-square-inventory
- **Square Payment Links**: https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links

