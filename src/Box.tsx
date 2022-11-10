import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useRef } from 'react'
import './Box.css'


function Box() {

    const [{ x, y, width, height, rotateZ }, api] = useSpring(() => ({
        x: 0, y: 0, width: 100, height: 100, rotateZ: 1
    }))

    const resizerRef = useRef<HTMLDivElement | null>(null)
    const rotaterRef = useRef<HTMLDivElement | null>(null)

    const bindDrag = useDrag(({ event, offset }) => {

        switch (event.target) {
            case resizerRef.current:
                api.set({
                    width: offset[0],
                    height: offset[1]
                })
                break;
            case rotaterRef.current:
                let angle = (Math.atan2(offset[0] - width.get() / 2, offset[1] - height.get() / 2) * 180) / Math.PI

                api.set({
                    rotateZ: angle
                })
                break;
            default:
                api.set({
                    x: offset[0],
                    y: offset[1]
                })
        }
    }, {
        from: (event) => {
            const isResizing = (event.target === resizerRef.current)
            return isResizing ? [width.get(), height.get()] : [x.get(), y.get()]
        }
    })

    return (
        <animated.div id="box" {...bindDrag()} style={{ x, y, width, height, rotateZ }} >
            <div className='resizer' ref={resizerRef}></div>
            <div className='rotater' ref={rotaterRef}></div>
        </animated.div>
    )
}

export default Box