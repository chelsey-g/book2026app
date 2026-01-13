import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(request: NextRequest) {
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
    const { username, currentPassword, newPassword, searchHistoryEnabled } = body

    if (!username && !newPassword && searchHistoryEnabled === undefined) {
      return NextResponse.json(
        { error: 'Please provide username, new password, or preference to update' },
        { status: 400 }
      )
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password required for password change' },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters' },
          { status: 400 }
        )
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (passwordError) {
        console.error('Password update error:', passwordError)
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        )
      }
    }

    if (username) {
      if (username.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters' },
          { status: 400 }
        )
      }

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single()

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id)

      if (updateError) {
        console.error('Username update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update username' },
          { status: 500 }
        )
      }
    }

    if (searchHistoryEnabled !== undefined) {
      if (typeof searchHistoryEnabled !== 'boolean') {
        return NextResponse.json(
          { error: 'searchHistoryEnabled must be a boolean' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ search_history_enabled: searchHistoryEnabled })
        .eq('id', user.id)

      if (updateError) {
        console.error('Search history preference update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update search history preference' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
