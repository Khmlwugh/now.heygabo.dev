const KV_URL   = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const KEY      = 'steam:last_game'

async function kvGet() {
  const r = await fetch(`${KV_URL}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
  const data = await r.json()
  if (!data.result) return null
  try {
    const parsed = JSON.parse(data.result)
    // handle double-wrapped { value: "..." }
    if (parsed.value) return JSON.parse(parsed.value)
    return parsed
  } catch {
    return null
  }
}

async function kvSet(gameName) {
  // Store just the game name as a plain string — no JSON wrapping
  await fetch(`${KV_URL}/set/${KEY}/${encodeURIComponent(gameName)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
}

export default async function handler(req, res) {
  const API_KEY  = process.env.STEAM_API_KEY
  const STEAM_ID = process.env.STEAM_ID

  try {
    const r = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`
    )
    const data = await r.json()
    const player = data.response?.players?.[0]
    const currentGame = player?.gameextrainfo ?? null

    if (currentGame) {
      await kvSet(currentGame)
      return res.status(200).json({ game: currentGame, live: true })
    }

    // Not playing — read from KV
    const r2 = await fetch(`${KV_URL}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
    const kv = await r2.json()
    const lastGame = kv.result ? decodeURIComponent(kv.result) : null

    if (lastGame) {
      return res.status(200).json({ game: lastGame, live: false })
    }

    return res.status(200).json({ game: null, live: false })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
