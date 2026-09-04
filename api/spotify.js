export default async function handler(req, res) {
  const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(500).json({ error: 'env vars missing' })
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/x-www-form-urlencoded',
        Authorization:   `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
    })

    const tokenData = await tokenRes.json()
    const access_token = tokenData.access_token

    if (!access_token) {
      return res.status(500).json({ error: 'token_failed', detail: tokenData })
    }

    const nowRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    if (nowRes.status === 200) {
      const nowData = await nowRes.json()
      if (nowData?.item) {
        return res.status(200).json({
          track:  nowData.item.name,
          artist: nowData.item.artists[0].name,
          live:   true,
          ago:    null,
        })
      }
    }

    const recentRes = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const recentData = await recentRes.json()
    const item = recentData.items?.[0]

    if (!item) {
      return res.status(200).json({ track: null, artist: null, live: false, ago: null })
    }

    const diffMs   = Date.now() - new Date(item.played_at).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs  = Math.floor(diffMins / 60)
    const ago = diffMins < 60 ? `${diffMins}m ago` : diffHrs < 24 ? `${diffHrs}h ago` : 'yesterday'

    return res.status(200).json({
      track:  item.track.name,
      artist: item.track.artists[0].name,
      live:   false,
      ago,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
