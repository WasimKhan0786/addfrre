'use client'

import { useRef, useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import React from 'react'

interface VideoPlayerProps {
  url: string
  onEnded?: () => void
}

export default function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [seeking, setSeeking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [quality, setQuality] = useState<string>('auto')
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [isPiPSupported, setIsPiPSupported] = useState(false)
  const videoElementRef = useRef<HTMLVideoElement>(null)

  // Check if it's a Terabox link
  const isTerabox = url.includes('terabox.com') || url.includes('1024terabox.com')
  
  // Check if it's Instagram
  const isInstagram = url.includes('instagram.com')
  
  // Check if it's a direct video file (can be downloaded)
  const isDirectVideo = url.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i) !== null
  
  // Check if it's YouTube (quality selector works for YouTube)
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')

  const qualityOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 'hd1080', label: '1080p' },
    { value: 'hd720', label: '720p' },
    { value: 'large', label: '480p' },
    { value: 'medium', label: '360p' },
    { value: 'small', label: '240p' },
    { value: 'tiny', label: '144p' }
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value))
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value))
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePictureInPicture = async () => {
    try {
      // For ReactPlayer, we need to get the internal video element
      const player = playerRef.current
      if (!player) return

      // Get the internal player element
      const internalPlayer = player.getInternalPlayer() as HTMLVideoElement
      
      if (internalPlayer && 'requestPictureInPicture' in internalPlayer) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else {
          await internalPlayer.requestPictureInPicture()
        }
      } else {
        alert('Picture-in-Picture is not supported in your browser.')
      }
    } catch (error) {
      console.error('PiP error:', error)
      alert('Failed to enable Picture-in-Picture mode.')
    }
  }

  // Check PiP support on mount
  React.useEffect(() => {
    if (typeof document !== 'undefined' && 'pictureInPictureEnabled' in document) {
      setIsPiPSupported(true)
    }
  }, [])

  const handleDownload = async () => {
    if (!isDirectVideo) {
      alert('❌ Download is only available for direct video files (MP4, WebM, etc.).\n\n💡 For YouTube videos, please use third-party download tools.')
      return
    }

    setDownloading(true)
    try {
      // Extract filename from URL
      const filename = url.split('/').pop()?.split('?')[0] || 'video.mp4'
      
      // Method 1: Try fetch with CORS
      try {
        const response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit'
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = filename
          link.style.display = 'none'
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Cleanup
          setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100)
          
          alert('✅ Download started! Please check your Downloads folder.')
          setDownloading(false)
          return
        }
      } catch (fetchError) {
        console.log('Fetch method failed, trying direct link method')
      }
      
      // Method 2: Direct link download (fallback)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      alert('✅ Download link opened! If download doesn\'t start, right-click and select "Save As".')
      
    } catch (error) {
      console.error('Download failed:', error)
      alert('❌ Download failed!\n\n💡 Possible reasons:\n- Video is CORS protected\n- Network issue\n- Invalid URL\n\nTry: Open video URL in new tab and right-click > Save Video As')
    } finally {
      setDownloading(false)
    }
  }

  // For Instagram, show embed option
  if (isInstagram) {
    // Extract Instagram post ID from URL
    const postMatch = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
    const postId = postMatch ? postMatch[2] : null
    const embedUrl = postId ? `https://www.instagram.com/p/${postId}/embed` : null

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        <div className="relative aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              scrolling="no"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-900/20 to-purple-900/20">
              <div className="text-center p-8">
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Instagram Reel</h3>
                <p className="text-gray-300 mb-6">Invalid Instagram URL format</p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 text-sm flex-1">
              <svg className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-gray-300">
                <strong className="text-pink-400">Instagram:</strong> Embedded player. Click below to open in the Instagram app.
              </div>
            </div>
            <button
              onClick={() => window.open(url, '_blank')}
              className="ml-3 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Instagram
            </button>
          </div>
        </div>
      </div>
    )
  }

  // For Terabox, show download/open option
  if (isTerabox) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">📦 Terabox Video</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Terabox videos require authentication to play directly. 
              Please use one of the options below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.open(url, '_blank')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Terabox
              </button>
              <button
                onClick={() => window.open(`https://terabox-downloader.online/?url=${encodeURIComponent(url)}`, '_blank')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-gray-300">
                <strong className="text-yellow-400">Note:</strong> Terabox videos cannot be embedded directly because they require authentication.
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-gray-300">
                <strong className="text-blue-400">Options:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Watch on Terabox website (login required)</li>
                  <li>Download using third-party downloader</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For other platforms, use ReactPlayer
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
      <div className="relative aspect-video bg-black">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          volume={volume}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={onEnded}
          config={{
            youtube: {
              playerVars: { 
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                quality: quality
              }
            },
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>

      <div className="bg-gray-900 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 min-w-[45px]">
            {formatTime(played * duration)}
          </span>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-400 min-w-[45px]">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              title="Play/Pause"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Picture-in-Picture Button */}
            {isPiPSupported && !isYouTube && (
              <button
                onClick={handlePictureInPicture}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                title="Picture-in-Picture Mode (Background Play)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  <rect x="14" y="14" width="6" height="4" rx="1" stroke="currentColor" strokeWidth={2} fill="none"/>
                </svg>
                <span className="hidden sm:inline">PiP</span>
              </button>
            )}

            {/* Quality Selector */}
            {isYouTube && (
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                  title="Video Quality"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{qualityOptions.find(q => q.value === quality)?.label || 'Auto'}</span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[120px]">
                    {qualityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setQuality(option.value)
                          setShowQualityMenu(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${
                          quality === option.value ? 'bg-blue-600 text-white' : 'text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        {quality === option.value && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!isDirectVideo || downloading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
              title={isDirectVideo ? 'Download video' : 'Download only available for direct video files'}
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
