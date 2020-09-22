import Vector2 from './vector2';

export const pixelsPerMeter = 10;
export const maxSpeed = 100;
export const dragConstant = 0.1;

export function calculateDragMagnitude(squareSpeed) {
    var dragMagnitude = dragConstant * squareSpeed
    return dragMagnitude;
}

export function calculateDragForce(velocity) {
    var force = new Vector2();
    var squareSpeed = velocity.squareMagnitude;
    var dragMagnitude = calculateDragMagnitude(squareSpeed);
    force.x = velocity.x;
    force.y = velocity.y;
    force = force.normalize();
    force.mult(-1);
    force.mult(dragMagnitude);
    return force;
}

export function calculateAccelerationToMaintainVelocity(velocity) {
    var force = calculateDragForce(velocity);
    force.mult(-1);
    return force;
}

export function getDistance(vector2A, vector2B) {
    var x = vector2A.x - vector2B.x;
    var y = vector2A.y - vector2B.y;
    return Math.sqrt(x*x + y*y);
}

export function getSquareDistance(vector2A, vector2B) {
    var x = vector2A.x - vector2B.x;
    var y = vector2A.y - vector2B.y;
    return x*x + y*y;
}

export function getComplimentPositions(position, ctx) {
    let complimentX = position.x + ctx.canvas.width;
    let complimentY = position.y + ctx.canvas.height;
    if (position.y > ctx.canvas.height / 2) {
        complimentY = position.y - ctx.canvas.height;
    }
    if (position.x > ctx.canvas.width / 2) {
        complimentX = position.x - ctx.canvas.width;
    }
    return [
        new Vector2(position.x, complimentY),
        new Vector2(complimentX, position.y),
        new Vector2(complimentX, complimentY)
    ];
}