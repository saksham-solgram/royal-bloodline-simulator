/** Prefixed tables — avoids clashing with existing Supabase `players` / `rooms` tables */
export const TABLES = {
  rooms: 'bloodline_rooms',
  players: 'bloodline_players',
  choices: 'bloodline_choices',
}
