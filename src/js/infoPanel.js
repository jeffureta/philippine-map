const infoPanel = document.getElementById('info-panel');

export function updateInfoPanel(data, regionDetail, dataType, subLayer, povertyData) {
    const regionName = regionDetail.regionName;
    const point = regionDetail.point; // Get the click coordinates

    // Select elements
    const regionNameEl = document.getElementById('region-name');
    const additionalInfoEl = document.getElementById('additional-info');

    // Update DOM
    if (regionNameEl) regionNameEl.textContent = regionName || 'Unknown Region';

    // Clear previous additional info
    if (additionalInfoEl) additionalInfoEl.innerHTML = '';

    // Conditionally display poverty incidence data
    // The subLayer value (e.g., 'Poverty_Threshold_2_15') needs to be converted to lowercase
    // to match the keys in the unified data properties (e.g., 'poverty_threshold_2_15').
    if (dataType === 'poverty incidence' && subLayer && regionDetail.properties) {
        const propertyKey = subLayer.toLowerCase();
        const povertyValue = regionDetail.properties[propertyKey];

        if (povertyValue !== undefined) {
            // Format the key for display (e.g., "Threshold $2.15") to match UI
            const displayLabel = subLayer.replace('Poverty_Threshold_', 'Threshold $').replace('_', '.');
            additionalInfoEl.innerHTML = `<strong>Poverty Incidence (${displayLabel}):</strong> ${povertyValue}%`;
        } else {
            additionalInfoEl.innerHTML = `<strong>Poverty Incidence:</strong> Result Not Found`;
        }
    }

    // Ensure panel is visible and position it
    if (infoPanel && point) {
        infoPanel.style.display = 'block';
        infoPanel.style.left = `${point.x}px`;
        infoPanel.style.top = `${point.y}px`;
    }

    // Verify data availability (optional usage)
    if (data) {
        console.log('Info Panel updated. Data features count:', data.features.length);
    }
    console.log('Region displayed:', regionName);
}

export function closeInfoPanel() {
    if (infoPanel) {
        infoPanel.style.display = 'none';
    }
}

export function initInfoPanel() {
    const closeButton = document.querySelector('#info-panel .close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeInfoPanel);
    }
}
