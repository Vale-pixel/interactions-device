const express = require("express");
//nuestro sevidor
const { Server } = require("socket.io");
//ngrok y el puerto poner el mismo puerto
const PORT = 5050; // No cambiar
const SERVER_IP = "172.30.56.202"; // Cambiar por la IP del computador

//const os = require('os');
//const IPaddress = os.networkInterfaces().en0[1].address;

const app = express();
app.use(express.json());
app.use("/app", express.static("public-app"));
app.use("/mupi", express.static("public-mupi"));

//crear servidor http para arrancar con el puerto
const httpServer = app.listen(PORT, () => {
  console.log(`http://${SERVER_IP}:${PORT}/app`);
  console.log(`http://${SERVER_IP}:${PORT}/mupi`);
});
// Run on terminal: ngrok http 5050;

const io = new Server(httpServer, { path: "/real-time" });
//aqupi ponemos los eventos que necesitamos 
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("device-size", (deviceSize) => {
    socket.broadcast.emit("mupi-size", deviceSize);
  });

  socket.on("mobile-instructions", (instructions) => {
    console.log(instructions);
    socket.broadcast.emit("mupi-instructions", instructions);
  });
});
