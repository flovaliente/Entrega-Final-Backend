document.getElementById("changePasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = document.querySelector("input[name='token']").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    console.log('Token en changePassword.js: ', token);
    console.log('Password nueva: ', password);
    console.log('Password nueva confirmacion: ', confirmPassword);

    if(password !== confirmPassword){
        Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'Passwords dont match!'
        });
        return;
    }

    try {
        const response = await fetch("/changePassword", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, password })//Esto se envia en el body a la ruta /changePassword para que cambie la contraseña del user
        });

        const result = await response.json();
        console.log('Result: ', result.error);

        if(result.status == "success"){
            Swal.fire({
                icon: 'success',
                title: 'Password changed',
                text: 'Your password has been successfully changed!'
            }).then(() => {
                window.location.href = "/login";
            });
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error.',
                text: result.error || "Error changing password."
            });
        }
    } catch (error) {
        console.error("Error: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "There was an error while processing your request. Try again later."
        });
    }
});