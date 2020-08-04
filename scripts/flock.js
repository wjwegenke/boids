class Flock {
    constructor() {
        this.flock = [];
    }

    addBoid = (boid) => {
        this.flock.push(boid);
    }

    addNewBoid = (boidType, position, velocity, acceleration) => {
        let boid = new Boid(boidType, position, velocity, acceleration);
        this.flock.push(boid);
    }

    update = (deltaTime, ctx) => {
        for(let i = 0; i < this.flock.length; i++) {
            this.flock[i].update(deltaTime, this.flock, ctx);
        }    
    }

    lateUpdate = (deltaTime, ctx) => {
        for(let i = 0; i < this.flock.length; i++) {
            this.flock[i].lateUpdate(deltaTime, ctx);
        }    
    }

    draw = (ctx) => {
        for(let i = 0; i < this.flock.length; i++) {
            this.flock[i].draw(ctx);
        }    
    }

    lateDraw = (ctx) => {
        for(let i = 0; i < this.flock.length; i++) {
            this.flock[i].lateDraw(ctx);
        }    
    }
}