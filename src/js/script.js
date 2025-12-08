import { map } from './map.js';
import { setRegionColor, regionColorExpression } from './color.js';
import { initFilter } from './filter.js';
import { handleRegionClick } from './regionClickHandler.js';

map.on('load', function () {
    initFilter(map);

    const mapCanvas = map.getCanvas();

    // Listen for filter changes
    mapCanvas.addEventListener('filterChange', (e) => {
        const { layerId } = e.detail;
        if (layerId === 'regions') {
            setRegionColor(map, 'philippines-fill', regionColorExpression);
        } else if (layerId === 'no-filter') {
            setRegionColor(map, 'philippines-fill', '#6f9c76');
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



    // Event listener for custom regionClick event
    mapCanvas.addEventListener('regionClick', handleRegionClick);
});