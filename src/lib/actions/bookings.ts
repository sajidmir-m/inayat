"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBooking(formData: {
  packageId: string
  name: string
  email: string
  phone: string
  date: string
  persons: number
  message?: string
}) {
  const supabase = await createClient()

  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.persons) {
      return { error: 'All required fields must be filled' }
    }

    // Validate package exists
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id, title')
      .eq('id', formData.packageId)
      .single()

    if (packageError || !packageData) {
      return { error: 'Package not found' }
    }

    // Insert booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        package_id: formData.packageId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        persons: parseInt(formData.persons.toString()),
        message: formData.message?.trim() || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return { error: error.message || 'Failed to create booking' }
    }

    revalidatePath('/admin/bookings')
    return { data, error: null }
  } catch (err: any) {
    console.error('Unexpected error creating booking:', err)
    return { error: err.message || 'An unexpected error occurred' }
  }
}

export async function getBookings() {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { data: null, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (
          id,
          title,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return { data: null, error: error.message }
    }

    // Transform data to include package name and calculate total amount
    const transformedData = data?.map(booking => ({
      ...booking,
      packageName: booking.packages?.title || 'Package Not Found',
      packagePrice: booking.packages?.price || 0,
      totalAmount: (booking.packages?.price || 0) * booking.persons
    })) || []

    return { data: transformedData, error: null }
  } catch (err: any) {
    console.error('Unexpected error fetching bookings:', err)
    return { data: null, error: err.message || 'Failed to fetch bookings' }
  }
}

export async function getBookingById(id: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { data: null, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        packages (
          id,
          title,
          price,
          description,
          location,
          duration
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return {
      data: {
        ...data,
        packageName: data.packages?.title || 'Package Not Found',
        packagePrice: data.packages?.price || 0,
        totalAmount: (data.packages?.price || 0) * data.persons
      },
      error: null
    }
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch booking' }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/bookings')
    return { error: null }
  } catch (err: any) {
    return { error: err.message || 'Failed to update booking status' }
  }
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.role !== 'admin') {
      return { error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/bookings')
    return { error: null }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete booking' }
  }
}
