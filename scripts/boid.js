class Boid {
    constructor(boidType, position, velocity, acceleration, baseAcceleration, maxAcceleration, maxSpeed) {
        this.position = position || new Vector2(20, 20);
        this.velocity = velocity || new Vector2(10, 5);
        this.acceleration = acceleration || new Vector2(0, 0);
        this.baseAcceleration = baseAcceleration || new Vector2(10, 10);
        this.boidType = boidType || BoidTypes.Red;
        this.maxAcceleration = maxAcceleration || 30;
        this.maxSpeed = maxSpeed || 15;
        this.minAcceleration = calculateDragMagnitude(maxSpeed);
        this.prevVelocity = new Vector2();
    }

    update = (deltaTime, flock) => {
        //Calculate acceleration
        var dragForce = calculateDragForce(this.velocity);

        var proximityBoids = this.getProximityBoids(flock);

        var attractionForce = this.calculateAttractionForce(deltaTime, proximityBoids);
        var repelForce = this.calculateRepelForce(deltaTime, proximityBoids);
        var directionForce = this.calculateDirectionForce(deltaTime, proximityBoids);
        var acceleration = directionForce.combine(repelForce)
                                    .combine(attractionForce);
        // acceleration.limitMagnitude(this.maxAcceleration);
        // acceleration.limitMagnitudeMin(this.maxAcceleration);
        acceleration.setMagnitude(this.maxAcceleration);

        //acceleration = new Vector2(this.baseAcceleration.x, this.baseAcceleration.y);
        this.acceleration = acceleration.combine(dragForce);
        this.prevVelocity = this.velocity;
    }

    lateUpdate = (deltaTime, ctx) => {
        //Update velocity, position
        this.calculateVelocity(deltaTime);
        this.calculatePosition(deltaTime, ctx.canvas.width, ctx.canvas.height);
    }

    draw = (ctx) => {
        var radius = 10;
        //Update self to canvas
        ctx.beginPath();
        ctx.fillStyle = this.boidType.color;
        ctx.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        var complimentX = this.position.x;
        var complimentY = this.position.y;
        if (this.position.y < radius) {
            complimentY = ctx.canvas.height + this.position.y;
        } else if (this.position.y > ctx.canvas.height - radius) {
            complimentY = this.position.y - ctx.canvas.height;
        }
        if (this.position.x < radius) {
            complimentX = ctx.canvas.width + this.position.x;
        } else if (this.position.x > ctx.canvas.width - radius) {
            complimentX = this.position.x - ctx.canvas.width;
        }

        if (complimentX != this.position.x || complimentY != this.position.y) {
            ctx.beginPath();
            ctx.fillStyle = this.boidType.color;
            ctx.arc(complimentX, complimentY, radius, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }
    }

    getProximityBoids = (flock) => {
        var proximityBoids = [];
        var radius = 50;
        for (let i = 0; i < flock.length; i++) {
            if (flock[i].boidType !== this.boidType)
                continue;

            var distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y, 2));
            
            var complimentX = this.position.x;
            var complimentY = this.position.y;
            if (this.position.y < radius) {
                complimentY = ctx.canvas.height + this.position.y;
            } else if (this.position.y > ctx.canvas.height - radius) {
                complimentY = this.position.y - ctx.canvas.height;
            }
            if (this.position.x < radius) {
                complimentX = ctx.canvas.width + this.position.x;
            } else if (this.position.x > ctx.canvas.width - radius) {
                complimentX = this.position.x - ctx.canvas.width;
            }

            if (complimentX != this.position.x || complimentY != this.position.y) {
                distance = Math.min(distance, 
                    distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y, 2)));
            }

            if (distance < radius) {
                proximityBoids.push(flock[i]);
            }
        }

        return proximityBoids;
    }

    getAllProximityBoids = (flock) => {
        var proximityBoids = [];
        var radius = 100;
        for (let i = 0; i < flock.length; i++) {
            var distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y, 2));
            
            var complimentX = this.position.x;
            var complimentY = this.position.y;
            if (this.position.y < radius) {
                complimentY = ctx.canvas.height + this.position.y;
            } else if (this.position.y > ctx.canvas.height - radius) {
                complimentY = this.position.y - ctx.canvas.height;
            }
            if (this.position.x < radius) {
                complimentX = ctx.canvas.width + this.position.x;
            } else if (this.position.x > ctx.canvas.width - radius) {
                complimentX = this.position.x - ctx.canvas.width;
            }

            if (complimentX != this.position.x || complimentY != this.position.y) {
                distance = Math.min(distance, 
                    distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y, 2)));
            }

            if (distance < radius) {
                proximityBoids.push(flock[i]);
            }
        }

        return proximityBoids;
    }

    calculateDragForce = (velocity) => {
        var force = new Vector2();
        var k = 0.45 * 0.025 * 0.25 / 2; //0.0028125 used to be //0.0000181;
        velocity = velocity || this.velocity;
        var speed = velocity.magnitude();
        var dragMagnitude = k * speed * speed
        force.x = velocity.x;
        force.y = velocity.y;
        force = force.normalize();
        force.mult(-1);
        force.mult(dragMagnitude);
        return force;
    }
    calculateAttractionForce = (deltaTime, flock) => {
        if (flock.length === 0)
            return new Vector2();

        var force = new Vector2();
        return force;
    }
    calculateRepelForce = (deltaTime, flock) => {
        if (flock.length === 0)
            return new Vector2();

        var averagePosition = new Vector2();
        flock.forEach(boid => {
            //Need to figure out edges.
            averagePosition.combine(boid.position);
        });

        var force = new Vector2();
        return force;
    }
    calculateDirectionForce = (deltaTime, flock) => {            
        var averageVelocity = new Vector2();
        var averageAcceleration = new Vector2();
        if (flock.length > 0) {
            flock.forEach(boid => {
                averageVelocity.combine(boid.velocity);
                averageAcceleration.combine(boid.acceleration);
            });
            averageVelocity.mult(1/flock.length);
            averageAcceleration.mult(1/flock.length);
        } else {
            if (this.velocity.magnitude > 0)
                averageVelocity = this.velocity.normalize().mult(this.maxSpeed);
            else
                averageVelocity = this.baseAcceleration.normalize().mult(this.maxSpeed);
        }

        var myVelocity = this.velocity.copy();
        var diffVelocity = averageVelocity.copy().combine(myVelocity.mult(-1));

        // if (averageVelocity.isClose(this.velocity, 0.2))
        //     return this.calculateAccelerationToMaintainVelocity(averageVelocity);
        // else if (averageVelocity.isDirectionClose(this.velocity)
        //          && averageVelocity.magnitude() < this.velocity.magnitude)
        //     return this.calculateAccelerationToMaintainVelocity(averageVelocity);

        if (diffVelocity.magnitude() < 0.2)
            return calculateAccelerationToMaintainVelocity(averageVelocity);
        
        return diffVelocity.normalize().mult(this.maxAcceleration);
    }

    calculateVelocity(deltaTime) {
        this.velocity = this.prevVelocity.combine(this.acceleration.copy().mult(deltaTime / 1000));
        this.velocity.limitMagnitude(this.maxSpeed);
        //this.velocity.setMagnitude(this.maxSpeed);
    }

    calculatePosition(deltaTime, width, height) {
        var pixelsPerMeter = 5;
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

function calculateDragMagnitude(speed) {
    var force = new Vector2();
    var k = 0.45 * 0.025 * 0.25 / 2; //0.0028125 used to be //0.0000181;
    var speed = velocity.magnitude();
    var dragMagnitude = k * speed * speed
    return dragMagnitude;
}

function calculateDragForce(velocity) {
    var force = new Vector2();
    var k = 0.45 * 0.025 * 0.25 / 2; //0.0028125 used to be //0.0000181;
    velocity = velocity;
    var speed = velocity.magnitude();
    var dragMagnitude = k * speed * speed
    force.x = velocity.x;
    force.y = velocity.y;
    force = force.normalize();
    force.mult(-1);
    force.mult(dragMagnitude);
    return force;
}

function calculateAccelerationToMaintainVelocity(velocity) {
    var force = calculateDragForce(velocity);
    force.mult(-1);
    return force;
}