const express = require("express");
const app = express();

let firstclient;
let secondclient;
let offerclient;

const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

let clients = 0;

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
    socket.on("ready", () => {
        clients++;
        console.log("clients",clients)
        if (clients > 1){
            socket.broadcast.emit("join");
            secondclient = socket.id;
        } else {
            firstclient = socket.id;
        }
    });
    socket.on("offer", (id, message) => {
        console.log("offer received")
        offerclient = socket.id;
        socket.to(secondclient).emit("offer", socket.id, message);
    })
    socket.on("answer", (id, message) => {
        console.log("answer received")
        socket.to(offerclient).emit("answer", socket.id, message);
    })
    socket.on("disconnect", () => {
        clients--;
        console.log("clients",clients)
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));

