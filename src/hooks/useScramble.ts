import { useState, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

export function useScramble(target: string, delay = 400) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let frame = 0
    let timeout: ReturnType<typeof setTimeout>
    const totalFrames = 24
    const revealAt = Math.floor(totalFrames / target.length)

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++
        const revealed = Math.floor(frame / revealAt)
        const scrambled = target
          .split('')
          .map((char, i) => {
            if (i < revealed) return char
            if (char === ' ') return ' '
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')

        setDisplay(scrambled)

        if (revealed >= target.length) {
          setDisplay(target)
          setDone(true)
          clearInterval(interval)
        }
      }, 40)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [target, delay])

  return { display, done }
}
