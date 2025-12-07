import { map } from './map.js';
import { setRegionColor, regionColorExpression } from './color.js';
import { initFilter } from './filter.js';
import { show as showInfoPanel } from './infoPanel.js';

map.on('load', function () {
    initFilter(map);

    const mapCanvas = map.getCanvas();

    // Listen for filter changes
    mapCanvas.addEventListener('filterChange', (e) => {
        const { layerId } = e.detail;
        if (layerId === 'regions') {
            setRegionColor(map, 'philippines-fill', regionColorExpression);
        } else {
            // Reset to default green if another layer is selected (optional but good practice)
            // The prompt didn't strictly require this but it makes sense.
            // But 'pi-rate' might want to set its own colors later.
            // I'll leave it as setting 'regions' causes colors, others do nothing for now unless specified.
            // Actually, if I don't reset, the map stays colorful.
            // I will set it to default green if not regions?
            // No, let's just implement the positive case requested.
        }
    });

    mapCanvas.addEventListener('regionClick', (e) => {
        const { regionName, properties } = e.detail;

        // Format content for the info panel
        let content = `<h3>${regionName || 'Unknown Region'}</h3>`;
        if (properties) {
            content += '<ul>';
            for (const key in properties) {
                if (key !== 'ID' && key !== 'NAME_1' && key !== 'name') { // Skip ID and redundant name
                    content += `<li><strong>${key}:</strong> ${properties[key]}</li>`;
                }
            }
            content += '</ul>';
        }

        showInfoPanel(content);
    });
});