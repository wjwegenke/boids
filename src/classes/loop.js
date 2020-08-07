var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width
var height
var pixelsPerMeter = 5;
var drawAcceleration = false;
var drawVelocity = false;
var drawProximity = true;
var drawDirectRadius = true;
var drawAttractRadius = true;
var drawRepelRadius = true;
var drawAttraction = true;
var drawRepel = true;
var drawDirection = true;
var direct = true;
var attract = true;
var repel = true;
var showStats = true;
var drawOnAll = false;

var directTime = 0;
var attractTime = 0;
var repelTime = 0;
var updateTime = 0;
var drawTime = 0;

var resize = function() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
}
window.onresize = resize;
resize();

function loop(timestamp) {
    var deltaTime = (timestamp - lastRender);

    directTime = 0;
    attractTime = 0;
    repelTime = 0;
    updateTime = 0;
    drawTime = 0;

    var updateStartTime = Date.now();
    bunches.forEach(bunch => bunch.update(deltaTime, ctx));
    bunches.forEach(bunch => bunch.lateUpdate(deltaTime, ctx));
    updateTime = Date.now() - updateStartTime;
  
    var drawStartTime = Date.now();
    ctx.clearRect(0, 0, width, height)
    bunches.forEach(bunch => bunch.draw(ctx));
    bunches.forEach(bunch => bunch.lateDraw(ctx));
    drawTime = Date.now() - drawStartTime;
  
    if (showStats) {
        document.getElementById('statDeltaTime').innerHTML = Math.round(deltaTime);
        document.getElementById('statFPS').innerHTML = Math.round(1000 / deltaTime);
        document.getElementById('statDirectionTime').innerHTML = directTime;
        document.getElementById('statAttracitonTime').innerHTML = attractTime;
        document.getElementById('statRepelTime').innerHTML = repelTime;
        document.getElementById('statUpdateTime').innerHTML = updateTime;
        document.getElementById('statDrawTime').innerHTML = drawTime;
    }

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0
window.requestAnimationFrame(loop);

var bunches = [new Bunch(), new Bunch(), new Bunch()];
//Add some boids
for (var i = 0; i < 33; i++) {
    var min = 100;
    var scale = 100;
    var accelerationScale = 10;
    var position = new Vector2();
    position.x = Math.random() * width;
    position.y = Math.random() * height;
    var acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
    var velocity = acceleration.normalize().mult(15);
    var boidTypes = [BoidTypes.Red, BoidTypes.Pink, BoidTypes.Cyan];
    var boidType = boidTypes[Math.round(Math.random() * 3)];
    //var boidType = Math.round(Math.random()) ? BoidTypes.Red : BoidTypes.Cyan;
    var boid = new Boid(position, velocity, acceleration);
    bunches[0].addBoid(boid);
}
//Add some boids
for (var i = 0; i < 33; i++) {
    bunches[1].color = 'cyan';
    bunches[1].size = 6;
    bunches[1].baseAcceleration = 18;
    bunches[1].maxAcceleration = 22;
    bunches[1].directRadius = 150;
    bunches[1].repelRadius = 150;
    bunches[1].attractRadius = 150;
    bunches[1].proximityAngle = 2 * Math.PI / 3;
    var min = 100;
    var scale = 100;
    var accelerationScale = 10;
    var position = new Vector2();
    position.x = Math.random() * width;
    position.y = Math.random() * height;
    var acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
    var velocity = acceleration.normalize().mult(15);
    var boidTypes = [BoidTypes.Red, BoidTypes.Pink, BoidTypes.Cyan];
    var boidType = boidTypes[Math.round(Math.random() * 3)];
    var boid = new Boid(position, velocity, acceleration);
    bunches[1].addBoid(boid);
}
//Add some boids
for (var i = 0; i < 33; i++) {
    bunches[2].color = 'pink';
    bunches[2].size = 8;
    bunches[2].baseAcceleration = 25;
    bunches[2].maxAcceleration = 30;
    bunches[2].directRadius = 250;
    bunches[2].repelRadius = 150;
    bunches[2].attractRadius = 200;
    bunches[2].proximityAngle = 2 * Math.PI / 3;
    var min = 100;
    var scale = 100;
    var accelerationScale = 10;
    var position = new Vector2();
    position.x = Math.random() * width;
    position.y = Math.random() * height;
    var acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
    var velocity = acceleration.normalize().mult(15);
    var boidTypes = [BoidTypes.Red, BoidTypes.Pink, BoidTypes.Cyan];
    var boidType = boidTypes[Math.round(Math.random() * 3)];
    //var boidType = Math.round(Math.random()) ? BoidTypes.Red : BoidTypes.Cyan;
    var boid = new Boid(position, velocity, acceleration);
    bunches[2].addBoid(boid);
}
