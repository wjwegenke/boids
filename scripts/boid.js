class Boid {
    constructor(position, velocity, acceleration) {
        this.position = position || [0, 0];
        this.velocity = velocity || [1,0];
        this.acceleration = acceleration || [0,0];
    }

    update = (progress, flock) => {
        //Calculate acceleration etc.
    }

    draw(canvas) {
        //Update self to canvas
    }
}