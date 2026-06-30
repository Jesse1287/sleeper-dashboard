import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { useSleeper } from './hooks/useSleeper'
import Standings from './components/Standings'
import Matchups from './components/Matchups'
import PlayerStats from './components/PlayerStats'
import Draft from './components/Draft'
import TeamDetail from './components/TeamDetail'
import Ticker from './components/Ticker'

const TABS = [
  { key: 'standings', label: 'Standings' },
  { key: 'matchups', label: 'Matchups' },
  { key: 'players', label: 'Live Stats' },
  { key: 'draft', label: 'Draft' },
]

function App() {
  const [activeTab, setActiveTab] = useState('standings')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const {
    league, rosters, users, matchups, players,
    draft, draftPicks, currentWeek, loading, error,
    weeklyPoints, weeklyOpponents
  } = useSleeper()

  const userMap = {}
  users.forEach(u => { userMap[u.user_id] = u.display_name })

  const getTeamName = (rosterId) => {
    const r = rosters.find(ro => ro.roster_id === rosterId)
    return r ? (userMap[r.owner_id] || `Team ${rosterId}`) : `Team ${rosterId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <div className="text-2xl font-bold tracking-tight">LOADING LEAGUE DATA</div>
          <div className="text-gray-500 text-sm mt-2">Fetching from Sleeper...</div>
        </div>
        <Analytics />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 font-black text-red-500">!</div>
          <div className="text-xl font-bold mb-2">CONNECTION ERROR</div>
          <div className="text-gray-400">{error}</div>
        </div>
        <Analytics />
      </div>
    )
  }

  if (selectedTeam) {
    return (
      <div className="min-h-screen bg-gray-950 text-white pb-10">
        <TeamDetail
          teamName={getTeamName(selectedTeam)}
          rosterId={selectedTeam}
          rosters={rosters}
          users={users}
          players={players}
          matchups={matchups}
          weeklyPoints={weeklyPoints}
          weeklyOpponents={weeklyOpponents}
          onBack={() => setSelectedTeam(null)}
        />
        <Ticker matchups={matchups} rosters={rosters} users={users} currentWeek={currentWeek} />
        <Analytics />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="sticky top-0 z-10 bg-gray-950/98 backdrop-blur border-b border-red-600/30 shadow-lg shadow-red-900/10">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">FF</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-tight">
                  {league?.name || 'Fantasy Football'}
                </h1>
                <div className="text-[10px] text-gray-500 tracking-widest uppercase font-semibold">
                  Season {league?.season || ''} • Week {currentWeek}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 font-mono">
              {rosters.length} Teams
            </div>
          </div>

          <nav className="flex px-4 gap-0 overflow-x-auto scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
                  activeTab === tab.key
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {activeTab === 'standings' && (
          <Standings
            rosters={rosters}
            users={users}
            players={players}
            onSelectTeam={(id) => setSelectedTeam(id)}
          />
        )}
        {activeTab === 'matchups' && (
          <Matchups matchups={matchups} rosters={rosters} users={users} players={players} currentWeek={currentWeek} />
        )}
        {activeTab === 'players' && (
          <PlayerStats matchups={matchups} rosters={rosters} players={players} currentWeek={currentWeek} />
        )}
        {activeTab === 'draft' && <Draft draft={draft} draftPicks={draftPicks} users={users} players={players} />}
      </main>

      <Ticker matchups={matchups} rosters={rosters} users={users} currentWeek={currentWeek} />
      <Analytics />
    </div>
  )
}

export default App
