"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function registerAdmin(email: string, password: string, name: string) {
  const supabase = await createClient()

  try {
    // Sign up the user in Supabase Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/login`
      }
  })

  if (signUpError) {
      if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
        return {
          success: false,
          error: "This email is already registered. Please use the login page instead.",
          code: 'USER_EXISTS'
        }
      }
      
    return {
      success: false,
        error: signUpError.message || "Failed to create account. Please try again.",
      code: signUpError.status
    }
  }

  if (!authData.user) {
    return {
      success: false,
        error: "Failed to create user account. Please try again."
    }
  }

    // Wait a moment for the trigger to potentially create the user record
    await new Promise(resolve => setTimeout(resolve, 500))

    // Try to create user record in public.users with admin role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: authData.user.email || email,
      name: name,
      role: 'admin'
    })
    .select()
    .single()

  if (userError) {
      // If insert fails due to RLS, try updating if record exists (from trigger)
      if (userError.code === '42501' || userError.message.includes('permission')) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ 
            role: 'admin',
            name: name,
            email: authData.user.email || email
          })
          .eq('id', authData.user.id)
          .select()
          .single()

        if (updateError) {
          return {
            success: false,
            error: "Account created but failed to set admin role. Please contact support.",
            code: updateError.code
          }
        }

        return {
          success: true,
          user: updatedUser,
          message: "Admin account created successfully! You can now login."
        }
      }

      // If record already exists, try updating it
      if (userError.code === '23505') {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ 
            role: 'admin',
            name: name
          })
          .eq('id', authData.user.id)
          .select()
          .single()

        if (!updateError && updatedUser) {
          return {
            success: true,
            user: updatedUser,
            message: "Admin account updated successfully! You can now login."
          }
        }
      }

    return {
      success: false,
        error: userError.message || "Failed to create user profile",
        code: userError.code
    }
  }

  return {
    success: true,
    user: userData,
      message: "Admin account created successfully! You can now login."
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during registration"
    }
  }
}

export async function createOrUpdateUser(userId: string, email: string, role: string = 'customer') {
  const supabase = await createClient()

  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle()

  if (checkError && checkError.code !== 'PGRST116') {
    return { 
      success: false, 
      error: checkError.message, 
      code: checkError.code
    }
  }

  if (existingUser) {
    if (existingUser.role !== role) {
      const { data, error } = await supabase
        .from('users')
        .update({ role, email })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { 
          success: false, 
          error: error.message, 
          code: error.code
        }
      }
      return { success: true, user: data }
    }
    return { success: true, user: { ...existingUser, email } }
  } else {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        role
      })
      .select()
      .single()

    if (error) {
      return { 
        success: false, 
        error: error.message, 
        code: error.code
      }
    }

    return { success: true, user: data }
  }
}

export async function checkUserRole(userId: string) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        success: false,
        error: 'Supabase configuration missing. Please check your environment variables.',
        exists: false
      }
    }

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Invalid user ID',
        exists: false
      }
    }

  const supabase = await createClient()

    // Verify we have a valid session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      return {
        success: false,
        error: 'Authentication session expired. Please login again.',
        exists: false
      }
    }

    // Verify the userId matches the authenticated user
    if (authUser.id !== userId) {
      return {
        success: false,
        error: 'User ID mismatch. Please login again.',
        exists: false
      }
    }

    // Try direct query first (more reliable)
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
      // If error is permission denied, try RPC
      if (error.code === '42501' || error.message.includes('permission')) {
        try {
          const { data: adminCheck, error: funcError } = await supabase.rpc('is_admin')
          if (!funcError && adminCheck === true) {
            return {
              success: true,
              user: { id: userId, role: 'admin' },
              isAdmin: true,
              exists: true
            }
          }
        } catch (rpcErr) {
          // RPC failed, return original error
        }
      }

    return { 
      success: false, 
        error: error.message || 'Failed to check user role',
        code: error.code || 'UNKNOWN',
      exists: false
    }
  }

  if (!data) {
    return {
      success: false,
      exists: false,
        error: 'User record not found in database. Please ensure your user record exists.'
    }
  }

    const role = data.role?.toString().toLowerCase().trim()
    const isAdmin = role === 'admin'

  return { 
    success: true, 
    user: data,
      isAdmin: isAdmin,
    exists: true
    }
  } catch (err: any) {
    // Ensure error is serializable
    const errorMessage = err?.message || err?.toString() || 'Unexpected error checking user role'
    console.error('checkUserRole error:', err)
    return {
      success: false,
      error: errorMessage,
      exists: false
    }
  }
}
