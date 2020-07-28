class Boid {
    constructor(boidType, position, velocity, acceleration) {
        this.position = position || new Vector2(20, 20);
        this.velocity = velocity || new Vector2(10, 5);
        this.acceleration = acceleration || new Vector2(0, 0);
        this.baseAcceleration = this.baseAcceleration || new Vector2(50, 50);
        this.boidType = boidType || BoidTypes.Red;
        this.prevVelocity = new Vector2();
        this.maxAcceleration = 5;
    }

    update = (deltaTime, flock) => {
        //Calculate acceleration
        var dragForce = this.calculateDragForce();

        var proximityBoids = this.getProximityBoids(flock);

        var attractionForce = this.calculateAttractionForce(deltaTime, proximityBoids);
        var repelForce = this.calculateRepelForce(deltaTime, proximityBoids);
        var directionForce = this.calculateDirectionForce(deltaTime, proximityBoids);
        var acceleration = directionForce.combine(repelForce)
                                    .combine(attractionForce);
        acceleration.limitMagnitude(this.maxAcceleration);
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
            var distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y));
            
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
                    distance = Math.sqrt(Math.pow(this.position.x - flock[i].position.x, 2) + Math.pow(this.position.y - flock[i].position.y)));
            }

            if (distance < radius) {
                proximityBoids.push(flock[i]);
            }
        }

        return proximityBoids;
    }

    calculateDragForce = () => {
        var force = new Vector2();
        var c = 0.0000181;
        var speed = this.velocity.magnitude();
        var dragMagnitude = c * speed * speed
        force.x = this.velocity.x;
        force.y = this.velocity.y;
        force.normalize();
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

        var force = new Vector2();
        return force;
    }
    calculateDirectionForce = (deltaTime, flock) => {
        if (flock.length === 0)
            return new Vector2(this.baseAcceleration.x, this.baseAcceleration.y);
            
        var averageVolocity = new Vector2();
        var averageAcceleration = new Vector2();
        flock.forEach(boid => {
            averageVolocity.combine(boid.velocity);
            averageAcceleration.combine(boid.acceleration);
        });
        averageVolocity.mult(1/flock.length);
        averageAcceleration.mult(1/flock.length);
        return averageAcceleration;
    }

    calculateVelocity(deltaTime) {
        this.velocity = this.prevVelocity.combine(this.acceleration.mult(deltaTime / 1000));
    }

    calculatePosition(deltaTime, width, height) {
        var displacement = new Vector2();
        displacement.x = (this.velocity.x + this.prevVelocity.x) * deltaTime / 2000 * 2;
        displacement.y = (this.velocity.y + this.prevVelocity.y) * deltaTime / 2000 * 2;
        displacement.mult(2);
        this.position = this.position.combine(displacement);
        if (this.position.x < 0 || this.position.x > width)
            this.position.x = (this.position.x % width + width) % width;
        if (this.position.y < 0 || this.position.y > height)
            this.position.y = (this.position.y % height + height) % height;
    }
}