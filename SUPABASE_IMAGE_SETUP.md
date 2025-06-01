# 🖼️ Adding Image Support to Supabase Products

## Current Status
✅ **Product links updated** - All products now have real affiliate URLs instead of example.com
❌ **Images missing** - The Supabase Product table doesn't have an `image` column yet

## How to Add Image Column

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to your project: `uubjjjxzywpyxiqcxnfn`
3. Go to Table Editor → Product table
4. Click "Add Column" 
5. Add new column:
   - **Name**: `image`
   - **Type**: `text`
   - **Default**: `null`
   - **Nullable**: ✅ (checked)

### Option 2: SQL Editor
Run this SQL in your Supabase SQL Editor:
```sql
ALTER TABLE "Product" ADD COLUMN image TEXT;
```

## After Adding Image Column

Once the image column is added, run this script to update all products with images:
```bash
node scripts/updateSupabaseProducts.js
```

This will update all products with:
- ✅ Real affiliate links (already done)
- 🖼️ High-quality product images

## Product Images Available

The script will add these images:
- **MacBook Pro 14"**: Apple official product image
- **MacBook Air M2**: Apple official product image  
- **Premium Wireless Headphones**: Unsplash high-quality stock photo
- **Smart Home Hub**: Unsplash smart device photo
- **Smart TVs**: Unsplash TV/display photos
- **Professional Blenders**: Unsplash kitchen appliance photos
- **Office/Gaming Chairs**: Unsplash furniture photos

All images are:
- 800x800 optimized resolution
- High quality from Unsplash or official product sources
- Proper crop and fit for product display

## Testing After Setup

Search for products in the app:
1. **"macbook"** → Should show Apple MacBooks with images
2. **"chair"** → Should show office/gaming chairs with images  
3. **"headphones"** → Should show wireless headphones with images

## Current Search Results (Links Working)

✅ MacBook search now returns:
- MacBook Pro 14" M2: https://www.apple.com/macbook-pro-14-and-16/
- MacBook Air M2: https://www.apple.com/macbook-air-m2/

✅ Chair search now returns:  
- Gaming Chair: https://www.amazon.com/dp/B08T1YX8JD
- Office Chairs: https://www.herman-miller.com/products/seating/office-chairs/aeron-chairs/

✅ All other products have proper affiliate links to Amazon, Best Buy, Vitamix, etc.