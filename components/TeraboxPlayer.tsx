'use client'

interface TeraboxPlayerProps {
  url: string
}

export default function TeraboxPlayer({ url }: TeraboxPlayerProps) {
  // Extract share code from URL
  const shareMatch = url.match(/\/s\/([a-zA-Z0-9_-]+)/)
  const shareCode = shareMatch ? shareMatch[1] : ''

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
      <div className="relative aspect-video bg-black">
        <iframe
          src={url}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="bg-gray-900 p-4">
        <p className="text-sm text-gray-400">
          Playing from Terabox. If video doesn't load, the link might be private or expired.
        </p>
      </div>
    </div>
  )
}
