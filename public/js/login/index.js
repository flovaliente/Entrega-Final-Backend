function Login(event) {
    event.preventDefault();

    const req = {
        email: document.querySelector('input#email').value,
        password: document.querySelector('input#password').value
    }

    fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => result.json())
    .then(json => {
        console.log(json);
        window.location.href = '/api/users/current';
    });
}