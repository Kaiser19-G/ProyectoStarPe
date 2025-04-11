// This file handles the functionality related to restaurant ratings, including star rating interactions and form submissions.

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating-input');
    const submitButton = document.getElementById('submit-rating');

    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            // Set the rating based on the star clicked
            ratingInput.value = index + 1;
            updateStarDisplay(index);
        });
    });

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        const rating = ratingInput.value;

        if (rating) {
            // Handle the form submission logic here
            alert(`Thank you for rating! You rated this restaurant ${rating} star(s).`);
            // Optionally, you can send the rating to the server here
        } else {
            alert('Please select a rating before submitting.');
        }
    });

    function updateStarDisplay(selectedIndex) {
        stars.forEach((star, index) => {
            if (index <= selectedIndex) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
});