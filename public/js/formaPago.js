document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener el método de pago seleccionado
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');

        if (selectedPaymentMethod) {
            const paymentMethod = selectedPaymentMethod.value;

            // Hacer una petición para guardar la selección del método de pago
            fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod: paymentMethod })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    // Redirigir a la función cart
                    window.location.href = '/cart';
                } else {
                    alert('Error al guardar la forma de pago');
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Por favor, selecciona una forma de pago');
        }
    });
});