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
    console.log('Received FormData keys:', Array.from(formData.keys()))
    const file = formData.get('profilePicture') as File

    console.log('File received:', file ? { name: file.name, type: file.type, size: file.size } : 'null')

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
        .from('avatar_images')
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

      // Construct the public URL directly for public buckets
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
      }
      
      // For public buckets, use the direct public URL format
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/avatar_images/${fileName}`

      console.log('Constructed public URL:', imageUrl)

      const { error: updateError } = await supabase
        .from('users')
        .update({ image: imageUrl })
        .eq('id', user.id)
        .select()

      if (updateError) {
      console.error('Database update error:', updateError)
      try {
        await supabase.storage
          .from('avatar_images')
          .remove([filePath])
      } catch (e) {
        console.error('Failed to clean up storage:', e)
      }

      return NextResponse.json({ error: 'Failed to update profile' + updateError.message }, { status: 500 })
    }

    try {
      const updatedUser = await supabase
        .from('users')
        .select('image')
        .eq('id', user.id)
        .single()

      console.log('Updated user image:', updatedUser.data?.image)

      return NextResponse.json({
        success: true,
        profilePictureUrl: imageUrl
      })
    } catch (error) {
      console.error('Profile picture upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json(
        { error: `Internal server error: ${errorMessage}` },
        { status: 500 }
      )
    }

   } catch (error) {
     console.error('Profile picture upload error:', error)
     const errorMessage = error instanceof Error ? error.message : 'Unknown error'
     return NextResponse.json(
       { error: `Internal server error: ${errorMessage}` },
       { status: 500 }
     )
   }
}
