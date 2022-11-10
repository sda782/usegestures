import { animated, useSpring } from '@react-spring/web';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { useEffect, useRef } from 'react';
import './App.css'

const useGesture = createUseGesture([dragAction, pinchAction])

function App() {

  useEffect(() => {
    const handler = (e: { preventDefault: () => any; }) => e.preventDefault()
    document.addEventListener('gesturestart', handler)
    document.addEventListener('gesturechange', handler)
    document.addEventListener('gestureend', handler)
    return () => {
      document.removeEventListener('gesturestart', handler)
      document.removeEventListener('gesturechange', handler)
      document.removeEventListener('gestureend', handler)
    }
  }, [])

  const [style, api] = useSpring(() => ({
    x: 0, y: 0, width: 100, height: 100, rotateZ: 0
  }))
  const resizerRef = useRef<HTMLDivElement | null>(null)
  const selfRef = useRef<HTMLDivElement | null>(null)

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y], event, ...rest }) => {
        if (pinching) return cancel()

        const isResizing = (event.target === resizerRef.current)
        console.log(event.target);
        console.log(x + " " + y)
        api.start(isResizing ? {
          width: x,
          height: y
        } : {
          x: x,
          y: y
        })
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {

        if (first && selfRef.current !== null) {
          const { width, height, x, y } = selfRef.current.getBoundingClientRect()
          const tx = ox - (x + width / 2)
          const ty = oy - (y + height / 2)
          memo = [style.x.get(), style.y.get(), tx, ty]
        }

        const x = memo[0] - (ms - 1) * memo[2]
        const y = memo[1] - (ms - 1) * memo[3]

        api.start({ rotateZ: a, x, y })

        return memo
      },
    },
    {
      target: selfRef,
      drag: { from: () => [style.x.get(), style.y.get()] }
    }
  )

  return (
    <animated.div id="box" ref={selfRef} style={style} >
      <div className='resizer' ref={resizerRef}></div>
    </animated.div>
  )
}

export default App;
