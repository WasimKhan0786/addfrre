import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Handle Terabox links
    if (url.includes('terabox.com') || url.includes('1024terabox.com')) {
      try {
        // Extract the share code from URL
        const shareMatch = url.match(/\/s\/([a-zA-Z0-9_-]+)/)
        
        if (!shareMatch) {
          return NextResponse.json(
            { error: 'Invalid Terabox link format' },
            { status: 400 }
          )
        }

        // Fetch the Terabox page to extract video info
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        })

        const html = await response.text()
        
        // Try to extract direct video URL from the page
        // Terabox embeds video info in the page
        const videoUrlMatch = html.match(/"dlink":"([^"]+)"/) || 
                             html.match(/"path":"([^"]+\.mp4[^"]*)"/)
        
        if (videoUrlMatch) {
          let videoUrl = videoUrlMatch[1]
          // Decode escaped characters
          videoUrl = videoUrl.replace(/\\u002F/g, '/').replace(/\\\//g, '/')
          
          return NextResponse.json({
            success: true,
            videoUrl: videoUrl,
            message: 'Terabox video extracted successfully'
          })
        }

        // If direct extraction fails, return the original URL
        // The iframe player might still work
        return NextResponse.json({
          success: true,
          videoUrl: url,
          message: 'Using Terabox embed player',
          isEmbed: true
        })

      } catch (error) {
        console.error('Terabox extraction error:', error)
        return NextResponse.json(
          { error: 'Could not extract video from Terabox. The link might be private or expired.' },
          { status: 400 }
        )
      }
    }

    // For other URLs, return as-is
    return NextResponse.json({
      success: true,
      videoUrl: url,
      message: 'Video URL processed successfully'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to process video URL' },
      { status: 500 }
    )
  }
}
