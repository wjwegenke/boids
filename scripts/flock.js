class Flock {
    constructor() {
        this.boids = [];
        this.color = 'red',
        this.size = 4,
        this.baseAcceleration = 15,
        this.maxAcceleration = 20,
        this.directRadius = 100,
        this.repelRadius = 60,
        this.attractRadius = 150,
        this.proximityAngle = 2 * Math.PI / 3
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

    update = (deltaTime, ctx) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].update(deltaTime, ctx);
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