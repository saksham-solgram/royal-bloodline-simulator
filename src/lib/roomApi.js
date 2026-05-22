import { supabase, supabaseConfigured } from './supabase'
import { resolveOutcome, clampStat } from './outcomes'
import { TABLES } from './tables'
import { MAX_PLAYERS, MIN_PLAYERS, canStartGame } from './constants'

export async function findOrCreateRoom(roomCode) {
  const code = roomCode.toUpperCase().trim()
  const { data: existing } = await supabase
    .from(TABLES.rooms)
    .select('*')
    .eq('room_code', code)
    .maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from(TABLES.rooms)
    .insert({ room_code: code })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function joinRoom(roomCode, playerName, existingPlayerId = null) {
  const room = await findOrCreateRoom(roomCode)

  if (existingPlayerId) {
    const { data: player } = await supabase
      .from(TABLES.players)
      .select('*')
      .eq('id', existingPlayerId)
      .eq('room_id', room.id)
      .maybeSingle()

    if (player) return { room, player }
  }

  const { count } = await supabase
    .from(TABLES.players)
    .select('*', { count: 'exact', head: true })
    .eq('room_id', room.id)

  if ((count ?? 0) >= MAX_PLAYERS) {
    throw new Error(`This room is full (${MAX_PLAYERS} players max).`)
  }

  const { data: player, error } = await supabase
    .from(TABLES.players)
    .insert({
      room_id: room.id,
      name: playerName.trim(),
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('That name is already taken in this room.')
    }
    throw error
  }

  return { room, player }
}

export async function fetchRoomBundle(roomId) {
  const [{ data: room }, { data: players }] = await Promise.all([
    supabase.from(TABLES.rooms).select('*').eq('id', roomId).single(),
    supabase.from(TABLES.players).select('*').eq('room_id', roomId).order('score', { ascending: false }),
  ])
  return { room, players: players ?? [] }
}

export async function startGame(roomId) {
  const { players } = await fetchRoomBundle(roomId)
  if (!canStartGame(players.length)) {
    throw new Error(
      `Need ${MIN_PLAYERS}–${MAX_PLAYERS} players to start (currently ${players.length}).`
    )
  }
  return updateRoom(roomId, {
    is_started: true,
    is_paused: false,
    current_generation: 1,
    game_state: 'choosing',
    phase_deadline: new Date(Date.now() + 20 * 1000).toISOString(),
    sync_token: Date.now(),
  })
}

export async function updateRoom(roomId, patch) {
  const { data, error } = await supabase
    .from(TABLES.rooms)
    .update(patch)
    .eq('id', roomId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function submitPlayerChoice(player, room, generation, candidate) {
  await supabase.from(TABLES.choices).upsert(
    {
      player_id: player.id,
      room_id: room.id,
      generation,
      candidate_id: candidate.id,
      candidate_name: candidate.name,
    },
    { onConflict: 'player_id,generation' }
  )

  await supabase
    .from(TABLES.players)
    .update({ has_chosen: true })
    .eq('id', player.id)
}

export async function resolveGeneration(roomId, generation) {
  const { players } = await fetchRoomBundle(roomId)
  const { data: choices } = await supabase
    .from(TABLES.choices)
    .select('*')
    .eq('room_id', roomId)
    .eq('generation', generation)

  const choiceMap = Object.fromEntries((choices ?? []).map((c) => [c.player_id, c]))

  for (const player of players) {
    const choice = choiceMap[player.id]
    const candidate = choice
      ? { id: choice.candidate_id, name: choice.candidate_name, power: 30, risk: 30 }
      : { power: 0, risk: 40 }

    const outcome = resolveOutcome(player, candidate)
    const newHealth = clampStat(player.dynasty_health + outcome.health)
    const newPower = clampStat(player.political_power + outcome.power)
    const newRisk = clampStat(player.inbreeding_risk + outcome.risk)
    const newPrestige = Math.max(0, player.prestige + outcome.prestige)
    const newScore = player.score + outcome.scoreDelta + (choice ? 5 : 0)

    await supabase
      .from(TABLES.players)
      .update({
        dynasty_health: newHealth,
        political_power: newPower,
        inbreeding_risk: newRisk,
        prestige: newPrestige,
        score: newScore,
        last_outcome: outcome.text,
        has_chosen: false,
        is_alive: newHealth > 0,
      })
      .eq('id', player.id)

    if (choice) {
      await supabase
        .from(TABLES.choices)
        .update({ outcome: outcome.text })
        .eq('id', choice.id)
    }
  }
}

export async function resetRoomScores(roomId) {
  await supabase
    .from(TABLES.players)
    .update({
      dynasty_health: 100,
      political_power: 50,
      inbreeding_risk: 0,
      prestige: 0,
      score: 0,
      last_outcome: null,
      has_chosen: false,
      is_alive: true,
    })
    .eq('room_id', roomId)

  await supabase.from(TABLES.choices).delete().eq('room_id', roomId)

  await updateRoom(roomId, {
    current_generation: 0,
    game_state: 'lobby',
    is_started: false,
    is_paused: false,
    phase_deadline: null,
    sync_token: Date.now(),
  })
}

export async function kickPlayer(playerId) {
  await supabase.from(TABLES.players).delete().eq('id', playerId)
}

export function checkSupabase() {
  if (!supabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'
    )
  }
}
