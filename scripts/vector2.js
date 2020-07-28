class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    magnitude = () => {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    normalize = () => {
        var mag = this.magnitude();
        return new Vector2(this.x / mag, this.y / mag);
    }

    mult = (scale) => {
        this.x = this.x * scale;
        this.y = this.y * scale;
        return this;
    }

    combine = (vector2) => {
        this.x = this.x + vector2.x;
        this.y = this.y + vector2.y;
        return this;
    }

    limitMagnitude = (maxMagnitude) => {
        var mag = this.magnitude();
        if (mag > maxMagnitude) {
            var scale = maxMagnitude / mag;
            this.mult(scale);
        }
        return this;
    }
}

Vector2.prototype ["+"] = function (operand) {
    return new Vector2(this.x + operand.x, this.y + operand.y);
}