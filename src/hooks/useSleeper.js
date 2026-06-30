import { useState, useEffect, useCallback } from 'react'

const LEAGUE_ID = '1312099870605049856'

export function useSleeper() {
  const [league, setLeague] = useState(null)
  const [rosters, setRosters] = useState([])
  const [users, setUsers] = useState([])
  const [matchups, setMatchups] = useState({})
  const [players, setPlayers] = useState({})
  const [draft, setDraft] = useState(null)
  const [draftPicks, setDraftPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [leagueRes, rostersRes, usersRes, playersRes, draftsRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`),
        fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`),
        fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`),
        fetch(`https://api.sleeper.app/v1/players/nfl`),
        fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/drafts`),
      ])

      const leagueData = await leagueRes.json()
      const rostersData = await rostersRes.json()
      const usersData = await usersRes.json()
      const playersData = await playersRes.json()
      const draftsData = await draftsRes.json()

      setLeague(leagueData)
      setRosters(rostersData)
      setUsers(usersData)
      setPlayers(playersData)
      setCurrentWeek(leagueData.settings?.last_scored_leg || 1)

      if (draftsData.length > 0) {
        setDraft(draftsData[0])
        const picksRes = await fetch(`https://api.sleeper.app/v1/draft/${draftsData[0].draft_id}/picks`)
        const picksData = await picksRes.json()
        setDraftPicks(picksData)
      }

      const week = leagueData.settings?.last_scored_leg || 1
      const matchupPromises = []
      for (let w = 1; w <= week; w++) {
        matchupPromises.push(
          fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${w}`)
            .then(r => r.json())
            .then(d => ({ week: w, data: d }))
        )
      }
      const matchupResults = await Promise.all(matchupPromises)
      const matchupMap = {}
      matchupResults.forEach(({ week, data }) => {
        matchupMap[week] = data
      })
      setMatchups(matchupMap)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshMatchups = useCallback(async () => {
    const week = currentWeek
    try {
      const res = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${week}`)
      const data = await res.json()
      setMatchups(prev => ({ ...prev, [week]: data }))
    } catch (err) {
      console.error('Failed to refresh matchups:', err)
    }
  }, [currentWeek])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (currentWeek < 1) return
    const interval = setInterval(refreshMatchups, 30000)
    return () => clearInterval(interval)
  }, [refreshMatchups, currentWeek])

  const weeklyPoints = {}
  const weeklyOpponents = {}
  Object.entries(matchups).forEach(([week, entries]) => {
    entries.forEach(entry => {
      const rid = entry.roster_id
      if (!weeklyPoints[rid]) weeklyPoints[rid] = {}
      if (!weeklyOpponents[rid]) weeklyOpponents[rid] = {}
      const pts = entry.starters?.reduce((sum, id, i) => sum + (entry.starters_points?.[i] || 0), 0) || 0
      weeklyPoints[rid][week] = pts
      const opponent = entries.find(e => e.matchup_id === entry.matchup_id && e.roster_id !== rid)
      if (opponent) weeklyOpponents[rid][week] = opponent.roster_id
    })
  })

  return {
    league, rosters, users, matchups, players,
    draft, draftPicks, loading, error, currentWeek, refreshMatchups,
    weeklyPoints, weeklyOpponents
  }
}
