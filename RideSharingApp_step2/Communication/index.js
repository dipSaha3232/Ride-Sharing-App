const express = require('express');
const http = require('http')
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app);

app.use(express.json())

app.listen(3002, ()=>{
    console.log("Communication service listening on port 3002")
});

const io = socketIo(server);

server.listen(5000, ()=>{
    console.log("Communication socket listening on port 5000");
})

let rider_driver=null;

let s = null;

io.of('communication').on('connection',(socket)=>{
    s=socket
    console.log("User connected")
})

app.post('/pairMatching', async(req,res)=>{
    rider_driver = req.body;
    s.emit('hello', [rider_driver.driver_name, rider_driver.rider_name, rider_driver.fare])
})