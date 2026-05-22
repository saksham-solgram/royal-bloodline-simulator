import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { JoinScreen } from '../components/JoinScreen'
import { LobbyScreen } from '../components/LobbyScreen'
import { GenerationScreen } from '../components/GenerationScreen'
import { OutcomeReveal } from '../components/OutcomeReveal'
import { LeaderboardScreen } from '../components/LeaderboardScreen'
import { useRoomRealtime } from '../hooks/useRoomRealtime'
import { usePhaseTimer } from '../hooks/usePhaseTimer'
import { joinRoom, submitPlayerChoice, checkSupabase } from '../lib/roomApi'
import { getStoredPlayer, savePlayer, clearPlayer } from '../lib/storage'
import { playChoice, resumeAudio } from '../lib/sounds'
import { supabase } from '../lib/supabase'
import { TABLES } from '../lib/tables'

export function PlayPage() {
  const [params] = useSearchParams()
  const presetRoom = params.get('room')

  const [player, setPlayer] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)

  const { room, players, refresh } = useRoomRealtime(roomId)

  const me = players.find((p) => p.id === player?.id) ?? player

  const onExpire = useCallback(() => {
    /* host-driven advance; players just see timer hit 0 */
  }, [])

  const secondsLeft = usePhaseTimer(
    room?.phase_deadline,
    room?.is_paused,
    onExpire
  )

  useEffect(() => {
    resumeAudio()
  }, [])

  useEffect(() => {
    if (!presetRoom) return
    setReconnecting(true)
    const stored = getStoredPlayer()
    if (stored && stored.roomCode === presetRoom.toUpperCase()) {
      attemptRejoin(stored.name, stored.roomCode, stored.id)
    }
  }, [presetRoom])

  useEffect(() => {
    const stored = getStoredPlayer()
    if (!stored || player) return
    setReconnecting(true)
    attemptRejoin(stored.name, stored.roomCode, stored.id)
  }, [])

  async function attemptRejoin(name, roomCode, id) {
    try {
      checkSupabase()
      const { room: r, player: p } = await joinRoom(roomCode, name, id)
      setRoomId(r.id)
      setPlayer(p)
      savePlayer({ id: p.id, name: p.name, roomCode: r.room_code })
      setError(null)
    } catch (e) {
      if (e.message?.includes('not taken')) clearPlayer()
    } finally {
      setReconnecting(false)
    }
  }

  const handleJoin = async (name, roomCode) => {
    checkSupabase()
    const stored = getStoredPlayer()
    const { room: r, player: p } = await joinRoom(
      roomCode,
      name,
      stored?.roomCode === roomCode ? stored.id : null
    )
    setRoomId(r.id)
    setPlayer(p)
    savePlayer({ id: p.id, name: p.name, roomCode: r.room_code })
    setError(null)
  }

  const handleSubmitChoice = async (candidate) => {
    if (!me || !room) return
    setSubmitting(true)
    try {
      await submitPlayerChoice(me, room, room.current_generation, candidate)
      playChoice()
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!roomId) return
    const stored = getStoredPlayer()
    if (!stored) return
    const channel = supabase.channel(`sync-${roomId}`).on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: TABLES.rooms, filter: `id=eq.${roomId}` },
      () => refresh()
    ).subscribe()
    return () => supabase.removeChannel(channel)
  }, [roomId, refresh])

  if (!player || !roomId) {
    return (
      <JoinScreen
        onJoin={handleJoin}
        error={error}
        reconnecting={reconnecting}
      />
    )
  }

  if (!room || !me) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-[#c9a227] font-display">
        Summoning the court...
      </div>
    )
  }

  const state = room.game_state

  if (!room.is_started || state === 'lobby') {
    return <LobbyScreen player={me} players={players} room={room} />
  }

  if (state === 'choosing') {
    return (
      <GenerationScreen
        player={me}
        room={room}
        secondsLeft={room.is_paused ? null : secondsLeft}
        onSubmitChoice={handleSubmitChoice}
        submitting={submitting}
      />
    )
  }

  if (state === 'revealing') {
    return <OutcomeReveal player={me} generation={room.current_generation} />
  }

  if (state === 'leaderboard' || state === 'ended') {
    return <LeaderboardScreen players={players} room={room} player={me} />
  }

  return <LobbyScreen player={me} players={players} room={room} />
}
