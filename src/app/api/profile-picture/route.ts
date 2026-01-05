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

    const formData = await request.formData()
    const file = formData.get('profilePicture') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Generate unique filename
     const fileExt = file.name.split('.').pop()
     const fileName = `${user.id}_${Date.now()}.${fileExt}`
     const filePath = fileName

    // Convert file to buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

     const { data: uploadData, error: uploadError } = await supabase.storage
       .from('profile-pictures')
       .upload(filePath, buffer, {
         contentType: file.type,
         upsert: true
       })

     if (uploadError) {
       console.error('Upload error:', uploadError)
       return NextResponse.json(
         { error: `Upload failed: ${uploadError.message}` },
         { status: 500 }
       )
     }

     const { data: { publicUrl } } = supabase.storage
       .from('profile-pictures')
       .getPublicUrl(filePath)

     const { error: updateError } = await supabase
       .from('users')
       .update({ image: publicUrl })
       .eq('id', user.id)

     if (updateError) {
       console.error('Database update error:', updateError)
       try {
         await supabase.storage
           .from('profile-pictures')
           .remove([filePath])
       } catch (e) {
         console.error('Failed to clean up storage:', e)
       }
       return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
     }

     return NextResponse.json({ 
       success: true, 
       profilePictureUrl: publicUrl 
     })

   } catch (error) {
     console.error('Profile picture upload error:', error)
     const errorMessage = error instanceof Error ? error.message : 'Unknown error'
     return NextResponse.json(
       { error: `Internal server error: ${errorMessage}` },
       { status: 500 }
     )
   }
}
