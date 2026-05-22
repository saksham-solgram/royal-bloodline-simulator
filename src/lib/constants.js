export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 15

export function canStartGame(playerCount) {
  return playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS
}

export function playersNeededToStart(playerCount) {
  return Math.max(0, MIN_PLAYERS - playerCount)
}

export function playerCountLabel(count) {
  return `${count}/${MAX_PLAYERS}`
}
