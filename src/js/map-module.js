import { regionColors, highlightLegendItem } from './legend-module.js';
import { getLayerData } from './data-service.js';

export function initializeMap() {
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
        // Add a geojson source for the Philippine map
        map.addSource('philippines', {
            type: 'geojson',
            data: 'src/data/ph.json' // Your GeoJSON file
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

        map.on('click', 'philippines-layer', async function (e) {
            var coordinates = e.lngLat;
            var regionName = e.features[0].properties.name;

            // Map region names if necessary
            const regionNameMap = {
                "Davao": "Davao Region"
            };
            const dataRegionName = regionNameMap[regionName] || regionName;

            // Highlight the legend item
            if (typeof highlightLegendItem === 'function') {
                highlightLegendItem(regionName);
            }

            // Fetch data for the clicked region
            const layerData = await getLayerData({
                name: dataRegionName,
                dataUrl: 'src/data/ph-pi-rate.json',
                dataKey: 'Region'
            });

            let popupContent = `<strong>${regionName}</strong>`;

            if (layerData) {
                const regionPovertyData = layerData.find(item => item.Region === dataRegionName);
                if (regionPovertyData) {
                    popupContent += `<br>Poverty Threshold (2.15): ${regionPovertyData.Poverty_Threshold_2_15}`;
                    popupContent += `<br>Poverty Threshold (3.65): ${regionPovertyData.Poverty_Threshold_3_65}`;
                    popupContent += `<br>Poverty Threshold (6.85): ${regionPovertyData.Poverty_Threshold_6_85}`;
                    popupContent += `<br>Year of Estimate: ${regionPovertyData.Year_of_Estimate}`;
                } else {
                    popupContent += `<br>No poverty data available for ${dataRegionName}`;
                }
            } else {
                popupContent += `<br>Failed to load poverty data.`;
            }

            new maplibregl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map);
        });
    });
}
