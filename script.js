// Defines an array of objects, where each object represents a region
// and its corresponding color for display on the map.
const regionColors = [
    { name: 'Autonomous Region in Muslim Mindanao', color: '#e6194b' },
    { name: 'Bicol', color: '#3cb44b' },
    { name: 'Cagayan Valley', color: '#ffe119' },
    { name: 'Calabarzon', color: '#4363d8' },
    { name: 'Caraga', color: '#f58231' },
    { name: 'Central Luzon', color: '#911eb4' },
    { name: 'Central Visayas', color: '#46f0f0' },
    { name: 'Cordillera Administrative Region', color: '#f032e6' },
    { name: 'Davao', color: '#bcf60c' },
    { name: 'Eastern Visayas', color: '#fabebe' },
    { name: 'Ilocos', color: '#008080' },
    { name: 'Mimaropa', color: '#e6beff' },
    { name: 'National Capital Region', color: '#9a6324' },
    { name: 'Northern Mindanao', color: '#fffac8' },
    { name: 'Soccsksargen', color: '#800000' },
    { name: 'Western Visayas', color: '#aaffc3' },
    { name: 'Zamboanga Peninsula', color: '#808000' }
];

// Generates a Mapbox GL JS match expression to dynamically set fill colors for regions
// based on their 'name' property. This allows different regions to have distinct colors.
const matchExpression = ['match', ['get', 'name']];
regionColors.forEach(region => {
    matchExpression.push(region.name, region.color);
});
matchExpression.push('#cccccc'); // Default color for regions not explicitly listed

// Populates the legend dynamically based on the `regionColors` array.
// Each region gets a color swatch and its name displayed in the legend.
const legend = document.getElementById('legend');
regionColors.forEach(region => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.setAttribute('data-region', region.name); // Add data attribute for easy selection
    item.innerHTML = `
        <div class="legend-color" style="background-color: ${region.color};"></div>
        <span>${region.name}</span>
    `;
    legend.appendChild(item);
});

// Initializes the MapLibre GL JS map.
// It sets the container, defines the map style (sources and layers),
// and sets the initial center coordinates and zoom level.
var map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'philippines': {
                type: 'geojson',
                data: './ph.json' // Path to your GeoJSON file
            }
        },
        layers: [
            {
                id: 'background',
                type: 'background',
                paint: {
                    'background-color': '#f2f2f2' // Light grey background
                }
            },
            {
                id: 'philippines-fill',
                type: 'fill',
                source: 'philippines',
                paint: {
                    'fill-color': matchExpression,
                    'fill-opacity': 0.8
                }
            },
            {
                id: 'philippines-borders',
                type: 'line',
                source: 'philippines',
                paint: {
                    'line-color': '#ffffff', // White color from ph.svg
                    'line-width': 0.5
                }
            }
        ]
    },
    center: [121.7740, 12.8797], // Approximate center of the Philippines [lng, lat]
    zoom: 5 // Initial zoom level
});

// Event listener that fires once the map has finished loading.
// This is where interactive behaviors for the map are defined.
map.on('load', function () {
    // Event listener for when the mouse enters a Philippine region.
    // It changes the cursor to a pointer and highlights the corresponding legend item.
    map.on('mouseenter', 'philippines-fill', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        // Highlight legend item
        if (e.features.length > 0) {
            const regionName = e.features[0].properties.name;
            const legendItem = document.querySelector(`.legend-item[data-region="${regionName}"]`);
            if (legendItem) {
                legendItem.classList.add('active');
                legendItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });

    // Event listener for when the mouse leaves a Philippine region.
    // It resets the cursor and removes the highlight from all legend items.
    map.on('mouseleave', 'philippines-fill', function () {
        map.getCanvas().style.cursor = '';

        // Remove highlight from all legend items
        document.querySelectorAll('.legend-item.active').forEach(item => {
            item.classList.remove('active');
        });
    });

    // Event listener for when a user clicks on a Philippine region.
    // It displays a popup with the name of the clicked region.
    map.on('click', 'philippines-fill', function (e) {
        var coordinates = e.lngLat;
        var description = e.features[0].properties.name;

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML('<strong>' + description + '</strong>')
            .addTo(map);
    });
});