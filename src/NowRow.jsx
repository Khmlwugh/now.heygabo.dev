import { useScramble } from './useScramble'

const MONO = "'Share Tech Mono', monospace"

export default function NowRow({ main, muted, delay, trigger, theme }) {
  const { display, done } = useScramble(main, delay, trigger)

  const dimColor   = theme === 'light' ? '#2a6a2a' : '#2d6e2d'
  const mainColor  = theme === 'light' ? '#1a5c1a' : '#c8ffc8'
  const scramColor = theme === 'light' ? '#1a8a1a' : '#33ff33'
  const promptCol  = theme === 'light' ? '#1a8a1a' : '#33ff33'

  return (
    <div style={{ display: 'flex', padding: '0.35rem 0', borderBottom: '1px solid rgba(51,255,51,0.05)', alignItems: 'baseline' }}>
      <span style={{ fontFamily: MONO, color: promptCol, opacity: 0.45, marginRight: '0.75rem', fontSize: '13px', flexShrink: 0 }}>$</span>
      <span style={{ fontFamily: MONO, fontSize: '13px', color: done ? mainColor : scramColor, letterSpacing: '0.04em', lineHeight: 1.4, transition: 'color 0.2s' }}>
        {display}
      </span>
      {done && muted && (
        <span style={{ fontFamily: MONO, color: dimColor, fontSize: '11px', marginLeft: '0.6rem', animation: 'fadeIn 0.4s ease forwards' }}>
          {muted}
        </span>
      )}
    </div>
  )
}
