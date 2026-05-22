import { useState } from 'react'
import {
  updateRoom,
  resolveGeneration,
  resetRoomScores,
  kickPlayer,
  startGame,
} from '../lib/roomApi'
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  canStartGame,
  playerCountLabel,
  playersNeededToStart,
} from '../lib/constants'

const CHOICE_SECONDS = 20
const REVEAL_SECONDS = 8
const LEADERBOARD_SECONDS = 10

function deadlineFromNow(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString()
}

export function HostPanel({ room, players, onRefresh }) {
  const [busy, setBusy] = useState('')
  const [roomCodeInput, setRoomCodeInput] = useState(room?.room_code ?? 'HABSBURG')

  const run = async (label, fn) => {
    setBusy(label)
    try {
      await fn()
      await onRefresh?.()
    } catch (e) {
      alert(e.message)
    } finally {
      setBusy('')
    }
  }

  if (!room) return null

  const chosenCount = players.filter((p) => p.has_chosen).length
  const readyToStart = canStartGame(players.length)
  const needMore = playersNeededToStart(players.length)
  const inLobby = room.game_state === 'lobby' || !room.is_started

  return (
    <div className="min-h-dvh bg-[#0a0608] text-[#e8dcc4] p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl text-[#c9a227] mb-1">Host Command</h1>
      <p className="text-sm opacity-60 mb-6">
        Room <strong className="text-[#c9a227]">{room.room_code}</strong> · State:{' '}
        <strong>{room.game_state}</strong> · Gen {room.current_generation}/{room.max_generations}
        {room.is_paused && ' · PAUSED'}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card-royal rounded-xl p-4">
          <p className="text-4xl font-display text-[#c9a227]">{playerCountLabel(players.length)}</p>
          <p className="text-sm opacity-60">Players connected ({MIN_PLAYERS}–{MAX_PLAYERS} to play)</p>
          {inLobby && needMore > 0 && (
            <p className="text-sm text-[#8b1a2b] mt-2">
              Need {needMore} more player{needMore === 1 ? '' : 's'} before start
            </p>
          )}
          {inLobby && readyToStart && (
            <p className="text-sm text-emerald-400/90 mt-2">Ready to start</p>
          )}
          <p className="text-sm mt-2">
            Choices locked: {chosenCount}/{players.length}
          </p>
        </div>
        <div className="card-royal rounded-xl p-4 text-sm space-y-1 max-h-40 overflow-y-auto">
          {players.map((p) => (
            <div key={p.id} className="flex justify-between gap-2">
              <span>
                {p.name} {p.has_chosen ? '✓' : '…'}
              </span>
              <button
                type="button"
                className="text-[#8b1a2b] text-xs"
                onClick={() => run('kick', () => kickPlayer(p.id))}
              >
                kick
              </button>
            </div>
          ))}
        </div>
      </div>

      <section className="mb-6">
        <h2 className="font-display text-[#c9a227] mb-3">Game flow</h2>
        <div className="flex flex-wrap gap-2">
          <HostBtn
            busy={busy}
            label="START GAME"
            disabled={inLobby && !readyToStart}
            onClick={() => run('start', () => startGame(room.id))}
            primary
          />
          <HostBtn
            busy={busy}
            label="PAUSE"
            onClick={() => run('pause', () => updateRoom(room.id, { is_paused: true }))}
          />
          <HostBtn
            busy={busy}
            label="RESUME"
            onClick={() =>
              run('resume', () =>
                updateRoom(room.id, {
                  is_paused: false,
                  phase_deadline: deadlineFromNow(CHOICE_SECONDS),
                  sync_token: Date.now(),
                })
              )
            }
          />
          <HostBtn
            busy={busy}
            label="NEXT GENERATION"
            onClick={() => handleNextGeneration(room, players, run)}
          />
          <HostBtn
            busy={busy}
            label="REVEAL STATS"
            onClick={() =>
              run('leaderboard', () =>
                updateRoom(room.id, {
                  game_state: 'leaderboard',
                  phase_deadline: deadlineFromNow(LEADERBOARD_SECONDS),
                  sync_token: Date.now(),
                })
              )
            }
          />
          <HostBtn
            busy={busy}
            label="FORCE END"
            onClick={() =>
              run('end', () =>
                updateRoom(room.id, {
                  game_state: 'ended',
                  is_paused: true,
                  phase_deadline: null,
                  sync_token: Date.now(),
                })
              )
            }
          />
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-display text-[#c9a227] mb-3">Failsafes</h2>
        <div className="flex flex-wrap gap-2">
          <HostBtn
            busy={busy}
            label="SYNC ALL CLIENTS"
            onClick={() =>
              run('sync', () => updateRoom(room.id, { sync_token: Date.now() }))
            }
          />
          <HostBtn
            busy={busy}
            label="FORCE ADVANCE"
            onClick={() => forceAdvance(room, run)}
          />
          <HostBtn
            busy={busy}
            label="EMERGENCY RESET"
            onClick={() => run('reset', () => resetRoomScores(room.id))}
            danger
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-[#c9a227] mb-3">Reconnect room</h2>
        <div className="flex gap-2">
          <input
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            className="card-royal rounded-lg px-3 py-2 flex-1 uppercase"
          />
          <a
            href={`/play?room=${roomCodeInput}`}
            className="px-4 py-2 bg-[#c9a227] text-[#0a0608] rounded-lg font-display text-sm"
          >
            Open player view
          </a>
        </div>
      </section>
    </div>
  )
}

function HostBtn({ label, onClick, busy, primary, danger, disabled }) {
  const cls = primary
    ? 'bg-[#c9a227] text-[#0a0608]'
    : danger
      ? 'bg-[#8b1a2b]'
      : 'card-royal'
  return (
    <button
      type="button"
      disabled={!!busy || disabled}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl font-display text-sm tracking-wide disabled:opacity-50 ${cls}`}
    >
      {busy === label ? '...' : label}
    </button>
  )
}

async function handleNextGeneration(room, players, run) {
  const state = room.game_state

  if (state === 'lobby' || state === 'ended') {
    await run('start', () => startGame(room.id))
    return
  }

  if (state === 'choosing') {
    await run('resolve', async () => {
      await resolveGeneration(room.id, room.current_generation)
      await updateRoom(room.id, {
        game_state: 'revealing',
        phase_deadline: deadlineFromNow(REVEAL_SECONDS),
        sync_token: Date.now(),
      })
    })
    return
  }

  if (state === 'revealing') {
    await run('board', () =>
      updateRoom(room.id, {
        game_state: 'leaderboard',
        phase_deadline: deadlineFromNow(LEADERBOARD_SECONDS),
        sync_token: Date.now(),
      })
    )
    return
  }

  if (state === 'leaderboard') {
    const nextGen = room.current_generation + 1
    if (nextGen > room.max_generations) {
      await run('end', () =>
        updateRoom(room.id, {
          game_state: 'ended',
          is_paused: true,
          phase_deadline: null,
          sync_token: Date.now(),
        })
      )
    } else {
      await run('next', () =>
        updateRoom(room.id, {
          current_generation: nextGen,
          game_state: 'choosing',
          phase_deadline: deadlineFromNow(CHOICE_SECONDS),
          sync_token: Date.now(),
        })
      )
    }
  }
}

async function forceAdvance(room, run) {
  if (room.game_state === 'choosing') {
    await run('force-resolve', async () => {
      await resolveGeneration(room.id, room.current_generation)
      await updateRoom(room.id, {
        game_state: 'revealing',
        phase_deadline: deadlineFromNow(REVEAL_SECONDS),
        sync_token: Date.now(),
      })
    })
  } else if (room.game_state === 'revealing') {
    await run('force-board', () =>
      updateRoom(room.id, {
        game_state: 'leaderboard',
        phase_deadline: deadlineFromNow(LEADERBOARD_SECONDS),
        sync_token: Date.now(),
      })
    )
  } else if (room.game_state === 'leaderboard') {
    const nextGen = room.current_generation + 1
    if (nextGen > room.max_generations) {
      await updateRoom(room.id, { game_state: 'ended', phase_deadline: null, sync_token: Date.now() })
    } else {
      await updateRoom(room.id, {
        current_generation: nextGen,
        game_state: 'choosing',
        phase_deadline: deadlineFromNow(CHOICE_SECONDS),
        sync_token: Date.now(),
      })
    }
  }
}
