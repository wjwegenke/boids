import React from 'react';
import { useState, useEffect, useRef } from 'react';
import useAnimationFrame from './useAnimationFrame';
import Bunch from './classes/bunch';
import Boid from './classes/boid';
import Vector2 from './classes/vector2';
import DrawAll from './components/drawAll';
import BunchController from './components/bunchController';

function App() {
    const canvasEl = useRef(null);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [bunches, setBunches] = useState([]);
    bunches.forEach(bunch => bunch.dimensions = dimensions);
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
        for (let i = 0; i < 100; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            bunch.addBoid(boid);
        }
        
        const bunch2 = new Bunch();
        bunch2.color = 'grey';
        for (let i = 0; i < 100; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            bunch2.addBoid(boid);
        }

        setBunches([bunch, bunch2]);
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

    const showStats = false;
    const divStats = showStats ? (<div id="stats">
                                    <span>FPS:</span><span id="statFPS">{fps}</span><br/>
                                    <span>Delta Time:</span><span id="statDeltaTime">{dTime}</span><br/>
                                    <span>Direction Time:</span><span id="statDirectionTime"></span><br/>
                                    <span>Attraction Time:</span><span id="statAttracitonTime"></span><br/>
                                    <span>Repel Time:</span><span id="statRepelTime"></span><br/>
                                    <span>Update Time:</span><span id="statUpdateTime"></span><br/>
                                    <span>Draw Time:</span><span id="statDrawTime"></span>
                                </div>) : null;

    return (
        <div className="App">
            <canvas id="canvas" ref={canvasEl} width={dimensions.width} height={dimensions.height}></canvas>
            {bunches.map((bunch, idx) => {
                return (<BunchController bunch={bunch} dimensions={dimensions} key={idx}/>)
            })}
            {divStats}
        </div>
    );
}

export default App;
