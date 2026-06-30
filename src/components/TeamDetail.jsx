import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function TeamDetail({ teamName, rosterId, rosters, users, players, matchups, weeklyPoints, weeklyOpponents, onBack }) {
  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const roster = rosters.find(r => r.roster_id === rosterId)

  const weeks = useMemo(() => {
    const pts = weeklyPoints[rosterId] || {}
    return Object.keys(pts).map(Number).sort((a, b) => a - b)
  }, [weeklyPoints, rosterId])

  const points = weeks.map(w => weeklyPoints[rosterId]?.[w] || 0)

  const chartData = {
    labels: weeks.map(w => `W${w}`),
    datasets: [{
      label: 'Points',
      data: points,
      backgroundColor: points.map(p => p >= 100 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)'),
      borderColor: points.map(p => p >= 100 ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'),
      borderWidth: 1,
      borderRadius: 4,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          afterLabel: (ctx) => {
            const week = weeks[ctx.dataIndex]
            const oppId = weeklyOpponents[rosterId]?.[week]
            if (oppId) {
              const oppRoster = rosters.find(r => r.roster_id === oppId)
              const oppName = oppRoster ? (userMap[oppRoster.owner_id] || `Team ${oppId}`) : `Team ${oppId}`
              const oppPts = weeklyPoints[oppId]?.[week] || 0
              const result = points[ctx.dataIndex] > oppPts ? 'W' : 'L'
              return `vs ${oppName}: ${oppPts.toFixed(1)} (${result})`
            }
            return ''
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  }

  const wins = roster?.settings?.wins || 0
  const losses = roster?.settings?.losses || 0
  const pf = (roster?.settings?.fpts || 0).toFixed(1)
  const pa = (roster?.settings?.fpts_against || 0).toFixed(1)

  return (
    <div className="p-4 md:p-6">
      <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-white mb-4 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Standings
      </button>

      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/40 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{teamName}</h2>
            <div className="flex gap-4 mt-2 text-lg">
              <span className="text-green-400 font-bold">{wins}W</span>
              <span className="text-red-400 font-bold">{losses}L</span>
              <span className="text-gray-400">PF: <span className="text-white">{pf}</span></span>
              <span className="text-gray-400">PA: <span className="text-white">{pa}</span></span>
            </div>
          </div>
          <div className="text-6xl font-black text-gray-600/30">{rosterId}</div>
        </div>
      </div>

      <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/40 mb-4">
        <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">Weekly Performance</h3>
        <div className="h-72 md:h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <RosterView roster={roster} players={players} />
    </div>
  )
}

function RosterView({ roster, players }) {
  if (!roster?.players) return null

  const getPlayerName = (pid) => {
    const p = players[pid]
    return p ? `${p.first_name} ${p.last_name}` : pid
  }

  const allPlayers = roster.players.map(pid => ({
    id: pid,
    name: getPlayerName(pid),
    pos: players[pid]?.position || 'N/A',
    team: players[pid]?.team || '',
    isStarter: roster.starters?.includes(pid),
  }))

  const sorted = [...allPlayers].sort((a, b) => {
    const posOrder = { QB: 0, RB: 1, WR: 2, TE: 3, K: 4, DEF: 5 }
    return (posOrder[a.pos] ?? 99) - (posOrder[b.pos] ?? 99)
  })

  return (
    <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/40">
      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">Roster</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sorted.map(p => (
          <div key={p.id} className={`p-2 rounded-lg ${p.isStarter ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-800/50'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{p.name}</span>
              <PosBadge pos={p.pos} />
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{p.team}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PosBadge({ pos }) {
  const colors = {
    QB: 'bg-purple-900/60 text-purple-300',
    RB: 'bg-blue-900/60 text-blue-300',
    WR: 'bg-green-900/60 text-green-300',
    TE: 'bg-yellow-900/60 text-yellow-300',
    K: 'bg-red-900/60 text-red-300',
    DEF: 'bg-gray-700 text-gray-300',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${colors[pos] || 'bg-gray-700 text-gray-300'}`}>
      {pos}
    </span>
  )
}
