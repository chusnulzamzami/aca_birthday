import { useEffect, useRef, useState } from 'react'
import Typewriter from './Typewriter'

/**
 * DINDING KENANGAN (slide 4)
 *
 * Semua foto di `assets/slide 4` dimuat otomatis lewat import.meta.glob.
 * Urutan cerita:
 *   1. foto `IMG_*`  -> kenangan masa kecil (8568..8584)
 *   2. foto WhatsApp -> urut jam (15.41.XX) lalu suffix (1)/(2)
 *
 * Tata letak memakai CSS `columns` (masonry) sehingga tinggi tiap kartu
 * mengikuti rasio asli foto -> dinding terlihat alami, bukan grid kaku.
 * Tiap kartu di-scroll masuk bertahap pakai IntersectionObserver.
 */
const imageModules = import.meta.glob('../assets/slide 4/*.{PNG,jpeg}', {
  eager: true,
  import: 'default',
})

/**
 * Ukuran asli tiap foto (dipakai sebagai atribut width/height).
 * Tanpa ini, semua polaroid tingginya 0 sampai gambar selesai diunduh ->
 * seluruh dinding menyusut jadi satu layar, lalu IntersectionObserver
 * langsung membuka semuanya sekaligus (animasi scroll jadi sia-sia).
 * Dengan rasio yang sudah dipesan, tinggi masonry benar sejak awal.
 */
const DIMENSIONS = {
  'IMG_8568.PNG': [410, 546],
  'IMG_8569.PNG': [338, 422],
  'IMG_8570.PNG': [314, 558],
  'IMG_8571.PNG': [180, 320],
  'IMG_8580.PNG': [224, 280],
  'IMG_8581.PNG': [222, 394],
  'IMG_8582.PNG': [189, 336],
  'IMG_8583.PNG': [503, 894],
  'IMG_8584.PNG': [429, 536],
  'WhatsApp Image 2026-11-26 at 15.41.10.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.11.jpeg': [1280, 720],
  'WhatsApp Image 2026-11-26 at 15.41.11 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.12.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.12 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.13.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.13 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.14.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.15.jpeg': [739, 1600],
  'WhatsApp Image 2026-11-26 at 15.41.15 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.15 (2).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.16.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.16 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.17.jpeg': [739, 1600],
  'WhatsApp Image 2026-11-26 at 15.41.17 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.18.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.18 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.18 (2).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.19.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.19 (1).jpeg': [1280, 720],
  'WhatsApp Image 2026-11-26 at 15.41.20.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.20 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.20 (2).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.21.jpeg': [739, 1600],
  'WhatsApp Image 2026-11-26 at 15.41.21 (1).jpeg': [1280, 720],
  'WhatsApp Image 2026-11-26 at 15.41.22.jpeg': [1600, 1066],
  'WhatsApp Image 2026-11-26 at 15.41.22 (1).jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.22 (2).jpeg': [854, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.23.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.23 (1).jpeg': [1280, 720],
  'WhatsApp Image 2026-11-26 at 15.41.23 (2).jpeg': [1280, 720],
  'WhatsApp Image 2026-11-26 at 15.41.24.jpeg': [900, 1600],
  'WhatsApp Image 2026-11-26 at 15.41.24 (1).jpeg': [960, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.25.jpeg': [720, 1280],
  'WhatsApp Image 2026-11-26 at 15.41.25 (1).jpeg': [960, 1280],
}

/** Kunci urut: kelompok -> nomor IMG -> detik jam WhatsApp -> suffix. */
const parsePhoto = (path, src) => {
  const file = path.split('/').pop()

  const img = file.match(/^IMG_(\d+)\.PNG$/i)
  if (img) {
    return { src, file, group: 0, num: Number(img[1]), sec: 0, dup: 0 }
  }

  const wa = file.match(
    /^WhatsApp Image .*?at (\d{2})\.(\d{2})\.(\d{2})(?: \((\d+)\))?\.jpe?g$/i,
  )
  if (wa) {
    return {
      src,
      file,
      group: 1,
      num: 0,
      sec: Number(wa[1]) * 3600 + Number(wa[2]) * 60 + Number(wa[3]),
      dup: Number(wa[4] ?? 0),
    }
  }

  return { src, file, group: 2, num: 0, sec: 0, dup: 0 }
}

const PHOTOS = Object.entries(imageModules)
  .map(([path, src]) => parsePhoto(path, src))
  .sort(
    (a, b) =>
      a.group - b.group ||
      a.num - b.num ||
      a.sec - b.sec ||
      a.dup - b.dup,
  )

/**
 * Catatan tangan yang diselipkan di antara foto (index = posisi setelah
 * foto ke-N). Dipakai untuk memecah ritme dinding jadi lebih "scrapbook".
 */
const NOTES = {
  8: {
    text: 'Dulu... kamu masih kecil, kini jadi alasan aku tersenyum. ♡',
    rot: -2.5,
  },
  26: {
    text: 'Setiap foto ini jadi favoritku, karena ada kamu di dalamnya.',
    rot: 2,
  },
  41: {
    text: 'Kita masih punya ribuan cerita yang belum ditulis. ♡',
    rot: -1.5,
  },
}

/** Susun dinding: foto + catatan yang diselipkan. */
const WALL = []
PHOTOS.forEach((photo, photoIndex) => {
  WALL.push({ kind: 'photo', photo, photoIndex })
  const note = NOTES[photoIndex]
  if (note) WALL.push({ kind: 'note', ...note })
})

/** Kemiringan polaroid (diulang tiap 8 foto) biar kesan scrapbook. */
const ROTATIONS = [-3, 2.5, -2, 3.5, -4, 2, -2.5, 3]

export default function GallerySlide({ active, onNavigate }) {
  const wallRef = useRef(null)
  const [revealed, setRevealed] = useState(() => new Set())

  // Tiap kartu muncul bertahap saat di-scroll, bukan sekaligus saat slide dibuka.
  useEffect(() => {
    const root = wallRef.current
    const items = root ? Array.from(root.querySelectorAll('.gallery-item')) : []

    if (!active) {
      items.forEach((el) => el.classList.remove('is-revealed'))
      return undefined
    }

    const revealAll = () => {
      items.forEach((el) => el.classList.add('is-revealed'))
      setRevealed(new Set(items.map((el) => Number(el.dataset.giIndex))))
    }

    if (typeof IntersectionObserver === 'undefined') {
      const id = window.setTimeout(revealAll, 0)
      return () => window.clearTimeout(id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          const index = Number(entry.target.dataset.giIndex)
          setRevealed((prev) => (prev.has(index) ? prev : new Set(prev).add(index)))
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [active])

  const slideClass = `slide-shell relative w-full ${
    active ? 'is-active flex' : 'hidden'
  } flex-col items-center gap-6 py-4 text-center`

  return (
    <section className={slideClass} data-purpose="slide-memory-gallery" id="slide-4">
      {/* ===== Header ===== */}
      <header className="relative mb-1 flex flex-col items-center">
        <div className="relative w-fit">
          <div className="headline-halo" aria-hidden="true" />
          <h2 className="min-h-[3rem] sm:min-h-[3.5rem] text-4xl sm:text-5xl font-script text-white leading-tight filter drop-shadow-[0_0_16px_rgba(116,164,247,0.5)] flex items-center justify-center gap-2">
            <Typewriter
              active={active}
              delay={0.3}
              speed={62}
              reserve
              segments={[
                { text: 'Our Memories ' },
                { text: '♡', className: 'text-periwinkle-400 animate-twinkle inline-block' },
              ]}
              caretClassName="text-periwinkle-300"
            />
          </h2>
        </div>
        <div className="relative">
          <p className="min-h-[2.5rem] text-slate-300 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-lg">
            <Typewriter
              active={active}
              delay={1.55}
              speed={14}
              segments={[{ text: 'macii yaa sayang udah hadir dalam hidup akoo\n ♡♡♡' }]}
              caretClassName="text-periwinkle-400"
            />
          </p>
          {/* Underline hand-drawn arrow */}
          <svg
            className="w-52 h-3 text-periwinkle-400 mx-auto mt-0.5 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 200 10"
            aria-hidden="true"
          >
            <path
              d="M5 5 L180 5 M180 5 L170 2 M180 5 L170 8"
              pathLength="100"
              className="draw"
              style={{ '--d': '2.45s' }}
            />
          </svg>
        </div>
      </header>

      {/* ===== Dinding foto masonry ===== */}
      <div
        ref={wallRef}
        className="relative w-full max-w-6xl columns-2 sm:columns-3 md:columns-4 gap-x-3 sm:gap-x-4"
        data-purpose="gallery-masonry-wall"
      >
        {/* Halo lembut di belakang dinding */}
        <div
          className="headline-halo pointer-events-none"
          style={{ inset: '6% 8%', filter: 'blur(40px)' }}
          aria-hidden="true"
        />

        {WALL.map((item, index) => {
          const stagger = String(index % 4)

          if (item.kind === 'note') {
            return (
              <aside
                key={`note-${item.text.slice(0, 8)}`}
                data-gi-index={index}
                className="gallery-item"
                style={{ '--stagger': stagger }}
              >
                <div className="gallery-reveal">
                  <div
                    className="bg-parchment text-slate-800 font-script font-bold px-4 py-3.5 rounded shadow-2xl border border-stone-300"
                    style={{ transform: `rotate(${item.rot}deg)` }}
                  >
                    <p className="text-sm sm:text-base leading-snug">
                      <Typewriter
                        active={active && revealed.has(index)}
                        delay={0.15}
                        speed={44}
                        reserve
                        segments={[{ text: item.text }]}
                        caretClassName="text-slate-700"
                      />
                    </p>
                  </div>
                </div>
              </aside>
            )
          }

          const { photo, photoIndex } = item
          const rot = ROTATIONS[photoIndex % ROTATIONS.length]
          const tape = photoIndex % 5 === 0
          // Rasio asli foto -> ruang tinggi sudah dipesan sebelum gambar dimuat.
          const dims = DIMENSIONS[photo.file] ?? [720, 1280]
          const alt =
            photo.group === 0
              ? `Kenangan masa kecil ${photo.num}`
              : `Momen kita ${photoIndex + 1}`

          return (
            <article
              key={photo.file}
              data-gi-index={index}
              className="gallery-item"
              style={{ '--stagger': stagger }}
            >
              <div className="gallery-reveal">
                <div
                  className="photo-slot relative"
                  style={{ transform: `rotate(${rot}deg)` }}
                >
                  <div className="polaroid relative p-1.5 pb-5 sm:p-2 sm:pb-6">
                    {tape ? (
                      <div
                        className="masking-tape absolute -top-2 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-5 rotate-[1deg] z-20"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="overflow-hidden bg-slate-900">
                      <img
                        alt={alt}
                        width={dims[0]}
                        height={dims[1]}
                        loading="lazy"
                        decoding="async"
                        className="block w-full h-auto"
                        src={photo.src}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}

        {/* Aksen melayang di sekitar dinding */}
        <div
          className="fx-fade absolute -top-2 left-[6%] text-periwinkle-400/70 font-script text-2xl pointer-events-none"
          style={{ '--d': '2.6s' }}
          aria-hidden="true"
        >
          <span className="animate-float inline-block" style={{ animationDelay: '-1.5s' }}>
            ♡
          </span>
        </div>
        <div
          className="fx-fade absolute top-[38%] -right-1 text-periwinkle-300/60 font-script text-xl pointer-events-none"
          style={{ '--d': '3.2s' }}
          aria-hidden="true"
        >
          <span className="animate-float inline-block" style={{ animationDelay: '-3.4s' }}>
            ♡
          </span>
        </div>
        <svg
          className="fx-fade absolute bottom-[30%] -left-1 w-3.5 h-3.5 text-periwinkle-300 animate-twinkle pointer-events-none"
          style={{ '--d': '2.9s', animationDelay: '-1.1s' }}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
      </div>

      {/* ===== CTA penutup ===== */}
      <div className="mt-2 flex flex-col items-center gap-2 fx-up" style={{ '--d': '3.55s' }}>
        <button
          className="glow-border btn-lift btn-shine px-8 py-2.5 rounded-full bg-midnight/90 text-white font-medium text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer hover:bg-slate-900"
          onClick={() => onNavigate(1)}
        >
          <svg className="w-4 h-4 text-periwinkle-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Terima Kasih ♡</span>
        </button>
        <p className="min-h-[1.4rem] font-script text-sm sm:text-base text-periwinkle-300/80 tracking-wide">
          <Typewriter
            active={active}
            delay={4.25}
            speed={48}
            reserve
            segments={[{ text: 'Selamanya, kamu. ♡' }]}
            caretClassName="text-periwinkle-300"
          />
        </p>
      </div>
    </section>
  )
}
