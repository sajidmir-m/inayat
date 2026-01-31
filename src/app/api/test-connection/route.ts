import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      })
    }

    const supabase = await createClient()

    // Test 1: Check auth connection
    const { data: authData, error: authError } = await supabase.auth.getUser()

    // Test 2: Check database connection
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    return NextResponse.json({
      success: true,
      auth: {
        connected: !authError,
        error: authError?.message || null
      },
      database: {
        connected: !tableError,
        error: tableError?.message || null,
        code: tableError?.code || null
      },
      message: "Connection test completed"
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Connection test failed',
      details: error.toString()
    })
  }
}

