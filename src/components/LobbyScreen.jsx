import { motion } from 'framer-motion'
import { GameShell } from './GameShell'
import { StatBar } from './StatBar'
import {
  MIN_PLAYERS,
  canStartGame,
  playerCountLabel,
  playersNeededToStart,
} from '../lib/constants'

export function LobbyScreen({ player, players, room }) {
  const needMore = playersNeededToStart(players.length)
  const ready = canStartGame(players.length)
  return (
    <GameShell
      title={`House ${player.name}`}
      subtitle={`Room ${room.room_code} · Waiting for the host`}
      crest="🏰"
    >
      <div className="card-royal rounded-xl p-4 mt-4">
        <StatBar label="Dynasty Health" value={player.dynasty_health} icon="❤️" />
        <StatBar label="Political Power" value={player.political_power} color="crimson" icon="⚔️" />
        <StatBar label="Inbreeding Risk" value={player.inbreeding_risk} color="risk" icon="💀" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6"
      >
        <p className="font-display text-[#c9a227] text-center mb-3">
          {playerCountLabel(players.length)} in the Great Hall
        </p>
        {needMore > 0 ? (
          <p className="text-center text-sm text-[#e8dcc4]/60 mb-3">
            Waiting for {needMore} more noble{needMore === 1 ? '' : 's'} (min {MIN_PLAYERS})
          </p>
        ) : (
          <p className="text-center text-sm text-emerald-400/80 mb-3">
            Court is ready — host may begin
          </p>
        )}
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {players.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-royal rounded-lg px-4 py-2 flex justify-between items-center text-sm"
            >
              <span>{p.name}</span>
              <span className="text-[#c9a227]/60 text-xs">
                {p.id === player.id ? 'you' : 'ready'}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-center text-[#e8dcc4]/50 text-sm mt-8"
      >
        {ready
          ? 'The host will begin the bloodline trial shortly...'
          : `At least ${MIN_PLAYERS} houses must join before the game can start.`}
      </motion.p>
    </GameShell>
  )
}
