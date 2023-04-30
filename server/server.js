const express = require('express');
const path = require('path')
const port = 8080;
const app = express();
const session = require('express-session')

const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
app.use('*/public', express.static(path.resolve(__dirname, '../public')));
app.use('*/img', express.static(path.resolve(__dirname, '../public/chessboardjs/img')));


module.exports.app = app;
module.exports.io = io;


server.listen(port, () => {
    console.log('listening on Port ' + port);
});


app.use(
    session({
        name: 'sid',
        saveUninitialized: false,
        resave: false,
        secret: 'ABCDEFG',
        cookie: {
            maxAge: 1000 * 60 * 60 * 2, //2hours
            sameSite: true
        }
    })
);

const authRouter = require('./routes/Authentication');
app.use('/', authRouter);

const socketRouter = require('./routes/Sockets.js');
app.use('/', socketRouter);

