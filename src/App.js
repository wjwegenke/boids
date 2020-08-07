import React from 'react';
import { useState, useEffect, useRef } from 'react';
import useAnimationFrame from './useAnimationFrame';
import Bunch from './classes/bunch';
import Boid from './classes/boid';
import Vector2 from './classes/vector2';
import DrawAll from './components/drawAll';

function App() {
    const canvasEl = useRef(null);
    const [bunches, setBunches] = useState([]);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [ctx, setCtx] = useState(null);
    const [fps, setFps] = useState(0);
    const [dTime, setDTime] = useState(0);
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
        
        const bunch = new Bunch();
        for (let i = 0; i < 150; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            bunch.addBoid(boid);
        }
        
        const flock2 = new Bunch();
        for (let i = 0; i < 150; i++) {
            flock2.color = 'grey';
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            flock2.addBoid(boid);
        }

        setBunches([bunch, flock2]);
        setCtx(thisCtx);
    }, []);

    useAnimationFrame(deltaTime => {
        setDTime(Math.round(deltaTime));
        setFps(Math.round(1000 / deltaTime));
        bunches.forEach(bunch => bunch.update(deltaTime, ctx, bunches));
        bunches.forEach(bunch => bunch.lateUpdate(deltaTime, ctx));
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        bunches.forEach(bunch => bunch.draw(ctx));
        bunches.forEach(bunch => bunch.lateDraw(ctx));
    });

    return (
        <div className="App">
            <canvas id="canvas" ref={canvasEl} width={dimensions.width} height={dimensions.height}></canvas>
            {bunches.map(bunch => {
                return (<DrawAll bunch={bunch}/>)
            })}
            <div id="stats">
                <span>FPS:</span><span id="statFPS">{fps}</span><br/>
                <span>Delta Time:</span><span id="statDeltaTime">{dTime}</span><br/>
                <span>Direction Time:</span><span id="statDirectionTime"></span><br/>
                <span>Attraction Time:</span><span id="statAttracitonTime"></span><br/>
                <span>Repel Time:</span><span id="statRepelTime"></span><br/>
                <span>Update Time:</span><span id="statUpdateTime"></span><br/>
                <span>Draw Time:</span><span id="statDrawTime"></span>
            </div>
        </div>
    );
}

export default App;
