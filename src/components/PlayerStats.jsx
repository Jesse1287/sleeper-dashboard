export default function PlayerStats({ matchups, rosters, players, currentWeek }) {
  const weekData = matchups[currentWeek] || []

  const playerPoints = {}
  weekData.forEach(entry => {
    entry.starters?.forEach((pid, i) => {
      if (!playerPoints[pid]) playerPoints[pid] = 0
      playerPoints[pid] += entry.starters_points?.[i] || 0
    })
  })

  const sorted = Object.entries(playerPoints)
    .map(([id, pts]) => ({ id, name: players[id] ? `${players[id].first_name} ${players[id].last_name}` : id, pts, pos: players[id]?.position || 'N/A', team: players[id]?.team || '' }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 30)

  if (sorted.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No live player data for week {currentWeek}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="text-sm text-gray-400 mb-3">Top 30 Players - Week {currentWeek}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-600/50 text-gray-400 uppercase text-xs tracking-wider">
              <th className="py-2 px-2">Player</th>
              <th className="py-2 px-2 text-center">Pos</th>
              <th className="py-2 px-2 text-center">Team</th>
              <th className="py-2 px-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors">
                <td className="py-2 px-2 font-medium">{p.name}</td>
                <td className="py-2 px-2 text-center">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${posColor(p.pos)}`}>{p.pos}</span>
                </td>
                <td className="py-2 px-2 text-center text-gray-400">{p.team}</td>
                <td className="py-2 px-2 text-right font-semibold">{p.pts.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function posColor(pos) {
  const colors = {
    QB: 'bg-purple-900/50 text-purple-300',
    RB: 'bg-blue-900/50 text-blue-300',
    WR: 'bg-green-900/50 text-green-300',
    TE: 'bg-yellow-900/50 text-yellow-300',
    K: 'bg-red-900/50 text-red-300',
    DEF: 'bg-gray-700 text-gray-300',
  }
  return colors[pos] || 'bg-gray-700 text-gray-300'
}
