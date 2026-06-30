export default function Standings({ rosters, users, players }) {
  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const sorted = [...rosters].sort((a, b) => {
    const aWins = a.settings?.wins || 0
    const bWins = b.settings?.wins || 0
    if (aWins !== bWins) return bWins - aWins
    return (b.settings?.fpts || 0) - (a.settings?.fpts || 0)
  })

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600/50 text-gray-400 uppercase text-xs tracking-wider">
            <th className="py-3 px-2">#</th>
            <th className="py-3 px-2">Team</th>
            <th className="py-3 px-2 text-center">W</th>
            <th className="py-3 px-2 text-center">L</th>
            <th className="py-3 px-2 text-center">T</th>
            <th className="py-3 px-2 text-right">PF</th>
            <th className="py-3 px-2 text-right">PA</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const name = userMap[r.owner_id] || `Team ${r.roster_id}`
            const wins = r.settings?.wins || 0
            const losses = r.settings?.losses || 0
            const ties = r.settings?.ties || 0
            const pf = (r.settings?.fpts || 0).toFixed(1)
            const pa = (r.settings?.fpts_against || 0).toFixed(1)
            return (
              <tr key={r.roster_id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                <td className="py-3 px-2 text-gray-400">{i + 1}</td>
                <td className="py-3 px-2 font-medium">{name}</td>
                <td className="py-3 px-2 text-center text-green-400">{wins}</td>
                <td className="py-3 px-2 text-center text-red-400">{losses}</td>
                <td className="py-3 px-2 text-center text-gray-400">{ties}</td>
                <td className="py-3 px-2 text-right">{pf}</td>
                <td className="py-3 px-2 text-right text-gray-400">{pa}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
