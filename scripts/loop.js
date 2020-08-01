var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width
var height
var pixelsPerMeter = 5;
var drawAcceleration = false;
var drawVelocity = false;
var drawProximity = false;
var direct = true;
var attract = true;
var repel = true;

var resize = function() {
  width = window.innerWidth * 2
  height = window.innerHeight * 2
  canvas.width = width
  canvas.height = height
}
window.onresize = resize;
resize();

function loop(timestamp) {
  var deltaTime = (timestamp - lastRender);

  flock.update(deltaTime, ctx);
  flock.lateUpdate(deltaTime, ctx);
  ctx.clearRect(0, 0, width, height)
  flock.draw(ctx);
  
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
var lastRender = 0
window.requestAnimationFrame(loop);

var flock = new Flock();
//Add some boids
for (var i = 0; i < 100; i++) {
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
  var boid = new Boid(boidType, position, velocity, acceleration);
  flock.addBoid(boid);
}
