import React from 'react';
import { useState, useEffect, useRef } from 'react';
import useAnimationFrame from './useAnimationFrame';
import Flock from './classes/flock';
import Boid from './classes/boid';
import Vector2 from './classes/vector2';
import DrawAll from './components/drawAll';

function App() {
    const canvasEl = useRef(null);
    const [flocks, setFlocks] = useState([]);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [ctx, setCtx] = useState(null);
    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
            console.log(canvasEl);
        }

        window.addEventListener('resize', handleResize);
        let thisCtx = canvasEl.current.getContext('2d');
        
        const flock = new Flock();
        for (let i = 0; i < 50; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            flock.addBoid(boid);
        }
        
        const flock2 = new Flock();
        for (let i = 0; i < 50; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            flock2.addBoid(boid);
        }

        setFlocks([flock, flock2]);
        setCtx(thisCtx);
    }, []);

    useAnimationFrame(deltaTime => {
        flocks.forEach(flock => flock.update(deltaTime, ctx, flocks));
        flocks.forEach(flock => flock.lateUpdate(deltaTime, ctx));
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        flocks.forEach(flock => flock.draw(ctx));
        flocks.forEach(flock => flock.lateDraw(ctx));
    });

    return (
        <div className="App">
            <canvas id="canvas" ref={canvasEl} width={dimensions.width} height={dimensions.height}></canvas>
            {flocks.map(flock => {
                return (<DrawAll flock={flock}/>)
            })}
        </div>
    );
}

export default App;
