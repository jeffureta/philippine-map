// This section initializes the map and its related functionalities.
// It can be modularized into a separate 'map-module.js' file.

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
    // Add a layer to display the Philippine regions
    map.addLayer({
        id: 'philippines-layer',
        type: 'fill',
        source: 'philippines',
        paint: {
            'fill-color': [
                'match',
                ['get', 'name'],
                'Autonomous Region in Muslim Mindanao', '#e6194b',
                'Bicol', '#3cb44b',
                'Cagayan Valley', '#ffe119',
                'Calabarzon', '#4363d8',
                'Caraga', '#f58231',
                'Central Luzon', '#911eb4',
                'Central Visayas', '#46f0f0',
                'Cordillera Administrative Region', '#f032e6',
                'Davao', '#bcf60c',
                'Eastern Visayas', '#fabebe',
                'Ilocos', '#008080',
                'Mimaropa', '#e6beff',
                'National Capital Region', '#9a6324',
                'Northern Mindanao', '#fffac8',
                'Soccsksargen', '#800000',
                'Western Visayas', '#aaffc3',
                'Zamboanga Peninsula', '#808000',
                '#cccccc' // Default color
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
        }
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'philippines-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'philippines-layer', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', 'philippines-layer', function (e) {
        var coordinates = e.lngLat;
        var description = e.features[0].properties.name;

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML('<strong>' + description + '</strong>')
            .addTo(map);
    });
});
