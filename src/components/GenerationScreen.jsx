import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from './GameShell'
import { StatBar } from './StatBar'
import { CandidateCard } from './CandidateCard'
import { Timer } from './Timer'
import { generateCandidates } from '../lib/candidates'

export function GenerationScreen({
  player,
  room,
  secondsLeft,
  onSubmitChoice,
  submitting,
}) {
  const [selected, setSelected] = useState(null)
  const candidates = useMemo(
    () => generateCandidates(player.id, room.current_generation),
    [player.id, room.current_generation]
  )

  const handleConfirm = async () => {
    if (!selected || player.has_chosen) return
    await onSubmitChoice(selected)
  }

  return (
    <GameShell
      title={`Generation ${room.current_generation}`}
      subtitle="Choose your marriage alliance"
      crest="💍"
    >
      <div className="flex justify-between items-center mt-2">
        <Timer seconds={secondsLeft} large />
        {player.has_chosen && (
          <span className="text-sm text-[#c9a227]">Choice locked ✓</span>
        )}
      </div>

      <div className="card-royal rounded-xl p-3 mt-3">
        <StatBar label="Dynasty Health" value={player.dynasty_health} icon="❤️" />
        <StatBar label="Political Power" value={player.political_power} color="crimson" icon="⚔️" />
        <StatBar label="Inbreeding Risk" value={player.inbreeding_risk} color="risk" icon="💀" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="my-4 text-center"
      >
        <div className="text-6xl mb-2">🤴</div>
        <p className="font-display text-[#e8dcc4]">{player.current_heir}</p>
        <p className="text-xs text-[#e8dcc4]/50">Ruler of House {player.name}</p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            selected={selected?.id === c.id}
            disabled={player.has_chosen || submitting}
            onSelect={setSelected}
          />
        ))}
      </div>

      {!player.has_chosen && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={!selected || submitting}
          onClick={handleConfirm}
          className="mt-4 py-3 rounded-xl bg-[#8b1a2b] text-[#e8dcc4] font-display disabled:opacity-40 w-full"
        >
          {submitting ? 'Sealing the betrothal...' : 'Seal the Alliance'}
        </motion.button>
      )}
    </GameShell>
  )
}
