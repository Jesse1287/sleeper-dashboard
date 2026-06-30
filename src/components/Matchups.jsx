export default function Matchups({ matchups, rosters, users, players, currentWeek }) {
  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const rosterMap = {}
  rosters.forEach(r => { rosterMap[r.roster_id] = r })

  const weekData = matchups[currentWeek] || []

  const grouped = {}
  weekData.forEach(entry => {
    const mid = entry.matchup_id
    if (!grouped[mid]) grouped[mid] = []
    grouped[mid].push(entry)
  })

  const getTeamName = (rosterId) => {
    const r = rosterMap[rosterId]
    if (!r) return `Team ${rosterId}`
    return userMap[r.owner_id] || `Team ${rosterId}`
  }

  const getPlayerName = (playerId) => {
    const p = players[playerId]
    return p ? `${p.first_name} ${p.last_name}` : playerId
  }

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No matchup data available for week {currentWeek}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-gray-400 mb-2">Week {currentWeek} Matchups</div>
      {Object.entries(grouped).map(([matchupId, entries]) => {
        const team1 = entries[0]
        const team2 = entries[1]
        if (!team2) return null

        const score1 = team1.starters?.reduce((sum, id, i) => sum + (team1.starters_points?.[i] || 0), 0) || 0
        const score2 = team2.starters?.reduce((sum, id, i) => sum + (team2.starters_points?.[i] || 0), 0) || 0

        return (
          <div key={matchupId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-lg">{getTeamName(team1.roster_id)}</div>
                <div className="text-2xl font-bold mt-1">{score1.toFixed(1)}</div>
              </div>
              <div className="text-gray-500 text-sm px-4">VS</div>
              <div className="flex-1 text-right">
                <div className="font-semibold text-lg">{getTeamName(team2.roster_id)}</div>
                <div className="text-2xl font-bold mt-1">{score2.toFixed(1)}</div>
              </div>
            </div>
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">Lineup details</summary>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  {team1.starters?.map((pid, i) => (
                    <div key={pid} className="flex justify-between py-0.5">
                      <span className="truncate mr-2">{getPlayerName(pid)}</span>
                      <span className="text-gray-400">{(team1.starters_points?.[i] || 0).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  {team2.starters?.map((pid, i) => (
                    <div key={pid} className="flex justify-between py-0.5">
                      <span className="text-gray-400">{(team2.starters_points?.[i] || 0).toFixed(1)}</span>
                      <span className="truncate ml-2">{getPlayerName(pid)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        )
      })}
    </div>
  )
}
