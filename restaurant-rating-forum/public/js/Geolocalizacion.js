// This file handles location-related functionality including geolocation permissions and distance calculations

document.addEventListener('DOMContentLoaded', function() {
    const locationAlert = document.getElementById('locationAlert');
    const enableLocationBtn = document.getElementById('enableLocation');
    
    // Check if geolocation is already available in the session
    checkStoredLocation();
    
    // Add event listener to the location button
    if (enableLocationBtn) {
        enableLocationBtn.addEventListener('click', requestUserLocation);
    }
    
    // Function to request user's location
    function requestUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                handleLocationSuccess,
                handleLocationError
            );
        } else {
            // The browser doesn't support geolocation
            updateLocationAlert(
                'warning',
                '<i class="fas fa-exclamation-triangle me-2"></i>' +
                '<strong>Tu navegador no soporta geolocalización.</strong> Las distancias mostradas son aproximadas.'
            );
        }
    }
    
    // Handle successful location retrieval
    function handleLocationSuccess(position) {
        // Store location data in sessionStorage for future use
        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().getTime()
        };
        
        sessionStorage.setItem('userLocation', JSON.stringify(locationData));
        
        // Update the UI to show success message
        updateLocationAlert(
            'success',
            '<i class="fas fa-check-circle me-2"></i>' +
            '<strong>¡Ubicación activada!</strong> Ahora te mostraremos los restaurantes más cercanos.'
        );
        
        // Update restaurant distances based on user location
        updateRestaurantDistances(position.coords.latitude, position.coords.longitude);
    }
    
    // Handle errors when retrieving location
    function handleLocationError(error) {
        console.error('Error al obtener la ubicación:', error);
        
        let errorMessage = '<strong>No pudimos acceder a tu ubicación.</strong> ';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += 'Has denegado el permiso de ubicación.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += 'La información de ubicación no está disponible.';
                break;
            case error.TIMEOUT:
                errorMessage += 'Se agotó el tiempo para obtener la ubicación.';
                break;
            case error.UNKNOWN_ERROR:
                errorMessage += 'Ocurrió un error desconocido.';
                break;
        }
        
        updateLocationAlert(
            'warning',
            '<i class="fas fa-exclamation-triangle me-2"></i>' +
            errorMessage + ' Las distancias mostradas son aproximadas.'
        );
    }
    
    // Update the location alert with appropriate styling and message
    function updateLocationAlert(alertType, message) {
        if (locationAlert) {
            locationAlert.innerHTML = message + 
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            
            // Reset all alert classes
            locationAlert.classList.remove('alert-info', 'alert-success', 'alert-warning', 'alert-danger');
            // Add the specific alert class
            locationAlert.classList.add(`alert-${alertType}`);
        }
    }
    
    // Check if we already have location stored and update UI accordingly
    function checkStoredLocation() {
        const storedLocation = sessionStorage.getItem('userLocation');
        
        if (storedLocation) {
            try {
                const locationData = JSON.parse(storedLocation);
                const timestamp = locationData.timestamp;
                const currentTime = new Date().getTime();
                
                // If location data is less than 30 minutes old, use it
                if (currentTime - timestamp < 30 * 60 * 1000) {
                    // Update the UI to show we already have location
                    updateLocationAlert(
                        'success',
                        '<i class="fas fa-check-circle me-2"></i>' +
                        '<strong>¡Ubicación activa!</strong> Estamos mostrando los restaurantes más cercanos a ti.'
                    );
                    
                    // Update restaurant distances
                    updateRestaurantDistances(locationData.latitude, locationData.longitude);
                    return true;
                }
            } catch (e) {
                console.error('Error parsing stored location data', e);
            }
        }
        
        return false;
    }
    
    // Update restaurant distances based on user location
    function updateRestaurantDistances(latitude, longitude) {
        const restaurantCards = document.querySelectorAll('.card');
        
        restaurantCards.forEach(card => {
            // In a real application, each restaurant would have data attributes
            // with their latitude and longitude
            const restaurantLat = parseFloat(card.dataset.latitude);
            const restaurantLng = parseFloat(card.dataset.longitude);
            
            if (!isNaN(restaurantLat) && !isNaN(restaurantLng)) {
                const distance = calculateDistance(latitude, longitude, restaurantLat, restaurantLng);
                
                // Find the distance element within the card and update it
                const distanceElement = card.querySelector('.restaurant-distance');
                if (distanceElement) {
                    distanceElement.innerHTML = `<i class="fas fa-map-marker-alt me-2"></i>A ${distance.toFixed(1)} km de ti`;
                }
            }
        });
    }
    
    // Calculate distance between two coordinates using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
});