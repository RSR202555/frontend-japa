'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const move = (e: MouseEvent) => {
      cursor.style.left    = e.clientX + 'px'
      cursor.style.top     = e.clientY + 'px'
      cursor.style.opacity = '1'
    }
    const leave = () => { cursor.style.opacity = '0' }

    const enterInteractive = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.8)'
      cursor.style.opacity   = '0.7'
    }
    const leaveInteractive = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      cursor.style.opacity   = '1'
    }

    document.addEventListener('mousemove',  move)
    document.addEventListener('mouseleave', leave)

    const interactives = document.querySelectorAll('a, button')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', enterInteractive)
      el.addEventListener('mouseleave', leaveInteractive)
    })

    return () => {
      document.removeEventListener('mousemove',  move)
      document.removeEventListener('mouseleave', leave)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', enterInteractive)
        el.removeEventListener('mouseleave', leaveInteractive)
      })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        width:         '12px',
        height:        '12px',
        borderRadius:  '50%',
        background:    '#5B8CF5',
        pointerEvents: 'none',
        zIndex:        99999,
        transform:     'translate(-50%, -50%)',
        transition:    'transform 0.12s ease, opacity 0.2s ease',
        opacity:       0,
        mixBlendMode:  'difference',
      }}
    />
  )
}
