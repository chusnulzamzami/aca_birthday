import { useEffect, useRef, useState } from 'react'
import HeroSlide from './components/HeroSlide'
import PasscodeSlide from './components/PasscodeSlide'
import TimelineSlide from './components/TimelineSlide'
import GallerySlide from './components/GallerySlide'
import MusicPlayer from './components/MusicPlayer'

const TOTAL_SLIDES = 4

const STAR_FIELD = [
  { left: '6%', top: '14%', d: '0s', dur: '4.4s' },
  { left: '14%', top: '62%', d: '1.2s', dur: '5.1s' },
  { left: '22%', top: '30%', d: '2.4s', dur: '3.8s' },
  { left: '29%', top: '82%', d: '0.7s', dur: '6s' },
  { left: '37%', top: '9%', d: '3.1s', dur: '4.8s' },
  { left: '44%', top: '48%', d: '1.8s', dur: '5.6s' },
  { left: '52%', top: '22%', d: '0.3s', dur: '4.1s' },
  { left: '59%', top: '73%', d: '2.9s', dur: '5.4s' },
  { left: '66%', top: '37%', d: '1.4s', dur: '3.9s' },
  { left: '72%', top: '13%', d: '3.6s', dur: '5.8s' },
  { left: '78%', top: '58%', d: '0.9s', dur: '4.7s' },
  { left: '85%', top: '26%', d: '2.1s', dur: '5.2s' },
  { left: '91%', top: '79%', d: '1.6s', dur: '4.3s' },
  { left: '96%', top: '44%', d: '2.7s', dur: '6.2s' },
  { left: '10%', top: '88%', d: '3.3s', dur: '5s' },
  { left: '48%', top: '92%', d: '0.5s', dur: '4.6s' },
  { left: '63%', top: '88%', d: '2s', dur: '5.9s' },
  { left: '33%', top: '54%', d: '3.8s', dur: '4.2s' },
]

const DUST_FIELD = [
  { left: '8%', d: '0s', dur: '19s', size: '3px' },
  { left: '18%', d: '4.5s', dur: '23s', size: '2px' },
  { left: '30%', d: '9s', dur: '21s', size: '4px' },
  { left: '42%', d: '2.5s', dur: '26s', size: '2px' },
  { left: '55%', d: '12s', dur: '20s', size: '3px' },
  { left: '67%', d: '6.5s', dur: '24s', size: '2px' },
  { left: '79%', d: '1.5s', dur: '22s', size: '4px' },
  { left: '90%', d: '10s', dur: '25s', size: '2px' },
]

export default function App() {
  const [slide, setSlide] = useState(1)
  const glowRef = useRef(null)

  const goToSlide = (n) => {
    if (n < 1 || n > TOTAL_SLIDES) return
    setSlide(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const canHover = window.matchMedia?.('(hover: hover)').matches
    if (!canHover) return undefined

    const el = glowRef.current
    if (!el) return undefined

    let frame = 0
    let pointerX = -1000
    let pointerY = -1000

    const handleMove = (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        el.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
        frame = 0
      })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* BEGIN: AmbientAtmosphere */}
      <div className="ambient-layer" aria-hidden="true">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
        {STAR_FIELD.map((star, index) => (
          <span
            key={`star-${index}`}
            className="ambient-star"
            style={{ left: star.left, top: star.top, '--d': star.d, '--tw-dur': star.dur }}
          />
        ))}
        {DUST_FIELD.map((mote, index) => (
          <span
            key={`dust-${index}`}
            className="ambient-dust"
            style={{
              left: mote.left,
              width: mote.size,
              height: mote.size,
              '--d': mote.d,
              '--dur': mote.dur,
            }}
          />
        ))}
      </div>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />

      {/* Top hairline glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-periwinkle-400/50 to-transparent"
      />
      {/* END: AmbientAtmosphere */}

      {/* BEGIN: BotanicalSilhouetteOverlays */}
      {/* Top Left subtle floral silhouette */}
      <div className="pointer-events-none fixed top-0 left-0 w-64 h-64 md:w-96 md:h-96 opacity-25 z-[2]" data-purpose="background-floral-tl">
        <svg className="w-full h-full text-indigo-400 opacity-40 animate-sway" fill="none" viewBox="0 0 200 200">
          <path d="M-20,40 Q30,60 50,110 T30,190" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          <path d="M15,65 C35,40 65,30 80,45 C90,65 60,85 15,65 Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M48,105 C75,90 98,105 95,128 C85,145 60,135 48,105 Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M-10,120 C15,130 30,160 15,180 C-5,185 -10,150 -10,120 Z" fill="currentColor" fillOpacity="0.3" />
        </svg>
      </div>
      {/* Bottom Left Dark Foliage Overlay */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-80 h-80 opacity-40 z-[2]" data-purpose="background-floral-bl">
        <svg className="w-full h-full text-slate-900 opacity-90 animate-sway" fill="none" viewBox="0 0 300 300" style={{ animationDelay: '-4s' }}>
          <path d="M-40,300 C20,220 90,200 130,220 C180,240 140,320 140,320 Z" fill="#03060d" />
          <path d="M20,320 C60,250 150,230 180,280 Z" fill="#040916" />
          <circle cx="90" cy="210" fill="#74a4f7" opacity="0.6" r="3" className="animate-twinkle" />
          <circle cx="150" cy="240" fill="#74a4f7" opacity="0.4" r="2.5" className="animate-twinkle" style={{ animationDelay: '-1.6s' }} />
        </svg>
      </div>
      {/* Bottom Right Dark Foliage Overlay */}
      <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 opacity-45 z-[2]" data-purpose="background-floral-br">
        <svg className="w-full h-full text-slate-800 animate-sway" fill="none" viewBox="0 0 350 350" style={{ animationDelay: '-7s' }}>
          <path d="M360,240 C300,210 240,240 210,290 C190,320 280,360 360,360 Z" fill="#03060f" />
          <path d="M270,190 C230,160 190,200 210,250 Z" fill="#060c1d" />
          <g fill="#43639e" opacity="0.45">
            <ellipse cx="280" cy="290" rx="35" ry="18" transform="rotate(-25 280 290)" />
            <ellipse cx="280" cy="290" rx="35" ry="18" transform="rotate(45 280 290)" />
            <ellipse cx="280" cy="290" rx="35" ry="18" transform="rotate(110 280 290)" />
          </g>
        </svg>
      </div>
      {/* END: BotanicalSilhouetteOverlays */}

      {/* BEGIN: PersistentTopBar */}
      <header
        className="app-rise relative z-40 w-full px-6 md:px-12 py-6 flex items-center justify-between pointer-events-auto"
        data-purpose="top-navigation-bar"
        style={{ '--d': '0.15s' }}
      >
        {/* Heart Icon with soft pulse & cyan-blue glow */}
        <button className="group flex items-center gap-2 p-1 -m-1 focus:outline-none" onClick={() => goToSlide(1)} title="Kembali ke awal" aria-label="Kembali ke awal">
          <div className="heartbeat w-9 h-9 rounded-full flex items-center justify-center transition-transform transform group-hover:scale-110">
            <svg className="w-6 h-6 text-periwinkle-400 filter drop-shadow-[0_0_8px_rgba(117,165,248,0.85)]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
        {/* Music + Slide Indicator */}
        <div className="relative flex items-center gap-2 sm:gap-3" data-purpose="top-bar-actions">
          <MusicPlayer />
          {/* Slide Indicator Display (1 / 4, 2 / 4, ...) */}
          <div className="text-sm md:text-base font-medium tracking-widest text-slate-300/80 bg-nightcard/60 px-3.5 py-1 rounded-full border border-slate-700/40 backdrop-blur-sm shadow-[0_0_18px_rgba(79,139,245,0.12)]" aria-live="polite">
            <span key={slide} className="counter-pop inline-block">
              <span className="text-periwinkle-300 font-semibold">{slide}</span>{' '}
              <span className="text-slate-500">/</span>{' '}
              <span>{TOTAL_SLIDES}</span>
            </span>
          </div>
        </div>
      </header>
      {/* END: PersistentTopBar */}

      {/* BEGIN: MainContentCarousel */}
      <main className="relative z-20 flex-1 flex items-center justify-center w-full px-4 sm:px-8 md:px-12 max-w-7xl mx-auto py-2">
        <HeroSlide active={slide === 1} onNavigate={goToSlide} />
        <PasscodeSlide active={slide === 2} onNavigate={goToSlide} />
        <TimelineSlide active={slide === 3} onNavigate={goToSlide} />
        <GallerySlide active={slide === 4} onNavigate={goToSlide} />
      </main>
      {/* END: MainContentCarousel */}

      {/* BEGIN: BottomTornPaperFooterAesthetic */}
      <div className="w-full h-8 relative pointer-events-none z-30 opacity-70 footer-sway" data-purpose="torn-paper-bottom-accent">
        <svg className="w-full h-full text-midnight" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 1200 40">
          <path d="M0,40 L0,20 Q60,5 120,22 Q180,35 240,15 Q300,5 360,20 Q420,38 480,18 Q540,10 600,25 Q660,35 720,15 Q780,5 840,25 Q900,38 960,18 Q1020,10 1080,25 Q1140,35 1200,15 L1200,40 Z" />
        </svg>
      </div>
      {/* END: BottomTornPaperFooterAesthetic */}
    </>
  )
}
