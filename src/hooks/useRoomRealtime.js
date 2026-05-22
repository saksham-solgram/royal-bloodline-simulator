import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { fetchRoomBundle } from '../lib/roomApi'
import { TABLES } from '../lib/tables'

export function useRoomRealtime(roomId) {
  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!roomId) return
    try {
      const bundle = await fetchRoomBundle(roomId)
      setRoom(bundle.room)
      setPlayers(bundle.players)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (!roomId) return
    refresh()

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.rooms, filter: `id=eq.${roomId}` },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLES.players, filter: `room_id=eq.${roomId}` },
        () => refresh()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, refresh])

  return { room, players, loading, error, refresh }
}
