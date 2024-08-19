function removeFromCart(productId){
    console.log('cart id fetch: ', cartId);
    console.log('Product id fetch: ', productId);

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado del carrito',
                position: 'top-end', //Posiciona en la esquina superior derecha
                showConfirmButton: false,
                timer: 600,
                toast: true //Hace que el mensaje aparezca como un pequeño toast
            }).then(() => {
                // Recargar la página después de que la alerta se cierre
                window.location.reload();
            });
        } else {
            alert('Hubo un problema al eliminar un producto del carrito');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el producto del carrito');
    });
}

function incrementQuantity(productId) {
    console.log('Script cargado');
    console.log('cart id fetch: ', cartId);
    console.log('Product id fetch: ', productId);
    const quantity = 1;
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            window.location.reload();
        } else {
            alert('Hubo un problema al agregar el producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    });
}

function decrementarQuantity(productId) {
    console.log('Script cargado');
    console.log('cart id fetch: ', cartId);
    console.log('Product id fetch: ', productId);
    const quantity = -1;
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity }) // Decrementar la cantidad en 1
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
            window.location.reload();
        } else {
            alert('Hubo un problema al agregar el producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    });
}