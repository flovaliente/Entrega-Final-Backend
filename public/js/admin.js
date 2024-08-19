function switchUserRole(userId) {
    fetch(`/api/users/premium/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Recargar la página para mostrar el nuevo rol
            window.location.reload();
        } else {
            alert(data.message); // Muestra el mensaje de error si no se pudo cambiar el rol
        }
    })
    .catch(error => console.error('Error:', error));
}


function confirmDelete() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/users`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            Swal.fire(
              'El usuario ha sido eliminado.',
              'success'
            ).then(() => {
              // Recargar la página después de la eliminación
              window.location.reload();
            });
          } else {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el usuario.',
              'error'
            );
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el usuario.',
            'error'
          );
        });
      }
    });
}
  