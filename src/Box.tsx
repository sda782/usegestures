import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react'
import './Box.css'


function Box() {

    const [{ x, y, width, height, rotateZ }, api] = useSpring(() => ({
        x: 0, y: 0, width: 100, height: 100, rotateZ: 0
    }))

    var centerPoint = {
        x: 0,
        y: 0
    }

    var boundingBox: DOMRect | undefined;

    const [mousePos, setMousePos] = useState({
        x: 0,
        y: 0
    });

    useEffect(() => {
        const handleMouseMove = (event: { clientX: any; clientY: any; }) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);

    const resizerRef = useRef<HTMLDivElement | null>(null)
    const rotaterRef = useRef<HTMLDivElement | null>(null)
    const selfRef = useRef<HTMLDivElement | null>(null)

    const bindDrag = useDrag(({ event, offset }) => {

        switch (event.target) {
            case resizerRef.current:
                api.set({
                    width: offset[0],
                    height: offset[1]
                })
                break;
            case rotaterRef.current:
                if (selfRef.current === null) return

                let p1 = {
                    x: centerPoint.x,
                    y: centerPoint.y
                }

                let p2 = {
                    x: mousePos.x,
                    y: mousePos.y
                }

                let angle = (Math.atan2(p2.x - p1.x, p2.y - p1.y) * 180) / Math.PI + 180

                console.log(centerPoint)
                console.log(mousePos)
                console.log(angle);

                api.set({
                    rotateZ: -angle
                })
                break;
            default:
                boundingBox = selfRef.current?.getBoundingClientRect()
                if (boundingBox === undefined) return;

                console.log(boundingBox);

                centerPoint = {
                    x: boundingBox.left + boundingBox.width / 2,
                    y: boundingBox.top + boundingBox.height / 2
                }

                console.log(centerPoint)

                api.set({
                    x: offset[0],
                    y: offset[1]
                })
        }
    }, {
        from: (event) => {
            const isResizing = (event.target === resizerRef.current)

            if (boundingBox !== undefined) {
                centerPoint = {
                    x: boundingBox.left + boundingBox.width / 2,
                    y: boundingBox.top + boundingBox.height / 2
                }
            }

            return isResizing ? [width.get(), height.get()] : [x.get(), y.get()]
        }
    })

    return (
        <div>
            <p>center pos : {centerPoint.x} , {centerPoint.y}</p>
            <p>mouse position : {mousePos.x} , {mousePos.y}</p>
            <animated.div id="box" ref={selfRef} {...bindDrag()} style={{ x, y, width, height, rotateZ }} >
                <div className='resizer dot' ref={resizerRef}></div>
                <div className='rotater dot' ref={rotaterRef}></div>
            </animated.div>
        </div>
    )
}

export default Box