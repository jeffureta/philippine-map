export function updateInfoPanel(data, regionDetail) {
    const regionName = regionDetail.regionName;
    const regionId = regionDetail.regionId;

    // Select elements
    const regionNameEl = document.getElementById('region-name');
    const regionIdEl = document.getElementById('region-id');
    const infoPanel = document.getElementById('info-panel');

    // Update DOM
    if (regionNameEl) regionNameEl.textContent = regionName || 'Unknown Region';
    if (regionIdEl) regionIdEl.textContent = regionId || '-';

    // Ensure panel is visible
    if (infoPanel) infoPanel.style.display = 'block';

    // Verify data availability (optional usage)
    if (data) {
        console.log('Info Panel updated. Data features count:', data.features.length);
    }
    console.log('Region displayed:', regionName);
}
