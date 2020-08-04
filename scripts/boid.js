class Boid {
    constructor(boidType, position, velocity, acceleration) {
        this.boidType = boidType || BoidTypes.Red;
        this.position = position || new Vector2(20, 20);
        this.velocity = velocity || new Vector2(10, 5);
        this.acceleration = acceleration || new Vector2(0, 0);
        this.prevVelocity = new Vector2();
    }

    update = (deltaTime, flock, ctx) => {
        //Calculate acceleration
        var acceleration = new Vector2();
        var dragForce = calculateDragForce(this.velocity);

        var allProximityBoids = this.getAllProximityBoids(flock, Math.max(this.boidType.directRadius, this.boidType.attractRadius, this.boidType.repelRadius));

        if (direct) {
            this.directBoids = this.getProximityBoids(allProximityBoids, this.boidType.directRadius);
            var directionForce = this.calculateDirectionForce(deltaTime, this.directBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(directionForce);
        } else {
            acceleration = this.calculateDirectionForce(deltaTime, [], ctx.canvas.width, ctx.canvas.height);
        }

        if (attract) {
            this.attractBoids = this.getProximityBoids(allProximityBoids, this.boidType.attractRadius);
            var attractionForce = this.calculateAttractionForce(deltaTime, this.attractBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(attractionForce);
        }

        if (repel) {
            this.repelBoids = this.getAllProximityBoids(allProximityBoids, this.boidType.repelRadius);
            var repelForce = this.calculateRepelForce(deltaTime, this.repelBoids, ctx.canvas.width, ctx.canvas.height);
            acceleration.combine(repelForce);
        }

        acceleration.limitMagnitude(this.boidType.maxAcceleration);

        this.acceleration = acceleration.combine(dragForce);
        this.prevVelocity = this.velocity;
    }

    lateUpdate = (deltaTime, ctx) => {
        //Update velocity, position
        this.calculateVelocity(deltaTime);
        this.calculatePosition(deltaTime, ctx.canvas.width, ctx.canvas.height);
    }

    draw = (ctx) => {
        //Draw Proximity
        if (drawProximity) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(100,100,100,0.2)";
            var direction = Math.atan2(this.velocity.y, this.velocity.x);
            var startAngle = direction + this.boidType.proximityAngle;
            var endAngle = direction - this.boidType.proximityAngle;
            ctx.arc(this.position.x, this.position.y, this.boidType.directRadius, startAngle, endAngle, true);
            ctx.fill();
            ctx.closePath();
        }

        //Draw Acceleration Line
        if (drawAcceleration) {
            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 5;
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + this.acceleration.x * pixelsPerMeter, this.position.y + this.acceleration.y * pixelsPerMeter);
            ctx.stroke();
            ctx.closePath();
        }

        //Draw Velocity Line
        if (drawVelocity) {
            ctx.beginPath();
            ctx.strokeStyle = "#88FF88";
            ctx.lineWidth = 2;
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.position.x + this.velocity.x * pixelsPerMeter, this.position.y + this.velocity.y * pixelsPerMeter);
            ctx.stroke();
            ctx.closePath();
        }

        if (drawAttraction)
            this.drawAttraction(ctx);

        if (drawRepel)
            this.drawRepel(ctx);

        if (drawDirection)
            this.drawDirection(ctx);
    }

    lateDraw = (ctx) => {
        //Update self to canvas
        ctx.beginPath();
        ctx.fillStyle = this.boidType.color;
        ctx.arc(this.position.x, this.position.y, this.boidType.size, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        if (this.position.x < this.boidType.size
            || this.position.y < this.boidType.size
            || ctx.canvas.width - this.position.x < this.boidType.size
            || ctx.canvas.height - this.position.y < this.boidType.size) {
            var compliments = this.getComplimentPositions(ctx);
            for (var i = 0; i < compliments.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = this.boidType.color;
                ctx.arc(compliments[i].x, compliments[i].y, this.boidType.size, 0, 2 * Math.PI, true);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    drawAttraction(ctx) {
        for (var i = 0; i < this.attractBoids.length; i++) {
            var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
            grd.addColorStop(0, 'rgb(0,255,0)');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            var thisComplimentPositions = this.getComplimentPositions(ctx);
            var otherComplimentPositions = this.attractBoids[i].getComplimentPositions(ctx);
            var squareDistance = this.position.getSquareDistance(this.attractBoids[i].position);
            var squareDistance0 = this.position.getSquareDistance(otherComplimentPositions[0]);
            var squareDistance1 = this.position.getSquareDistance(otherComplimentPositions[1]);
            var squareDistance2 = this.position.getSquareDistance(otherComplimentPositions[2]);
            var minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(0,255,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,255,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    drawRepel(ctx) {
        for (var i = 0; i < this.repelBoids.length; i++) {
            var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
            grd.addColorStop(0, 'rgb(255,0,0)');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            var thisComplimentPositions = this.getComplimentPositions(ctx);
            var otherComplimentPositions = this.repelBoids[i].getComplimentPositions(ctx);
            var squareDistance = this.position.getSquareDistance(this.repelBoids[i].position);
            var squareDistance0 = this.position.getSquareDistance(otherComplimentPositions[0]);
            var squareDistance1 = this.position.getSquareDistance(otherComplimentPositions[1]);
            var squareDistance2 = this.position.getSquareDistance(otherComplimentPositions[2]);
            var minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.lineTo(this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.lineTo(this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(255,0,0)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.lineTo(this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    drawDirection(ctx) {
        for (var i = 0; i < this.directBoids.length; i++) {
            var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
            grd.addColorStop(0, 'rgb(0,0,255)');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            var thisComplimentPositions = this.getComplimentPositions(ctx);
            var otherComplimentPositions = this.directBoids[i].getComplimentPositions(ctx);
            var squareDistance = this.position.getSquareDistance(this.directBoids[i].position);
            var squareDistance0 = this.position.getSquareDistance(otherComplimentPositions[0]);
            var squareDistance1 = this.position.getSquareDistance(otherComplimentPositions[1]);
            var squareDistance2 = this.position.getSquareDistance(otherComplimentPositions[2]);
            var minSquareDistance = Math.min(squareDistance,
                                            squareDistance0,
                                            squareDistance1,
                                            squareDistance2)
            if (minSquareDistance === squareDistance) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd.addColorStop(0, 'rgb(0,0,255)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance0) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                grd.addColorStop(0, 'rgb(0,0,255)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[0].x, otherComplimentPositions[0].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[0].x, thisComplimentPositions[0].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,0,255)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[0].x, thisComplimentPositions[0].y);
                ctx.lineTo(this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance1) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                grd.addColorStop(0, 'rgb(0,0,255)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[1].x, otherComplimentPositions[1].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[1].x, thisComplimentPositions[1].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,0,255)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[1].x, thisComplimentPositions[1].y);
                ctx.lineTo(this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else if (minSquareDistance === squareDistance2) {
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                grd.addColorStop(0, 'rgb(0,0,255)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherComplimentPositions[2].x, otherComplimentPositions[2].y);
                ctx.stroke();
                ctx.closePath();
                
                var grd2 = ctx.createLinearGradient(thisComplimentPositions[2].x, thisComplimentPositions[2].y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd2.addColorStop(0, 'rgb(0,0,255)');
                grd2.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.strokeStyle = grd2;
                ctx.lineWidth = 3;
                ctx.moveTo(thisComplimentPositions[2].x, thisComplimentPositions[2].y);
                ctx.lineTo(this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    getProximityBoids = (flock, radius) => {
        var proximityBoids = [];
        var myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI

        flock.forEach(boid => {
            //Need to figure out edges.
            if (boid.boidType !== this.boidType || boid === this)
                return;

            var xDiff = Infinity;
            var xDiff1 = boid.position.x - this.position.x;
            var xDiff2 = boid.position.x - this.position.x - width;
            var xDiff3 = boid.position.x - this.position.x + width;
            var xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            var yDiff = Infinity;
            var yDiff1 = boid.position.y - this.position.y;
            var yDiff2 = boid.position.y - this.position.y - height;
            var yDiff3 = boid.position.y - this.position.y + height;
            var yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            var displacement = new Vector2(xDiff, yDiff);
            var angle = Math.atan2(yDiff, xDiff) + Math.PI; //0 to 2PI
            var leftAngle = (angle + 2 * Math.PI - myAngle) % (2 * Math.PI);
            var rightAngle = (myAngle + 2 * Math.PI - angle) % (2 * Math.PI);
            if (displacement.squareMagnitude <= radius*radius
                && (leftAngle <= this.boidType.proximityAngle
                    || rightAngle <= this.boidType.proximityAngle))
                proximityBoids.push(boid);
        });

        return proximityBoids;
    }

    getAllProximityBoids = (flock, radius) => {
        var proximityBoids = [];
        var myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI

        flock.forEach(boid => {
            //Need to figure out edges.
            if (boid === this)
                return;

            var xDiff = Infinity;
            var xDiff1 = boid.position.x - this.position.x;
            var xDiff2 = boid.position.x - this.position.x - width;
            var xDiff3 = boid.position.x - this.position.x + width;
            var xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            var yDiff = Infinity;
            var yDiff1 = boid.position.y - this.position.y;
            var yDiff2 = boid.position.y - this.position.y - height;
            var yDiff3 = boid.position.y - this.position.y + height;
            var yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            var displacement = new Vector2(xDiff, yDiff);
            var angle = Math.atan2(yDiff, xDiff) + Math.PI; //0 to 2PI
            var leftAngle = (angle + 2 * Math.PI - myAngle) % (2 * Math.PI);
            var rightAngle = (myAngle + 2 * Math.PI - angle) % (2 * Math.PI);
            if (displacement.squareMagnitude <= radius*radius
                && (leftAngle <= this.boidType.proximityAngle
                    || rightAngle <= this.boidType.proximityAngle))
                proximityBoids.push(boid);
        });


        return proximityBoids;
    }

    calculateAttractionForce = (deltaTime, flock, width, height) => {
        if (flock.length === 0)
            return new Vector2();

        var averagePosition = new Vector2();
        flock.forEach(boid => {
            //Need to figure out edges.
            var xDiff = Infinity;
            var xDiff1 = this.position.x - boid.position.x;
            var xDiff2 = this.position.x - boid.position.x - width;
            var xDiff3 = this.position.x - boid.position.x + width;
            var xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            var yDiff = Infinity;
            var yDiff1 = this.position.y - boid.position.y;
            var yDiff2 = this.position.y - boid.position.y - height;
            var yDiff3 = this.position.y - boid.position.y + height;
            var yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }

            averagePosition.x += xDiff;
            averagePosition.y += yDiff;
        });
        averagePosition.mult(-1/flock.length);
        var d = averagePosition.magnitude;
        var r = this.boidType.attractRadius;
        var attractForce = averagePosition.normalize().mult(10/(-d+1+r)).mult(10);
        
        return attractForce;
    }

    calculateRepelForce = (deltaTime, flock, width, height) => {
        if (flock.length === 0)
            return new Vector2();

        var repelForce = new Vector2();
        flock.forEach(boid => {
            //Need to figure out edges.
            var xDiff = Infinity;
            var xDiff1 = this.position.x - boid.position.x;
            var xDiff2 = this.position.x - boid.position.x - width;
            var xDiff3 = this.position.x - boid.position.x + width;
            var xDiffMin = Math.min(Math.abs(xDiff1), Math.abs(xDiff2), Math.abs(xDiff3));
            if (xDiffMin === Math.abs(xDiff3)) {
                xDiff = xDiff3;
            } else if (xDiffMin === Math.abs(xDiff2)) {
                xDiff = xDiff2;
            } else {
                xDiff = xDiff1;
            }

            var yDiff = Infinity;
            var yDiff1 = this.position.y - boid.position.y;
            var yDiff2 = this.position.y - boid.position.y - height;
            var yDiff3 = this.position.y - boid.position.y + height;
            var yDiffMin = Math.min(Math.abs(yDiff1), Math.abs(yDiff2), Math.abs(yDiff3));
            if (yDiffMin === Math.abs(yDiff3)) {
                yDiff = yDiff3;
            } else if (yDiffMin === Math.abs(yDiff2)) {
                yDiff = yDiff2;
            } else {
                yDiff = yDiff1;
            }
            
            var currentRepelForce = new Vector2(xDiff, yDiff);
            var d = currentRepelForce.magnitude;
            currentRepelForce = currentRepelForce.normalize().mult(10/(d + 1)).mult(10);
            if (boid.boidType === this.boidType)
                currentRepelForce.mult(10);
            else
                currentRepelForce.mult(20);
            repelForce.combine(currentRepelForce);
        });

        return repelForce;
    }

    calculateDirectionForce = (deltaTime, flock) => {
        var averageVelocity = new Vector2();
        if (flock.length > 0) {
            flock.forEach(boid => {
                averageVelocity.combine(boid.velocity);
            });
            averageVelocity.mult(1/flock.length);
        }
        if (averageVelocity.squareMagnitude === 0) {
            if (this.velocity.squareMagnitude === 0)
                averageVelocity = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
            else
                averageVelocity = this.velocity.copy();
        }

        return averageVelocity.normalize().mult(this.boidType.baseAcceleration);
    }

    calculateVelocity(deltaTime) {
        this.velocity = this.prevVelocity.copy().combine(this.acceleration.copy().mult(deltaTime / 1000));
        this.velocity.limitMagnitude(100);
    }

    calculatePosition(deltaTime, width, height) {
        var displacement = new Vector2();
        displacement.x = (this.velocity.x + this.prevVelocity.x) * deltaTime / 2000 * pixelsPerMeter;
        displacement.y = (this.velocity.y + this.prevVelocity.y) * deltaTime / 2000 * pixelsPerMeter;
        displacement.mult(2);
        this.position = this.position.combine(displacement);
        if (this.position.x < 0 || this.position.x > width)
            this.position.x = (this.position.x % width + width) % width;
        if (this.position.y < 0 || this.position.y > height)
            this.position.y = (this.position.y % height + height) % height;
    }

    getComplimentPositions(ctx) {
        var complimentX = this.position.x + ctx.canvas.width;
        var complimentY = this.position.y + ctx.canvas.height;
        if (this.position.y > ctx.canvas.height / 2) {
            complimentY = this.position.y - ctx.canvas.height;
        }
        if (this.position.x > ctx.canvas.width / 2) {
            complimentX = this.position.x - ctx.canvas.width;
        }
        return [
            new Vector2(this.position.x, complimentY),
            new Vector2(complimentX, this.position.y),
            new Vector2(complimentX, complimentY)
        ];
    }
}

function getCompliment(boid, ctx, radius) {
    var complimentX = boid.position.x;
    var complimentY = boid.position.y;
    radius = radius || boid.boidType.size;
    if (boid.position.y < radius) {
        complimentY = ctx.canvas.height + boid.position.y;
    } else if (boid.position.y > ctx.canvas.height - radius) {
        complimentY = boid.position.y - ctx.canvas.height;
    }
    if (boid.position.x < radius) {
        complimentX = ctx.canvas.width + boid.position.x;
    } else if (boid.position.x > ctx.canvas.width - radius) {
        complimentX = boid.position.x - ctx.canvas.width;
    }
    return new Vector2(complimentX, complimentY);
}