import Vector2 from './vector2';

export function getDistance(vector2A, vector2B) {
    return Math.sqrt(getSquareDistance(vector2A, vector2B));
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

export function getMidpointOffsetPosition(startPosition, endPosition, distance) {
    const midPoint = new Vector2((startPosition.x + endPosition.x) / 2, (startPosition.y + endPosition.y) / 2);
    const a = startPosition.y - midPoint.y;
    const b = startPosition.x - midPoint.x;
    const theta = Math.atan(Math.abs(b / a));
    const offset = new Vector2(midPoint.x + Math.cos(theta) * distance * (a < 0 ? -1 : 1), midPoint.y + Math.sin(theta) * distance * (b < 0 ? 1 : -1));
    return offset;
}