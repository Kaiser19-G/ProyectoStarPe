// Este archivo maneja la funcionalidad relacionada con las calificaciones de restaurantes,
// incluyendo interacciones con estrellas de calificación y envíos de formularios.

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los elementos con clase 'star' (estrellas)
    const stars = document.querySelectorAll('.star');
    // Obtenemos el campo de entrada oculto que almacenará el valor de la calificación
    const ratingInput = document.getElementById('rating-input');
    // Obtenemos el botón para enviar la calificación
    const submitButton = document.getElementById('submit-rating');

    // Agregamos un evento de clic a cada estrella
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            // Establecemos la calificación basada en la estrella que se hizo clic (1-5)
            ratingInput.value = index + 1;
            // Actualizamos la visualización de las estrellas
            updateStarDisplay(index);
        });
    });

    // Manejamos el evento de envío del formulario
    submitButton.addEventListener('click', function(event) {
        // Prevenimos el comportamiento predeterminado del formulario
        event.preventDefault();
        // Obtenemos el valor de la calificación
        const rating = ratingInput.value;

        if (rating) {
            // Si hay una calificación seleccionada, mostramos mensaje de agradecimiento
            alert(`¡Gracias por calificar! Has dado ${rating} estrella(s) a este restaurante.`);
            // Opcionalmente, aquí se podría enviar la calificación al servidor
        } else {
            // Si no hay calificación, mostramos mensaje de error
            alert('Por favor selecciona una calificación antes de enviar.');
        }
    });

    // Función para actualizar la visualización de las estrellas
    function updateStarDisplay(selectedIndex) {
        // Recorremos todas las estrellas
        stars.forEach((star, index) => {
            if (index <= selectedIndex) {
                // Añadimos la clase 'filled' a las estrellas seleccionadas y anteriores
                star.classList.add('filled');
            } else {
                // Removemos la clase 'filled' de las estrellas posteriores
                star.classList.remove('filled');
            }
        });
    }
});