import { useState } from 'react'
import { useSleeper } from './hooks/useSleeper'
import Standings from './components/Standings'
import Matchups from './components/Matchups'
import PlayerStats from './components/PlayerStats'
import Draft from './components/Draft'
import './index.css'

const TABS = [
  { key: 'standings', label: 'Standings', icon: '🏆' },
  { key: 'matchups', label: 'Matchups', icon: '⚔️' },
  { key: 'players', label: 'Live Stats', icon: '📊' },
  { key: 'draft', label: 'Draft', icon: '📋' },
]

function App() {
  const [activeTab, setActiveTab] = useState('standings')
  const { league, rosters, users, matchups, players, draft, draftPicks, currentWeek, loading, error } = useSleeper()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-gray-400">Loading league data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <div>Error loading data: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold truncate">
              {league?.name || 'Fantasy Football'}
            </h1>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              Season {league?.season || ''}
            </span>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {activeTab === 'standings' && <Standings rosters={rosters} users={users} players={players} />}
        {activeTab === 'matchups' && (
          <Matchups matchups={matchups} rosters={rosters} users={users} players={players} currentWeek={currentWeek} />
        )}
        {activeTab === 'players' && (
          <PlayerStats matchups={matchups} rosters={rosters} players={players} currentWeek={currentWeek} />
        )}
        {activeTab === 'draft' && <Draft draft={draft} draftPicks={draftPicks} users={users} players={players} />}
      </main>
    </div>
  )
}

export default App
