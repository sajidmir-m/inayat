# Complete Setup Checklist

## ✅ Step-by-Step Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

#### 3.1 Create Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste entire `supabase/schema.sql`
3. Click "Run"
4. ✅ All tables, functions, and policies created

#### 3.2 Add Seed Data (Optional but Recommended)
1. In SQL Editor, copy and paste `supabase/seed-data.sql`
2. Click "Run"
3. ✅ Sample journeys, services, and contacts added

### 4. Storage Buckets Setup

#### 4.1 Create Packages Bucket
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `packages`
4. **Make it Public** (important!)
5. Click "Create"
6. ✅ Bucket created for package images

#### 4.2 Set Bucket Policies (Important!)
After creating the bucket, run this in SQL Editor:

```sql
-- Allow public to view images
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
USING (bucket_id = 'packages');

-- Allow authenticated users (admins) to upload
CREATE POLICY "Admins can upload package images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);

-- Allow admins to update/delete
CREATE POLICY "Admins can manage package images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'packages' AND
  auth.role() = 'authenticated'
);
```

### 5. Create Admin Account

#### Option 1: Registration Page (Recommended)
1. Go to `/admin/register`
2. Fill in your details
3. Your account will be created with admin role
4. Go to `/admin/login` and sign in

#### Option 2: Manual Creation
1. Go to Supabase Dashboard → Authentication → Users
2. Create a new user
3. Copy the User ID
4. Run this SQL:
```sql
INSERT INTO public.users (id, email, role)
VALUES ('your-user-id', 'your-email@example.com', 'admin');
```

### 6. Test Everything

#### 6.1 Test Connection
- Go to `/admin/test-connection`
- Should show database connected ✅

#### 6.2 Test Login
- Go to `/admin/login`
- Login with your credentials
- Should redirect to dashboard ✅

#### 6.3 Test Admin Panel
- View dashboard at `/admin`
- Check journeys at `/admin/journeys`
- Check services at `/admin/services`
- Check contacts at `/admin/contacts`

## 🎯 What You Can Do in Admin Panel

### Journeys/Packages Management
- ✅ View all journeys
- ✅ Create new journey (`/admin/journeys/new`)
- ✅ Edit existing journey (`/admin/journeys/[id]/edit`)
- ✅ Delete journey
- ✅ Upload main image
- ✅ Upload additional images
- ✅ Set featured status
- ✅ Set active/draft status

### Services Management
- ✅ View all services
- ✅ Create new service (click "+" button)
- ✅ Edit service (click edit icon)
- ✅ Delete service
- ✅ Set featured status
- ✅ Choose icon

### Contacts Management
- ✅ View all contact inquiries
- ✅ Update status (pending/replied/closed)
- ✅ View full message details
- ✅ Delete inquiries

### Dashboard
- ✅ View statistics
- ✅ See recent bookings
- ✅ See recent contacts

## 📝 Additional Setup (Optional)

### Email Configuration
If you want email notifications:
1. Configure SMTP in Supabase Dashboard → Settings → Auth
2. Set up email templates

### Custom Domain
1. Add your domain in Supabase Dashboard
2. Update `NEXT_PUBLIC_SITE_URL` in `.env.local`

## 🔧 Troubleshooting

### Images not uploading?
- Check storage bucket is created and public
- Verify bucket policies are set
- Check file size limits

### Can't edit journeys?
- Verify you're logged in as admin
- Check browser console for errors
- Verify RLS policies are set correctly

### Seed data not showing?
- Make sure you ran `seed-data.sql` after `schema.sql`
- Check if data exists: `SELECT * FROM public.packages;`
- Refresh the admin panel

## ✅ You're All Set!

Your admin panel is now fully functional. You can:
- Manage all content through the admin interface
- Upload images for packages
- Edit everything directly from the panel
- No need to touch the database manually!

