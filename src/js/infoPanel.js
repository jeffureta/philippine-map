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
    if (dataType === 'poverty incidence' && subLayer && povertyData) {
        const regionPovertyData = povertyData.find(item => item.region_name === regionName);
        if (regionPovertyData && regionPovertyData[subLayer]) {
            additionalInfoEl.innerHTML = `<strong>Poverty Incidence (${subLayer.replace(/_/g, ' ')}):</strong> ${regionPovertyData[subLayer]}`;
        } else {
            additionalInfoEl.innerHTML = `<strong>Poverty Incidence:</strong> N/A`;
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
