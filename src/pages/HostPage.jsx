import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HostPanel } from '../components/HostPanel'
import { useRoomRealtime } from '../hooks/useRoomRealtime'
import { findOrCreateRoom, checkSupabase } from '../lib/roomApi'

const HOST_PASSWORD = import.meta.env.VITE_HOST_PASSWORD || 'habsburg'

export function HostPage() {
  const [params] = useSearchParams()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [roomCode, setRoomCode] = useState(params.get('room') || 'HABSBURG')
  const [roomId, setRoomId] = useState(null)
  const [error, setError] = useState(null)

  const { room, players, refresh } = useRoomRealtime(roomId)

  useEffect(() => {
    if (sessionStorage.getItem('bloodline_host_auth') === '1') {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (!authed || !roomCode) return
    loadRoom()
  }, [authed, roomCode])

  async function loadRoom() {
    try {
      checkSupabase()
      const r = await findOrCreateRoom(roomCode)
      setRoomId(r.id)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const login = (e) => {
    e.preventDefault()
    if (password === HOST_PASSWORD) {
      sessionStorage.setItem('bloodline_host_auth', '1')
      setAuthed(true)
    } else {
      setError('Wrong password')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0608] p-4">
        <form onSubmit={login} className="card-royal rounded-2xl p-8 w-full max-w-sm">
          <h1 className="font-display text-2xl text-[#c9a227] mb-4 text-center">Host Access</h1>
          {error && <p className="text-[#8b1a2b] text-sm mb-3 text-center">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Host password"
            className="w-full rounded-lg px-4 py-3 bg-[#140c10] border border-[#c9a227]/30 mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#c9a227] text-[#0a0608] rounded-lg font-display"
          >
            Enter Command Chamber
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#140c10] border-b border-[#c9a227]/20 px-4 py-2 flex gap-2 items-center flex-wrap">
        <label className="text-xs opacity-60">Room</label>
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="card-royal rounded px-2 py-1 uppercase text-sm w-32"
        />
        <button
          type="button"
          onClick={loadRoom}
          className="text-xs text-[#c9a227]"
        >
          Load
        </button>
        <span className="text-xs opacity-40 ml-auto">
          QR → bloodline.scayn.in/play?room={roomCode}
        </span>
      </div>
      {error && <p className="text-center text-[#8b1a2b] p-4">{error}</p>}
      <HostPanel room={room} players={players} onRefresh={refresh} />
    </div>
  )
}
