# 🚀 Quick Start Guide

## Setup in 5 Minutes

### 1️⃣ Database Setup (2 minutes)
1. Open Supabase Dashboard → **SQL Editor**
2. Copy **entire** `supabase/schema.sql` → Paste → **Run** ✅
3. Copy **entire** `supabase/seed-data.sql` → Paste → **Run** ✅

### 2️⃣ Storage Bucket (1 minute)
1. Go to **Storage** → **New bucket**
2. Name: `packages`
3. **Toggle Public ON** ✅
4. **Create**

### 3️⃣ Storage Policies (1 minute)
1. Go to **SQL Editor**
2. Copy and run this:

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

### 4️⃣ Create Admin Account (1 minute)
1. Go to `/admin/register`
2. Fill form → **Create Admin Account** ✅
3. Go to `/admin/login` → Login ✅

## ✅ Done! You Can Now:

- ✅ **View Dashboard:** `/admin`
- ✅ **Manage Journeys:** `/admin/journeys` (6 sample journeys already added!)
- ✅ **Manage Services:** `/admin/services` (6 sample services already added!)
- ✅ **View Contacts:** `/admin/contacts` (3 sample contacts already added!)
- ✅ **Create New Journey:** Click "+ New Journey" button
- ✅ **Edit Journey:** Click edit icon on any journey
- ✅ **Upload Images:** Upload main image + additional images
- ✅ **Edit Services:** Click edit icon on any service

## 📋 What's Included in Seed Data

### 6 Sample Journeys:
- Majestic Kashmir Tour (₹18,500)
- Honeymoon Special Kashmir (₹25,000)
- Adventure in Gulmarg (₹15,000)
- Kashmir Winter Wonderland (₹22,000)
- Gurez Valley Expedition (₹28,000)
- Quick Weekend Getaway (₹12,000)

### 6 Sample Services:
- 24/7 Customer Support
- Custom Itineraries
- Local Expert Guides
- Luxury Accommodations
- Photography Services
- Transportation

### 3 Sample Contacts:
- Sample inquiries for testing

## 🎨 Customize Everything

All data can be edited through the admin panel:
- Edit journey details, prices, descriptions
- Upload your own images
- Add/remove services
- Everything is editable from the admin panel!

## 🆘 Need Help?

- **Full Setup Guide:** See `SETUP_CHECKLIST.md`
- **Storage Setup:** See `STORAGE_SETUP.md`
- **Troubleshooting:** Check browser console for errors

---

**You're all set! Start managing your content! 🎉**

