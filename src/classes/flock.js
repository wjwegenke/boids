import Boid from './boid';

class Flock {
    constructor() {
        this.boids = [];
        this.color = 'red';
        this.size = 4;
        this.baseAcceleration = 15;
        this.maxAcceleration = 20;
        this.directRadius = 100;
        this.repelRadius = 140;
        this.attractRadius = 150;
        this.proximityAngle = 2 * Math.PI / 3;

        this.direct = true;
        this.attract = true;
        this.repel = true;
        this.drawAcceleration = true;
        this.drawVelocity = true;
        this.drawProximity = true;
        this.drawDirectRadius = true;
        this.drawAttractRadius = true;
        this.drawRepelRadius = true;
        this.drawDirection = true;
        this.drawAttraction = true;
        this.drawRepel = true;
        this.drawOnAll = false;
    }

    addBoid = (boid) => {
        boid.flock = this;
        this.boids.push(boid);
    }

    addNewBoid = (position, velocity, acceleration) => {
        let boid = new Boid(position, velocity, acceleration);
        boid.flock = this;
        this.boids.push(boid);
    }

    update = (deltaTime, ctx, flocks) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].update(deltaTime, ctx, flocks);
        }    
    }

    lateUpdate = (deltaTime, ctx) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].lateUpdate(deltaTime, ctx);
        }    
    }

    draw = (ctx) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].draw(ctx);
        }    
    }

    lateDraw = (ctx) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].lateDraw(ctx);
        }    
    }
}

export default Flock;