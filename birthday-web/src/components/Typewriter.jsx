import { useEffect, useState } from 'react'

/**
 * Slowly reveals text character-by-character, like it is being written.
 * Supports multiple styled segments and line breaks (\n).
 * The animation restarts every time `active` turns true.
 *
 * Set `reserve` to keep the final text dimensions (prevents centered
 * headlines from shifting while they are being typed).
 */
export default function Typewriter({
  segments = [],
  active = true,
  speed = 32,
  delay = 0,
  className = '',
  caretClassName = '',
  caret = true,
  reserve = false,
  as: Tag = 'span',
}) {
  const fullText = segments.map((segment) => segment.text).join('')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      setCount(0)
      return undefined
    }

    setCount(0)
    let index = 0
    let intervalId = null

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1
        setCount(index)
        if (index >= fullText.length) {
          window.clearInterval(intervalId)
        }
      }, Math.max(speed, 8))
    }, Math.max(delay, 0) * 1000)

    return () => {
      window.clearTimeout(startId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [active, fullText, speed, delay])

  const isTyping = active && count > 0 && count < fullText.length

  const renderParts = (limit) =>
    segments.map((segment, index) => {
      const start = segments
        .slice(0, index)
        .reduce((total, item) => total + item.text.length, 0)
      const take =
        limit === null
          ? segment.text.length
          : Math.max(0, Math.min(segment.text.length, limit - start))
      return (
        <span key={`${index}-${segment.text.slice(0, 4)}`} className={segment.className}>
          {segment.text.slice(0, take)}
        </span>
      )
    })

  const caretNode =
    caret && isTyping ? (
      <span aria-hidden="true" className={`type-caret ${caretClassName}`} />
    ) : null

  if (reserve) {
    return (
      <Tag className={className}>
        <span className="sr-only">{fullText}</span>
        <span aria-hidden="true" className="relative inline-block">
          <span className="invisible whitespace-pre-line">{renderParts(null)}</span>
          <span className="absolute inset-0 whitespace-pre-line text-left">
            {renderParts(count)}
            {caretNode}
          </span>
        </span>
      </Tag>
    )
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{fullText}</span>
      <span aria-hidden="true" className="whitespace-pre-line">
        {renderParts(count)}
        {caretNode}
      </span>
    </Tag>
  )
}
