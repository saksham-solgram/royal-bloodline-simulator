import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GameShell } from '../components/GameShell'

export function LandingPage() {
  return (
    <GameShell
      title="Save the Royal Bloodline"
      subtitle="A cinematic multiplayer dynasty simulator"
      crest="👑"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 space-y-4 text-center"
      >
        <p className="text-[#e8dcc4]/70 leading-relaxed">
          Marry for power. Risk your bloodline. Survive five generations — or become the next
          Habsburg cautionary tale. Best with 3–15 players in the same room.
        </p>
        <Link
          to="/play"
          className="block py-4 rounded-xl bg-[#c9a227] text-[#0a0608] font-display text-lg tracking-wide"
        >
          Enter the Court
        </Link>
        <Link
          to="/host"
          className="block py-3 rounded-xl card-royal text-[#e8dcc4]/70 text-sm"
        >
          Host panel (presentation)
        </Link>
        <p className="text-xs text-[#e8dcc4]/30 pt-4">
          Inspired by the real Habsburg dynasty · Built for scayn.in
        </p>
      </motion.div>
    </GameShell>
  )
}
