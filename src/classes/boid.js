import Vector2 from './vector2';
import * as physics from './physics';
import * as geometry from './geometry';

class Boid {
    constructor(position, velocity, acceleration) {
        this.position = position || new Vector2(20, 20);
        this.velocity = velocity || new Vector2(10, 5);
        this.acceleration = acceleration || new Vector2(0, 0);
        this.prevVelocity = new Vector2();
    }

    update = (deltaTime, ctx, bunches, obstacles) => {
        //Calculate acceleration
        let acceleration = new Vector2();
        //const dragForce = physics.calculateDragForce(this.velocity);

        //const allProximityBoids = this.getAllProximityBoids(bunches, Math.max(this.bunch.directRadius, this.bunch.attractRadius, this.bunch.repelRadius), ctx);

        if (this.bunch.direct) {
            this.directBoids = this.getBunchMates(this.bunch.directRadius, this.bunch.directAngle, ctx);
            const directionForce = this.calculateDirectionForce(deltaTime, this.directBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(directionForce);
        } else {
            acceleration = this.calculateDirectionForce(deltaTime, [], ctx.canvas.width, ctx.canvas.height);
        }

        if (this.bunch.attract) {
            this.attractBoids = this.getBunchMates(this.bunch.attractRadius, this.bunch.attractAngle, ctx);
            const attractionForce = this.calculateAttractionForce(deltaTime, this.attractBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(attractionForce);
        }

        if (this.bunch.repel) {
            this.repelBoids = this.getAllProximityBoids(bunches, this.bunch.repelRadius, this.bunch.repelAngle, ctx);
            const repelObstacles = this.getProximityObstacles(obstacles, this.bunch.repelRadius, this.bunch.repelAngle, ctx);
            this.repelBoids = this.repelBoids.concat(repelObstacles);
            const repelForce = this.calculateRepelForce(deltaTime, this.repelBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(repelForce);
        }

        acceleration.limitMagnitude(this.bunch.maxAcceleration);

        //this.acceleration = acceleration.combine(dragForce);
        this.acceleration = acceleration;
        this.prevVelocity = this.velocity;
    }

    lateUpdate = (deltaTime, ctx) => {
        //Update velocity, position
        this.calculateVelocity(deltaTime);
        this.calculatePosition(deltaTime, ctx.canvas.width, ctx.canvas.height);
    }

    draw = (ctx) => {
        if (this.bunch.drawOnAll || this === this.bunch.boids[0]) {
            ctx.lineWidth = 1;
            if (this.bunch.drawDirectRadius) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(100,100,100,0.2)";
                ctx.strokeStyle = "rgba(0,80,255,0.7)";
                const direction = Math.atan2(this.velocity.y, this.velocity.x);
                const startAngle = direction + this.bunch.directAngle;
                const endAngle = direction - this.bunch.directAngle;
                if (this.bunch.directAngle < Math.PI) {
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(Math.cos(startAngle) + this.position.x, Math.sin(startAngle) + this.position.y);
                }
                ctx.arc(this.position.x, this.position.y, this.bunch.directRadius, startAngle, endAngle, true);
                if (this.bunch.directAngle < Math.PI)
                    ctx.lineTo(this.position.x, this.position.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
                thisComplimentPositions.forEach(position => {
                    ctx.beginPath();
                    if (this.bunch.directAngle < Math.PI) {
                        ctx.moveTo(position.x, position.y);
                        ctx.lineTo(Math.cos(startAngle) + position.x, Math.sin(startAngle) + position.y);
                    }
                    ctx.arc(position.x, position.y, this.bunch.directRadius, startAngle, endAngle, true);
                    if (this.bunch.directAngle < Math.PI)
                        ctx.lineTo(position.x, position.y);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                });
            }

            if (this.bunch.drawAttractRadius) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(100,100,100,0.2)";
                ctx.strokeStyle = "rgba(0,255,0,0.7)";
                const direction = Math.atan2(this.velocity.y, this.velocity.x);
                const startAngle = direction + this.bunch.attractAngle;
                const endAngle = direction - this.bunch.attractAngle;
                if (this.bunch.attractAngle < Math.PI) {
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(Math.cos(startAngle) + this.position.x, Math.sin(startAngle) + this.position.y);
                }
                ctx.arc(this.position.x, this.position.y, this.bunch.attractRadius, startAngle, endAngle, true);
                if (this.bunch.attractAngle < Math.PI)
                    ctx.lineTo(this.position.x, this.position.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
                thisComplimentPositions.forEach(position => {
                    ctx.beginPath();
                    if (this.bunch.attractAngle < Math.PI) {
                        ctx.moveTo(position.x, position.y);
                        ctx.lineTo(Math.cos(startAngle) + position.x, Math.sin(startAngle) + position.y);
                    }
                    ctx.arc(position.x, position.y, this.bunch.attractRadius, startAngle, endAngle, true);
                    if (this.bunch.attractAngle < Math.PI)
                        ctx.lineTo(position.x, position.y);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                });
            }

            if (this.bunch.drawRepelRadius) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(100,100,100,0.2)";
                ctx.strokeStyle = "rgba(255,0,0,0.7)";
                const direction = Math.atan2(this.velocity.y, this.velocity.x);
                const startAngle = direction + this.bunch.repelAngle;
                const endAngle = direction - this.bunch.repelAngle;
                if (this.bunch.repelAngle < Math.PI) {
                    ctx.moveTo(this.position.x, this.position.y);
                    ctx.lineTo(Math.cos(startAngle) + this.position.x, Math.sin(startAngle) + this.position.y);
                }
                ctx.arc(this.position.x, this.position.y, this.bunch.repelRadius, startAngle, endAngle, true);
                if (this.bunch.repelAngle < Math.PI)
                    ctx.lineTo(this.position.x, this.position.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
                thisComplimentPositions.forEach(position => {
                    ctx.beginPath();
                    if (this.bunch.repelAngle < Math.PI) {
                        ctx.moveTo(position.x, position.y);
                        ctx.lineTo(Math.cos(startAngle) + position.x, Math.sin(startAngle) + position.y);
                    }
                    ctx.arc(position.x, position.y, this.bunch.repelRadius, startAngle, endAngle, true);
                    if (this.bunch.repelAngle < Math.PI)
                        ctx.lineTo(position.x, position.y);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                });
            }

            //Draw Acceleration Line
            if (this.bunch.drawAcceleration) {
                ctx.beginPath();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.acceleration.x * physics.pixelsPerMeter / 2, this.position.y + this.acceleration.y * physics.pixelsPerMeter / 2);
                ctx.stroke();
                ctx.closePath();
            }

            //Draw Velocity Line
            if (this.bunch.drawVelocity) {
                ctx.beginPath();
                ctx.strokeStyle = "#88FF88";
                ctx.lineWidth = 2;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.position.x + this.velocity.x * physics.pixelsPerMeter / 2, this.position.y + this.velocity.y * physics.pixelsPerMeter / 2);
                ctx.stroke();
                ctx.closePath();
            }

            if (this.bunch.drawRepel)
                this.drawRepel(ctx);

            if (this.bunch.drawAttraction)
                this.drawAttraction(ctx);

            if (this.bunch.drawDirection)
                this.drawDirection(ctx);
        }
    }

    lateDraw = (ctx) => {
        //Update self to canvas
        ctx.beginPath();
        ctx.fillStyle = this.bunch.color;
        ctx.arc(this.position.x, this.position.y, this.bunch.size, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        if (this.position.x < this.bunch.size
            || this.position.y < this.bunch.size
            || ctx.canvas.width - this.position.x < this.bunch.size
            || ctx.canvas.height - this.position.y < this.bunch.size) {
            const compliments = geometry.getComplimentPositions(this.position, ctx);
            for (let i = 0; i < compliments.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = this.bunch.color;
                ctx.arc(compliments[i].x, compliments[i].y, this.bunch.size, 0, 2 * Math.PI, true);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    drawAttraction(ctx) {
        const d = 15;
        for (let i = 0; i < this.attractBoids.length; i++) {
            const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
            const otherComplimentPositions = geometry.getComplimentPositions(this.attractBoids[i].position, ctx);
            const squareDistance = geometry.getSquareDistance(this.position, this.attractBoids[i].position);
            const squareDistance0 = geometry.getSquareDistance(this.position, otherComplimentPositions[0]);
            const squareDistance1 = geometry.getSquareDistance(this.position, otherComplimentPositions[1]);
            const squareDistance2 = geometry.getSquareDistance(this.position, otherComplimentPositions[2]);
            const minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                const offset = geometry.getMidpointOffsetPosition(this.position, this.attractBoids[i].position, d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[0], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], this.attractBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[1], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], this.attractBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[2], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[2], this.attractBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], otherComplimentPositions[1], d);
                const grd3 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd3.addColorStop(0, 'rgb(0,255,0)');
                grd3.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd3;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], otherComplimentPositions[0], d);
                const grd4 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd4.addColorStop(0, 'rgb(0,255,0)');
                grd4.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd4;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[0], thisComplimentPositions[1], d);
                const grd5 = ctx.createLinearGradient(otherComplimentPositions[0].x, otherComplimentPositions[0].y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                grd5.addColorStop(0, 'rgb(0,255,0)');
                grd5.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd5;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[1], thisComplimentPositions[0], d);
                const grd6 = ctx.createLinearGradient(otherComplimentPositions[1].x, otherComplimentPositions[1].y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                grd6.addColorStop(0, 'rgb(0,255,0)');
                grd6.addColorStop(1, 'rgba(0,255,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd6;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    drawRepel(ctx) {
        const d = 5;
        for (let i = 0; i < this.repelBoids.length; i++) {
            const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
            const otherComplimentPositions = geometry.getComplimentPositions(this.repelBoids[i].position, ctx);
            const squareDistance = geometry.getSquareDistance(this.position, this.repelBoids[i].position);
            const squareDistance0 = geometry.getSquareDistance(this.position, otherComplimentPositions[0]);
            const squareDistance1 = geometry.getSquareDistance(this.position, otherComplimentPositions[1]);
            const squareDistance2 = geometry.getSquareDistance(this.position, otherComplimentPositions[2]);
            const minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                const offset = geometry.getMidpointOffsetPosition(this.position, this.repelBoids[i].position, d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[0], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], this.repelBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[1], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], this.repelBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[2], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[2], this.repelBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], otherComplimentPositions[1], d);
                const grd3 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd3.addColorStop(0, 'rgb(255,0,0)');
                grd3.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd3;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], otherComplimentPositions[0], d);
                const grd4 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd4.addColorStop(0, 'rgb(255,0,0)');
                grd4.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd4;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[0], thisComplimentPositions[1], d);
                const grd5 = ctx.createLinearGradient(otherComplimentPositions[0].x, otherComplimentPositions[0].y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                grd5.addColorStop(0, 'rgb(255,0,0)');
                grd5.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd5;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[1], thisComplimentPositions[0], d);
                const grd6 = ctx.createLinearGradient(otherComplimentPositions[1].x, otherComplimentPositions[1].y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                grd6.addColorStop(0, 'rgb(255,0,0)');
                grd6.addColorStop(1, 'rgba(255,0,0,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd6;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    drawDirection(ctx) {
        const d = 25;
        for (let i = 0; i < this.directBoids.length; i++) {
            const thisComplimentPositions = geometry.getComplimentPositions(this.position, ctx);
            const otherComplimentPositions = geometry.getComplimentPositions(this.directBoids[i].position, ctx);
            const squareDistance = geometry.getSquareDistance(this.position, this.directBoids[i].position);
            const squareDistance0 = geometry.getSquareDistance(this.position, otherComplimentPositions[0]);
            const squareDistance1 = geometry.getSquareDistance(this.position, otherComplimentPositions[1]);
            const squareDistance2 = geometry.getSquareDistance(this.position, otherComplimentPositions[2]);
            const minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                const offset = geometry.getMidpointOffsetPosition(this.position, this.directBoids[i].position, d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd.addColorStop(0, 'rgb(0,80,255)');
                grd.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[0], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(0,80,255)');
                grd.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], this.directBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,80,255)');
                grd2.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[1], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(0,80,255)');
                grd.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], this.directBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,80,255)');
                grd2.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                let offset = geometry.getMidpointOffsetPosition(this.position, otherComplimentPositions[2], d);
                const grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(0,80,255)');
                grd.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[2], this.directBoids[i].position, d);
                const grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,80,255)');
                grd2.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.quadraticCurveTo(offset.x, offset.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[0], otherComplimentPositions[1], d);
                const grd3 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd3.addColorStop(0, 'rgb(0,80,255)');
                grd3.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd3;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(thisComplimentPositions[1], otherComplimentPositions[0], d);
                const grd4 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd4.addColorStop(0, 'rgb(0,80,255)');
                grd4.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd4;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[0], thisComplimentPositions[1], d);
                const grd5 = ctx.createLinearGradient(otherComplimentPositions[0].x, otherComplimentPositions[0].y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                grd5.addColorStop(0, 'rgb(0,80,255)');
                grd5.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd5;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                offset = geometry.getMidpointOffsetPosition(otherComplimentPositions[1], thisComplimentPositions[0], d);
                const grd6 = ctx.createLinearGradient(otherComplimentPositions[1].x, otherComplimentPositions[1].y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                grd6.addColorStop(0, 'rgb(0,80,255)');
                grd6.addColorStop(1, 'rgba(0,80,255,0.1)');

                ctx.beginPath();
                ctx.strokeStyle = grd6;
                ctx.lineWidth = 3;
                ctx.moveTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.quadraticCurveTo(offset.x, offset.y, thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    getBunchMates = (radius, angle, ctx) => {
        const proximityBoids = [];
        const myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI

        this.bunch.boids.forEach(boid => {
            //Need to figure out edges.
            if (boid === this)
                return;

            let xDiff = Infinity;
            const xDiff1 = boid.position.x - this.position.x;
            const xDiff2 = boid.position.x - this.position.x - ctx.canvas.width;
            const xDiff3 = boid.position.x - this.position.x + ctx.canvas.width;
            const xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            let yDiff = Infinity;
            const yDiff1 = boid.position.y - this.position.y;
            const yDiff2 = boid.position.y - this.position.y - ctx.canvas.height;
            const yDiff3 = boid.position.y - this.position.y + ctx.canvas.height;
            const yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            const displacement = new Vector2(xDiff, yDiff);
            const angleToTarget = Math.atan2(yDiff, xDiff) + Math.PI; //0 to 2PI
            const leftAngle = (angleToTarget + 2 * Math.PI - myAngle) % (2 * Math.PI);
            const rightAngle = (myAngle + 2 * Math.PI - angleToTarget) % (2 * Math.PI);
            if (displacement.squareMagnitude <= radius*radius
                && (leftAngle <= angle
                    || rightAngle <= angle))
                proximityBoids.push(boid);
        });

        return proximityBoids;
    }

    getAllProximityBoids = (bunches, radius, angle, ctx) => {
        const proximityBoids = [];
        const myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI

        bunches.forEach(bunch => {
            bunch.boids.forEach(boid => {
                //Need to figure out edges.
                if (boid === this)
                    return;

                let xDiff = Infinity;
                const xDiff1 = boid.position.x - this.position.x;
                const xDiff2 = boid.position.x - this.position.x - ctx.canvas.width;
                const xDiff3 = boid.position.x - this.position.x + ctx.canvas.width;
                const xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
                if (xDiffMin === Math.abs(xDiff3)) {
                    xDiff = xDiff3;
                } else if (xDiffMin === Math.abs(xDiff2)) {
                    xDiff = xDiff2;
                } else {
                    xDiff = xDiff1;
                }

                let yDiff = Infinity;
                const yDiff1 = boid.position.y - this.position.y;
                const yDiff2 = boid.position.y - this.position.y - ctx.canvas.height;
                const yDiff3 = boid.position.y - this.position.y + ctx.canvas.height;
                const yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
                if (yDiffMin === Math.abs(yDiff3)) {
                    yDiff = yDiff3;
                } else if (yDiffMin === Math.abs(yDiff2)) {
                    yDiff = yDiff2;
                } else {
                    yDiff = yDiff1;
                }

                const displacement = new Vector2(xDiff, yDiff);
                const angleToTarget = Math.atan2(yDiff, xDiff) + Math.PI; //0 to 2PI
                const leftAngle = (angleToTarget + 2 * Math.PI - myAngle) % (2 * Math.PI);
                const rightAngle = (myAngle + 2 * Math.PI - angleToTarget) % (2 * Math.PI);
                if (displacement.squareMagnitude <= radius*radius
                    && (leftAngle <= angle
                        || rightAngle <= angle))
                    proximityBoids.push(boid);
            });
        });

        return proximityBoids;
    }

    getProximityObstacles = (obstacles, radius, angle, ctx) => {
        const proximityObstacles = [];
        const myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI
        
        obstacles.forEach(obstacle => {
            let xDiff = Infinity;
            const xDiff1 = obstacle.position.x - this.position.x;
            const xDiff2 = obstacle.position.x - this.position.x - ctx.canvas.width;
            const xDiff3 = obstacle.position.x - this.position.x + ctx.canvas.width;
            const xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            let yDiff = Infinity;
            const yDiff1 = obstacle.position.y - this.position.y;
            const yDiff2 = obstacle.position.y - this.position.y - ctx.canvas.height;
            const yDiff3 = obstacle.position.y - this.position.y + ctx.canvas.height;
            const yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            const displacement = new Vector2(xDiff, yDiff);
            const angleToTarget = Math.atan2(yDiff, xDiff) + Math.PI; //0 to 2PI
            const leftAngle = (angleToTarget + 2 * Math.PI - myAngle) % (2 * Math.PI);
            const rightAngle = (myAngle + 2 * Math.PI - angleToTarget) % (2 * Math.PI);
            if (displacement.squareMagnitude <= radius*radius
                && (leftAngle <= angle
                    || rightAngle <= angle)) {
                proximityObstacles.push(obstacle);
            }
        });

        return proximityObstacles;
    }

    calculateAttractionForce = (deltaTime, boids, width, height) => {
        if (boids.length === 0)
            return new Vector2();

        //let averagePosition = new Vector2();
        const attractForce = new Vector2();
        boids.forEach(boid => {
            //Need to figure out edges.
            let xDiff = Infinity;
            const xDiff1 = this.position.x - boid.position.x;
            const xDiff2 = this.position.x - boid.position.x - width;
            const xDiff3 = this.position.x - boid.position.x + width;
            const xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            let yDiff = Infinity;
            const yDiff1 = this.position.y - boid.position.y;
            const yDiff2 = this.position.y - boid.position.y - height;
            const yDiff3 = this.position.y - boid.position.y + height;
            const yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            // averagePosition.x += xDiff;
            // averagePosition.y += yDiff;
            
            let currentAttractForce = new Vector2(xDiff, yDiff);
            const d = currentAttractForce.magnitude;
            const r = this.bunch.attractRadius;
            currentAttractForce = currentAttractForce.normalize().mult(-10/(-d+1+r)).mult(10).mult(this.bunch.attractScale);;
            attractForce.combine(currentAttractForce);
        });
        // averagePosition.mult(-1/boids.length);
        // let d = averagePosition.magnitude;
        // let r = this.bunch.attractRadius;
        // let attractForce = averagePosition.normalize().mult(10/(-d+1+r)).mult(10);
        
        return attractForce;
    }

    calculateRepelForce = (deltaTime, bunch, width, height) => {
        if (bunch.length === 0)
            return new Vector2();

        const repelForce = new Vector2();
        bunch.forEach(boid => {
            //Need to figure out edges.
            let xDiff = Infinity;
            const xDiff1 = this.position.x - boid.position.x;
            const xDiff2 = this.position.x - boid.position.x - width;
            const xDiff3 = this.position.x - boid.position.x + width;
            const xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            let yDiff = Infinity;
            const yDiff1 = this.position.y - boid.position.y;
            const yDiff2 = this.position.y - boid.position.y - height;
            const yDiff3 = this.position.y - boid.position.y + height;
            const yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }
            
            let currentRepelForce = new Vector2(xDiff, yDiff);
            const d = currentRepelForce.magnitude;

            currentRepelForce = currentRepelForce.normalize().mult(10/(d + 1)).mult(50);
            if (boid.bunch === this.bunch) {
                currentRepelForce.mult(this.bunch.repelLikeScale);
            } else if (boid.bunch !== undefined) {
                currentRepelForce.mult(this.bunch.repelOtherScale);
            } else {
                currentRepelForce.mult(this.bunch.repelObstacleScale);
            }

            repelForce.combine(currentRepelForce);
        });

        return repelForce;
    }

    calculateDirectionForce = (deltaTime, bunch) => {
        let averageVelocity = new Vector2();
        if (bunch.length > 0) {
            bunch.forEach(boid => {
                averageVelocity.combine(boid.velocity);
            });
            averageVelocity.mult(1/bunch.length);
        }
        if (averageVelocity.squareMagnitude === 0) {
            if (this.velocity.squareMagnitude === 0)
                averageVelocity = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
            else
                averageVelocity = this.velocity.copy();
        }

        return averageVelocity.normalize().mult(this.bunch.baseAcceleration).mult(this.bunch.directScale);
    }

    calculateVelocity(deltaTime) {
        //v(t) = (ma/k) - ((ma/k) - v(0))e^(-kt/m))
        //let m = k
        const dt = deltaTime / 1000;
        let a = this.acceleration.copy();//.mult(1 / physics.dragConstant);
        let b = a.copy().combine(this.prevVelocity.copy().mult(-1));
        let c = Math.pow(Math.E, -dt); //Math.pow(Math.E, -physics.dragConstant * dt);
        this.velocity = a.combine(b.mult(-c));

        //this.velocity = this.prevVelocity.copy().combine(this.acceleration.copy().mult(deltaTime / 1000));
        //this.velocity.limitMagnitude(physics.maxSpeed);
        this.velocity.limitMagnitudeMin(this.bunch.minSpeed);
    }

    calculatePosition(deltaTime, width, height) {
        //let displacement = new Vector2();
        //(ma/k)t + (((ma/k) - v(0))/k)e^(-kt/m))
        //let m = k
        const dt = deltaTime / 1000;
        let a = this.acceleration.copy(); //.mult(1 / physics.dragConstant);
        let b = a.copy().combine(this.prevVelocity.copy().mult(-1));
        let c = Math.pow(Math.E, -dt); //Math.pow(Math.E, -physics.dragConstant * dt);
        let d = a.mult(dt).combine(b.copy().mult(c)).combine(b.mult(-1));

        // displacement.x = (this.velocity.x + this.prevVelocity.x) * deltaTime / 1000 * physics.pixelsPerMeter;
        // displacement.y = (this.velocity.y + this.prevVelocity.y) * deltaTime / 1000 * physics.pixelsPerMeter;
        // displacement.mult(2);
        // this.position = this.position.combine(displacement);
        this.position = this.position.combine(d.mult(physics.pixelsPerMeter));
        if (this.position.x < 0 || this.position.x > width)
            this.position.x = (this.position.x % width + width) % width;
        if (this.position.y < 0 || this.position.y > height)
            this.position.y = (this.position.y % height + height) % height;
    }
}

export default Boid;