import Vector2 from './vector2';

export const pixelsPerMeter = 5;

export function calculateDragMagnitude(squareSpeed) {
    var k = 0.1; //0.0028125
    var dragMagnitude = k * squareSpeed
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