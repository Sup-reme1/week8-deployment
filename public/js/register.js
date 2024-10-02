document.addEventListener('DOMContentLoaded', () => {
    const reg = document.getElementById('registration-form');
    
    
    reg.addEventListener('submit', async (e) => {
        e.preventDefault();
        //  alert('details recieved');

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const fullname = document.getElementById('fullname').value;
        const password = document.getElementById('password').value;
        const authMsg = document.getElementById('auth-msg');


        try{
            const response = await fetch('http://localhost:8001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, fullname, password })
            });

            // const output = response.json();

            // console.log(output);
            // alert(output.message); // Display message from backend


            const data = await response.json();
            console.log(data.message);

            if(!response.ok) {
                alert(data.message);
                authMsg.textContent = "User already exists!";
            } else{
                alert(data.message);
                authMsg.textContent = "User created successfully";
            }

            if (data.redirect) {
                window.location.href = data.redirect;
            }
            
        } catch (err) {
            authMsg.textContent = 'An error occured'
            console.error(err);
        }
    })
}); 