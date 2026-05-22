import { motion } from 'framer-motion'
import { GameShell } from './GameShell'

function rankEmoji(i) {
  if (i === 0) return '🏆'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return `${i + 1}.`
}

export function LeaderboardScreen({ players, room, player }) {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  const healthiest = [...players].sort((a, b) => b.dynasty_health - a.dynasty_health)[0]
  const mostInbred = [...players].sort((a, b) => b.inbreeding_risk - a.inbreeding_risk)[0]
  const strongest = [...players].sort((a, b) => b.political_power - a.political_power)[0]

  return (
    <GameShell
      title="Dynasty Rankings"
      subtitle={
        room.game_state === 'ended'
          ? 'The bloodline has been judged'
          : `After Generation ${room.current_generation}`
      }
      crest="🏆"
    >
      <div className="grid grid-cols-1 gap-2 mt-4 text-xs">
        <p className="card-royal rounded-lg p-2 text-center">
          ❤️ Healthiest: <strong className="text-[#c9a227]">{healthiest?.name}</strong>
        </p>
        <p className="card-royal rounded-lg p-2 text-center">
          ⚔️ Strongest house: <strong className="text-[#c9a227]">{strongest?.name}</strong>
        </p>
        <p className="card-royal rounded-lg p-2 text-center">
          💀 Most inbred: <strong className="text-purple-400">{mostInbred?.name}</strong>
        </p>
      </div>

      <ul className="mt-4 space-y-2 flex-1">
        {sorted.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`card-royal rounded-xl p-3 flex items-center gap-3 ${
              p.id === player.id ? 'ring-1 ring-[#c9a227]' : ''
            }`}
          >
            <span className="text-xl w-8">{rankEmoji(i)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[#c9a227] truncate">{p.name}</p>
              <p className="text-xs text-[#e8dcc4]/50">
                ❤️{p.dynasty_health} ⚔️{p.political_power} 💀{p.inbreeding_risk}
              </p>
            </div>
            <span className="font-display text-lg">{p.score}</span>
          </motion.li>
        ))}
      </ul>
    </GameShell>
  )
}
