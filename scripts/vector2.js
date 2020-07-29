class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    copy = () => {
        return new Vector2(this.x, this.y);
    }

    magnitude = () => {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    normalize = () => {
        var mag = this.magnitude();
        if (mag === 0)
            return new Vector2(1,0);
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

    limitMagnitudeMin = (minMagnitude) => {
        var mag = this.magnitude();
        if (mag < minMagnitude) {
            var scale = minMagnitude / mag;
            this.mult(scale);
        }
        return this;
    }

    setMagnitude = (magnitude) => {
        var scale = magnitude / this.magnitude();
        this.mult(scale);
        return this;
    }

    equals = (vector2) => {
        return this.x === vector2.x && this.y === vector2.y;
    }

    isClose = (vector2, threshold) => {
        return this.isDirectionClose(vector2, threshold) && this.isMagnitudeClose(vector2, threshold);
    }

    isDirectionClose = (vector2, threshold) => {
        threshold = threshold || 0.1;
        var thisNormal = this.normalize();
        var thatNormal = vector2.normalize();
        return (thisNormal.x < thatNormal.x + threshold && thisNormal.x > thatNormal.x - threshold
            && thisNormal.y < thatNormal.y + threshold && thisNormal.y > thatNormal.y - threshold);
    }

    isMagnitudeClose = (vector2, threshold) => {
        threshold = threshold || 0.1;
        var thisMag = this.magnitude();
        var thatMag = vector2.magnitude();
        return (thisMag < thatMag + threshold && thisMag > thatMag - threshold);
    }
}

Vector2.prototype ["+"] = function (operand) {
    return new Vector2(this.x + operand.x, this.y + operand.y);
}