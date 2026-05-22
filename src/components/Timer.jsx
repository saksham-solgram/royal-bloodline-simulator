import { motion } from 'framer-motion'

export function Timer({ seconds, large }) {
  if (seconds == null) return null
  const urgent = seconds <= 5

  return (
    <motion.div
      animate={urgent ? { scale: [1, 1.08, 1] } : {}}
      transition={{ repeat: urgent ? Infinity : 0, duration: 0.5 }}
      className={`font-display text-center ${large ? 'text-5xl' : 'text-2xl'} ${
        urgent ? 'text-[#8b1a2b]' : 'text-[#c9a227]'
      }`}
    >
      {seconds}s
    </motion.div>
  )
}
