const baseUrl = ''

document.getElementById('registerBtn').addEventListener('click', regiterClicked);
document.getElementById('loginBtn').addEventListener('click', loginClicked);


function regiterClicked(event) {
    let name = document.getElementById('nameField').value;
    let username = document.getElementById('usernameField').value;
    let password = document.getElementById('passwordField').value;
    let rePassword = document.getElementById('rePasswordField').value;
    let email = document.getElementById('emailField').value;

    event.preventDefault();

    postRegister(name, username, password, rePassword, email);

}

function loginClicked(event) {
    let username = document.getElementById('usernameFieldL').value;
    let password = document.getElementById('passwordFieldL').value;
    
    event.preventDefault();

    postLogin(username, password);


}


async function postRegister(name, username, password, rePassword, email) {
    let result = await fetch(
        baseUrl + '/register',
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                name: name,
                username: username,
                email: email,
                password: password,
                rePassword: rePassword
            })
        }
    );

    let data = await result.json();

    console.log(data);
    
    let resultDiv = document.getElementById('registerResult');

    if(data.result) {
        window.location = '/breakout';
    } else {
        resultDiv.innerHTML = "";
        resultDiv.appendChild(document.createTextNode(data.message));
    }

}

async function postLogin(username, password) {
    let result = await fetch(
        baseUrl + '/login',
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    );

    let data = await result.json();

    //console.log(data);
    
    let resultDiv = document.getElementById('loginResult');

    //handleLoginResult(data);
    
    if(data.result) {
        window.location = '/breakout';
    } else {
        resultDiv.innerHTML = "";
        resultDiv.appendChild(document.createTextNode(data.message));
    }
}


// function handleLoginResult(data) {
//     if(data.result) {
//         window.lo
//     }
// }