import { useEffect, useRef } from 'react'
import Typewriter from './Typewriter'
import photo1 from '../assets/slide1/1.PNG'
import photo2 from '../assets/slide1/2.PNG'
import photo3 from '../assets/slide1/3.PNG'
import photo4 from '../assets/slide1/4.PNG'
import photo5 from '../assets/slide1/5.PNG'
import photo6 from '../assets/slide1/6.PNG'
import photo7 from '../assets/slide1/7.PNG'
import photo8 from '../assets/slide1/8.PNG'

/**
 * Kenangan 1 -> 8, ditampilkan berurutan dari kiri-atas ke kanan-bawah.
 * Rasio bingkai 2/3 supaya foto potret panjang tidak memotong wajah & kue.
 */
const HERO_PHOTOS = [
  { src: photo1, alt: 'Foto 1 - ulang tahun kecil dengan lilin angka 6', rot: -4, lift: 0, tape: true, fromX: '-30px', fromY: '40px', d: '0.95s' },
  { src: photo2, alt: 'Foto 2 - potret ulang tahun di depan kue', rot: 3, lift: 8, tape: false, fromX: '34px', fromY: '44px', d: '1.15s' },
  { src: photo3, alt: 'Foto 3 - tiup lilin pada kue cokelat', rot: -2, lift: -6, tape: false, fromX: '-20px', fromY: '-34px', d: '1.35s' },
  { src: photo4, alt: 'Foto 4 - senyum di depan kue ulang tahun', rot: 4, lift: 6, tape: false, fromX: '36px', fromY: '-28px', d: '1.55s' },
  { src: photo5, alt: 'Foto 5 - ulang tahun dengan lilin angka 9', rot: -3, lift: -8, tape: false, fromX: '-38px', fromY: '34px', d: '1.75s' },
  { src: photo6, alt: 'Foto 6 - ulang tahun bersama dua teman', rot: 2, lift: 8, tape: true, fromX: '28px', fromY: '42px', d: '1.95s' },
  { src: photo7, alt: 'Foto 7 - potret dengan kue cokelat', rot: -2, lift: -4, tape: false, fromX: '-30px', fromY: '-36px', d: '2.15s' },
  { src: photo8, alt: 'Foto 8 - ulang tahun ke-15', rot: 3, lift: 10, tape: false, fromX: '40px', fromY: '30px', d: '2.35s' },
]

export default function HeroSlide({ active, onNavigate }) {
  const photoRefs = useRef([])

  // Mobile: each photo fades in as it scrolls into view.
  // Desktop is unaffected — it keeps the time-based stagger from index.css.
  useEffect(() => {
    const els = photoRefs.current.filter(Boolean)

    if (!active) {
      els.forEach((el) => el.classList.remove('is-revealed'))
      return undefined
    }

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-revealed'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [active])

  const slideClass = `slide-shell relative w-full ${active ? 'is-active flex' : 'hidden'} flex-col lg:flex-row items-center justify-between gap-7 lg:gap-14 py-2 sm:py-4 pb-10 lg:pb-4`

  return (
    <section className={slideClass} data-purpose="slide-birthday-hero" id="slide-1">
      {/* Left Column: Emotional Birthday Greetings */}
      <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-4 sm:space-y-6">
        {/* Script Title with Floating Crown & Star Doodles */}
        <div className="relative w-fit">
          <div className="headline-halo" aria-hidden="true" />

          {/* Hand-drawn style crown SVG */}
          <span className="fx-fade absolute -top-9 -right-12 z-10 block" style={{ '--d': '1.25s' }}>
            <svg className="w-12 h-12 text-periwinkle-400 filter drop-shadow-[0_0_10px_rgba(116,164,247,0.7)] animate-float" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 48 48">
              <path d="M8 32 L12 15 L24 24 L36 15 L40 32 Z" pathLength="100" className="draw" style={{ '--d': '1.6s' }} />
              <circle cx="12" cy="13" r="2" fill="currentColor" />
              <circle cx="24" cy="21" r="2" fill="currentColor" />
              <circle cx="36" cy="13" r="2" fill="currentColor" />
            </svg>
          </span>

          {/* Star sparkle doodles */}
          <svg className="fx-fade absolute -left-8 top-1 w-5 h-5 text-periwinkle-300 opacity-80 animate-twinkle" style={{ '--d': '1.1s' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
          </svg>
          <svg className="fx-fade absolute right-2 -bottom-2 w-3.5 h-3.5 text-periwinkle-400 opacity-70 animate-twinkle" style={{ '--d': '2.2s', animationDelay: '-1.8s' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
          </svg>

          <h1 className="min-h-[7.5rem] sm:min-h-[9rem] md:min-h-[11.25rem] text-5xl sm:text-6xl md:text-7xl font-script text-white leading-tight filter drop-shadow-[0_0_18px_rgba(116,164,247,0.45)]">
            <Typewriter
              active={active}
              delay={0.45}
              speed={72}
              segments={[
                { text: 'Happy Birthdayyy\n' },
                { text: 'Sayaangg♡', className: 'text-gradient-blue tracking-wide' },
              ]}
              caretClassName="text-periwinkle-300"
            />
          </h1>
        </div>

        {/* Heartfelt Birthday Wish Paragraph */}
        
  <p className="min-h-[4.5rem] md:min-h-[5.25rem] text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-light tracking-wide whitespace-pre-line">
  <Typewriter
    active={active}
    delay={1.85}
    speed={17}
    segments={[
      { text: '    Semoga di umur yang baru ini, kamu selalu diberikan umur yang berkah, kesehatan, kebahagiaan, dan dipermudahkan segala urusanmu. Semoga rezekimu selalu dilancarkan dari segala arah, apa pun yang sedang kamu usahakan bisa mendapatkan hasil terbaik, dan semoga kamu selalu dikelilingi orang-orang baik yang tulus sama kamu.\n\n' },

      { text: '    Terus jadi perempuan yang baik yaa sayang, jangan pernah berhenti jadi pribadi yang hebat, tetap rendah hati, terus berbakti sama orang tua, dan semoga semua impian yang kamu punya satu per satu bisa terwujud.\n\n' },

      { text: '    Ada satu doa yang nggak pernah lupa aku selipkan di setiap salatku, yang selalu aku ceritakan dengan Allah, aku berdoa semoga kamu terus sayang sama aku, terus cinta sama aku, dan semoga kita bisa terus bersama sampai ajal menjemput kita. Aku berharap suatu hari nanti bukan cuma bisa merayakan ulang tahunmu sebagai pacarmu, tapi juga sebagai suamimu yang bisa selalu ada di sampingmu. AAMIIN YAA ALLAH. \n\n' },

      { text: '    Terima kasih sudah hadir di hidup aku. Tetap jadi diri kamu sendiri yang aku kenal, jangan bosan-bosan sama aku yaa, dan teruslah tumbuh bersama aku. Aku mau kita terus saling menemani, saling menguatkan apapun kendala yang kita alami, dan janji kepada diri kita untuk saling mengusahakan satu sama lainya yaa.\n\n' },

      { text: 'I love you so muchhh, sayanggg. Once again, happy birthday, my favorite person! ♡ ' },
    ]}
    caretClassName="text-periwinkle-400"
  />
</p>


        {/* Decorative subtle wave flourish */}
        <div className="w-28 h-2">
          <svg className="opacity-70" fill="none" stroke="#74A4F7" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 100 8" aria-hidden="true">
            <path d="M2 4 C20 0, 30 8, 50 4 C70 0, 80 8, 98 4" pathLength="100" className="draw" style={{ '--d': '2.55s' }} />
          </svg>
        </div>

        {/* Sparkle & small heart doodle near button */}
        <div className="relative pt-2 fx-up" style={{ '--d': '3.95s' }}>
          <svg className="absolute -right-14 -top-2 w-6 h-6 text-periwinkle-400 opacity-70 animate-float" style={{ animationDelay: '-2.2s' }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" pathLength="100" className="draw" style={{ '--d': '4.2s' }} />
          </svg>
          {/* CTA Pill: Selanjutnya */}
          <button className="glow-border btn-lift btn-shine px-8 py-2.5 rounded-full bg-midnight/80 text-white font-medium text-sm sm:text-base flex items-center gap-2 group cursor-pointer hover:bg-slate-900/80" onClick={() => onNavigate(2)}>
            <span>Selanjutnya</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-300">→</span>
          </button>
        </div>
      </div>

      {/* Right Column: Ordered Memory Wall (Foto 1 -> 8) */}
      <div
        className="relative w-full lg:w-1/2 min-h-0 lg:min-h-[520px] flex flex-col items-center justify-center"
        data-purpose="polaroid-collage-hero"
      >
        {/*
          Mobile  -> tangga: 1 kolom, foto berselang-seling kiri/kanan,
                      jarak atas-bawah lebar, muncul saat di-scroll.
          Desktop -> grid 4 kolom seperti sebelumnya.
        */}
        <div className="flex flex-col gap-y-10 sm:gap-y-12 w-full lg:grid lg:grid-cols-4 lg:gap-x-3 lg:gap-y-4 lg:content-center">
          {HERO_PHOTOS.map((photo, index) => {
            const isLeft = index % 2 === 0
            return (
              <div
                key={photo.src}
                ref={(el) => {
                  photoRefs.current[index] = el
                }}
                className={`photo-slot w-[74%] sm:w-[62%] lg:w-full ${
                  isLeft ? 'self-start' : 'self-end'
                } lg:self-auto`}
                style={{
                  zIndex: 10 + index,
                  transform: `rotate(${photo.rot}deg) translateY(${photo.lift}px)`,
                }}
              >
                <div
                  className="fx-photo"
                  style={{ '--d': photo.d, '--x': photo.fromX, '--y': photo.fromY }}
                >
                  <div className="polaroid relative p-1.5 pb-4 sm:p-2 sm:pb-5 rounded-sm">
                    {photo.tape ? (
                      <div
                        className="masking-tape fx-fade absolute -top-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 lg:w-20 h-4 sm:h-5 -rotate-2 z-20"
                        style={{ '--d': '2.6s' }}
                      />
                    ) : null}

                    <div className="relative overflow-hidden bg-slate-900 w-full aspect-[2/3] shadow-inner">
                      <img
                        alt={photo.alt}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                        src={photo.src}
                      />
                      {/* Nomor urut 1 - 8 */}
                      <span
                        aria-label={`Foto nomor ${index + 1}`}
                        className="absolute bottom-1 left-1 grid place-items-center w-5 h-5 rounded-full bg-midnight/75 backdrop-blur-sm border border-periwinkle-400/60 font-script text-[13px] leading-none text-periwinkle-200 shadow-[0_0_10px_rgba(79,139,245,0.45)]"
                      >
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tilted Kraft Scrap Note */}
        <div className="mt-6 sm:mt-8 lg:mt-4 self-center lg:self-end mr-0 lg:mr-4 rotate-[-6deg] fx-note" style={{ '--d': '3.2s' }}>
          <div className="animate-float-slow bg-parchment text-slate-800 font-script text-base sm:text-lg md:text-xl font-bold px-4 py-2.5 sm:py-3 rounded shadow-xl border border-stone-300" style={{ clipPath: 'polygon(1% 2%, 99% 0%, 98% 97%, 3% 99%)' }}>
            <div className="leading-tight min-h-[2.9rem] w-40 sm:w-44">
              <Typewriter
                active={active}
                delay={3.3}
                speed={44}
                segments={[{ text: 'You deserve\nall the happiness ♡' }]}
                caretClassName="text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Floating Sparkle and Heart Accents */}
        <div className="fx-fade absolute top-1 left-2 text-periwinkle-400 font-script text-3xl opacity-75" style={{ '--d': '1.9s' }}>
          <span className="animate-float inline-block">♡</span>
        </div>
        <div className="fx-fade absolute bottom-4 left-3 text-periwinkle-300 font-script text-2xl opacity-60" style={{ '--d': '2.9s' }}>
          <span className="animate-float inline-block" style={{ animationDelay: '-2.8s' }}>♡</span>
        </div>
        <svg className="fx-fade absolute top-[14%] right-[1%] w-4 h-4 text-periwinkle-300/80 animate-twinkle" style={{ '--d': '2s', animationDelay: '-2.4s' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
        <svg className="fx-fade absolute top-[42%] right-[-6px] w-3 h-3 text-periwinkle-400/70 animate-twinkle" style={{ '--d': '3.2s', animationDelay: '-0.9s' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
      </div>
      
    </section>
  )
}
