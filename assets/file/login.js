const loginBtn = document.getElementById('login');


loginBtn.addEventListener("click", ()=>{
    const inputUsername = document.getElementById('username').value.trim();
    const inputPassword = document.getElementById('password').value.trim();
    console.log(inputUsername);
    console.log(inputPassword);


    if(inputUsername === 'admin' && inputPassword === 'admin123'){
        window.location.href = "./system.html";
    }else{
        alert("Invalid Username or Password");
    }

    




    
})