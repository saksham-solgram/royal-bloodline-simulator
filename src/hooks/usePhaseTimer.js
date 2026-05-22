import { useEffect, useState } from 'react'
import { playTick, playUrgentTick } from '../lib/sounds'

export function usePhaseTimer(deadline, isPaused, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(null)

  useEffect(() => {
    if (!deadline || isPaused) {
      setSecondsLeft(null)
      return
    }

    const tick = () => {
      const ms = new Date(deadline).getTime() - Date.now()
      const sec = Math.max(0, Math.ceil(ms / 1000))
      setSecondsLeft(sec)
      if (sec <= 5 && sec > 0) playUrgentTick()
      else if (sec > 0 && sec % 2 === 0) playTick()
      if (sec <= 0) onExpire?.()
    }

    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [deadline, isPaused, onExpire])

  return secondsLeft
}
