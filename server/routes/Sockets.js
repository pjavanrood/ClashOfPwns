const express = require('express');
const serverExports = require('../server');
const io = serverExports.io;
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


router.get('/test', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/test.html'));
})

router.get('/breakout', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/breakoutRoom.html'));
})


router.get('/room/:key([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})', (req, res) => {
    let uuid = req.params.key;
    let result = checkRoomId(uuid);    
    
    if(!result.status) {
        res.status(400).send(uuid);
    } else {
        res.sendFile(path.resolve(__dirname, '../../public/mainGame.html'));
    }
})

router.get('/newRoom', (req, res) => {
    let newUuid = generateRoom();
    
    res.status(201).send({
        status: true,
        message: newUuid
    });

})


function generateRoom() {
    let newUuid = uuidv4();
    let rooms = io.sockets.adapter.rooms;
    
    while(true) {
        if(!rooms.has(newUuid))
            break;
        newUuid = uuidv4();
    }

    return newUuid;
}


function checkRoomId(uuid) {
    let rooms = io.sockets.adapter.rooms;
        
    let roomSockets = rooms.get(uuid);

    if(roomSockets === undefined)
        return {
            status: true,
            message: 'Room is available'
        };

    if(roomSockets.size >= 2)
        return {
            status: false,
            message: 'Room is occupied'
        };

    return {
        status: true,
        message: 'Room is available'
    };
}


const userColorMap = new Map();
//const roomChessMap = new Map();


io.on('connection', (socket) => {
    console.log("User Connected: " + socket.id)
    
    let roomNo;
    
    socket.on('join', (roomNumber) => {
        roomNo = roomNumber;

        let color = assignUserColor(roomNumber);

        socket.emit('assigned-color', color);
        
        userColorMap.set(socket.id, color);

        socket.join(roomNumber);
    });

    socket.on('message', (msg) => {
        socket.broadcast.to(roomNo).emit('message', msg);
        console.log('BROADCASTED to ' + roomNo);
    });

    socket.on('player-moved', (move) => {
        socket.broadcast.to(roomNo).emit('player-moved', move);
        console.log('Player MOVED to ' + move);
    });

    socket.on('disconnecting', () => {
        userColorMap.delete(socket.id);
    })

})


function assignUserColor(roomNumber) {
    const roomsMap = io.sockets.adapter.rooms;

    if(roomsMap.has(roomNumber)) {
        let otherPlayerId = (roomsMap.get(roomNumber)).values().next().value;

        let otherColor = userColorMap.get(otherPlayerId);

        if(otherColor === 'w') return 'b';
        
        else return 'w';

    } else
        return 'w';
}

module.exports = router;