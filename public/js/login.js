document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const msg = document.getElementById('msg');

        try{
            const url = 'http://localhost:8001/api/login'
            const response = await fetch( url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            // console.log(response);

            if (!response.ok){
                // alert('Wrong information');

                msg.innerHTML = 'Incorrect Username or Password'
            } else{
                // alert('Login Successful');
                // console.log('successful');
            }

            if (response.redirected){
                window.location.href = response.url;
            }
        }catch (err){
            console.log(err);
        }


    })
})