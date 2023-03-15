const express = require('express');
const path = require('path')
const port = 8080;
const app = express();
const session = require('express-session')

const socketPort = 8080;
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
app.use('*/public', express.static(path.resolve(__dirname, '../public')));
app.use('*/img', express.static(path.resolve(__dirname, '../public/chessboardjs/img')));


module.exports.app = app;
module.exports.io = io;


server.listen(socketPort, () => {
    console.log('listening on Port ' + socketPort);
});


const authRouter = require('./routes/Authentication');
app.use('/', authRouter);

const socketRouter = require('./routes/Sockets.js');
app.use('/', socketRouter);

