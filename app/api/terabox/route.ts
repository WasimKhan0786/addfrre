import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Check if it's a Terabox URL
    if (!url.includes('terabox.com') && !url.includes('1024terabox.com')) {
      return NextResponse.json(
        { error: 'Invalid Terabox URL' },
        { status: 400 }
      )
    }

    // Note: Terabox requires authentication and has CORS protection
    // Direct extraction is not possible without proper API access
    // For now, we'll return the original URL to open in new tab
    
    return NextResponse.json({
      success: false,
      originalUrl: url,
      message: 'Terabox videos require authentication. Please open in Terabox to watch.',
      suggestion: 'Click "Open in Terabox" button to watch the video'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
