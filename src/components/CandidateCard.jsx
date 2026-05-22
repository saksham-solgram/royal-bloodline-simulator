import { motion } from 'framer-motion'

export function CandidateCard({ candidate, selected, disabled, onSelect }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(candidate)}
      className={`card-royal w-full text-left p-4 rounded-xl transition-all ${
        selected ? 'ring-2 ring-[#c9a227] gold-glow' : ''
      } ${disabled ? 'opacity-50' : 'hover:border-[#c9a227]/60'}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-display text-lg text-[#c9a227]">{candidate.name}</p>
          <p className="text-xs text-[#e8dcc4]/60 mt-0.5">{candidate.rarity}</p>
        </div>
        <span className="text-2xl">{selected ? '👑' : '💍'}</span>
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <span className="text-emerald-400/90">Power +{candidate.power}</span>
        <span className="text-purple-400/90">Risk +{candidate.risk}</span>
      </div>
    </motion.button>
  )
}
