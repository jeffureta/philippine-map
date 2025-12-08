// src/js/regionClickHandler.js

export function handleRegionClick(e) {
    const region = e.detail.region;
    const regionName = e.detail.regionName;
    const regionId = e.detail.regionId;


    // Update the content based on the clicked region
    const regionNameEl = document.getElementById('region-name');
    const regionIdEl = document.getElementById('region-id');
    const infoPanel = document.getElementById('info-panel');

    if (regionNameEl) regionNameEl.textContent = regionName;
    if (regionIdEl) regionIdEl.textContent = regionId;
    if (infoPanel) infoPanel.style.display = 'block';

    // You can add more logic here to display region-specific data
    console.log(`Region Clicked: ${regionName} (ID: ${regionId})`);
}
