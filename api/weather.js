export default async function handler(req, res) {
  const API_KEY = process.env.OPENWEATHER_API_KEY
  const CITY = 'Lima,PE'

  try {
    const r = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    )
    const data = await r.json()

    const temp = Math.round(data.main.temp)
    const condition = data.weather[0].main.toLowerCase()
    const desc = data.weather[0].description

    const moodMap = {
      clear:        'dreading the sun',
      clouds:       'enjoying the clouds',
      rain:         'loving the rain',
      drizzle:      'loving the drizzle',
      thunderstorm: 'hiding from the storm',
      mist:         'lost in the mist',
      fog:          'lost in the fog',
      haze:         'squinting through the haze',
    }

    const mood = moodMap[condition] ?? `dealing with ${desc}`

    res.status(200).json({ temp, condition, desc, mood })
  } catch {
    res.status(500).json({ error: 'weather unavailable' })
  }
}
