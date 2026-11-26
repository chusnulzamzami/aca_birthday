import { useEffect, useRef, useState } from 'react'
import Typewriter from './Typewriter'

/**
 * Semua foto di folder `assets/slide 3` dimuat otomatis lalu diurutkan
 * sesuai nomor nama file (1..46, tanpa nomor 32).
 * Foto ditampilkan bergantian seperti tangga:
 *   - foto ganjil (1,3,5..) -> di KANAN, cerita di kiri
 *   - foto genap  (2,4,6..) -> di KIRI,  cerita di kanan
 */
const imageModules = import.meta.glob('../assets/slide 3/*.{PNG,jpeg}', {
  eager: true,
  import: 'default',
})

const IMAGES = Object.entries(imageModules)
  .map(([path, src]) => ({
    num: Number(path.match(/(\d+)\.\w+$/)?.[1] ?? 0),
    src,
  }))
  .sort((a, b) => a.num - b.num)

/** Teks kisah per foto (diambil dari nomor nama file). */
const STORY = {
  1: 'ntikkk ayii nak nii kan, aku ada liat kamu gii foto nii, comel ayii loh sayangg.',
  2: 'nah disini pertama kali kita pergi jalan jalan sama anak magang lain nya kan sayang, kita pakek baju warna yg sama kan, kamu udah kecintaan dgn aku disini kan sayang jujur.',
  3: 'buktinya disini kamu paparazi in aku loh hihii comel lii nak nii, suka dgn aku yaa?.',
  4: 'liat nah kamu foto" in aku disini knpa sayang? suka kan kamu jujur aja loh sayang.',
  5: 'ini hari pertama kali kamu DL kan sayang, tapi jujur DL yg ini aku ga mengharapkan kamu cepat balek, tapi nnya dikit dah sampe apa belom pas pulangnya tu ehee.',
  6: 'disini kita udah selalu bareng take konten kan sayang ehehee sukaa.',
  7: 'kamu anaknya memamng suka foto aib yaa sayang-_-.',
  8: 'naah disini kita pergi ke Blang padang sama teman magang, kita perginya bareng kan aku kerumah kamu, tapi beda motor, dan difoto ini aku duduk di sebalah kamu loh sayang hihiii.',
  9: 'ini kamu jalan balik dari sabang, kalau tadi pas DL aku ga mengharapkan kamu cepat baliknya, tapi disini aku udah nnya kabar kamu,  nnya kamu udah dmna, kapan balik, jadi balik atau engga, udah nympe apa belom, dll kan hihii, iyaa maap.',
  10: 'kalau ga salah hari nii adalah hari dimna pertama kalinya aku jemput kamu dirumh karna kamu cape baru pulang dari sabang, dan disini kita buat konten pertama kali kita sayang, kamu yg ajak buat bareng kan, iyaa kan sayangg.',
  11: 'disini aku senang kaliiii, kamu ajak aku pergi ke acara wisuda tasya, kamu kenalin aku ke teman teman kamu, sukaa kaliii macii yaa sayang.',
  12: 'pertama kali kita ceefdean bareng nii sayang, hari itu aku jemput kamu dan bertemu sama papa dan mama kamu sayang, sukaa ayiii, aku nii orangnya sayangg?.',
  13: 'sukaa kali loh dia foto" aib kitaa, kesukaan kamu kan sama aku sayang-_-.',
  14: 'sukaaa kaliii loh aku sayangg, geemsy kalii kok kamuuu cintaa, mauu di pegang" lagii rambut sayangg mauuuu.',
  15: 'disniii kitaa mau pergi duduk bareng teman" kamuu ke gorengan kk ida kan sayang, kita pake masker karna asap karhutla kan sayang hihii.',
  16: 'bestu pulang dari gorengan kk ida kita lanjut mam gacoan kan, ini first date kita kah sayang mam gacoan? hihiii comel ayii kan kita sayang, disini kita juga udah ngajak couple an kan bajunyaaa geamsyyy.',
  17: 'ini kitaa gowes date kan sayang, harusnya kita pergi sore tapi karna hujan jadi kita tunda sampe malam pun tetap kita gas jalan pake sepeda kan, salat di mesjid tvri, keliling keling, terus pulangnya kita mam bakso rempah.',
  18: 'agggggg gemasyy kali loh diaa jadi cewe pertama kali yg nemenin aku pangkas agghh, cii yaa sayang udah selalu ada buat aku, abes siap pangkas kita lanjut jalan mam lontong malam kan sayang hihii, kita habisin jalan berdua karna kita besoknya mau DL.',
  19: 'inii potret kita vc DL bareng kan sayang, tapi kita ga satu daerah sayang:(, kamu ke bireun aku ki pijay, aneen kamuu disinii makanya kita asik vc aja kan sayang, sampe kamu nemenin aku beli jajan dan makakan disna, geemsyyy ayii, macii yaa saynag).',
  20: 'pulang dari DL kita pergi mam marugame udon kan sayang, kamu jemput aku naik mobil, disini aku masii jadi princes loh sayangg hehee, soalnya kamu yg nyetir aku yg duduk di sampingnyaa.',
  21: 'bes siap mam, kita masuk kesini buat cari mirror, ehh hasilnya bagus kalii kalii kan sayangg, suka kali aku dgn foto nii, geemsyy kaliii kita sayang.',
  22: 'ini kita foto lagi nungguin bg fahmi mau ambil APD buat take konten kan sayang, bestu kita dikasi fore gratis ma bg fahmi hihii.',
  23: 'dan lagi lagii kamu ajak aku ke sidangnya teman kamu, depit. dan lagi lagi disini aku ngerasa dihargai kali karna kamu mau kenalin dan ngajak aku buat main sama teman teman kamu.',
  24: 'inii ceefde kita yg kedua kan sayang, kita foto mirror punya azko, bayarnya cuma disuruh follow akun ig azko aja kan sayang hehehe comel kalii disinii kita kan sayang.',
  25: 'ehhh ini kita jogging date loh sayang, gemesyy kalii, ini kita ke stadion harapan bangsa kan yaa, sampe kita jumpa kucing embrot disna.',
  26: 'ini siapa sayang comel kalii hadap kebelakang, lagi liat siapa sii kita sayang, comel kali kan kita, ini kita pergi ke mendaki ke lhok mataie bareng teman" kamu juga kan sayang.',
  27: 'agggghhh geemsyy kalii ini sayangg, kamu ril peluk aku bangett disinii, suka kalii, sayang sekalii sama kamuuuu, cintaa kamuuu, loveee.',
  28: 'sesi potret anak baik, aku tau kamu suka kali dgn style rambut aku yg ini kan sayanggg, jujur aja kamu.',
  29: 'ini pas istirahat jam makan siang kita duduk di analogi, kita beli ayam geprek papolit kamuu dan teh hijau dingin iceland hihiii gemasyy.',
  30: 'kita num bandrek dan gorengan di ulele nii sayang, enak ayii kan tempatnyaa, semua tempat enak kok asal itu sama kamuuu.',
  31: 'tempat yang kamu suka, harvis, sebalm ke harvis kita cari mam keliling, cari burger tapi tutup, cari ayam geprek dja tutup juga, terakhir kita mam nasi ayam bakar bariq, dan kita mam nya di harvis.',
  33: 'kita datang lagi ke ulele tu sayang, tempat tapi kali ni kita ga pesan minum bandrek tu lgi yaa, soalnya kita mam nasi disini, kamunya aj sih aku udah mam dirumah.',
  34: 'potret anak kecil mam mie ayam depan mesjid teuku umar, cuu ayii dia loh gemasyy kalii.',
  35: 'eakkk kitaa badmin date sama teman aku disini sayang, disinilah aku liat sosok wanita kuat itu, main full sejam tanpa rasa lelah, kuat kalii my super hero aku nii lohhh.',
  36: 'besoknya kamu DL sayang:(, cediii rasanya kamu jauh dari aku, ga bisa aku eldeer, tapii kamu cantik kali sayang.',
  37: 'potret anak batat suka ngejek batat kaliii, gemesy kali tapi kan, kek aggghh pen banteng nakal kali pokonya nak niii.',
  38: 'eakk kita work bareng nii buat projek bos andri, suka kali kamu ada selalu dihidup aku sayang, macii yaa cintakuuu love youuu.',
  39: 'benciiii, batat kali ga sukaaa, ngakak kalii aku liat inii, kek anak ajoo aku disini, tapi kamu tetap gemasy kaliii.',
  40: 'kita selalu bersama dimanapun itu, kerja bareng semua semua harus bareng pokoknyaaa.',
  41: 'eitsss segan kali awak bah, foto ma bg joni diaa, nampak dari raut wajahnya kamu kaya kesenangan kali disini sayangg.',
  42: 'kek masyaAllah kalii disini kita disuruh masuk frame buat foto sama mentri kan sayang, baik kali kakak tu mau dia fotoin nya.',
  43: 'inii lucuu kalii, gegra mentri ga jadi masok ke kios, jadi kita yg habisin kue yg harusnya dihidangin buat mentri, kamu yg paling bnyak makan pokoknya disiniii, habis semua buat kamu sayang.',
  44: 'sarapan paporit kamu, nasi pagi pak FAISAL, sesuka itu kamu dgn om paisal yaa, suka kali liatt kamu bahagia kaya di foto ini sayang, disini kamu ngeh kan aku foto maknya kamu tersenyum.',
  45: 'lucuu kalii ga sanggop kena prank lagi buat projek, "jangn ngelirik ke laptop yaa soalnya lagi zoom kameranya 360 derajat nanti ketahuan", lebih lucunya lagi pas aku dance brazil, kamu bilang gini "manada orang gii zoom gtu aneh kali" huwaaa lucu kalii, aku ga mau kamu tau aku gii buat ini sayangg.',
  46: 'MAAF YAA HEHEE, SEBERPA IMUT CII AKUUU. ♡',
}

/** Kemiringan polaroid biar kesan scrapbook (diulang tiap 8 foto). */
const ROTATIONS = [-3, 2, -2, 3, -4, 3, -2, 4]

const TIMELINE = IMAGES.map((img, i) => ({
  ...img,
  caption: STORY[img.num] ?? 'Terima kasih sudah menjadi bagian dari kisah ini.',
  rot: ROTATIONS[i % ROTATIONS.length],
  tape: i % 5 === 0,
}))

export default function TimelineSlide({ active, onNavigate }) {
  const timelineRef = useRef(null)
  const [revealed, setRevealed] = useState(() => new Set())

  // Tiap baris kisah muncul bertahap saat di-scroll (foto & teks masuk
  // dari sisi yang berlawanan), bukan sekaligus saat slide dibuka.
  useEffect(() => {
    const root = timelineRef.current
    const items = root ? Array.from(root.querySelectorAll('.timeline-item')) : []

    if (!active) {
      items.forEach((el) => el.classList.remove('is-revealed'))
      return undefined
    }

    const revealAll = () => {
      items.forEach((el) => el.classList.add('is-revealed'))
      setRevealed(new Set(items.map((el) => Number(el.dataset.tlIndex))))
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
          const index = Number(entry.target.dataset.tlIndex)
          setRevealed((prev) => (prev.has(index) ? prev : new Set(prev).add(index)))
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [active])

  const slideClass = `slide-shell relative w-full ${
    active ? 'is-active flex' : 'hidden'
  } flex-col items-center gap-7 py-4`

  return (
    <section className={slideClass} data-purpose="slide-timeline-story" id="slide-3">
      {/* ===== Header: Judul + Intro ===== */}
      <header className="w-full max-w-2xl flex flex-col items-center text-center">
        <div className="relative w-fit">
          <div className="headline-halo" aria-hidden="true" />
          <h2 className="min-h-[3rem] sm:min-h-[3.5rem] text-4xl sm:text-5xl font-script text-white leading-tight filter drop-shadow-[0_0_14px_rgba(116,164,247,0.4)]">
            <Typewriter
              active={active}
              delay={0.35}
              speed={62}
              segments={[{ text: 'Kisah Kita...' }]}
              caretClassName="text-periwinkle-300"
            />
          </h2>
          <svg
            className="w-36 h-3 text-periwinkle-400 mx-auto mt-1"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 140 10"
            aria-hidden="true"
          >
            <path d="M5 5 Q40 8 75 4 T135 5" pathLength="100" className="draw" style={{ '--d': '1.15s' }} />
          </svg>
        </div>

        <p className="mt-5 min-h-[4.5rem] text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          <Typewriter
            active={active}
            delay={1.3}
            speed={9}
            segments={[
              { text: 'Percaya ga percaya, aku udah ngelirik kamu dari awal tes wawancara, plis cuma ngelirik yaa-_-\n\n trus aku ngecek pengumuman kelulusannya kan, aku kepoin IG kamu, ehh rupnya kamu juga lewat, tapi disitu aku bodo amat seng\n\n pas pertama kali kita kick off hari pertama magang itu aku ada sempat nyariin kamu duduknya di mana, rupanya kamu duduk di ujung sana kan yaa, hihi gemesy ngelirik dikit aaa loh\n\n  ' },
            ]}
            caretClassName="text-periwinkle-400"
          />
        </p>
        <p className="min-h-[4.5rem] text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          <Typewriter
            active={active}
            delay={2.45}
            speed={9}
            segments={[
              { text: 'tapi kan aku ga suka liat kamu karna kamu cuek kali benci, kaya bodo amat gtu, bestu kaya not respon dgn humor aku, GALIKE POKOKNYA. tapi suka dikit hehee\n\n' },
            ]}
            caretClassName="text-periwinkle-400"
          />
        </p>
        <p className="min-h-[3.5rem] font-script text-2xl text-periwinkle-300 tracking-wide pt-1">
          <Typewriter
            active={active}
            delay={3.65}
            speed={34}
            segments={[
              { text: 'Dan yaa sekarang....\n kamu lah pemenangnya sayang\n iyaaa kamu loh sayang\n ' },
              { text: '♡', className: 'text-periwinkle-400 animate-twinkle inline-block' },
            ]}
            caretClassName="text-periwinkle-300"
          />
        </p>
      </header>

      {/* ===== Timeline tangga: foto bergantian + cerita ===== */}
      <div
        ref={timelineRef}
        className="relative w-full max-w-5xl mt-2"
        data-purpose="vertical-timeline-collage"
      >
        {/* Garis timeline vertikal (tengah di desktop, kiri di mobile) */}
        <div className="timeline-track" aria-hidden="true" />

        {TIMELINE.map((item, index) => {
          const photoRight = index % 2 === 0
          return (
            <article
              key={item.num}
              data-tl-index={index}
              className={`timeline-item relative pl-9 sm:pl-12 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-10 xl:gap-16 items-center py-4 lg:py-6 ${
                photoRight ? 'photo-right' : 'photo-left'
              }`}
              style={{ '--from-x': photoRight ? '54px' : '-54px' }}
            >
              {/* Titik node di garis timeline */}
              <span className="tl-node" aria-hidden="true">
                <span className="node-halo absolute inset-0 rounded-full border border-periwinkle-400/70" />
                <span className="relative block h-3 w-3 rounded-full bg-white border-2 border-periwinkle-400 shadow-[0_0_12px_#74a4f7]" />
              </span>

              {/* Sel foto (polaroid) */}
              <div
                className={`tl-photo flex justify-center lg:row-start-1 ${
                  photoRight ? 'lg:col-start-2 lg:justify-start' : 'lg:col-start-1 lg:justify-end'
                }`}
              >
                <div
                  className="polaroid relative p-2 pb-6 rounded-sm w-48 sm:w-60 lg:w-56 xl:w-64"
                  style={{ transform: `rotate(${item.rot}deg)` }}
                >
                  {item.tape ? (
                    <div
                      className="masking-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 rotate-[1deg] z-20"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="overflow-hidden bg-slate-900 w-full aspect-[3/4] shadow-inner">
                    <img
                      alt={`Kenangan nomor ${item.num}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                      src={item.src}
                    />
                  </div>
                </div>
              </div>

              {/* Sel teks cerita */}
              <div
                className={`tl-text min-h-[5rem] mt-4 lg:mt-0 text-left lg:row-start-1 ${
                  photoRight ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2 lg:text-left'
                }`}
              >
                <p
                  className={`text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-md ${
                    photoRight ? 'ml-auto' : ''
                  }`}
                >
                  <Typewriter
                    active={active && revealed.has(index)}
                    delay={0.12}
                    speed={24}
                    segments={[{ text: item.caption }]}
                    caretClassName="text-periwinkle-400"
                  />
                </p>
              </div>
            </article>
          )
        })}

        {/* Aksen melayang di sekitar timeline */}
        <div className="fx-fade absolute top-[6%] right-[4%] text-periwinkle-400/70 font-script text-2xl pointer-events-none" style={{ '--d': '2.4s' }}>
          <span className="animate-float inline-block" style={{ animationDelay: '-1.5s' }}>♡</span>
        </div>
        <div className="fx-fade absolute bottom-[18%] left-[3%] text-periwinkle-300/60 font-script text-xl pointer-events-none" style={{ '--d': '3.1s' }}>
          <span className="animate-float inline-block" style={{ animationDelay: '-3.4s' }}>♡</span>
        </div>
        <svg className="fx-fade absolute top-[48%] right-[10%] w-3.5 h-3.5 text-periwinkle-300 animate-twinkle pointer-events-none" style={{ '--d': '2.7s', animationDelay: '-1.1s' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
      </div>

      {/* ===== CTA ke slide berikutnya ===== */}
      <div className="mt-3 fx-up" style={{ '--d': '4.75s' }}>
        <button
          className="glow-border btn-lift btn-shine px-8 py-2.5 rounded-full bg-midnight/80 text-white font-medium text-sm sm:text-base flex items-center gap-2 group cursor-pointer hover:bg-slate-900/80"
          onClick={() => onNavigate(4)}
        >
          <span>Selanjutnya</span>
          <span className="transition-transform group-hover:translate-x-1.5 duration-300">→</span>
        </button>
      </div>
    </section>
  )
}
