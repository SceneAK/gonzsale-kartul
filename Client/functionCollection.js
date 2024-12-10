const { date } = require("joi");

async function signIn(email, password) { // will return a cookie
    const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_email: email,
            user_password: password
        })
    })
    if (!response.ok) throw new Error("Sign In Failed");
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('loginTime', Date.now());
}
async function signUp(name, phone, email, password) { // will return a cookie
    const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_name: name,
            user_phone: phone,
            user_email: email,
            user_password: password
        })
    })
    if (!response.ok) throw new Error("Sign Up Failed");
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('loginTime', Date.now());
}

export default{
    user:{
        signIn,
        signUp
    }
}