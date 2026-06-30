export default function Standings({ rosters, users, players, onSelectTeam }) {
  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const sorted = [...rosters].sort((a, b) => {
    const aWins = a.settings?.wins || 0
    const bWins = b.settings?.wins || 0
    if (aWins !== bWins) return bWins - aWins
    return (b.settings?.fpts || 0) - (a.settings?.fpts || 0)
  })

  const top3 = sorted.slice(0, 3).map(r => r.roster_id)

  const recordColor = (wins, losses) => {
    const pct = wins / (wins + losses || 1)
    if (pct >= 0.6) return 'text-green-400'
    if (pct >= 0.4) return 'text-gray-300'
    return 'text-red-400'
  }

  return (
    <div className="p-4">
      <div className="hidden md:grid grid-cols-3 gap-3 mb-4">
        {sorted.slice(0, 3).map((r, i) => {
          const name = userMap[r.owner_id] || `Team ${r.roster_id}`
          const wins = r.settings?.wins || 0
          const losses = r.settings?.losses || 0
          const pf = (r.settings?.fpts || 0).toFixed(1)
          return (
            <button
              key={r.roster_id}
              onClick={() => onSelectTeam?.(r.roster_id)}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/40 text-left hover:border-gray-600 transition-colors"
            >
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                {i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'} Place
              </div>
              <div className="text-lg font-bold truncate">{name}</div>
              <div className={`text-2xl font-black mt-1 ${recordColor(wins, losses)}`}>
                {wins}-{losses}
              </div>
              <div className="text-xs text-gray-500 mt-1">PF: {pf}</div>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600/50 text-gray-500 uppercase text-xs tracking-wider">
              <th className="py-3 px-2 font-semibold">#</th>
              <th className="py-3 px-2 font-semibold">Team</th>
              <th className="py-3 px-2 text-center font-semibold">W</th>
              <th className="py-3 px-2 text-center font-semibold">L</th>
              <th className="py-3 px-2 text-center font-semibold">T</th>
              <th className="py-3 px-2 text-right font-semibold">PF</th>
              <th className="py-3 px-2 text-right font-semibold">PA</th>
              <th className="py-3 px-2 text-right font-semibold">Strk</th>
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
                <tr
                  key={r.roster_id}
                  className={`border-b border-gray-800/50 transition-colors cursor-pointer ${
                    top3.includes(r.roster_id) ? 'hover:bg-gray-700/30' : 'hover:bg-gray-800/30'
                  }`}
                  onClick={() => onSelectTeam?.(r.roster_id)}
                >
                  <td className={`py-3 px-2 font-bold ${top3.includes(r.roster_id) ? 'text-yellow-500' : 'text-gray-500'}`}>
                    {i + 1}
                  </td>
                  <td className="py-3 px-2 font-bold hover:text-blue-400 transition-colors">
                    {name}
                  </td>
                  <td className="py-3 px-2 text-center text-green-400 font-semibold">{wins}</td>
                  <td className="py-3 px-2 text-center text-red-400 font-semibold">{losses}</td>
                  <td className="py-3 px-2 text-center text-gray-500">{ties}</td>
                  <td className="py-3 px-2 text-right font-semibold">{pf}</td>
                  <td className="py-3 px-2 text-right text-gray-400">{pa}</td>
                  <td className="py-3 px-2 text-right text-xs text-gray-500">
                    {r.settings?.streak || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
