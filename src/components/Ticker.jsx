import { useState, useEffect } from 'react'

export default function Ticker({ matchups, rosters, users, currentWeek }) {
  const [position, setPosition] = useState(0)

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

  const matchupsList = Object.values(grouped).map(entries => {
    const t1 = entries[0]
    const t2 = entries[1]
    if (!t2) return null
    const s1 = t1.starters?.reduce((sum, id, i) => sum + (t1.starters_points?.[i] || 0), 0) || 0
    const s2 = t2.starters?.reduce((sum, id, i) => sum + (t2.starters_points?.[i] || 0), 0) || 0
    return `${getTeamName(t1.roster_id)} ${s1.toFixed(0)} - ${s2.toFixed(0)} ${getTeamName(t2.roster_id)}`
  }).filter(Boolean)

  useEffect(() => {
    const timer = setInterval(() => {
      setPosition(prev => prev + 1)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  if (matchupsList.length === 0) return null

  const separator = '   •   '
  const tickerText = matchupsList.join(separator) + separator + matchupsList.join(separator)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-red-600/50 h-10 overflow-hidden">
      <div className="flex items-center h-full">
        <div className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 h-full flex items-center shrink-0 tracking-wider">
          LIVE
        </div>
        <div className="overflow-hidden flex-1 relative h-full">
          <div
            className="whitespace-nowrap text-sm font-medium text-gray-300 absolute leading-10"
            style={{
              transform: `translateX(-${position % (tickerText.length * 8)}px)`,
              transition: 'none',
            }}
          >
            {tickerText}
          </div>
        </div>
      </div>
    </div>
  )
}
