# Storage Bucket Setup Guide

## 📦 Required Buckets

You need to create **one storage bucket** for package images:

### 1. Packages Bucket

**Purpose:** Store main images and additional images for travel packages/journeys

**Steps:**
1. Go to Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Enter bucket name: `packages`
4. **⚠️ IMPORTANT:** Toggle **"Public bucket"** to **ON** (this allows images to be viewed on your website)
5. Click **"Create bucket"**

## 🔐 Storage Policies Setup

After creating the bucket, you need to set up Row Level Security (RLS) policies. 

### Option 1: Using SQL Editor (Recommended)

Go to Supabase Dashboard → **SQL Editor** and run:

```sql
-- ============================================
-- STORAGE POLICIES FOR PACKAGES BUCKET
-- ============================================

-- Allow anyone to view images (public access)
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
USING (bucket_id = 'packages');

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Admins can upload package images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);

-- Allow admins to update images
CREATE POLICY "Admins can update package images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete package images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);
```

### Option 2: Using Dashboard (Alternative)

1. Go to **Storage** → **Policies**
2. Select the `packages` bucket
3. Click **"New Policy"**
4. For each policy:
   - **SELECT (View):** Public access
   - **INSERT (Upload):** Authenticated users only
   - **UPDATE:** Authenticated users only
   - **DELETE:** Authenticated users only

## ✅ Verification

### Test Image Upload
1. Go to `/admin/journeys/new`
2. Try uploading an image
3. If successful, you'll see the image preview
4. After saving, check if the image appears in the journey list

### Check Bucket Contents
1. Go to Supabase Dashboard → **Storage** → **packages**
2. You should see uploaded images here
3. Click on an image to get its public URL

## 🐛 Troubleshooting

### "Upload failed" error?
- ✅ Check bucket is created and named exactly `packages`
- ✅ Verify bucket is set to **Public**
- ✅ Check storage policies are set correctly
- ✅ Ensure you're logged in as admin

### Images not displaying on website?
- ✅ Check bucket is **Public**
- ✅ Verify the SELECT policy allows public access
- ✅ Check image URLs in the database are correct

### "Permission denied" error?
- ✅ Verify you're logged in as admin
- ✅ Check INSERT/UPDATE/DELETE policies allow authenticated users
- ✅ Refresh your session by logging out and back in

## 📝 File Naming

Images are automatically named with timestamps:
- Format: `packages/{timestamp}-{random}.{extension}`
- Example: `packages/1703123456789-abc123.jpg`

This prevents naming conflicts and keeps your bucket organized.

## 🎯 What Gets Stored

- **Main Image:** One primary image per package (shown in listings)
- **Additional Images:** Multiple images per package (shown in detail view)

All images are stored in the `packages` bucket with the path structure:
```
packages/
  ├── 1703123456789-abc123.jpg (main image)
  ├── 1703123456789-def456.jpg (additional)
  └── 1703123456789-ghi789.jpg (additional)
```

## ✅ You're Done!

Once the bucket is created and policies are set, you can:
- ✅ Upload images through the admin panel
- ✅ Images will be automatically stored in Supabase Storage
- ✅ Images will be publicly accessible on your website
- ✅ You can manage images directly from the admin panel

