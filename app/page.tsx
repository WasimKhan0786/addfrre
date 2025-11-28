'use client'

import { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('')
  const [currentVideo, setCurrentVideo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [playlist, setPlaylist] = useState<Array<{ url: string; title: string }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!videoUrl.trim()) return

    setLoading(true)
    setError('')

    try {
      // For all URLs, use directly
      setCurrentVideo(videoUrl)
    } catch (err) {
      setError('Failed to load video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = () => {
    if (!videoUrl.trim()) return
    
    const title = videoUrl.split('/').pop()?.split('?')[0] || `Video ${playlist.length + 1}`
    setPlaylist([...playlist, { url: videoUrl, title }])
    setVideoUrl('')
    setError('')
  }

  const handlePlayFromPlaylist = (index: number) => {
    setCurrentVideo(playlist[index].url)
    setCurrentIndex(index)
  }

  const handleRemoveFromPlaylist = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index)
    setPlaylist(newPlaylist)
    if (index === currentIndex && newPlaylist.length > 0) {
      const newIndex = Math.min(index, newPlaylist.length - 1)
      setCurrentVideo(newPlaylist[newIndex].url)
      setCurrentIndex(newIndex)
    }
  }

  const handleVideoEnd = () => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentVideo(playlist[nextIndex].url)
      setCurrentIndex(nextIndex)
    }
  }

  const handlePlayNext = () => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      handlePlayFromPlaylist(currentIndex + 1)
    }
  }

  const handlePlayPrevious = () => {
    if (playlist.length > 0 && currentIndex > 0) {
      handlePlayFromPlaylist(currentIndex - 1)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Ad-Free Video Player
            </h1>
            <p className="text-gray-400 text-lg">Watch videos without interruptions, completely free</p>
          </div>

          {/* Input Form */}
          <div className="mb-10">
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste your video URL here..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/50 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !videoUrl.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAddToPlaylist}
                    disabled={!videoUrl.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-105 transform flex items-center justify-center gap-2"
                    title="Add to Playlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Video Player with Playlist */}
          {currentVideo && (
            <div className="mb-10 animate-fadeIn">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Video Player */}
                <div className="lg:col-span-2">
                  <VideoPlayer url={currentVideo} onEnded={handleVideoEnd} />
                  
                  {/* Playlist Controls */}
                  {playlist.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        onClick={handlePlayPrevious}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <span className="text-gray-400 text-sm">
                        {currentIndex + 1} / {playlist.length}
                      </span>
                      <button
                        onClick={handlePlayNext}
                        disabled={currentIndex === playlist.length - 1}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                      >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Playlist Sidebar */}
                {playlist.length > 0 && (
                  <div className="lg:col-span-1">
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-4 max-h-[600px] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          Playlist ({playlist.length})
                        </h3>
                        <button
                          onClick={() => setPlaylist([])}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {playlist.map((item, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                              index === currentIndex
                                ? 'bg-blue-600/20 border-blue-500/50'
                                : 'bg-gray-900/30 border-gray-700/30 hover:border-gray-600/50'
                            }`}
                            onClick={() => handlePlayFromPlaylist(index)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-sm font-semibold">
                                {index === currentIndex ? (
                                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 truncate mt-1">{item.url}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFromPlaylist(index)
                                }}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-700/30 hover:border-blue-500/50 transition-all hover:scale-105 transform">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">No Ads</h3>
              <p className="text-gray-400 text-sm">Watch videos without any interruptions or advertisements</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-700/30 hover:border-purple-500/50 transition-all hover:scale-105 transform">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Download Videos</h3>
              <p className="text-gray-400 text-sm">Download direct video files with a single click</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 backdrop-blur-sm p-6 rounded-2xl border border-pink-700/30 hover:border-pink-500/50 transition-all hover:scale-105 transform">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pink-300">Multi-Platform</h3>
              <p className="text-gray-400 text-sm">Supports YouTube, Vimeo, Terabox, and direct links</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm p-6 rounded-2xl border border-green-700/30 hover:border-green-500/50 transition-all hover:scale-105 transform">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-300">Background Play</h3>
              <p className="text-gray-400 text-sm">Picture-in-Picture mode for multitasking while watching</p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              Supported Platforms & Formats
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '🎥', text: 'YouTube videos (youtube.com, youtu.be)' },
                { icon: '📸', text: 'Instagram Reels & Posts' },
                { icon: '📦', text: 'Terabox shared links' },
                { icon: '🎬', text: 'Vimeo videos' },
                { icon: '📘', text: 'Facebook videos' },
                { icon: '🎞️', text: 'Dailymotion videos' },
                { icon: '📹', text: 'MP4, WebM, Ogg files' },
                { icon: '🔗', text: 'Direct video URLs' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Section */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:scale-105 transform transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-gradient">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"></div>
                </div>

                {/* Developer Info */}
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">💻 Developed by</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-gradient">
                    Wasim Khan
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Bhada Kalan, Siwan, Bihar</span>
                  </div>
                </div>

                {/* Skills/Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 rounded-full text-xs text-gray-300 hover:bg-gray-600/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm max-w-md">
                  Full-stack developer passionate about creating beautiful and functional web applications. 
                  Specializing in modern web technologies and user experience design.
                </p>

                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  <button className="p-3 bg-gray-700/50 hover:bg-blue-600 rounded-xl transition-all hover:scale-110 transform group">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                  <button className="p-3 bg-gray-700/50 hover:bg-blue-500 rounded-xl transition-all hover:scale-110 transform group">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="p-3 bg-gray-700/50 hover:bg-blue-700 rounded-xl transition-all hover:scale-110 transform group">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button className="p-3 bg-gray-700/50 hover:bg-pink-600 rounded-xl transition-all hover:scale-110 transform group">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>
                </div>

                {/* Footer Note */}
                <div className="mt-4 pt-4 border-t border-gray-700/50 w-full text-center">
                  <p className="text-xs text-gray-500">
                    © 2024 Wasim Khan. Made with ❤️ in Bihar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
