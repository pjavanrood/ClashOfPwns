const express = require('express');
const path = require('path')

const router = express.Router();

router.use(express.json());
router.use(express.static(path.resolve(__dirname, '../../public')));


router.get('/', (req, res) => res.sendFile(__dirname, './public/index.html'));

const Model = require('../Database');

const bcrypt = require('bcrypt');


/**
 * Request Body Keys:
 * - username
 * - password

 * Login Endpoint: /login
 
 * 1. check if the username exists
 * 2. check if the password matches
 * 
 * 
 */

const loginEndPoint = '/login';

router.post(loginEndPoint, async (req, res) => {
    console.log((req.body));
    
    let result = await userLogin(req.body);

    if(result.result) {
        res.status(201).send(result);
    } else {
        res.status(400).send(result);
    }
});




async function userLogin(reqBody) {
    if (
        !('username' in reqBody) ||
        !('password' in reqBody)
    ) {
        return {
            result: false,
            message: "Invalid Request"
        };
    }

    let username = reqBody.username;
    let password = reqBody.password;

    return await checkCredentials(username, password);
}


async function checkCredentials(username, pwd) {
    let data = await Model.findOne(
        {username: username}, "hashedPassword"
    );



    if(!data) 
        return {
            result: false,
            message: "Username not found"
        };                

    if(await bcrypt.compare(pwd, data.hashedPassword)) {
        return {
            result: true,
            message: "Verified"
        };
    } else {
        return {
            result: false,
            message: "Incorrect Password"
        };
    }
    // for(let i = 0; i < users.length; i++) {
    //     let user = users[i];

    //     if(user.username == username) {
    //         if(await bcrypt.compare(pwd, user.hashedPassword)) {
    //             return {
    //                 result: true,
    //                 message: "Verified"
    //             };
    //         } else {
    //             return {
    //                 result: false,
    //                 message: "Incorrect Password"
    //             };
    //         }
    //     }
    // }

    // return {
    //     result: false,
    //     message: "Username not found"
    // };
}




/**
 * Request Body Keys:
 * - name
 * - username
 * - email
 * - password
 * - rePassword
 
 * Register Endpoint: /register
 
 * 1. Check if email is valid
 * 2. Check if password and re-entered password match and are 8 characters long
 * 3. Check if username/email address exists
 * 
 */

const registerEndpoint = '/register';

router.post(registerEndpoint, async(req, res) => {
    let result = await registerUser(req.body);

    if(result.result) {
        res.status(201).send(result);
    } else {
        res.status(400).send(result);
    }
})


async function registerUser(reqBody) {
    if (
        !('name' in reqBody) ||
        !('username' in reqBody) ||
        !('email' in reqBody) ||
        !('password' in reqBody) ||
        !('rePassword' in reqBody)
    ) {
        return {
            result: false,
            message: "Invalid Request"
        };
    }
    
    let name = reqBody.name;
    let username = reqBody.username;
    let email = reqBody.email;
    let password = reqBody.password;
    let reEnteredPwd = reqBody.rePassword;

    if(!checkEmailValid(email)) {
        return {
            result: false,
            message: "Invalid Email"
        };
    }
    
    
    else if(!checkPasswordsMatch(password, reEnteredPwd)) {
        return {
            result: false,
            message: "Password and Re-entered Password don't match"
        };
    }


    else if(!(await checkUserEmailExist(username, email))) {
        return {
            result: false,
            message: "Username or Email already registered"
        };
    }


    let hashedPassword = await bcrypt.hash(password, 10);

    let user = {
        name: name,
        username: username,
        email: email,
        hashedPassword: hashedPassword,
    };


    //users.push(user);

    let userModel = new Model(user);

    try {
        const dataToSave = await userModel.save();
    }
    catch (error) {
        return {
            result: false,
            message: "Failed to store"
        };
    }

    return {
        result: true,
        message: "User Added"
    };

    
}


function checkEmailValid(email) {
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(emailRegex)) {
        return true;
    } else {
        return false;
    }
}

function checkPasswordsMatch(pwd, reEnteredPwd) {
    if(pwd == reEnteredPwd && pwd.length >= 8)
        return true;
    else
        return false;
}

async function checkUserEmailExist(username, email) {
    let data = await Model.findOne(
        { $or: [{ username: username }, { email: email }] }
    );

    if(!data)
        return true;
    else
        return false;



    // let result = users.find(function (obj) {
    //     return (obj.username == username || obj.email == email);
    // });

    // if(typeof result == 'undefined')
    //     return true;
    
    // else
    //     return false;
}


module.exports = router;