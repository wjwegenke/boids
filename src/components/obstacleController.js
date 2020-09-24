import React from 'react';
import { useState, useEffect, useRef } from 'react';
import ObstacleManager from '../classes/obstacleManager';
import Obstacle from '../classes/obstacle';
import Vector2 from '../classes/vector2';

function ObstacleController(props) {
    const canvasEl = useRef(null);
    const [isControllerBodyOpen, setIsControllerBodyOpen] = useState(false);
    const [iconCtx, setIconCtx] = useState(null);
    const ctxScale = 2;

    useEffect(() => {
        // Set up CSS size.
        canvasEl.current.style.width = canvasEl.current.style.width || canvasEl.current.width + 'px';
        canvasEl.current.style.height = canvasEl.current.style.height || canvasEl.current.height + 'px';

        // Resize canvas and scale future draws.
        var scaleFactor = ctxScale;//dpi / 96;
        canvasEl.current.width = Math.ceil(canvasEl.current.width * scaleFactor);
        canvasEl.current.height = Math.ceil(canvasEl.current.height * scaleFactor);

        const thisIconCtx = canvasEl.current.getContext('2d');
        thisIconCtx.scale(scaleFactor, scaleFactor);
        setIconCtx(thisIconCtx);
    }, []);

    function toggleProperty(evt, propertyName) {
        props.bunch[propertyName] = evt.currentTarget.checked;
    }

    function setProperty(evt, propertyName) {
        props.obstacleManager[propertyName] = evt.currentTarget.value * 1;
    }

    function selectTab(isOpen, setOpen) {
        setOpen(!isOpen);
    }

    function toggleOpen() {
        setIsControllerBodyOpen(!isControllerBodyOpen);
    }

    if (iconCtx) {
        iconCtx.clearRect(0, 0, iconCtx.canvas.width, iconCtx.canvas.height);
        //Base
        const obstacle = new Obstacle(new Vector2(iconCtx.canvas.width/(2*ctxScale), iconCtx.canvas.height/(2*ctxScale)));
        obstacle.obstacleManager = props.obstacleManager;
        obstacle.draw(iconCtx);
    }

    return (
        <div className="controller">
            <div className="controller-header">
                <div className="controller-icon">
                    <canvas ref={canvasEl} width="30px" height="30px"></canvas>
                </div>
                <div className="controller-label">Obstacles</div>
                <div className="slider-control">
                    <input type="range" min="0" max="50" className="slider" value={props.obstacleManager.count} onChange={(evt) => setProperty(evt, "count")}/>
                </div>
                <div className="expander" onClick={toggleOpen}>v</div>
            </div>
        </div>
    )
}

export default ObstacleController;