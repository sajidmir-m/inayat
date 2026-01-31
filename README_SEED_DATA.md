# 🌱 Seed Data & Admin Panel Setup

## ✅ What's Been Created

### 1. **Seed Data File** (`supabase/seed-data.sql`)
Contains sample data ready to import:
- ✅ **6 Sample Journeys/Packages** with full details
- ✅ **6 Sample Services** with icons
- ✅ **3 Sample Contact Inquiries** for testing

### 2. **Setup Guides**
- ✅ `SETUP_CHECKLIST.md` - Complete step-by-step setup
- ✅ `STORAGE_SETUP.md` - Storage bucket configuration
- ✅ `QUICK_START.md` - 5-minute quick setup

## 🚀 Quick Setup Steps

### Step 1: Run Database Schema
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/schema.sql
```

### Step 2: Add Seed Data
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/seed-data.sql
```

### Step 3: Create Storage Bucket
1. Go to **Storage** → **New bucket**
2. Name: `packages`
3. **Make it Public** ✅
4. Create

### Step 4: Set Storage Policies
Run in SQL Editor:
```sql
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
USING (bucket_id = 'packages');

CREATE POLICY "Admins can upload package images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can manage package images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);
```

### Step 5: Create Admin Account
- Go to `/admin/register`
- Create your admin account
- Login at `/admin/login`

## 📋 What You Can Edit in Admin Panel

### ✅ Journeys/Packages (`/admin/journeys`)
- **View all journeys** - See list with search & filters
- **Create new journey** - Click "+ New Journey" button
- **Edit journey** - Click edit icon on any journey
- **Delete journey** - Click delete icon
- **Upload images** - Main image + multiple additional images
- **Set featured** - Toggle featured status
- **Set status** - Active or Draft
- **Edit all fields:**
  - Title, Price, Days, Nights, Duration
  - Description, Location, Category
  - Itinerary (JSON), Inclusions, Exclusions
  - Rating

### ✅ Services (`/admin/services`)
- **View all services** - See list with search
- **Create new service** - Click "+" button
- **Edit service** - Click edit icon
- **Delete service** - Click delete icon
- **Set featured** - Toggle featured status
- **Choose icon** - Select from available icons
- **Edit fields:**
  - Title, Description, Icon, Status

### ✅ Contacts (`/admin/contacts`)
- **View all inquiries** - See list with filters
- **Update status** - Pending/Replied/Closed
- **View details** - Full message and contact info
- **Delete inquiry** - Remove old inquiries

### ✅ Dashboard (`/admin`)
- **View statistics** - Total bookings, contacts, etc.
- **Recent activity** - Latest bookings and contacts

## 🎨 Sample Data Included

### Journeys:
1. **Majestic Kashmir Tour** - ₹18,500 (5D/4N) - Family
2. **Honeymoon Special Kashmir** - ₹25,000 (6D/5N) - Honeymoon
3. **Adventure in Gulmarg** - ₹15,000 (4D/3N) - Adventure
4. **Kashmir Winter Wonderland** - ₹22,000 (5D/4N) - Family
5. **Gurez Valley Expedition** - ₹28,000 (7D/6N) - Offbeat
6. **Quick Weekend Getaway** - ₹12,000 (3D/2N) - Family

### Services:
1. 24/7 Customer Support
2. Custom Itineraries
3. Local Expert Guides
4. Luxury Accommodations
5. Photography Services
6. Transportation

## 📝 Important Notes

### Image URLs in Seed Data
The seed data uses Unsplash placeholder URLs. After setup:
1. Go to `/admin/journeys`
2. Click edit on any journey
3. Upload your own images
4. Images will be stored in your `packages` bucket

### Editing Everything
- ✅ All content is editable through the admin panel
- ✅ No need to touch the database manually
- ✅ Changes are saved immediately
- ✅ Images upload directly to Supabase Storage

### Storage Bucket
- **Name must be:** `packages` (exact match)
- **Must be Public** for images to display
- **Policies must be set** for uploads to work

## 🎯 Next Steps After Setup

1. ✅ **Review seed data** - Check if sample journeys look good
2. ✅ **Upload real images** - Replace placeholder images with your photos
3. ✅ **Customize content** - Edit titles, descriptions, prices
4. ✅ **Add more journeys** - Create new packages through admin panel
5. ✅ **Test everything** - Make sure all features work

## ✅ You're All Set!

Everything is ready:
- ✅ Database schema created
- ✅ Seed data available
- ✅ Admin panel fully functional
- ✅ Image upload ready (after bucket setup)
- ✅ All CRUD operations working

**Start managing your content through the admin panel! 🎉**

