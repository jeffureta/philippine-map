import { map } from './map.js';
import { setRegionColor, regionColorExpression } from './color.js';
import { initFilter } from './filter.js';
import { updateInfoPanel, initInfoPanel } from './infoPanel.js';
import unifiedData from './data/region_data.js';

let currentDataType = null;
let currentSubLayer = null;

map.on('load', async function () {
    initInfoPanel();
    initFilter(map);

    const mapCanvas = map.getCanvas();

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

    // Event listener for custom regionClick event
    mapCanvas.addEventListener('regionClick', (e) => {
        updateInfoPanel(unifiedData, e.detail, currentDataType, currentSubLayer, unifiedData);
    });
});