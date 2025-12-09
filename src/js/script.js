document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    Promise.all([
        import('./map.js'),
        import('./color.js'),
        import('./filter.js'),
        import('./infoPanel.js'),
        import('../data/region_data.js')
    ]).then(([mapModule, colorModule, filterModule, infoPanelModule, regionDataModule]) => {
        console.log('All modules loaded successfully');
        const { map } = mapModule;
        const { setRegionColor, regionColorExpression } = colorModule;
        const { initFilter } = filterModule;
        const { updateInfoPanel, initInfoPanel } = infoPanelModule;
        const unifiedData = regionDataModule.default;

        let currentDataType = null;
        let currentSubLayer = null;

        map.on('load', async function () {
            console.log('Map loaded');
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
    }).catch(error => {
        console.error("Failed to load modules", error);
        alert("Failed to load map modules. Check console for details.");
    });
});
