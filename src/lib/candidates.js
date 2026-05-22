const FIRST = [
  'Eleanor', 'Margaret', 'Isabella', 'Catherine', 'Anne', 'Mary', 'Joan', 'Beatrice',
  'Philip', 'Charles', 'Louis', 'Ferdinand', 'Maximilian', 'Leopold', 'Francis',
]
const LAST = [
  'of Castile', 'of Aragon', 'of Burgundy', 'von Habsburg', 'of Savoy', 'of Medici',
  'the Pale', 'the Bold', 'the Pious', 'the Mad', 'of Austria', 'of Bohemia',
]
const RARITIES = [
  { label: 'Royal Pureblood', power: 35, risk: 45 },
  { label: 'Foreign Alliance', power: 40, risk: 15 },
  { label: 'Lowborn Genius', power: 25, risk: 5 },
  { label: 'Cousin Match', power: 20, risk: 55 },
  { label: 'Merchant House', power: 30, risk: 10 },
  { label: 'Exiled Princess', power: 28, risk: 25 },
]

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

export function generateCandidates(playerId, generation) {
  const seed =
    generation * 1000 +
    playerId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = seededRandom(seed)
  const candidates = []
  const used = new Set()

  while (candidates.length < 3) {
    const rarity = pick(rand, RARITIES)
    const name = `${pick(rand, FIRST)} ${pick(rand, LAST)}`
    if (used.has(name)) continue
    used.add(name)
    const id = `c-${generation}-${candidates.length}-${name.replace(/\s/g, '-')}`
    candidates.push({
      id,
      name,
      power: rarity.power + Math.floor(rand() * 15) - 5,
      risk: rarity.risk + Math.floor(rand() * 15) - 5,
      rarity: rarity.label,
    })
  }
  return candidates
}
