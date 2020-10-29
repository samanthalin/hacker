// see https://nextparticle.nextco.de for more informations

var nextParticle = new NextParticle(document.all.logo);
// nextParticle.particleGap = 1;
// nextParticle.gravity = 0.08;
// nextParticle.noise = 10;
// nextParticle.mouseForce = 60;
// nextParticle.size = Math.max(window.innerWidth, window.innerHeight);
// nextParticle.colorize = false;
// nextParticle.tint = '#FF00FF';
// nextParticle.minWidth = nextParticle.size;
// nextParticle.minHeight = nextParticle.size/2;
// nextParticle.maxWidth = nextParticle.size;
// nextParticle.maxHeight = nextParticle.size/2;

// var redraw = function() {
//   nextParticle.initPosition = "none";
//   nextParticle.initDirection = "none";
//   nextParticle.fadePostion = "none";
//   nextParticle.fadeDirection = "none";
//   nextParticle.minWidth = nextParticle.size;
//   nextParticle.minHeight = nextParticle.size;
//   nextParticle.maxWidth = nextParticle.size;
//   nextParticle.maxHeight = nextParticle.size;
//   nextParticle.color = nextParticle.colorize ? nextParticle.tint : '';
//   nextParticle.start();
// };
$(document).ready(function(){
  $('canvas:last-child').addClass('logo');
});

var ctx = document.getElementById('c').getContext('2d');
var view = {width: window.innerWidth, height: window.innerHeight};
ctx.canvas.width = view.width; ctx.canvas.height = view.height;

var keys = (new Array(127)).fill(0);
document.onkeydown = (e) => {keys[e.keyCode] = 1; console.log(e.keyCode)}; document.onkeyup = (e) => {keys[e.keyCode] = 0};

var world = {width: view.width * 2, height: view.height * 2};

var Camera = function(position, zoom) {
  this.position = position;
  this.speed = 3;
  this.acceleration = {x: 0, y: 0, z: 0};
  this.zoom = zoom;
}

var Joint = function(position, vector) {
  this.position = position;
  this.vector = vector;
  this.speed = 0.5;
  this.w = 2;
  this.h = 2;
  this.bone_length = 150;
  this.neighbors = [];
}

var joints_generator = (numb) => {
  var arr = new Array(numb).fill(0);
  arr.forEach((v, i, a) => {
    a[i] = new Joint(
      {
        x: Math.random() * world.width,
        y: Math.random() * world.height
      },
      {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1
      }
    )
  });
  return arr;
}

var joints_move = (arr) => {
  arr.forEach((v, i, a) => {
    v.position.x += v.vector.x * v.speed;
    v.position.y += v.vector.y * v.speed;
    if (v.position.x < 0) v.position.x = world.width;
    if (v.position.x > world.width) v.position.x = 0;
    if (v.position.y < 0) v.position.y = world.height;
    if (v.position.y > world.height) v.position.y = 0;
  });
}

var joints_draw = (arr, cam) => {
  var len = arr.length;
  for (var i = 0; i < len; i ++) {
    for (var j = i + 1; j < len; j += 3) {
      var length = Math.hypot(arr[j].position.x - arr[i].position.x, arr[j].position.y - arr[i].position.y);
      if (length <= arr[i].bone_length) {
        ctx.beginPath();
        ctx.lineWidth = cam.zoom * (30 / length);
        ctx.moveTo(
          view.width / 2 + (arr[i].position.x - cam.position.x) * cam.zoom, 
          view.height / 2 + (arr[i].position.y - cam.position.y) * cam.zoom
        );
        ctx.lineTo(
          view.width / 2 + (arr[j].position.x - cam.position.x) * cam.zoom, 
          view.height / 2 + (arr[j].position.y - cam.position.y) * cam.zoom
        );
        ctx.stroke();
        ctx.closePath();
      }
    }
    ctx.fillRect(
      view.width / 2 + ((arr[i].position.x - cam.position.x) - arr[i].w / 2) * cam.zoom, 
      view.height / 2 + ((arr[i].position.y - cam.position.y) - arr[i].w / 2) * cam.zoom, 
      arr[i].w * cam.zoom, arr[i].h * cam.zoom
    );
  }
  /*for (var t = (new Date()).getTime(), i = 0; i < 400; i ++) {
    for (var j = i + 1; j < 400; j += 1) {
    }
  }; console.log((new Date()).getTime()-t)*/
}

var camera_move = (cam) => {
  cam.position.x += cam.acceleration.x;
  cam.position.y += cam.acceleration.y;
  cam.zoom += cam.acceleration.z;
  if (keys[37]) {
    cam.acceleration.x -= cam.speed;
  }
  if (keys[38]) {
    cam.acceleration.y -= cam.speed;
  }
  if (keys[39]) {
    cam.acceleration.x += cam.speed;
  }
  if (keys[40]) {
    cam.acceleration.y += cam.speed;
  }
  if (keys[188]) {
    cam.acceleration.z += 0.003;
  }
  if (keys[190]) {
    cam.acceleration.z -= 0.003;
  }
  cam.acceleration.x = cam.acceleration.x * 0.96;
  cam.acceleration.y = cam.acceleration.y * 0.96;
  cam.acceleration.z = cam.acceleration.z * 0.90;
}

var joints = joints_generator(400);
var camera = new Camera({x: world.width / 2, y: world.height / 2}, 1);

ctx.fillStyle = ctx.strokeStyle = '#ffffff';
var LOOP = () => {
  ctx.clearRect(0, 0, view.width, view.height);
  
  // тут какая-то динамика
  camera_move(camera);
  joints_move(joints);
  joints_draw(joints, camera);

  //setTimeout(LOOP, 0);
  requestAnimationFrame(LOOP);
}
LOOP();
// window.onresize(function() {
//   nextParticle.width = window.innerWidth;
//   nextParticle.height = window.innerHeight;
//   redraw();
// });

// $(document).ready(function(){
//   $('canvas').click(function(){
//     redraw();
//   });
//   $(window).resize(function() {
//     nextParticle.width = window.innerWidth;
//     nextParticle.height = window.innerHeight;
//     redraw();
//   });
// });