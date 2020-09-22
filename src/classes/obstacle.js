import Vector2 from './vector2';
import * as physics from './physics';

class Obstacle {
    constructor(position) {
        this.position = position || new Vector2();
        this.color = 'grey';
        this.highlightColor = 'cyan';
        this.size = 8;
        this.isSelected = false;
    }

    update(ctx) {
        //Just ensure that it stays on the canvas.
        if (this.position.x < 0 || this.position.x > ctx.canvas.width)
            this.position.x = (this.position.x % ctx.canvas.width + ctx.canvas.width) % ctx.canvas.width;
        if (this.position.y < 0 || this.position.y > ctx.canvas.height)
            this.position.y = (this.position.y % ctx.canvas.height + ctx.canvas.height) % ctx.canvas.height;
    }

    draw(ctx) {
        //Update self to canvas
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, true);
        ctx.fill();
        if (this.isSelected) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.highlightColor;
            ctx.stroke();
        }
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        if (this.position.x < this.size
            || this.position.y < this.size
            || ctx.canvas.width - this.position.x < this.size
            || ctx.canvas.height - this.position.y < this.size) {
            const compliments = physics.getComplimentPositions(this.position, ctx);
            for (let i = 0; i < compliments.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(compliments[i].x, compliments[i].y, this.size, 0, 2 * Math.PI, true);
                ctx.fill();
                if (this.isSelected) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.highlightColor;
                    ctx.stroke();
                }
                ctx.closePath();
            }
        }
    }
}

export default Obstacle;