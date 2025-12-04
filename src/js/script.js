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
                id: 'philippines-fill',
                type: 'fill',
                source: 'philippines',
                paint: {
                    'fill-color': '#6f9c76', // Green color from ph.svg
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

map.on('load', function () {
    // You can add more layers or interactions here if needed
});