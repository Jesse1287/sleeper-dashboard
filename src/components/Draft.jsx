export default function Draft({ draft, draftPicks, users, players }) {
  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const getTeamName = (pick) => {
    const userId = pick.picked_by || pick.roster_id
    if (draft?.roster_to_user_ids) {
      const uid = draft.roster_to_user_ids[userId]
      if (uid && userMap[uid]) return userMap[uid]
    }
    return userMap[userId] || `Team ${userId}`
  }

  const getPlayerName = (playerId) => {
    const p = players[playerId]
    return p ? `${p.first_name} ${p.last_name}` : playerId
  }

  const sorted = [...draftPicks].sort((a, b) => a.pick_no - b.pick_no)

  const roundSize = draft?.settings?.rounds || sorted.length

  if (sorted.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">No draft data available</div>
    )
  }

  return (
    <div className="p-4">
      <div className="text-sm text-gray-400 mb-3">Draft Results</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-600/50 text-gray-400 uppercase text-xs tracking-wider">
              <th className="py-2 px-2">Rd</th>
              <th className="py-2 px-2">Pick</th>
              <th className="py-2 px-2">Team</th>
              <th className="py-2 px-2">Player</th>
              <th className="py-2 px-2 text-center">Pos</th>
              <th className="py-2 px-2 text-center">Team</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((pick) => {
              const p = players[pick.player_id]
              return (
                <tr key={pick.pick_no} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors">
                  <td className="py-2 px-2 text-gray-400">{pick.round}</td>
                  <td className="py-2 px-2 text-gray-400">{pick.pick_no}</td>
                  <td className="py-2 px-2">{getTeamName(pick)}</td>
                  <td className="py-2 px-2 font-medium">{getPlayerName(pick.player_id)}</td>
                  <td className="py-2 px-2 text-center">
                    {p && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${posColor(p.position)}`}>{p.position}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-gray-400">{p?.team || ''}</td>
                </tr>
              )
            })}
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
