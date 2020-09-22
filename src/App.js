import React from 'react';
import { useState, useEffect, useRef } from 'react';
import useAnimationFrame from './useAnimationFrame';
import Bunch from './classes/bunch';
import Boid from './classes/boid';
import Vector2 from './classes/vector2';
import BunchController from './components/bunchController';
import Obstacle from './classes/obstacle';
import ObstacleManager from './classes/obstacleManager';
import ObstacleController from './components/obstacleController';

function App() {
    const canvasEl = useRef(null);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [bunches, setBunches] = useState([]);
    const [obstacleManager, setObstacleManager] = useState(new ObstacleManager());
    obstacleManager.dimensions = dimensions;
    bunches.forEach(bunch => bunch.dimensions = dimensions);
    const [ctx, setCtx] = useState(null);
    const [fps, setFps] = useState(0);
    const [dTime, setDTime] = useState(0);
    const [dTimes, setDTimes] = useState([]);
    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
            console.log(canvasEl);
        }

        window.addEventListener('resize', handleResize);
        // // Set up CSS size.
        // canvasEl.current.style.width = canvasEl.current.style.width || canvasEl.current.width + 'px';
        // canvasEl.current.style.height = canvasEl.current.style.height || canvasEl.current.height + 'px';

        // // Resize canvas and scale future draws.
        // var scaleFactor = 2;//dpi / 96;
        // canvasEl.current.width = Math.ceil(canvasEl.current.width * scaleFactor);
        // canvasEl.current.height = Math.ceil(canvasEl.current.height * scaleFactor);
        let thisCtx = canvasEl.current.getContext('2d');
        // thisCtx.scale(scaleFactor, scaleFactor);
        
        const bunch = new Bunch();
        for (let i = 0; i < 50; i++) {
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
        bunch2.color = 'coral';
        for (let i = 0; i < 50; i++) {
            const accelerationScale = 10;
            const position = new Vector2();
            position.x = Math.random() * canvasEl.current.width;
            position.y = Math.random() * canvasEl.current.height;
            const acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
            const velocity = acceleration.normalize().mult(15);
            let boid = new Boid(position, velocity, acceleration);
            bunch2.addBoid(boid);
        }

        // const obstacleObjects = [];
        // for (let i = 0; i < 25; i++) {
        //     const position = new Vector2();
        //     position.x = Math.random() * canvasEl.current.width;
        //     position.y = Math.random() * canvasEl.current.height;
        //     const obstacle = new Obstacle(position);
        //     obstacleObjects.push(obstacle);
        // }
        // setObstacles(obstacleObjects);
        obstacleManager.count = 25;

        setBunches([bunch, bunch2]);
        setCtx(thisCtx);
    }, []);

    useAnimationFrame(deltaTime => {
        if (!ctx) return;
        dTimes.push(deltaTime);
        if (dTimes.length > 100) {
            setDTimes(dTimes.slice(20));
        }
        const aveDeltaTime = dTimes.reduce((a, b) => a + b) / dTimes.length;
        setDTime(Math.round(aveDeltaTime));
        setFps(Math.round(1000 / aveDeltaTime));
        bunches.forEach(bunch => {
            bunch.update(deltaTime, ctx, bunches, obstacleManager.obstacles)
        });
        obstacleManager.obstacles.forEach(obstacle => obstacle.update(ctx));
        bunches.forEach(bunch => bunch.lateUpdate(deltaTime, ctx));
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        bunches.forEach(bunch => bunch.draw(ctx));
        obstacleManager.obstacles.forEach(obstacle => obstacle.draw(ctx));
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
            <div className="controllers">
                <ObstacleController obstacleManager={obstacleManager}/>
                {bunches.map((bunch, idx) => {
                    return (<BunchController bunch={bunch} dimensions={dimensions} key={idx}/>)
                })}
                {divStats}
            </div>
        </div>
    );
}

export default App;
