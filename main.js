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
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const uploadForm = document.getElementById('upload-form');
const photoInput = document.getElementById('photo-input');

// Cargar modelos de FaceAPI
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo);

// Iniciar la cámara
function startVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => console.error('Error al acceder a la cámara:', err));
}

// Capturar foto y detectar rostro
captureBtn.addEventListener('click', async () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions()
    );

    if (detections.length > 0) {
        alert('¡Rostro detectado!');
        const dataURL = canvas.toDataURL('image/png');
        photoInput.value = dataURL;
    } else {
        alert('No se detectaron rostros.');
    }
});

// Subir foto al servidor
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const dataURL = photoInput.value;

    if (!dataURL) {
        alert('Captura una foto antes de subirla.');
        return;
    }

    fetch('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: dataURL }),
    })
        .then((res) => res.json())
        .then((data) => alert(data.message))
        .catch((err) => console.error(err));
});
