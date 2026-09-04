export default async function handler(req, res) {
  const USERNAME = process.env.GITHUB_USERNAME
  const TOKEN    = process.env.GITHUB_TOKEN

  if (!USERNAME) {
    return res.status(500).json({ error: 'GITHUB_USERNAME not set' })
  }

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'heygabo-now',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    }

    const reposRes = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=1`,
      { headers }
    )
    const repos = await reposRes.json()
    const repo  = repos?.[0]

    if (!repo) {
      return res.status(200).json({ repo: null, ago: null })
    }

    const pushedAt = new Date(repo.pushed_at)
    const diffMs   = Date.now() - pushedAt.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs  = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHrs / 24)

    let ago
    if (diffMins < 60)       ago = `${diffMins}m ago`
    else if (diffHrs < 24)   ago = `${diffHrs}h ago`
    else if (diffDays === 1) ago = 'yesterday'
    else                     ago = `${diffDays}d ago`

    return res.status(200).json({ repo: repo.name, ago })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
