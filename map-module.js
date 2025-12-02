
function initializeMap() {
    // Initialize the map
    const map = new maplibregl.Map({
        container: 'map',
        style: {
            'version': 8,
            'sources': {},
            'layers': [
                {
                    'id': 'background',
                    'type': 'background',
                    'paint': {
                        'background-color': '#333333'
                    }
                }
            ]
        },
        center: [122.5, 12.5], // Center of the Philippines
        zoom: 5
    });

    map.on('load', function () {
        initializeSidebar();
        initializeLegend();

        // Add a geojson source for the Philippine map
        map.addSource('philippines', {
            type: 'geojson',
            data: 'ph.json' // Your GeoJSON file
        });

        // Generate match expression for map style from regionColors (defined in legend-module.js)
        const matchExpression = ['match', ['get', 'name']];
        regionColors.forEach(region => {
            matchExpression.push(region.name, region.color);
        });
        matchExpression.push('#cccccc'); // Default color

        // Add a layer to display the Philippine regions
        map.addLayer({
            id: 'philippines-layer',
            type: 'fill',
            source: 'philippines',
            paint: {
                'fill-color': matchExpression,
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

            // Highlight the legend item
            if (typeof highlightLegendItem === 'function') {
                highlightLegendItem(description);
            }

            new maplibregl.Popup()
                .setLngLat(coordinates)
                .setHTML('<strong>' + description + '</strong>')
                .addTo(map);
        });
    });
}
