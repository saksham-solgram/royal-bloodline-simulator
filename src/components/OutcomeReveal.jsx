import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { GameShell } from './GameShell'
import { playReveal } from '../lib/sounds'

export function OutcomeReveal({ player, generation }) {
  useEffect(() => {
    playReveal()
  }, [])

  return (
    <GameShell title="The Fates Decree" subtitle={`Generation ${generation} · Outcome`} crest="📜">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ type: 'spring', damping: 14 }}
        className="card-royal rounded-2xl p-8 mt-8 text-center gold-glow"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl mb-6"
        >
          {player.dynasty_health <= 30 ? '💀' : player.inbreeding_risk >= 60 ? '😬' : '👑'}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-display text-xl md:text-2xl text-[#c9a227] leading-relaxed"
        >
          {player.last_outcome || 'The court awaits your decree...'}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-[#e8dcc4]/50"
        >
          House {player.name}
        </motion.p>
      </motion.div>
    </GameShell>
  )
}
