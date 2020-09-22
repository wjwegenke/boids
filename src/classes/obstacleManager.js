import Vector2 from './vector2';
import Obstacle from './obstacle';

class ObstacleManager {
    constructor() {
        this.dimensions = { height: 0, width: 0 };

        this.obstacles = [];
        this.color = 'grey';
        this.highlightColor = 'cyan';
        this.size = 8;
    }

    get count() {
        return this.obstacles.length;
    }
    set count(value) {
        while (this.count < value) {
            let position = new Vector2(Math.random() * this.dimensions.width, Math.random() * this.dimensions.height);
            const obstacle = new Obstacle(position);
            this.addObstacle(obstacle);
        }
        while (this.count > value) {
            this.obstacles.pop();
        }
    }

    addObstacle = (obstacle) => {
        obstacle.obstacleManager = this;
        this.obstacles.push(obstacle);
    }

    removeObstacle = (obstacle) => {
        this.obstacles = this.obstacles.filter(obs => obs != obstacle);
    }
}

export default ObstacleManager;