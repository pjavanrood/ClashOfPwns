const serverExports = require('./server.js');
const checkEmailValid = serverExports.checkEmailValid;
const checkPasswordsMatch = serverExports.checkPasswordsMatch;
const checkUserEmailExist = serverExports.checkUserEmailExist;
const registerUser = serverExports.registerUser;
const checkCredentials = serverExports.checkCredentials;

describe( "checkEmailValid", () => {
    test("test 1", () => {
        expect(checkEmailValid("ell")).toBe(false);
    });

    test("test 2", () => {
        expect(checkEmailValid("parshan@gmail.com")).toBe(true);
    });

    test("test 3", () => {
        expect(checkEmailValid("parshan@jjjj.com")).toBe(true);
    });
});



describe( "checkPasswordsMatch", () => {
    test("test 1", () => {
        expect(checkPasswordsMatch("hello", "world")).toBe(false);
    });

    test("test 2", () => {
        expect(checkPasswordsMatch("Hi", "Hi")).toBe(false);
    });

    test("test 3", () => {
        expect(checkPasswordsMatch("Parshans", "Parshans")).toBe(true);
    });

    test("test 4", () => {
        expect(checkPasswordsMatch("Parshan", "Parshans")).toBe(false);
    });
});



describe( "checkUserEmailExist", () => {
    test("test 1", () => {
        expect(checkUserEmailExist("username1", "email1@gmail.com")).toBe(false);
    });

    test("test 2", () => {
        expect(checkUserEmailExist("username2", "email2@gmail.com")).toBe(false);
    });

    test("test 3", () => {
        expect(checkUserEmailExist("username1", "email2@gmail.com")).toBe(false);
    });

    test("test 4", () => {
        expect(checkUserEmailExist("username2", "email1@gmail.com")).toBe(false);
    });

    test("test 5", () => {
        expect(checkUserEmailExist("testusername1", "testemail1@gmail.com")).toBe(true);
    });
});



describe( "registerUser", () => {
    test("test 1", () => {
        expect(registerUser({
            name: "name1",
            username: "uername1"
        })).toEqual({
            result: false,
            message: "Invalid Request"
        });
    });

    test("test 2", () => {
        expect(registerUser({
            name: "name1",
            username: "testuername1",
            email: "testemail1@gmail.com",
            password: "pwdpwdpwd",
            rePassword: "pwdpwdpwd"
        })).toEqual({
            result: true,
            message: "User Added"
        });
    });
});





