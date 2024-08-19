document.addEventListener('DOMContentLoaded', function() {
    const homeDeliveryBtn = document.getElementById('home-delivery');
    const storePickupBtn = document.getElementById('store-pickup');
    const deliveryForm = document.getElementById('delivery-form');
    const addAddressBtn = document.getElementById('add-address');
    const modifyAddressBtn = document.getElementById('modify-address');
    const modal = document.getElementById('address-modal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const addressForm = document.getElementById('address-form');
    const modalTitle = document.getElementById('modal-title');
    const newAddressInput = document.getElementById('new-address');
    let isEditing = false;

    homeDeliveryBtn.addEventListener('click', function() {
        homeDeliveryBtn.classList.add('active');
        storePickupBtn.classList.remove('active');
        deliveryForm.style.display = 'block';
    });

    storePickupBtn.addEventListener('click', function() {
        storePickupBtn.classList.add('active');
        homeDeliveryBtn.classList.remove('active');
        deliveryForm.style.display = 'none';
    });

    addAddressBtn?.addEventListener('click', function() {
        isEditing = false;
        modalTitle.textContent = "Agregar Dirección";
        newAddressInput.value = "";
        modal.style.display = "block";
    });

    modifyAddressBtn?.addEventListener('click', function() {
        isEditing = true;
        modalTitle.textContent = "Modificar Dirección";
        newAddressInput.value = document.querySelector('label[for="address-radio"]').textContent.trim();
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    addressForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newAddress = newAddressInput.value.trim();
        console.log('New address: ', newAddress);

        if (newAddress) {
            fetch(`/api/users/updateaddress/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: newAddress })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(isEditing ? 'Dirección modificada exitosamente' : 'Dirección agregada exitosamente');
                    location.reload();  // Recargar la página para mostrar la nueva dirección
                } else {
                    alert('Error al guardar la dirección');
                }
            })
            .catch(error => console.error('Error:', error));

            modal.style.display = "none";
        }
    });
});