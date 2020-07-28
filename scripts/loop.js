var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width
var height

var resize = function() {
  width = window.innerWidth * 2
  height = window.innerHeight * 2
  canvas.width = width
  canvas.height = height
}
window.onresize = resize;
resize();

function update(progress) {
  state.x += progress
  if (state.x > width) {
    state.x -= width;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  //ctx.fillRect(state.x - 10, state.y - 10, 20, 20)
  ctx.beginPath();
  ctx.fillStyle = 'green';
  ctx.arc(state.x, state.y, 10, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(state.x, state.y + 20, 10, 0, 2*Math.PI, true);
  ctx.fill();
  ctx.closePath();
}

function loop(timestamp) {
  var deltaTime = (timestamp - lastRender);

  flock.update(deltaTime);
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
for (var i = 0; i < 1; i++) {
  var min = 100;
  var scale = 100;
  var accelerationScale = 10;
  var position = new Vector2();
  position.x = Math.random() * width;
  position.y = Math.random() * height;
  var velocity = new Vector2();
  // velocity.x = (Math.random() * 2 - 1) * scale;
  // if (velocity.x < 0)
  //   velocity.x -= min;
  // else
  //   velocity.x += min;
  // velocity.y = (Math.random() * 2 - 1) * scale;
  // if (velocity.y < 0)
  //   velocity.y -= min;
  // else
  //   velocity.y += min;
  var acceleration = new Vector2((Math.random() * 2 - 1) * accelerationScale, (Math.random() * 2 - 1) * accelerationScale);
  var boid = new Boid(BoidTypes.Red, position, velocity, acceleration);
  flock.addBoid(boid);
}
