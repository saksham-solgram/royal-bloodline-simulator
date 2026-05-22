let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function tone(freq, duration, type = 'sine', volume = 0.08) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    /* audio blocked until user gesture */
  }
}

export function playTick() {
  tone(880, 0.05, 'square', 0.04)
}

export function playUrgentTick() {
  tone(1200, 0.06, 'square', 0.06)
}

export function playReveal() {
  tone(110, 0.4, 'sawtooth', 0.12)
  setTimeout(() => tone(165, 0.5, 'sawtooth', 0.1), 120)
  setTimeout(() => tone(220, 0.6, 'triangle', 0.08), 280)
}

export function playChoice() {
  tone(440, 0.15, 'triangle', 0.07)
}

export function playJoin() {
  tone(330, 0.2, 'sine', 0.06)
  setTimeout(() => tone(392, 0.25, 'sine', 0.06), 100)
}

export function resumeAudio() {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
  } catch {
    /* ignore */
  }
}
