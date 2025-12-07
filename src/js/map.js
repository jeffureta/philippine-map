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
    const regionId = e.features[0].properties.ID; // Or however you get the ID
    const regionName = e.features[0].properties.NAME_1;

    // Dispatch custom event
    const event = new CustomEvent('regionClick', {
        detail: {
            regionId,
            regionName,
            properties: e.features[0].properties
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

export function setRegionColor(regionId, color) {
    if (map.getLayer(regionId)) {
        map.setPaintProperty(regionId, 'fill-color', color);
    } else {
        console.warn(`Layer ${regionId} not found`);
    }
}

export const regionColorExpression = [
    'match',
    ['get', 'name'],
    'National Capital Region', '#e6194b',
    'Autonomous Region in Muslim Mindanao', '#3cb44b',
    'Calabarzon', '#ffe119',
    'Western Visayas', '#4363d8',
    'Cordillera Administrative Region', '#f58231',
    'Northern Mindanao', '#911eb4',
    'Negros Island Region', '#46f0f0',
    'Central Visayas', '#f032e6',
    'Zamboanga Peninsula', '#bcf60c',
    'Davao', '#fabebe',
    'Bicol', '#008080',
    'Eastern Visayas', '#e6beff',
    'Ilocos', '#9a6324',
    'Mimaropa', '#fffac8',
    'Caraga', '#800000',
    'Cagayan Valley', '#aaffc3',
    'Soccsksargen', '#808000',
    'Central Luzon', '#ffd8b1',
    '#6f9c76' // default fallback
];
