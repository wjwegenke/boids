import Vector2 from './vector2';
import * as physics from './physics';

class Obstacle {
    constructor(position) {
        this.position = position || new Vector2();
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
        ctx.fillStyle = this.obstacleManager.color;

        //Setup triangle points
        const A = new Vector2(0, -this.obstacleManager.size);
        const B = new Vector2(A.x * Math.cos(120 / 180 * Math.PI) - (A.y * Math.sin(120 / 180 * Math.PI)), A.x * Math.sin(120 / 180 * Math.PI) + (A.y * Math.cos(120 / 180 * Math.PI)));
        const C = new Vector2(A.x * Math.cos(240 / 180 * Math.PI) - (A.y * Math.sin(240 / 180 * Math.PI)), A.x * Math.sin(240 / 180 * Math.PI) + (A.y * Math.cos(240 / 180 * Math.PI)));
        A.combine(this.position);
        B.combine(this.position);
        C.combine(this.position);

        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.lineTo(A.x, A.y);
        //ctx.arc(this.position.x, this.position.y, this.obstacleManager.size, 0, 2 * Math.PI, true);
        ctx.fill();
        if (this.isSelected) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.obstacleManager.highlightColor;
            ctx.stroke();
        }
        ctx.closePath();

        //Draw on opposite side of screen if it overlaps
        if (this.position.x < this.obstacleManager.size
            || this.position.y < this.obstacleManager.size
            || ctx.canvas.width - this.position.x < this.obstacleManager.size
            || ctx.canvas.height - this.position.y < this.obstacleManager.size) {
            const compliments = physics.getComplimentPositions(this.position, ctx);
            for (let i = 0; i < compliments.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = this.obstacleManager.color;
                ctx.arc(compliments[i].x, compliments[i].y, this.obstacleManager.size, 0, 2 * Math.PI, true);
                ctx.fill();
                if (this.isSelected) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.obstacleManager.highlightColor;
                    ctx.stroke();
                }
                ctx.closePath();
            }
        }
    }
}

export default Obstacle;