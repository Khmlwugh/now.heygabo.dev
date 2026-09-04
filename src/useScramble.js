import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
const INTERVAL_MS = 40
const DURATION_MS = 600

function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export function useScramble(target, delay = 0, trigger = 0) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!target) return
    setDone(false)
    setDisplay('')

    const timeout = setTimeout(() => {
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / DURATION_MS, 1)
        const settleUpTo = Math.floor(progress * target.length)

        let out = ''
        for (let i = 0; i < target.length; i++) {
          out += i < settleUpTo
            ? target[i]
            : target[i] === ' ' ? ' ' : rand()
        }
        setDisplay(out)

        if (progress >= 1) {
          setDisplay(target)
          setDone(true)
          clearInterval(timerRef.current)
        }
      }, INTERVAL_MS)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(timerRef.current)
    }
  }, [target, delay, trigger]) // trigger forces re-run every 60s

  return { display, done }
}