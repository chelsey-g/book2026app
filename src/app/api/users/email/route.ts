import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { newEmail } = body

    if (!newEmail) {
      return NextResponse.json(
        { error: 'New email is required' },
        { status: 400 }
      )
    }

    if (!newEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (newEmail === user.email) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      console.error('Email update error:', updateError)
      if (updateError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent to your new email address. Please verify it to complete the change.',
    })
  } catch (error) {
    console.error('Email change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
