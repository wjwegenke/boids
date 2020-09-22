import React from 'react';
import { useState, useEffect, useRef } from 'react';

function BunchController(props) {
    const [isControllerBodyOpen, setIsControllerBodyOpen] = useState(false);
    const [isDrawBodyOpen, setIsDrawBodyOpen] = useState(false);
    const [isBehavioralBodyOpen, setIsBehavioralBodyOpen] = useState(false);
    let controllerBody = useRef(null);
    let drawBody = useRef(null);
    let behavioralBody = useRef(null);
    const canvasEl = useRef(null);
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

    function setCount(evt) {
        props.bunch.count = evt.currentTarget.value;
    }

    function setProperty(evt, propertyName) {
        props.bunch[propertyName] = evt.currentTarget.value * 1;
    }

    function selectTab(isOpen, setOpen) {
        setOpen(!isOpen);
    }

    if (iconCtx) {
        iconCtx.clearRect(0, 0, iconCtx.canvas.width, iconCtx.canvas.height);
        iconCtx.beginPath();
        //Base
        iconCtx.fillStyle = props.bunch.color;
        iconCtx.arc(iconCtx.canvas.width/(2*ctxScale), iconCtx.canvas.height/(2*ctxScale), props.bunch.size, 0, 2 * Math.PI, true);
        iconCtx.fill();
        
        //Highlight
        // iconCtx.lineWidth = 2;
        // iconCtx.strokeStyle = props.bunch.highlightColor;
        // iconCtx.stroke();

        iconCtx.closePath();
    }

    let controllerBodyHeight = 0;
    if (isControllerBodyOpen && controllerBody != null) {
        for (let i = 0; i < controllerBody.current.children.length; i++) {
            controllerBodyHeight += controllerBody.current.children[i].scrollHeight;
        }
    }
    let drawBodyHeight = 0;
    if (isDrawBodyOpen && drawBody != null) {
        for (let i = 0; i < drawBody.current.children.length; i++) {
            drawBodyHeight += drawBody.current.children[i].scrollHeight;
        }
    }
    let behavioralBodyHeight = 0;
    if (isBehavioralBodyOpen && behavioralBody != null) {
        for (let i = 0; i < behavioralBody.current.children.length; i++) {
            behavioralBodyHeight += behavioralBody.current.children[i].scrollHeight;
        }
    }

    return (
        <div className="controller">
            <div className="controller-header">
                <div className="controller-icon">
                    <canvas ref={canvasEl} width="30px" height="30px"></canvas>
                </div>
                <div className="controller-label">Bunch</div>
                <div className="slider-control">
                    <input type="range" min="1" max="50" className="slider" value={props.bunch.count} onChange={(evt) => setProperty(evt, "count")}/>
                </div>
                <div className="expander" onClick={(evt) => selectTab(isControllerBodyOpen, setIsControllerBodyOpen)}>v</div>
            </div>
            <div className="controller-body" ref={controllerBody} style={{height: controllerBodyHeight + 'px'}}>
                <div className="draw-options">
                    <div className="options-header">
                        <span>Draw Options</span>
                        <div className="expander" onClick={(evt) => selectTab(isDrawBodyOpen, setIsDrawBodyOpen)}>v</div>
                    </div>
                    <div className={'options-body' + (isDrawBodyOpen ? ' active' : '')} ref={drawBody} style={{height: + drawBodyHeight + 'px'}}>
                        <div className="checkbox-control">
                            <label>Draw On All</label>
                            <input type="checkbox" checked={props.bunch.drawOnAll} onChange={(evt) => toggleProperty(evt, "drawOnAll")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Direction Proximity</label>
                            <input type="checkbox" checked={props.bunch.drawDirectRadius} onChange={(evt) => toggleProperty(evt, "drawDirectRadius")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Attraction Proximity</label>
                            <input type="checkbox" checked={props.bunch.drawAttractRadius} onChange={(evt) => toggleProperty(evt, "drawAttractRadius")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Repulsion Proximity</label>
                            <input type="checkbox" checked={props.bunch.drawRepelRadius} onChange={(evt) => toggleProperty(evt, "drawRepelRadius")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Direction</label>
                            <input type="checkbox" checked={props.bunch.drawDirection} onChange={(evt) => toggleProperty(evt, "drawDirection")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Attraction</label>
                            <input type="checkbox" checked={props.bunch.drawAttraction} onChange={(evt) => toggleProperty(evt, "drawAttraction")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Repulsion</label>
                            <input type="checkbox" checked={props.bunch.drawRepel} onChange={(evt) => toggleProperty(evt, "drawRepel")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Acceleration</label>
                            <input type="checkbox" checked={props.bunch.drawAcceleration} onChange={(evt) => toggleProperty(evt, "drawAcceleration")} />
                        </div>
                        <div className="checkbox-control">
                            <label>Velocity</label>
                            <input type="checkbox" checked={props.bunch.drawVelocity} onChange={(evt) => toggleProperty(evt, "drawVelocity")} />
                        </div>
                    </div>
                </div>
                <div className="behavioral-options">
                    <div className="options-header">
                        <span>Behavioral Options</span>
                        <div className="expander" onClick={(evt) => selectTab(isBehavioralBodyOpen, setIsBehavioralBodyOpen)}>v</div>
                    </div>
                    <div className={'options-body' + (isBehavioralBodyOpen ? ' active' : '')} ref={behavioralBody} style={{height: behavioralBodyHeight + 'px'}}>
                        <div className="slider-control">
                            <label>Base Acceleration</label>
                            <input type="range" min="0" max="75" className="slider" value={props.bunch.baseAcceleration} onChange={(evt) => setProperty(evt, "baseAcceleration")}/>
                        </div>
                        <div className="slider-control">
                            <label>Max Acceleration</label>
                            <input type="range" min="0" max="75" className="slider" value={props.bunch.maxAcceleration} onChange={(evt) => setProperty(evt, "maxAcceleration")}/>
                        </div>
                        <div className="slider-control">
                            <label>Min Speed</label>
                            <input type="range" min="0" max="20" className="slider" value={props.bunch.minSpeed} onChange={(evt) => setProperty(evt, "minSpeed")}/>
                        </div>
                        <div className="slider-control">
                            <label>Direction Radius</label>
                            <input type="range" min="0" max="300" className="slider" value={props.bunch.directRadius} onChange={(evt) => setProperty(evt, "directRadius")}/>
                        </div>
                        <div className="slider-control">
                            <label>Attraction Radius</label>
                            <input type="range" min="0" max="300" className="slider" value={props.bunch.attractRadius} onChange={(evt) => setProperty(evt, "attractRadius")}/>
                        </div>
                        <div className="slider-control">
                            <label>Repulsion Radius</label>
                            <input type="range" min="0" max="300" className="slider" value={props.bunch.repelRadius} onChange={(evt) => setProperty(evt, "repelRadius")}/>
                        </div>
                        <div className="slider-control">
                            <label>Direction Angle</label>
                            <input type="range" min="0" max="3.15" step="0.01" className="slider" value={props.bunch.directAngle} onChange={(evt) => setProperty(evt, "directAngle")}/>
                        </div>
                        <div className="slider-control">
                            <label>Attraction Angle</label>
                            <input type="range" min="0" max="3.15" step="0.01" className="slider" value={props.bunch.attractAngle} onChange={(evt) => setProperty(evt, "attractAngle")}/>
                        </div>
                        <div className="slider-control">
                            <label>Repulsion Angle</label>
                            <input type="range" min="0" max="3.15" step="0.01" className="slider" value={props.bunch.repelAngle} onChange={(evt) => setProperty(evt, "repelAngle")}/>
                        </div>
                        <div className="slider-control">
                            <label>Direction Scale</label>
                            <input type="range" min="0" max="5" step="0.1" className="slider" value={props.bunch.directScale} onChange={(evt) => setProperty(evt, "directScale")}/>
                        </div>
                        <div className="slider-control">
                            <label>Attraction Scale</label>
                            <input type="range" min="0" max="5" step="0.1" className="slider" value={props.bunch.attractScale} onChange={(evt) => setProperty(evt, "attractScale")}/>
                        </div>
                        <div className="slider-control">
                            <label>Repulsion Like Scale</label>
                            <input type="range" min="0" max="5" step="0.1" className="slider" value={props.bunch.repelLikeScale} onChange={(evt) => setProperty(evt, "repelLikeScale")}/>
                        </div>
                        <div className="slider-control">
                            <label>Repulsion Other Scale</label>
                            <input type="range" min="0" max="5" step="0.1" className="slider" value={props.bunch.repelOtherScale} onChange={(evt) => setProperty(evt, "repelOtherScale")}/>
                        </div>
                        <div className="slider-control">
                            <label>Repulsion Obstacle Scale</label>
                            <input type="range" min="0" max="5" step="0.1" className="slider" value={props.bunch.repelObstacleScale} onChange={(evt) => setProperty(evt, "repelObstacleScale")}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BunchController;