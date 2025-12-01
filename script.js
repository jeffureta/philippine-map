// Initialize the map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // Example style
    center: [122.5, 12.5], // Center of the Philippines
    zoom: 5
});

map.on('load', function () {
    // Add a geojson source for the Philippine map
    map.addSource('philippines', {
        type: 'geojson',
        data: 'ph.json' // Your GeoJSON file
    });

    // Add a layer to display the Philippine regions
    map.addLayer({
        id: 'philippines-layer',
        type: 'fill',
        source: 'philippines',
        paint: {
            'fill-color': '#007cbf', // Blue color for regions
            'fill-opacity': 0.5,
            'fill-outline-color': 'black'
        }
    });

    // Add interaction: change color on hover
    map.on('mousemove', 'philippines-layer', function (e) {
        if (e.features.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
            map.setPaintProperty('philippines-layer', 'fill-color', '#005c99'); // Darker blue on hover
        }
    });

    map.on('mouseleave', 'philippines-layer', function () {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty('philippines-layer', 'fill-color', '#007cbf'); // Original color
    });
});

// Get references to the layer elements
const povertyIncidenceData = document.getElementById('poverty-incidence-data');
const povertyThresholdLayers = document.getElementById('poverty-threshold-layers');

// Add event listener to toggle visibility of sub-layers
povertyIncidenceData.addEventListener('click', () => {
    if (povertyThresholdLayers.style.display === 'none' || povertyThresholdLayers.style.display === '') {
        povertyThresholdLayers.style.display = 'block';
    } else {
        povertyThresholdLayers.style.display = 'none';
    }
});

// Optional: Add event listeners for sub-layers if they need to do something
document.getElementById('poverty-threshold-215').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling up to parent
    console.log('Poverty Threshold $2.15 clicked');
    // Add logic for this layer
});

document.getElementById('poverty-threshold-365').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling up to parent
    console.log('Poverty Threshold $3.65 clicked');
    // Add logic for this layer
});

document.getElementById('poverty-threshold-685').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from bubbling up to parent
    console.log('Poverty Threshold $6.85 clicked');
    // Add logic for this layer
});