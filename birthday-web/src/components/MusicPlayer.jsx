import { useCallback, useEffect, useRef, useState } from 'react'

const SONG_TITLE = 'Masa Ini, Nanti, dan Masa Indah Lainnya'
const ARTIST = 'Nuca'
const PREVIEW_SRC =
  'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c1/93/f4/c193f415-dd50-2f93-b16a-8d8fdd5f7e14/mzaf_10787163643509827446.plus.aac.p.m4a'
// Drop your own full-length song into public/music/ using one of these names.
// No code change needed — the first file that exists wins.
const LOCAL_CANDIDATES = [
  '/music/lagu.mp3',
  '/music/lagu.m4a',
  '/music/lagu.wav',
  '/music/lagu.ogg',
  '/music/masa-ini-nanti-dan-masa-indah-lainnya.mp3',
]
const FULL_SONG_URL = 'https://www.youtube.com/watch?v=2BI6_lDvwWk'
const TARGET_VOLUME = 0.55

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(1, '0')}`
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const pauseTimerRef = useRef(null)
  const userPausedRef = useRef(false)
  const mutedRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(30)
  const [source, setSource] = useState('preview')
  const [src, setSrc] = useState(PREVIEW_SRC)
  const [failed, setFailed] = useState(false)

  const fadeTo = useCallback((target, ms = 900) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current)
    const from = audio.volume
    const start = performance.now()

    const step = () => {
      const el = audioRef.current
      if (!el) return
      const progress = Math.min(1, (performance.now() - start) / Math.max(ms, 1))
      const eased = 1 - Math.pow(1 - progress, 2)
      el.volume = Math.min(1, Math.max(0, from + (target - from) * eased))
      if (progress < 1) {
        fadeTimerRef.current = window.setTimeout(step, 30)
      } else {
        fadeTimerRef.current = null
      }
    }

    step()
  }, [])

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    userPausedRef.current = false
    audio.volume = 0

    try {
      await audio.play()
      setPlaying(true)
      setFailed(false)
      fadeTo(mutedRef.current ? 0 : TARGET_VOLUME, 1400)
      return true
    } catch {
      setPlaying(false)
      setFailed(true)
      return false
    }
  }, [fadeTo])

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    userPausedRef.current = true
    setPlaying(false)
    fadeTo(0, 320)

    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = window.setTimeout(() => {
      const el = audioRef.current
      if (el) el.pause()
    }, 350)
  }, [fadeTo])

  const togglePlayback = () => {
    if (playing) {
      stopPlayback()
    } else {
      startPlayback()
    }
  }

  const toggleMute = () => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (!audioRef.current?.paused) {
      fadeTo(next ? 0 : TARGET_VOLUME, 350)
    }
  }

  const handleSeek = (event) => {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setTime(nextTime)
  }

  // Wire audio events + start the song on the first interaction.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.volume = 0

    const handleTime = () => setTime(audio.currentTime || 0)
    const handleMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }
    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)
    const handleError = () => {
      setFailed(true)
      setPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTime)
    audio.addEventListener('loadedmetadata', handleMeta)
    audio.addEventListener('durationchange', handleMeta)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    const handleFirstInteraction = () => {
      const el = audioRef.current
      if (!el || userPausedRef.current || !el.paused) return
      startPlayback()
    }

    window.addEventListener('click', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      audio.removeEventListener('timeupdate', handleTime)
      audio.removeEventListener('loadedmetadata', handleMeta)
      audio.removeEventListener('durationchange', handleMeta)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current)
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    }
  }, [startPlayback])

  // If a full-length track is dropped into public/music, use it automatically.
  useEffect(() => {
    let cancelled = false

    const checkLocalTrack = async () => {
      for (const candidate of LOCAL_CANDIDATES) {
        if (cancelled) return
        try {
          const response = await fetch(candidate, { method: 'HEAD' })
          const type = (response.headers.get('content-type') || '').toLowerCase()
          // A missing file falls back to index.html (text/html) on the dev server.
          const looksLikeMedia = response.ok && !type.includes('text/html') && !type.includes('json')
          if (looksLikeMedia) {
            setSource('full')
            setSrc(candidate)
            return
          }
        } catch {
          // Try the next candidate name.
        }
      }
    }

    checkLocalTrack()
    return () => {
      cancelled = true
    }
  }, [])

  // Keep playing (from the start) when switching between preview and full track.
  const previousSrcRef = useRef(src)
  useEffect(() => {
    if (previousSrcRef.current === src) return
    previousSrcRef.current = src
    const audio = audioRef.current
    if (!audio || audio.paused) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [src])

  useEffect(() => {
    if (!expanded) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expanded])

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 30
  const progress = Math.min(100, Math.max(0, (time / safeDuration) * 100))

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" aria-hidden="true" />

      <button
        type="button"
        className={`music-chip ${playing ? 'is-playing' : ''}`}
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Tutup pemutar musik' : 'Buka pemutar musik'}
        title={`Lagu: ${SONG_TITLE} — ${ARTIST}`}
      >
        <span className="music-eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        {!playing && !expanded ? <span className="music-invite" aria-hidden="true" /> : null}
      </button>

      {expanded ? (
        <div className="music-card" role="dialog" aria-label={`Pemutar musik: ${SONG_TITLE}`}>
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-periwinkle-300/80 to-transparent" aria-hidden="true" />

          <div className="flex items-start gap-3">
            <div className={`vinyl shrink-0 ${playing ? 'is-spinning' : ''}`} aria-hidden="true">
              <div className="vinyl-label">♡</div>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-periwinkle-300/80">
                <span className={`music-dot ${playing ? 'is-on' : ''}`} aria-hidden="true" />
                {playing ? 'Sedang diputar' : 'Playlist kita ni sayang?'}
              </p>
              <p className="mt-1 text-[13px] font-medium leading-snug text-white">{SONG_TITLE}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {ARTIST}
                <span className="px-1.5 text-periwinkle-400/70">·</span>
                {source === 'full' ? 'Lagu lengkap' : 'Pratinjau resmi 30 detik'}
              </p>
            </div>

            <button
              type="button"
              className="music-icon-btn -mr-1 -mt-1 shrink-0"
              onClick={() => setExpanded(false)}
              aria-label="Tutup pemutar musik"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min="0"
              max={safeDuration}
              step="0.1"
              value={Math.min(time, safeDuration)}
              onChange={handleSeek}
              className="music-range"
              style={{ '--progress': `${progress}%` }}
              aria-label="Posisi lagu"
            />
            <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums tracking-wide text-slate-500">
              <span>{formatTime(time)}</span>
              <span>{formatTime(safeDuration)}</span>
            </div>
          </div>

          {failed ? (
            <p className="mt-2 rounded-lg border border-periwinkle-400/20 bg-periwinkle-500/10 px-2.5 py-1.5 text-[10px] leading-relaxed text-periwinkle-300">
              Musik tidak dapat dimuat. Dengarkan lagunya langsung di YouTube.
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="music-play"
                onClick={togglePlayback}
                aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}
              >
                {playing ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <rect x="5.5" y="4" width="3.2" height="12" rx="1" />
                    <rect x="11.3" y="4" width="3.2" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6 4.3c0-.8.9-1.3 1.6-.9l8 5.7a1.1 1.1 0 010 1.8l-8 5.7c-.7.4-1.6-.1-1.6-.9V4.3z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="music-icon-btn"
                onClick={toggleMute}
                aria-label={muted ? 'Nyalakan suara' : 'Senyapkan suara'}
              >
                {muted ? (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M4 8h2.2L10 5v10L6.2 12H4V8z" strokeLinejoin="round" />
                    <path d="M13 8l4 4M17 8l-4 4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M4 8h2.2L10 5v10L6.2 12H4V8z" strokeLinejoin="round" />
                    <path d="M12.5 7.5a3.4 3.4 0 010 5M14.8 5.4a6.4 6.4 0 010 9.2" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              <span className="ml-0.5 inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-slate-400">
                <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 7h9l-2.5-2.5M16 13H7l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Loop
              </span>
            </div>

            <a
              href={FULL_SONG_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 text-[10px] font-medium text-periwinkle-300 transition-colors hover:text-white"
            >
              Lagu lengkap
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
