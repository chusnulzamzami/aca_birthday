import { useEffect, useRef, useState } from 'react'
import Typewriter from './Typewriter'

const PIN_LENGTH = 4
const EMPTY_PIN = ['', '', '', '']

export default function PasscodeSlide({ active, onNavigate }) {
  const [digits, setDigits] = useState([...EMPTY_PIN])
  const [status, setStatus] = useState('')
  const [statusClass, setStatusClass] = useState('')
  const [success, setSuccess] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [errorKey, setErrorKey] = useState(0)
  const inputsRef = useRef([])
  const timerRef = useRef(null)
  const shakeTimerRef = useRef(null)
  const shakeFrameRef = useRef(null)

  useEffect(() => {
    if (!active) return
    setDigits([...EMPTY_PIN])
    setStatus('')
    setStatusClass('')
    setSuccess(false)
    setErrorKey(0)
    setShaking(false)
  }, [active])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current)
      if (shakeFrameRef.current) window.cancelAnimationFrame(shakeFrameRef.current)
    }
  }, [])

  const setDigit = (index, value) => {
    setDigits((prev) => prev.map((d, i) => (i === index ? value : d)))
  }

  const focusInput = (index) => inputsRef.current[index]?.focus()

  const onInputChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, '')
    const value = raw.slice(-1)
    setDigit(index, value)
    if (status) {
      setStatus('')
      setStatusClass('')
    }
  }

  const onInputKeyUp = (index, event) => {
    if (event.key >= '0' && event.key <= '9') {
      if (index < PIN_LENGTH - 1) {
        focusInput(index + 1)
      }
    } else if (event.key === 'Backspace') {
      if (index > 0 && !inputsRef.current[index].value) {
        focusInput(index - 1)
      }
    }
  }

  const validateAndOpen = () => {
    if (success) return
    const code = digits.join('')
    if (code === '2702') {
      setSuccess(true)
      setStatus('YEEEEYY BENALL SAYANGG SUKAAA... ♡')
      setStatusClass('text-emerald-400')
      timerRef.current = window.setTimeout(() => onNavigate(3), 950)
    } else {
      setErrorKey((key) => key + 1)
      setStatus('HAA LIAT GA TAU DIAA KODENYA, GA LIKE...')
      setStatusClass('text-rose-400')
      setShaking(false)
      if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current)
      if (shakeFrameRef.current) window.cancelAnimationFrame(shakeFrameRef.current)
      shakeFrameRef.current = window.requestAnimationFrame(() => {
        setShaking(true)
        shakeTimerRef.current = window.setTimeout(() => setShaking(false), 620)
      })
      window.setTimeout(() => focusInput(0), 80)
    }
  }

  const slideClass = `slide-shell relative w-full flex-col items-center justify-center text-center max-w-xl mx-auto py-6 ${active ? 'is-active flex' : 'hidden'}`

  return (
    <section className={slideClass} data-purpose="slide-passcode-gate" id="slide-2">
      {/* Glowing Blue Padlock */}
      <div className="fx-drop mb-5 inline-flex items-center justify-center" style={{ '--d': '0.15s' }}>
        <div className="animate-float-slow">
          <div className={`p-3.5 rounded-2xl bg-midnight/90 border border-periwinkle-400/50 animate-glow-pulse ${success ? 'shadow-[0_0_38px_rgba(52,211,153,0.55)] border-emerald-400/70' : ''}`}>
            <svg className="w-9 h-9 text-periwinkle-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" pathLength="100" className="draw" style={{ '--d': '0.45s' }} />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" pathLength="100" className="draw" style={{ '--d': '0.75s' }} />
              <circle cx="12" cy="16" fill="currentColor" r="1.2" className="animate-twinkle" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title: Masukkan Kode Rahasia */}
      <h2 className="min-h-[2.5rem] sm:min-h-[2.75rem] text-2xl sm:text-4xl font-serif-title font-semibold text-white tracking-wide mb-3">
        <Typewriter
          active={active}
          delay={0.5}
          speed={52}
          reserve
          segments={[{ text: 'Masukin Kode Rahasia' }]}
          caretClassName="text-periwinkle-400"
        />
      </h2>
      <p className="min-h-[3.25rem] text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6 font-light leading-relaxed">
        <Typewriter
          active={active}
          delay={1.45}
          speed={15}
          segments={[{ text: 'kodenya dulu yaa sayang, kalo ga tau berarti ga bisa buka wlee...\n\nsupaya orang lain ga bisa buka selain kita sayanggg ♡♡♡' }]}
          caretClassName="text-periwinkle-400"
        />
      </p>

      {/* Clue Badge */}
      <div className="fx-up inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-periwinkle-400/40 text-periwinkle-300 text-xs sm:text-sm font-medium mb-8 shadow-[0_0_12px_rgba(79,139,245,0.2)]" style={{ '--d': '2.3s' }}>
        <span className="text-yellow-300 animate-twinkle">💡</span>
        <Typewriter
          active={active}
          delay={2.45}
          speed={26}
          segments={[{ text: 'Clue: Tanggal dan bulan lahir ♡' }]}
          caret={false}
        />
      </div>

      {/* Passcode Input Blocks with Hand-drawn Doodle Arrow */}
      <div
        className={`relative flex items-center justify-center gap-3 sm:gap-4 mb-7 ${shaking ? 'animate-shake' : ''}`}
      >
        {digits.map((digit, i) => (
          <div key={i} className="fx-pop" style={{ '--d': `${2.55 + i * 0.12}s` }}>
            <input
              ref={(el) => {
                inputsRef.current[i] = el
              }}
              className={`pin-digit w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold bg-midnight/80 border border-periwinkle-400/60 rounded-xl text-white focus:outline-none shadow-[0_0_10px_rgba(116,164,247,0.25)] ${success ? 'pin-success' : ''}`}
              id={`pin-${i + 1}`}
              aria-label={`Digit ${i + 1}`}
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength="1"
              pattern="[0-9]*"
              type="text"
              value={digit}
              onFocus={(e) => e.target.select()}
              onChange={(e) => onInputChange(i, e)}
              onKeyUp={(e) => onInputKeyUp(i, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') validateAndOpen()
              }}
            />
          </div>
        ))}

        {/* Hand-drawn annotation & curved arrow pointing to input */}
        <div className="fx-fade absolute -right-36 top-1/2 -translate-y-1/2 hidden sm:flex items-center pointer-events-none" style={{ '--d': '3.05s' }}>
          <svg className="w-12 h-12 text-slate-300/80 -scale-x-100" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M15,20 C40,10 70,30 65,70" pathLength="100" className="draw" style={{ '--d': '3.1s' }} />
            <path d="M50,65 L65,72 L70,55" pathLength="100" className="draw" style={{ '--d': '3.5s' }} />
          </svg>
          <div className="font-script text-white text-base sm:text-lg whitespace-nowrap pl-1 leading-none">
            <Typewriter
              active={active}
              delay={3.3}
              speed={48}
              segments={[{ text: 'Coba tebak\ndulu.. ♡' }]}
              caretClassName="text-periwinkle-300"
            />
          </div>
        </div>
      </div>

      {/* Action Button: Buka Sekarang */}
      <div className="fx-up" style={{ '--d': '3.45s' }}>
        <button className="glow-border btn-lift btn-shine px-9 py-2.5 rounded-full bg-midnight/80 text-white font-medium text-sm sm:text-base flex items-center gap-2 mx-auto cursor-pointer hover:bg-slate-900/90 disabled:cursor-default" onClick={validateAndOpen} disabled={success}>
          <span>Buka Sekarang</span>
          <span>→</span>
        </button>
      </div>

      {/* Status toast message for passcode */}
      <p
        key={`${errorKey}-${status}`}
        className={`mt-4 text-xs font-light min-h-[1.25rem] ${statusClass} ${status ? 'counter-pop' : ''}`}
        id="pin-status"
        aria-live="polite"
      >
        {status}
      </p>

      {/* Line art Cat doodle in bottom left */}
      <div className="fx-fade absolute left-2 sm:left-6 bottom-4 pointer-events-none hidden sm:block opacity-75" style={{ '--d': '3.6s' }}>
        <div className="animate-sway">
          <svg className="w-20 h-20 text-periwinkle-300/80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="55" r="28" pathLength="100" className="draw" style={{ '--d': '3.7s' }} />
            <polygon points="26,40 32,18 45,32" pathLength="100" className="draw" style={{ '--d': '3.9s' }} />
            <polygon points="55,32 68,18 74,40" pathLength="100" className="draw" style={{ '--d': '3.95s' }} />
            <ellipse cx="40" cy="52" fill="currentColor" rx="2.5" ry="3" />
            <ellipse cx="60" cy="52" fill="currentColor" rx="2.5" ry="3" />
            <path d="M47,59 Q50,61 53,59" pathLength="100" className="draw" style={{ '--d': '4.15s' }} />
            <path d="M50,61 L50,65" pathLength="100" className="draw" style={{ '--d': '4.2s' }} />
            <path d="M46,65 Q50,68 54,65" pathLength="100" className="draw" style={{ '--d': '4.25s' }} />
            <line x1="22" x2="33" y1="52" y2="54" pathLength="100" className="draw" style={{ '--d': '4.3s' }} />
            <line x1="20" x2="32" y1="60" y2="60" pathLength="100" className="draw" style={{ '--d': '4.35s' }} />
            <line x1="67" x2="78" y1="54" y2="52" pathLength="100" className="draw" style={{ '--d': '4.4s' }} />
            <line x1="68" x2="80" y1="60" y2="60" pathLength="100" className="draw" style={{ '--d': '4.45s' }} />
          </svg>
        </div>
      </div>
    </section>
  )
}
