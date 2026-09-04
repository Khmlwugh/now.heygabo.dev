import { useState, useEffect, useRef } from 'react'
import { useNowData } from './useNowData'
import NowRow from './NowRow'

const STAGGER = 180
const MONO = "'Share Tech Mono', monospace"
const LOADING = [{ main: 'loading...', muted: '' }]

export default function Now() {
  const lines = useNowData()
  const [theme, setTheme] = useState('dark')
  const [trigger, setTrigger] = useState(0)
  const triggerRef = useRef(0)

  useEffect(() => {
    const iv = setInterval(() => {
      triggerRef.current += 1
      setTrigger(triggerRef.current)
    }, 60_000)
    return () => clearInterval(iv)
  }, [])

  const dark = theme === 'dark'
  const bg       = dark ? '#0a0a0a' : '#f0f7f0'
  const green    = dark ? '#33ff33' : '#1a7a1a'
  const subGreen = dark ? 'rgba(51,255,51,0.4)' : 'rgba(26,122,26,0.5)'
  const footerC  = dark ? '#1a3a1a' : '#5a8a5a'
  const btnBg    = dark ? 'rgba(51,255,51,0.08)' : 'rgba(26,122,26,0.1)'
  const btnBor   = dark ? 'rgba(51,255,51,0.2)'  : 'rgba(26,122,26,0.3)'

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', transition: 'background 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes blink  { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        style={{
          position: 'fixed', top: '1.25rem', right: '1.25rem',
          fontFamily: MONO, fontSize: '11px', letterSpacing: '0.1em',
          background: btnBg, border: `1px solid ${btnBor}`,
          color: green, padding: '5px 12px', borderRadius: '2px',
          cursor: 'pointer', transition: 'all 0.3s',
        }}
      >
        {dark ? 'light' : 'dark'}
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.3em', color: green, opacity: 0.4, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          now.heygabo.dev
        </p>
        <p style={{ fontFamily: MONO, fontSize: '12px', color: green, opacity: 0.7, letterSpacing: '0.15em' }}>
          gabo@lima ~ %
          <span style={{ display: 'inline-block', width: '7px', height: '12px', background: green, verticalAlign: 'middle', marginLeft: '3px', animation: 'blink 1.1s step-end infinite' }} />
        </p>
      </div>

      {/* Rows */}
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {(lines ?? LOADING).map((line, i) => (
          <NowRow
            key={i}
            main={line.main}
            muted={line.muted}
            delay={i * STAGGER}
            trigger={trigger}
            theme={theme}
          />
        ))}
      </div>

      <p style={{ marginTop: '2rem', fontFamily: MONO, fontSize: '10px', letterSpacing: '0.15em', color: footerC }}>
        auto-refresh 60s
      </p>
    </div>
  )
}
