-- ============================================
-- SEED DATA FOR KHALEEJ TOUR AND TRAVEL
-- ============================================
-- Run this AFTER running schema.sql
-- This adds sample data for testing and demonstration
-- ============================================

-- ============================================
-- SEED SERVICES
-- ============================================
INSERT INTO public.services (id, title, description, icon, status, featured, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '24/7 Customer Support',
  'Round-the-clock assistance for all your travel needs. Our dedicated team is always ready to help you.',
  'ShieldCheck',
  'active',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Custom Itineraries',
  'Tailor-made travel plans designed specifically for your preferences, budget, and schedule.',
  'Map',
  'active',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Local Expert Guides',
  'Experienced local guides who know every hidden gem and can make your journey unforgettable.',
  'Star',
  'active',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Luxury Accommodations',
  'Handpicked hotels and resorts that offer comfort, luxury, and authentic local experiences.',
  'Home',
  'active',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Photography Services',
  'Professional photography to capture your beautiful moments and create lasting memories.',
  'Camera',
  'active',
  false,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Transportation',
  'Comfortable and reliable transportation for all your travel needs throughout your journey.',
  'Car',
  'active',
  false,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED PACKAGES/JOURNEYS
-- ============================================
INSERT INTO public.packages (id, title, price, days, nights, duration, description, location, category, rating, status, featured, main_image_url, itinerary, inclusions, exclusions, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Majestic Kashmir Tour',
  18500,
  5,
  4,
  '5 Days / 4 Nights',
  'Experience the breathtaking beauty of Kashmir with our Majestic Kashmir Tour. Visit the iconic Dal Lake, the snow-capped mountains of Gulmarg, and the lush valleys of Pahalgam. This comprehensive tour includes houseboat stays, Shikara rides, and visits to the most beautiful destinations in the valley.',
  'Srinagar, Gulmarg, Pahalgam',
  'Family',
  4.8,
  'active',
  true,
  'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival in Srinagar", "desc": "Pickup from airport, check-in to houseboat. Evening Shikara ride on Dal Lake."},
    {"day": 2, "title": "Srinagar to Gulmarg", "desc": "Day trip to Gulmarg. Enjoy Gondola ride and snow activities."},
    {"day": 3, "title": "Srinagar to Pahalgam", "desc": "Drive to Pahalgam. Visit Saffron fields and Avantipura ruins en route."},
    {"day": 4, "title": "Pahalgam Sightseeing", "desc": "Explore Betaab Valley, Aru Valley, and Chandanwari."},
    {"day": 5, "title": "Departure", "desc": "Transfer to Srinagar airport for departure."}
  ]'::jsonb,
  ARRAY['Airport Pickup & Drop', '3 Star Hotel Stay', 'Breakfast & Dinner', 'Shikara Ride', 'Private Cab for Sightseeing'],
  ARRAY['Lunch', 'Personal Expenses', 'Union Cab in Pahalgam', 'Gondola Tickets'],
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Honeymoon Special Kashmir',
  25000,
  6,
  5,
  '6 Days / 5 Nights',
  'A romantic getaway designed for couples. Enjoy private houseboat stays, candlelight dinners, and intimate experiences in the most beautiful locations of Kashmir.',
  'Srinagar, Sonamarg, Yusmarg',
  'Honeymoon',
  4.9,
  'active',
  true,
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival & Houseboat Check-in", "desc": "Romantic houseboat stay with private Shikara ride."},
    {"day": 2, "title": "Srinagar City Tour", "desc": "Visit Mughal Gardens and enjoy local shopping."},
    {"day": 3, "title": "Sonamarg Day Trip", "desc": "Scenic drive to Sonamarg, the Meadow of Gold."},
    {"day": 4, "title": "Yusmarg Exploration", "desc": "Visit the beautiful Yusmarg valley."},
    {"day": 5, "title": "Leisure Day", "desc": "Free day to explore or relax."},
    {"day": 6, "title": "Departure", "desc": "Transfer to airport with beautiful memories."}
  ]'::jsonb,
  ARRAY['Luxury Houseboat Stay', 'All Meals', 'Private Transportation', 'Romantic Dinner Setup', 'Flower Decoration'],
  ARRAY['Personal Expenses', 'Optional Activities'],
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Adventure in Gulmarg',
  15000,
  4,
  3,
  '4 Days / 3 Nights',
  'Perfect for adventure enthusiasts! Experience skiing, snowboarding, and other winter sports in the famous Gulmarg Ski Resort.',
  'Gulmarg Ski Resort',
  'Adventure',
  4.7,
  'active',
  true,
  'https://images.unsplash.com/photo-1562602740-423528430e8c?q=80&w=2070&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival in Gulmarg", "desc": "Check-in and orientation. Evening leisure."},
    {"day": 2, "title": "Skiing & Snow Activities", "desc": "Full day skiing and snowboarding activities."},
    {"day": 3, "title": "Gondola Ride & Exploration", "desc": "Cable car ride and mountain exploration."},
    {"day": 4, "title": "Departure", "desc": "Check-out and transfer."}
  ]'::jsonb,
  ARRAY['Ski Equipment Rental', 'Hotel Stay', 'Breakfast & Dinner', 'Gondola Tickets'],
  ARRAY['Lunch', 'Personal Expenses', 'Ski Lessons'],
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Kashmir Winter Wonderland',
  22000,
  5,
  4,
  '5 Days / 4 Nights',
  'Experience Kashmir in its winter glory with snow-covered landscapes, frozen lakes, and cozy stays.',
  'Gulmarg, Pahalgam',
  'Family',
  4.6,
  'active',
  false,
  'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival", "desc": "Transfer to hotel in Srinagar."},
    {"day": 2, "title": "Gulmarg Winter Experience", "desc": "Snow activities and winter sports."},
    {"day": 3, "title": "Pahalgam Winter Wonderland", "desc": "Explore snow-covered valleys."},
    {"day": 4, "title": "Srinagar Sightseeing", "desc": "Visit frozen Dal Lake and gardens."},
    {"day": 5, "title": "Departure", "desc": "Transfer to airport."}
  ]'::jsonb,
  ARRAY['Hotel Stay', 'All Meals', 'Winter Gear', 'Transportation'],
  ARRAY['Personal Expenses', 'Optional Activities'],
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Gurez Valley Expedition',
  28000,
  7,
  6,
  '7 Days / 6 Nights',
  'An offbeat journey to the hidden gem of Kashmir - Gurez Valley. Experience untouched natural beauty and authentic local culture.',
  'Gurez, Tulail',
  'Offbeat',
  4.9,
  'active',
  false,
  'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2070&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival in Srinagar", "desc": "Check-in and preparation for the journey."},
    {"day": 2, "title": "Drive to Gurez", "desc": "Scenic drive through Razdan Pass to Gurez Valley."},
    {"day": 3, "title": "Gurez Exploration", "desc": "Explore the beautiful Gurez Valley."},
    {"day": 4, "title": "Tulail Valley Visit", "desc": "Visit the remote Tulail Valley."},
    {"day": 5, "title": "Local Culture Experience", "desc": "Interact with locals and experience their culture."},
    {"day": 6, "title": "Return to Srinagar", "desc": "Drive back to Srinagar."},
    {"day": 7, "title": "Departure", "desc": "Transfer to airport."}
  ]'::jsonb,
  ARRAY['Accommodation', 'All Meals', 'Local Guide', 'Transportation', 'Permits'],
  ARRAY['Personal Expenses', 'Optional Activities'],
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Quick Weekend Getaway',
  12000,
  3,
  2,
  '3 Days / 2 Nights',
  'Perfect for a short break! Experience the best of Srinagar in just 3 days.',
  'Srinagar',
  'Family',
  4.5,
  'active',
  false,
  'https://images.unsplash.com/photo-1597167640038-165b67d58189?q=80&w=2070&auto=format&fit=crop',
  '[
    {"day": 1, "title": "Arrival & Dal Lake", "desc": "Check-in to houseboat and Shikara ride."},
    {"day": 2, "title": "City Tour", "desc": "Visit Mughal Gardens and local markets."},
    {"day": 3, "title": "Departure", "desc": "Check-out and transfer."}
  ]'::jsonb,
  ARRAY['Houseboat Stay', 'Breakfast & Dinner', 'Shikara Ride', 'Transportation'],
  ARRAY['Lunch', 'Personal Expenses'],
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED SAMPLE CONTACTS (Optional - for testing)
-- ============================================
INSERT INTO public.contacts (id, name, email, phone, subject, message, status, created_at) VALUES
(
  gen_random_uuid(),
  'John Smith',
  'john.smith@example.com',
  '+91 9876543210',
  'Inquiry about Kashmir Tour',
  'I am interested in booking the Majestic Kashmir Tour for my family. Can you provide more details about the itinerary and pricing?',
  'pending',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  'Sarah Johnson',
  'sarah.j@example.com',
  '+91 9876543211',
  'Honeymoon Package Query',
  'We are planning our honeymoon and would like to know more about the Honeymoon Special package. What are the best months to visit?',
  'pending',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  'Michael Brown',
  'michael.brown@example.com',
  '+91 9876543212',
  'Group Booking',
  'We are a group of 15 people planning to visit Kashmir in December. Do you offer group discounts?',
  'replied',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
-- You now have:
-- ✅ 6 Sample Services
-- ✅ 6 Sample Packages/Journeys
-- ✅ 3 Sample Contact Inquiries
--
-- You can now:
-- 1. View and edit these in the admin panel
-- 2. Add more through the admin interface
-- 3. Upload images through the admin panel
-- ============================================

