"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  try {
    const supabase = await createClient()
    // Get journeys count
    const { count: journeysCount } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })

    const { count: featuredJourneysCount } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)

    // Get bookings count
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Get contacts count
    const { count: contactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })

    const { count: pendingContactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get services count
    const { count: servicesCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })

    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        name,
        email,
        phone,
        date,
        persons,
        status,
        created_at,
        packages:package_id (
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(4)

    // Get recent contacts
    const { data: recentContacts } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)

    return {
      journeys: journeysCount || 0,
      featuredJourneys: featuredJourneysCount || 0,
      bookings: bookingsCount || 0,
      contacts: contactsCount || 0,
      pendingContacts: pendingContactsCount || 0,
      services: servicesCount || 0,
      recentBookings: recentBookings || [],
      recentContacts: recentContacts || []
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      journeys: 0,
      featuredJourneys: 0,
      bookings: 0,
      contacts: 0,
      pendingContacts: 0,
      services: 0,
      recentBookings: [],
      recentContacts: []
    }
  }
}
