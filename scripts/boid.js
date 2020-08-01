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
        var radius = this.boidType.size;

        //Draw Proximity
        if (drawProximity) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(100,100,100,0.2)";
            var direction = Math.atan2(this.velocity.y, this.velocity.x);
            var startAngle = direction + this.boidType.proximityAngle;
            var endAngle = direction - this.boidType.proximityAngle;
            ctx.arc(this.position.x, this.position.y, this.boidType.proximityRadius, startAngle, endAngle, true);
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

        for (var i = 0; i < this.attractBoids.length; i++) {
            var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.attractBoids[i].position.x, this.attractBoids[i].position.y);
            grd.addColorStop(0, 'rgb(0,255,0)');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            if (getDistance(this.position, this.attractBoids[i].position) <= this.boidType.attractRadius) {
                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            } else {
                var thisCompliment = getCompliment(this, ctx, this.boidType.attractRadius);
                var otherCompliment = getCompliment(this.attractBoids[i], ctx, this.boidType.attractRadius);
                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(otherCompliment.x, otherCompliment.y);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = 3;
                ctx.moveTo(thisCompliment.x, thisCompliment.y);
                ctx.lineTo(this.attractBoids[i].position.x, this.attractBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        for (var i = 0; i < this.repelBoids.length; i++) {
            if (getDistance(this.position, this.repelBoids[i].position) <= this.boidType.repelRadius) {
                ctx.beginPath();
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                grd.addColorStop(0, 'rgb(255,0,0)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.strokeStyle = grd;
                ctx.lineWidth = 2;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.repelBoids[i].position.x, this.repelBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        for (var i = 0; i < this.directBoids.length; i++) {
            if (getDistance(this.position, this.directBoids[i].position) <= this.boidType.directBoids) {
                ctx.beginPath();
                var grd = ctx.createLinearGradient(this.position.x, this.position.y, this.directBoids[i].position.x, this.directBoids[i].position.y);
                grd.addColorStop(0, 'rbg(0,0,255)');
                grd.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.strokeStyle = grd;
                ctx.lineWidth = 2;
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(this.directBoids[i].position.x, this.directBoids[i].position.y);
                ctx.stroke();
                ctx.closePath();
            }
        }


        //Update self to canvas
        ctx.beginPath();
        ctx.fillStyle = this.boidType.color;
        ctx.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        var compliment = getCompliment(this, ctx);

        if (!this.position.equals(compliment)) {
            ctx.beginPath();
            ctx.fillStyle = this.boidType.color;
            ctx.arc(compliment.x, compliment.y, radius, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }
    }

    getProximityBoids = (flock, radius) => {
        var proximityBoids = [];
        radius = radius || this.boidType.proximityRadius;
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
            if (displacement.magnitude() <= radius 
                && (leftAngle <= this.boidType.proximityAngle
                    || rightAngle <= this.boidType.proximityAngle))
                proximityBoids.push(boid);
        });

        return proximityBoids;
    }

    getAllProximityBoids = (flock, radius) => {
        var proximityBoids = [];
        var myAngle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI; //0 to 2PI
        radius = radius || this.boidType.proximityRadius;

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
            if (displacement.magnitude() <= radius 
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
        var d = averagePosition.magnitude();
        var r = this.boidType.proximityRadius;
        var attractForce = averagePosition.normalize().mult(-10/(d+1+r)).mult(10);
        
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
            var d = currentRepelForce.magnitude();
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
        if (averageVelocity.magnitude() === 0) {
            if (this.velocity.magnitude() === 0)
                averageVelocity = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
            else
                averageVelocity = this.velocity.copy();
        }

        return averageVelocity.normalize().mult(this.boidType.baseAcceleration);
    }

    calculateVelocity(deltaTime) {
        this.velocity = this.prevVelocity.copy().combine(this.acceleration.copy().mult(deltaTime / 1000));
        this.velocity.limitMagnitude(30);
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