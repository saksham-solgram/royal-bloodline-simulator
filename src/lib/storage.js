const PLAYER_ID = 'bloodline_player_id'
const PLAYER_NAME = 'bloodline_player_name'
const ROOM_CODE = 'bloodline_room_code'

export function getStoredPlayer() {
  const id = localStorage.getItem(PLAYER_ID)
  const name = localStorage.getItem(PLAYER_NAME)
  const roomCode = localStorage.getItem(ROOM_CODE)
  if (!id || !name || !roomCode) return null
  return { id, name, roomCode }
}

export function savePlayer({ id, name, roomCode }) {
  localStorage.setItem(PLAYER_ID, id)
  localStorage.setItem(PLAYER_NAME, name)
  localStorage.setItem(ROOM_CODE, roomCode.toUpperCase())
}

export function clearPlayer() {
  localStorage.removeItem(PLAYER_ID)
  localStorage.removeItem(PLAYER_NAME)
  localStorage.removeItem(ROOM_CODE)
}
