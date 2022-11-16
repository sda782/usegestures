import { useSpring, animated } from '@react-spring/web';
import { useDrag, Vector2 } from '@use-gesture/react';
import { useRef, useState } from 'react'
import './Box.css'


function Box() {

    const resizerRef = useRef<HTMLDivElement | null>(null)
    const rotaterRef = useRef<HTMLDivElement | null>(null)
    const selfRef = useRef<HTMLDivElement | null>(null)

    console.log(selfRef)

    var boundingBox: DOMRect | undefined;

    const [editmode, setEditmode] = useState(false)

    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0
    });

    const [centerPos, setCenterPos] = useState({
        x: 0,
        y: 0

    })

    const [{ x, y, width, height, rotateZ }, api] = useSpring(() => ({
        x: 0, y: 0, width: 100, height: 100, rotateZ: 0
    }))

    const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
        setMousePos({
            x: event.clientX,
            y: event.clientY
        });
    };

    const handleTouchMove = (event: TouchEvent) => {
        setMousePos({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    const resize = (offset: Vector2) => {
        boundingBox = selfRef.current?.getBoundingClientRect()
        if (boundingBox === undefined) return;

        setCenterPos({
            x: boundingBox.left + boundingBox.width / 2,
            y: boundingBox.top + boundingBox.height / 2
        })

        api.set({
            width: offset[0],
            height: offset[1]
        })
    }

    const rotate = () => {
        if (selfRef.current === null) return
        let angle = (Math.atan2(mousePos.x - centerPos.x, mousePos.y - centerPos.y) * 180) / Math.PI + 180

        api.set({
            rotateZ: -angle
        })
    }

    const move = (offset: Vector2) => {
        boundingBox = selfRef.current?.getBoundingClientRect()
        if (boundingBox === undefined) return;

        setCenterPos({
            x: boundingBox.left + boundingBox.width / 2,
            y: boundingBox.top + boundingBox.height / 2
        })

        api.set({
            x: offset[0],
            y: offset[1]
        })
    }

    const bindDrag = useDrag(({ event, offset, tap }) => {
        console.log(event);
        if (tap) setEditmode(!editmode)

        if (!editmode) return

        switch (event.target) {
            case resizerRef.current:
                resize(offset)
                break;
            case rotaterRef.current:
                rotate()
                break;
            default:
                move(offset)
        }

    }, {
        from: (event) => {
            const isResizing = (event.target === resizerRef.current)

            if (boundingBox !== undefined) {
                centerPos.x = boundingBox.left + boundingBox.width / 2
                centerPos.y = boundingBox.top + boundingBox.height / 2
            }

            return isResizing ? [width.get(), height.get()] : [x.get(), y.get()]
        }
    })

    return (
        <animated.div id="box" ref={selfRef} {...bindDrag()} style={{ x, y, width, height, rotateZ }} >
            {editmode
                ? <div>
                    <div className='resizer dot' ref={resizerRef}></div>
                    <div className='rotater dot' ref={rotaterRef}></div>
                </div>
                : <div></div>
            }
        </animated.div>
    )
}

export default Box