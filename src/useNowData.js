import { useState, useEffect } from 'react'

const REFRESH_MS = 60_000

async function fetchJson(url) {
  try {
    const r = await fetch(url)
    return await r.json()
  } catch {
    return null
  }
}

export function useNowData() {
  const [lines, setLines] = useState(null)

  async function load() {
    const [weather, spotify, github, steam, nba] = await Promise.all([
      fetchJson('/api/weather'),
      fetchJson('/api/spotify'),
      fetchJson('/api/github'),
      fetchJson('/api/steam'),
      fetchJson('/api/nba'),
    ])

    const result = []

    if (weather?.temp != null)
      result.push({ main: `${weather.temp}°c, ${weather.condition}`, muted: `— ${weather.mood}` })

    if (spotify?.track)
      result.push({ main: `${spotify.artist} — ${spotify.track}`, muted: spotify.live ? 'now playing' : spotify.ago })

    if (github?.repo)
      result.push({ main: github.repo, muted: `last commit ${github.ago}` })

    if (steam?.game)
      result.push({ main: steam.game, muted: steam.live ? 'now playing' : 'last played' })

    if (nba) {
      if (nba.offseason)
        result.push({ main: 'knicks', muted: 'offseason. suffering.' })
      else if (nba.matchup)
        result.push({ main: nba.matchup, muted: nba.when })
    }

    setLines(result)
  }

  useEffect(() => {
    load()
    const iv = setInterval(load, REFRESH_MS)
    return () => clearInterval(iv)
  }, [])

  return lines
}
