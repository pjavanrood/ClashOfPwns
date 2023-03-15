
socket.emit('join', localStorage.getItem('roomId'));


socket.on('assigned-color', (color) => {
    //localStorage.setItem('color', color);
    playerColor = color;
    document.getElementById('result').append(document.createTextNode(color));
});


document.getElementById('send').addEventListener('click', snedMessage);


socket.on('message', (msg) => {
    console.log("RECEIVED: " + msg);
    let ulElement = document.getElementById('resultList');
    let elem = document.createElement('li');
    elem.textContent = '-->' + msg;
    ulElement.append(elem);
})

function snedMessage() {
    let text = document.getElementById('message').value;

    socket.emit('message', text);

    let ulElement = document.getElementById('resultList');
    let elem = document.createElement('li');
    elem.textContent = text;
    ulElement.append(elem);
}




