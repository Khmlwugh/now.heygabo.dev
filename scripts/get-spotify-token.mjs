import http from 'http'
import fetch from 'node-fetch'

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI  = 'http://127.0.0.1:8888/callback'
const SCOPE         = 'user-read-currently-playing user-read-recently-played'

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id:     CLIENT_ID,
    scope:         SCOPE,
    redirect_uri:  REDIRECT_URI,
  })

console.log('\n1. Open this URL in your browser:\n')
console.log(authUrl)
console.log('\n2. Log in and click Agree.')
console.log('3. Waiting for callback...\n')

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:8888')

  if (url.pathname !== '/callback') {
    res.end('waiting...')
    return
  }

  const code  = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    res.end('Error: ' + error)
    console.error('Spotify returned error:', error)
    server.close()
    return
  }

  if (!code) {
    res.end('No code received.')
    server.close()
    return
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      Authorization:   `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })

  const data = await tokenRes.json()

  if (data.refresh_token) {
    res.end('Done! Check your terminal.')
    console.log('\n✅ Got your token!\n')
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`)
    console.log('\nCopy that into your Vercel env vars and you\'re done.\n')
  } else {
    res.end('Failed. Check terminal.')
    console.error('\n❌ Failed:', JSON.stringify(data, null, 2))
  }

  server.close()
})

server.listen(8888, '127.0.0.1', () => {
  console.log('Listening on http://127.0.0.1:8888 ...')
})
