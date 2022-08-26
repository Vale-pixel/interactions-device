let socket = io("http://localhost:5050", { path: "/real-time" });
let canvas;
let controllerX,
  controllerY = 0;

  let motion = false;
  let ios = false;

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    document.body.addEventListener('click', function() {
      DeviceMotionEvent.requestPermission()
        .then(function() {
          console.log('DeviceMotionEvent enabled');
  
          motion = true;
          ios = true;
        })
        .catch(function(error) {
          console.warn('DeviceMotionEvent not enabled', error);
        })
    })
  } else {
    // we are not on ios13 and above
    // todo
    // add detection for hardware for other devices
    // if(got the hardware) {
    // motion = true;
    // }
  } 

function setup() {
  frameRate(60);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("z-index", "-1");
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("right", "0");
  controllerX = windowWidth / 2;
  controllerY = windowHeight / 2;
  background(0);
}

function draw() {
  background(0, 5);
  newCursor(pmouseX, pmouseY);
  fill(255);
  ellipse(controllerX, controllerY, 50, 50);

   // we can use rotationZ, rotationX and rotationY
  // they should be used in this order (apparently - see docs)
  // even though default mode is radians the Z rotation returns degrees unless converted

  // the below code ensures a smooth transition from 0-180 and back
  let zMotion = 0;
  // x and y values moved from the centre point
  let yMotion = round(height / 2 + rotationX * 10)
  let xMotion = round(width / 2 + rotationY * 10)

  // motion affected circle
  circle(xMotion+5, yMotion-700, 50)
  // reference circle
  stroke(255)
  strokeWeight(3)
  noFill()
  circle(width / 2, height / 2, width / 1.2)

  // text to provide instructions and
  // document values at the top of the screen
  noStroke()
  textSize(width / 35)
  textFont("'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace")

  fill(255, 100, 50)
  text("click to start on iOS", 10, 80)
  text("on a mobile: twist, and tilt your device", 10, 120)

}

function mouseDragged() {
  console.log({ pmouseX, pmouseY });
  socket.emit("positions", { controlX: pmouseX, controlY: pmouseY });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
  noStroke();
  fill(255);
  ellipse(x, y, 10, 10);
}
socket.on("display-positions", (message) => {
  let { controlX, controlY } = message;
  controllerX = controlX;
  controllerY = controlY;
  console.log("server data", message);
});
