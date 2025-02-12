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
        radius: 500
        , // Radio de 2 km
        color: 'red',
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
const captureButton = document.getElementById('captureButton');
        const resetButton = document.getElementById('resetButton');
        const dateTimeDiv = document.getElementById('dateTime');
        const countdownDiv = document.getElementById('countdown');
        const video = document.getElementById('video');
        const preview = document.getElementById('preview');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let countdownTimer;
        let countdownValue = 5; // Cuenta regresiva en segundos
        let stream; // Variable para almacenar el flujo de la cámara

        // Función para iniciar la cuenta regresiva
        function startCountdown() {
            countdownValue = 5;  // Reinicia la cuenta regresiva a 5 segundos
            countdownDiv.textContent = countdownValue;
            countdownDiv.style.display = 'block'; // Muestra la cuenta regresiva
            countdownTimer = setInterval(() => {
                countdownValue--;
                countdownDiv.textContent = countdownValue;
                if (countdownValue <= 0) {
                    clearInterval(countdownTimer);
                    capturePhoto(); // Captura la foto cuando termina la cuenta regresiva
                }
            }, 1000);
        }

        // Función para capturar la foto
        function capturePhoto() {
            const currentDate = new Date();
            dateTimeDiv.value = currentDate.toLocaleString(); // Muestra la fecha y hora en el campo

            // Tomar la foto
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            preview.src = canvas.toDataURL('image/png'); // Convertir la foto a base64
            preview.style.display = 'block';  // Mostrar la imagen previsualizada
            video.style.display = 'none'; // Ocultar la cámara

            // Ocultar la cuenta regresiva y mostrar el botón de reset
            countdownDiv.style.display = 'none';
            resetButton.style.display = 'inline-block'; // Muestra el botón de eliminar y capturar otra
        }

        // Función para reiniciar la cámara y eliminar la foto
        function resetPhoto() {
            preview.style.display = 'none';
            resetButton.style.display = 'none';
            video.style.display = 'block'; // Volver a mostrar la cámara
            startCountdown(); // Reinicia la cuenta regresiva para tomar otra foto
        }

        // Función para iniciar la cámara al presionar el botón
        async function startCamera() {
            // Activar la cámara solo si no está activa
            if (!stream) {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            }

            // Cuando la cámara está lista, inicia la cuenta regresiva
            video.onplaying = function() {
                startCountdown(); // Comienza la cuenta regresiva para la foto
                video.style.display = 'block'; // Asegura que la cámara se muestre
            };
        }

        // Evento para capturar la foto al presionar el botón
        captureButton.addEventListener('click', function() {
            startCamera(); // Inicia la cámara y la cuenta regresiva
            captureButton.style.display = 'none'; // Oculta el botón mientras se captura la foto
        });

        // Evento para eliminar la foto y hacer otra
        resetButton.addEventListener('click', resetPhoto);