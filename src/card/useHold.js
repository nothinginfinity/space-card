import { useRef, useCallback } from 'react'

export function useHold(onHold, delay = 500) {
  const timer = useRef(null)
  const moved = useRef(false)

  const start = useCallback((e) => {
    moved.current = false
    timer.current = setTimeout(() => {
      if (!moved.current) onHold(e)
    }, delay)
  }, [onHold, delay])

  const cancel = useCallback(() => {
    clearTimeout(timer.current)
  }, [])

  const move = useCallback(() => {
    moved.current = true
    clearTimeout(timer.current)
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onMouseMove: move,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: move,
  }
}
