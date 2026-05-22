import { useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from './GameShell'
import { resumeAudio, playJoin } from '../lib/sounds'
import { MIN_PLAYERS, MAX_PLAYERS } from '../lib/constants'

export function JoinScreen({ onJoin, error, reconnecting }) {
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('HABSBURG')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !roomCode.trim()) return
    resumeAudio()
    setLoading(true)
    try {
      await onJoin(name.trim(), roomCode.trim().toUpperCase())
      playJoin()
    } finally {
      setLoading(false)
    }
  }

  return (
    <GameShell
      title="Save the Royal Bloodline"
      subtitle="Could YOU save the dynasty?"
      crest="👑"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-8"
      >
        {reconnecting && (
          <p className="text-center text-[#c9a227] text-sm">Reconnecting to your dynasty...</p>
        )}
        {error && (
          <p className="text-center text-[#8b1a2b] bg-[#8b1a2b]/20 rounded-lg p-3 text-sm">
            {error}
          </p>
        )}
        <label className="text-sm text-[#e8dcc4]/70">Your noble name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Duke of Something"
          maxLength={24}
          className="card-royal rounded-xl px-4 py-3 text-[#e8dcc4] placeholder:text-[#e8dcc4]/30 outline-none focus:ring-2 focus:ring-[#c9a227]/50"
        />
        <label className="text-sm text-[#e8dcc4]/70">Room code</label>
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="HABSBURG"
          maxLength={16}
          className="card-royal rounded-xl px-4 py-3 text-center font-display text-xl tracking-[0.3em] text-[#c9a227] uppercase outline-none focus:ring-2 focus:ring-[#c9a227]/50"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="mt-4 py-4 rounded-xl bg-[#c9a227] text-[#0a0608] font-display text-lg tracking-wide disabled:opacity-50"
        >
          {loading ? 'Entering the hall...' : 'Enter the Royal Court'}
        </motion.button>
        <p className="text-center text-xs text-[#e8dcc4]/40 mt-2">
          Join with phone or laptop · {MIN_PLAYERS}–{MAX_PLAYERS} players per room
        </p>
      </motion.form>
    </GameShell>
  )
}
