export default async function handler(req, res) {
  const TEAM = 'Knicks'
  const API_KEY = process.env.BALLDONTLIE_API_KEY

  try {
    const teamsRes = await fetch('https://api.balldontlie.io/v1/teams', {
      headers: { Authorization: API_KEY },
    })
    const teamsData = await teamsRes.json()
    const team = teamsData.data.find(t => t.full_name.includes(TEAM))
    if (!team) return res.status(200).json({ game: null })

    const today = new Date().toISOString().split('T')[0]
    const future = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

    const gamesRes = await fetch(
      `https://api.balldontlie.io/v1/games?team_ids[]=${team.id}&start_date=${today}&end_date=${future}&per_page=1`,
      { headers: { Authorization: API_KEY } }
    )
    const gamesData = await gamesRes.json()
    const game = gamesData.data?.[0]

    if (!game) {
      return res.status(200).json({ game: null, offseason: true })
    }

    const home = game.home_team.full_name
    const away = game.visitor_team.full_name
    const opponent = home.includes(TEAM) ? away : home
    const dateStr = new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const diffDays = Math.ceil((new Date(game.date) - new Date()) / 86400000)
    const when = diffDays === 0 ? 'today' : diffDays === 1 ? 'tomorrow' : `${diffDays}d out`

    res.status(200).json({
      matchup: `Knicks vs ${opponent.split(' ').at(-1)} — ${dateStr}`,
      when,
    })
  } catch {
    res.status(500).json({ error: 'nba unavailable' })
  }
}
