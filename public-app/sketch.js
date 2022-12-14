const NGROK = `https://${window.location.hostname}`;
console.log("Server IP: ", NGROK);
let socket = io(NGROK, { path: "/real-time" });

let controllerX,
  controllerY = 0;
let interactions = 0;
let isTouched = false;

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
  angleMode(DEGREES);

  socket.emit("device-size", { windowWidth, windowHeight });
// no se capturrar el movimiento sin device orientation
  let btn = createButton("Permitir movimiento");
  btn.mousePressed(function () {
    DeviceOrientationEvent.requestPermission();
  });
}

function draw() {
  background(0, 5);
  newCursor(pmouseX, pmouseY);
  fill(255);
  ellipse(controllerX, controllerY, 50, 50);
}

/*function mouseDragged() {
    socket.emit('positions', { controlX: pmouseX, controlY: pmouseY });
}*/
//si toco el dedo y lo arrastro
function touchMoved() {
  switch (interactions) {
    case 0:
        //a instructions mando interactions...
      socket.emit("mobile-instructions", { interactions, pmouseX, pmouseY });
      background(255, 0, 0);
      break;
  }
}

function touchStarted() {
  isTouched = true;
}

function touchEnded() {
  isTouched = false;
}
//si lo estuoy moviendo depnde de interacción, cambia el comportamiento
function deviceMoved() {
  switch (interactions) {
    case 1:
      socket.emit("mobile-instructions", {
        interactions,
        pAccelerationX,
        pAccelerationY,
        pAccelerationZ,
      });
      background(0, 255, 255);
      break;
    case 2:
      socket.emit("mobile-instructions", {
        interactions,
        rotationX,
        rotationY,
        rotationZ,
      });
      background(0, 255, 0);
      break;
      /*case 3:
        socket.emit("mobile-instructions", {
         if (isAbletoMove) {
           interactions,
           rotationX,
           rotationY,
           rotationZ,
         }
        });
        background(0, 255, 0);
        break;*/
    }
  }

//cada que el celu se agite, el método se activa
function deviceShaken() {
  //socket.emit('mobile-instructions', 'Moved!');
  //background(0, 255, 255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
  noStroke();
  fill(255);
  ellipse(x, y, 10, 10);
}
