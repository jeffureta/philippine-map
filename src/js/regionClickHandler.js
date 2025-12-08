// src/js/regionClickHandler.js

export function handleRegionClick(e) {
    const region = e.detail.region;
    const regionName = e.detail.regionName;
    const regionId = e.detail.regionId;

    // Update the content based on the clicked region
    document.getElementById('region-name').textContent = regionName;
    document.getElementById('region-id').textContent = regionId;

    // You can add more logic here to display region-specific data
    console.log(`Region Clicked: ${regionName} (ID: ${regionId})`);
}
