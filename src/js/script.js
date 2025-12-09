import { map } from './map.js';
import { setRegionColor, regionColorExpression } from './color.js';
import { initFilter } from './filter.js';
import { updateInfoPanel, initInfoPanel } from './infoPanel.js';

let currentDataType = null;
let currentSubLayer = null;
let povertyData = null; // To store poverty incidence data

map.on('load', async function () {
    initInfoPanel();
    initFilter(map);

    const mapCanvas = map.getCanvas();

    // Load the poverty incidence data once
    try {
        const response = await fetch('src/data/ph-pi-rate.json');
        povertyData = await response.json();
    } catch (error) {
        console.error('Failed to load poverty incidence data:', error);
    }

    // Listen for filter changes
    mapCanvas.addEventListener('filterChange', (e) => {
        const { layerId, dataType, subLayer } = e.detail;
        currentDataType = dataType;
        currentSubLayer = subLayer;

        if (layerId === 'regions') {
            setRegionColor(map, 'philippines-fill', regionColorExpression);
        } else if (layerId === 'no-filter') {
            setRegionColor(map, 'philippines-fill', '#6f9c76');
        }
    });

    // Load the data required for the info panel
    let geoJsonData = null;
    try {
        const response = await fetch('src/data/ph_updated_nir.json');
        geoJsonData = await response.json();
    } catch (error) {
        console.error('Failed to load JSON data:', error);
    }

    // Event listener for custom regionClick event
    mapCanvas.addEventListener('regionClick', (e) => {
        updateInfoPanel(geoJsonData, e.detail, currentDataType, currentSubLayer, povertyData);
    });
});