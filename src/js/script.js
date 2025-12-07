import { map } from './map.js';
import { initFilter } from './filter.js';
import { show as showInfoPanel } from './infoPanel.js';

map.on('load', function () {
    initFilter(map);

    const mapCanvas = map.getCanvas();
    mapCanvas.addEventListener('regionClick', (e) => {
        const { regionName, properties } = e.detail;

        // Format content for the info panel
        let content = `<h3>${regionName || 'Unknown Region'}</h3>`;
        if (properties) {
            content += '<ul>';
            for (const key in properties) {
                if (key !== 'ID' && key !== 'NAME_1') { // Skip ID and redundant name
                    content += `<li><strong>${key}:</strong> ${properties[key]}</li>`;
                }
            }
            content += '</ul>';
        }

        showInfoPanel(content);
    });
});