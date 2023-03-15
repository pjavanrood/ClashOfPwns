const baseUrl = 'http://localhost:8080'

document.getElementById('createRoomBtn').addEventListener('click', createRoom);
document.getElementById('joinBtn').addEventListener('click', joinRoom);


async function createRoom(event) {
    let result = await fetch(
        baseUrl + '/newRoom',
        {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        }
    ).then((res) => res.json());

    document.getElementById('roomUrl').innerText = result.message;

    document.getElementById('result').appendChild(document.createTextNode(result.message));

    if(!result.status)
        return;

    let roomId = result.message;

    localStorage.setItem('roomId', roomId);

    window.location = '/room/' + roomId;
}


function joinRoom(event) {
    let roomId = document.getElementById('roomId').value;
    
    localStorage.setItem('roomId', roomId);

    window.location = '/room/' + roomId;
    
}
