export const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'philippines': {
                type: 'geojson',
                data: 'src/data/ph_updated_nir.json' // Path to your GeoJSON file
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

map.on('click', 'philippines-fill', (e) => {
    const regionId = e.features[0].properties.id;
    const regionName = e.features[0].properties.name;

    // Dispatch custom event
    const event = new CustomEvent('regionClick', {
        detail: {
            regionId,
            regionName,
            properties: e.features[0].properties,
            point: e.point // Pass the pixel coordinates of the click
        }
    });
    map.getCanvas().dispatchEvent(event);
});

// Change the cursor to a pointer when the mouse is over the states layer.
map.on('mouseenter', 'philippines-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'philippines-fill', () => {
    map.getCanvas().style.cursor = '';
});

