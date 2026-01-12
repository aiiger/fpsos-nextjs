'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Zap, Trophy, Crown, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Toaster, toast } from 'sonner'

/* --- COMPONENT: Space Particles --- */
function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; pulse: number; layer: 0 | 1 | 2 }> = []
    let width = 0; let height = 0; let mouseX = 0; let mouseY = 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initParticles = () => {
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * window.devicePixelRatio; canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      const count = Math.floor((width * height) / 5000)
      particles = []
      for (let i = 0; i < count; i++) {
        const rand = Math.random()
        let layer: 0 | 1 | 2 = 0
        if (rand > 0.85) layer = 2
        else if (rand > 0.5) layer = 1

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer === 2 ? Math.random() * 1.5 + 1.5 : (layer === 1 ? Math.random() * 1.0 + 0.8 : Math.random() * 0.8 + 0.2),
          speedX: prefersReducedMotion ? 0 : (Math.random() - 0.5) * (layer === 2 ? 0.3 : 0.1),
          speedY: prefersReducedMotion ? 0 : (Math.random() - 0.5) * (layer === 2 ? 0.3 : 0.1),
          opacity: 0,
          pulse: Math.random() * Math.PI,
          layer
        })
      }
    }

    let globalAlpha = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      if (globalAlpha < 1) globalAlpha += 0.008;

      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.x += p.speedX; p.y += p.speedY;
          p.pulse += 0.02;
          if (p.opacity < 1) p.opacity += 0.01;

          const twinkle = Math.sin(p.pulse) * 0.3 + 0.7
          const parallaxFactor = p.layer === 2 ? 0.05 : (p.layer === 1 ? 0.02 : 0.005)
          const dx = (mouseX - width / 2) * parallaxFactor
          const dy = (mouseY - height / 2) * parallaxFactor

          let drawX = p.x + dx
          let drawY = p.y + dy

          if (drawX < -50) p.x += width + 100
          if (drawX > width + 50) p.x -= width + 100
          if (drawY < -50) p.y += height + 100
          if (drawY > height + 50) p.y -= height + 100

          drawX = p.x + dx
          drawY = p.y + dy

          const baseAlpha = p.layer === 2 ? 0.9 : (p.layer === 1 ? 0.6 : 0.3);
          const finalAlpha = baseAlpha * twinkle * globalAlpha * 0.8;

          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${finalAlpha})`; // Violet/Purple tint

          if (p.layer === 2) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = `rgba(139, 92, 246, ${finalAlpha})`;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fill();
          ctx.shadowBlur = 0
        }
      })
      if (!prefersReducedMotion) animationFrameId = requestAnimationFrame(render)
    }

    const handleResize = () => { initParticles(); if (prefersReducedMotion) render(); }
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; }
    window.addEventListener('resize', handleResize); window.addEventListener('mousemove', onMouseMove);
    initParticles(); render();
    return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(animationFrameId); }
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
}

type GameState = 'idle' | 'waiting' | 'go' | 'tooEarly' | 'results'

interface LeaderboardEntry {
  id?: number
  username: string
  discordId?: string
  score: number
  rank: string
}

export default function ReactionTestPage() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // Submission Form State
  const [username, setUsername] = useState('')
  const [discordId, setDiscordId] = useState('')
  const [pin, setPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // --- GAME LOGIC ---

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard')
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch leaderboard:', error)
      }
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handleStart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setGameState('waiting')
    setHasSubmitted(false)

    // Clear previous form data if needed, or keep nickname? 
    // Usually better to keep nickname if they just played, but let's clear for fresh start or keep. 
    // Let's keep username/discordId for convenience, but clear pin/submitted status.
    setPin('')

    const delay = Math.floor(Math.random() * 3000) + 2000 // 2-5 sec random delay
    const id = setTimeout(() => {
      setGameState('go')
      setStartTime(Date.now())
    }, delay)
    setTimerId(id)
  }

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (timerId) clearTimeout(timerId)
    setGameState('idle')
    setReactionTime(0)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timerId) clearTimeout(timerId)
      setGameState('tooEarly')
      return
    }

    if (gameState === 'go') {
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)
      setGameState('results')

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#ffffff', '#8b5cf6']
      })
    }
  }

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }
    if (!pin.trim() || pin.length < 4) {
      toast.error('Enter a 4-digit PIN to secure your score')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          discordId,
          pin,
          score: reactionTime,
          rank: 'Member'
        })
      })

      if (res.ok) {
        toast.success('Score saved to the mainframe!')
        setHasSubmitted(true)
        fetchLeaderboard()
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      toast.error('Failed to submit score. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBackground = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-900/20 cursor-wait'
      case 'go': return 'bg-green-500 cursor-pointer'
      case 'tooEarly': return 'bg-orange-500/10'
      case 'results': return 'bg-black'
      default: return 'bg-transparent'
    }
  }

  const getMainContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className="text-center relative z-20">
            <Zap className="w-24 h-24 mx-auto mb-6 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black font-rajdhani text-white mb-6 tracking-wider">
              REACTION <span className="text-cyan-500">TEST</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-md mx-auto">
              Test your visual reflex speed. Click immediately when the screen turns green.
            </p>
            <button
              onClick={handleStart}
              className="group relative px-12 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                INITIATE TEST
                <Zap className="w-5 h-5 fill-current" />
              </span>
            </button>
          </div>
        )

      case 'waiting':
        return (
          <div className="text-center animate-pulse pointer-events-none select-none">
            <h2 className="text-6xl font-black text-red-500 tracking-widest">WAIT FOR IT...</h2>
          </div>
        )

      case 'go':
        return (
          <div className="text-center pointer-events-none select-none">
            <h2 className="text-8xl font-black text-white drop-shadow-lg">CLICK!</h2>
          </div>
        )

      case 'tooEarly':
        return (
          <div className="text-center z-20">
            <h2 className="text-6xl font-black text-orange-500 mb-4">TOO EARLY!</h2>
            <p className="text-2xl text-gray-400 mb-8">You clicked before the signal.</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all"
            >
              TRY AGAIN
            </button>
          </div>
        )

      case 'results':
        return (
          <div className="text-center w-full max-w-md mx-auto z-50">
            <div className="mb-8 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold">Reaction Time</div>
              <div className="text-8xl font-black text-white font-mono mb-2 tracking-tighter">
                {reactionTime}<span className="text-4xl text-cyan-500 ml-1">ms</span>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {reactionTime < 200 ? (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded uppercase border border-yellow-500/30">
                    Godlike
                  </span>
                ) : reactionTime < 300 ? (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-500 text-xs font-bold rounded uppercase border border-cyan-500/30">
                    Professional
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-bold rounded uppercase border border-gray-500/30">
                    Average
                  </span>
                )}
              </div>

              {!hasSubmitted ? (
                <form
                  onSubmit={submitScore}
                  className="space-y-4 relative z-10 pointer-events-auto"
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="ENTER ALIAS"
                    maxLength={12}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-cyan-500 focus:outline-none transition-colors font-bold tracking-wider placeholder:text-gray-600 pointer-events-auto cursor-text"
                    autoFocus
                  />

                  {/* PIN input */}
                  <input
                    type="text"
                    placeholder="SECRET PIN (4+ DIGITS)"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-cyan-500 focus:outline-none transition-colors font-mono tracking-widest placeholder:text-gray-600 pointer-events-auto cursor-text"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex justify-center items-center gap-2 pointer-events-auto"
                  >
                    {isSubmitting ? 'SAVING...' : 'SAVE RECORD'}
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>Score Registered.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors uppercase font-bold text-sm tracking-widest relative z-50"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Test
            </button>
          </div>
        )
    }
  }


  return (
    <main
      className={`min-h-screen relative overflow-hidden transition-colors duration-200 ${gameState === 'results' ? '' : 'select-none'} font-sans ${getBackground()}`}
      onMouseDown={gameState === 'results' ? undefined : handleClick}
    >
      <Toaster position="bottom-center" />
      <div className="absolute inset-0 bg-[#050505] -z-20" /> {/* Dark background base */}
      <SpaceParticles />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 z-50 text-gray-500 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest">
        ← Return to Base
      </Link>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {getMainContent()}
      </div>

      {/* LEADERBOARD SECTION (Only visible when idle) */}
      {gameState === 'idle' && (
        <div className="w-full max-w-5xl mx-auto px-6 pb-20 relative z-20">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-2 flex items-center justify-center gap-3 font-rajdhani">
              <Trophy className="w-8 h-8 text-yellow-500" />
              HALL OF FAME
            </h3>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Monthly Top Performers</p>
          </div>

          {/* Top 1 Spotlight */}
          {leaderboard.length > 0 && (
            <div className="mb-8 bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent border-2 border-yellow-500/40 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Crown className="w-16 h-16 text-yellow-400" />
                  <div>
                    <div className="text-yellow-500 text-xs uppercase tracking-wider font-bold mb-1">👑 Champion</div>
                    <h4 className="text-3xl font-black text-white mb-1 font-rajdhani">{leaderboard[0].username}</h4>
                    <div className="text-gray-400 text-sm">{leaderboard[0].discordId || 'Anonymous Warrior'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-black text-yellow-400 font-mono tracking-tighter">{leaderboard[0].score}<span className="text-2xl">ms</span></div>
                  <div className="text-xs text-yellow-500 uppercase tracking-wider mt-2">Record Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <table className="w-full text-left">
              <thead className="bg-cyan-500/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-cyan-400 text-sm uppercase tracking-wider font-bold">Rank</th>
                  <th className="px-6 py-4 text-cyan-400 text-sm uppercase tracking-wider font-bold">Player</th>
                  <th className="px-6 py-4 text-cyan-400 text-sm uppercase tracking-wider font-bold">Time</th>
                  <th className="px-6 py-4 text-cyan-400 text-sm uppercase tracking-wider font-bold">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 10).map((entry, index) => (
                    <tr key={entry.id || index} className={`hover:bg-cyan-500/5 transition-all group ${index === 0 ? 'bg-yellow-500/5' : ''}`}>
                      <td className="px-6 py-4">
                        <div className={`font-mono font-bold ${index === 0 ? 'text-yellow-500 text-lg' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                          {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${index === 0 ? 'text-yellow-400 text-lg' : 'text-white'}`}>
                          {entry.username}
                        </div>
                        {entry.discordId && (
                          <div className="text-xs text-gray-500 mt-1">{entry.discordId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-mono font-bold ${index === 0 ? 'text-yellow-400 text-xl' : 'text-cyan-400 text-lg'}`}>
                          {entry.score}<span className="text-sm text-gray-500">ms</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${entry.score < 200
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          : entry.score < 300
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                          }`}>
                          {entry.score < 200 ? 'Godlike' : entry.score < 300 ? 'Pro' : 'Rookie'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <div className="font-bold text-lg mb-1">No records yet</div>
                      <div className="text-sm">Be the first to claim the throne!</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}
