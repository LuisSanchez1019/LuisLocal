// Función para inicializar el mapa con una vista predeterminada
function initMap() {
    const map = L.map('map').setView([0, 0], 13); // Establecemos el punto inicial en [0, 0]

    // Capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    return map;
}

// Función para obtener la ubicación actual del usuario
function getUserLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                callback(latitude, longitude);
            },
            (error) => {
                console.error('Error al obtener la geolocalización:', error.message);
                alert('No se pudo obtener la ubicación.');
            }
        );
    } else {
        alert('Tu navegador no soporta geolocalización.');
    }
}

// Función para agregar un círculo de 2 km alrededor de la ubicación
function addRadarCircle(map, latitude, longitude) {
    const currentLocation = [latitude, longitude];
    // Añadir un círculo (radar) de 2 km de radio desde la ubicación actual
    L.circle(currentLocation, {
        radius: 2000, // Radio de 2 km
        color: 'blue',
        fillColor: '#007BFF',
        fillOpacity: 0.4
    }).addTo(map);
}

// Función para agregar un marcador en la ubicación del usuario
function addLocationMarker(map, latitude, longitude) {
    const currentLocation = [latitude, longitude];
    const marker = L.marker(currentLocation).addTo(map);
    marker.bindPopup('Tu ubicación actual').openPopup();
}

// Función para actualizar las coordenadas en la página
function updateCoordinatesDisplay(latitude, longitude) {
    const coordinatesElement = document.getElementById('user-coordinates');
    coordinatesElement.textContent = `Latitud: ${latitude.toFixed(6)}, Longitud: ${longitude.toFixed(6)}`;
}

// Función principal que coordina la ejecución
function initialize() {
    const map = initMap(); // Inicializa el mapa

    getUserLocation((latitude, longitude) => {
        // Después de obtener la ubicación, se actualiza el mapa y la información
        map.setView([latitude, longitude], 15); // Mover el mapa a la ubicación actual
        addRadarCircle(map, latitude, longitude); // Añadir el radar de 2 km
        addLocationMarker(map, latitude, longitude); // Añadir el marcador de ubicación
        updateCoordinatesDisplay(latitude, longitude); // Mostrar las coordenadas actuales
    });
}

// Ejecutar la función de inicialización
initialize();
