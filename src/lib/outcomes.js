const DRAMATIC = [
  { text: 'Your heir suffers madness. The court whispers.', health: -18, power: -5, risk: 12, prestige: -3 },
  { text: 'Twin heirs strengthen the dynasty!', health: 12, power: 15, risk: 8, prestige: 10 },
  { text: 'Your bloodline weakens. A stillborn heir.', health: -25, power: -10, risk: 5, prestige: -8 },
  { text: 'The royal jaw worsens. Portrait painters weep.', health: -8, power: 0, risk: 20, prestige: -5 },
  { text: 'Your heir fears sunlight. The servants gossip.', health: -5, power: -8, risk: 10, prestige: -2 },
  { text: 'Your daughter becomes a genius tactician.', health: 5, power: 22, risk: 0, prestige: 15 },
  { text: 'Your dynasty survives the plague!', health: 20, power: 5, risk: -5, prestige: 12 },
  { text: 'A scandal rocks the alliance. Power crumbles.', health: -10, power: -20, risk: 5, prestige: -10 },
  { text: 'Gold floods the treasury. The realm prospers.', health: 8, power: 18, risk: 0, prestige: 8 },
  { text: 'The marriage produces no heir. Panic spreads.', health: -15, power: -12, risk: 3, prestige: -6 },
  { text: 'A beloved heir wins the hearts of the people.', health: 10, power: 12, risk: 0, prestige: 18 },
  { text: 'Inbreeding whispers grow louder...', health: -12, power: 5, risk: 25, prestige: -4 },
  { text: 'A military victory secures your borders!', health: 5, power: 25, risk: 0, prestige: 14 },
  { text: 'Your heir is... unusually chin-forward.', health: -6, power: 3, risk: 18, prestige: 2 },
  { text: 'Peace treaty signed. Europe applauds.', health: 8, power: 20, risk: -3, prestige: 12 },
]

export function resolveOutcome(player, candidate) {
  const effectiveRisk = Math.max(
    0,
    (player.inbreeding_risk ?? player.inbreedingRisk ?? 0) +
      (candidate?.risk ?? 30)
  )
  const badChance = Math.min(0.85, effectiveRisk / 120)
  const roll = Math.random()

  let pool = DRAMATIC
  if (roll < badChance) {
    pool = DRAMATIC.filter((o) => o.health < 0 || o.risk > 10)
  } else if (roll > 0.75) {
    pool = DRAMATIC.filter((o) => o.health > 0 || o.prestige > 10)
  }

  const outcome = pool[Math.floor(Math.random() * pool.length)] || DRAMATIC[0]
  const powerBonus = Math.floor((candidate?.power ?? 0) / 8)

  return {
    text: outcome.text,
    health: outcome.health,
    power: outcome.power + powerBonus,
    risk: outcome.risk,
    prestige: outcome.prestige,
    scoreDelta: Math.max(
      -15,
      Math.min(25, outcome.prestige + powerBonus + Math.floor(outcome.health / 3))
    ),
  }
}

export function clampStat(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}
