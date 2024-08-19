
function addToCart(productId) {

    console.log('Script cargado');
    console.log('cart id fetch: ', cartId);
    console.log('Product id fetch: ', productId);
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                position: 'top-end', //Posiciona en la esquina superior derecha
                showConfirmButton: false,
                timer: 1500,
                toast: true //Hace que el mensaje aparezca como un pequeño toast
            });
        } else {
            alert('Hubo un problema al agregar el producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    });
}