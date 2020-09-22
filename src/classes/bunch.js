import Boid from './boid';
import Vector2 from './vector2';

class Bunch {
    constructor() {
        this.dimensions = { height: 0, width: 0 };

        this.boids = [];
        this.color = 'green';
        this.size = 4;
        this.baseAcceleration = 15;
        this.maxAcceleration = 20;
        this.minSpeed = 5;
        this.directRadius = 100;
        this.attractRadius = 100;
        this.repelRadius = 100;
        this.proximityAngle = 2 * Math.PI / 3;
        this.directAngle = 2 * Math.PI / 3;
        this.attractAngle = 2 * Math.PI / 3;
        this.repelAngle = 2 * Math.PI / 3;
        this.directScale = 1;
        this.attractScale = 1;
        this.repelLikeScale = 1;
        this.repelOtherScale = 2;
        this.repelObstacleScale = 3;

        this.direct = true;
        this.attract = true;
        this.repel = true;
        this.drawAcceleration = false;
        this.drawVelocity = false;
        this.drawDirectRadius = false;
        this.drawAttractRadius = false;
        this.drawRepelRadius = false;
        this.drawDirection = false;
        this.drawAttraction = false;
        this.drawRepel = false;
        this.drawOnAll = false;
    }

    get count() {
        return this.boids.length;
    }
    set count(value) {
        while (this.count < value) {
            let position = new Vector2(Math.random() * this.dimensions.width, Math.random() * this.dimensions.height);
            let velocity = new Vector2();
            let acceleration = new Vector2(Math.random(), Math.random());
            this.addNewBoid(position, velocity, acceleration);
        }
        while (this.count > value) {
            this.boids.pop();
        }
    }

    addBoid = (boid) => {
        boid.bunch = this;
        this.boids.push(boid);
    }

    addNewBoid = (position, velocity, acceleration) => {
        let boid = new Boid(position, velocity, acceleration);
        boid.bunch = this;
        this.boids.push(boid);
    }

    update = (deltaTime, ctx, bunches, obstacles) => {
        for(let i = 0; i < this.boids.length; i++) {
            this.boids[i].update(deltaTime, ctx, bunches, obstacles);
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

export default Bunch;