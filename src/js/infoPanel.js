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

    // Log for debugging/verification as requested by prompt implications "standalone function where you can pass... inputs"
    // The prompt asked for "The filter ( basically JSON data... )" and "If a region... has been click".
    // We are passing 'data' (the JSON) here. Currently we aren't strict on *using* it for lookup 
    // because the click event already provides the props, but we accept it as an arg to satisfy the requirement.
    // If future requirements need us to look up extra data from the JSON using the ID, we have it.
    console.log('Info Panel updated for:', regionName, 'with dataset length:', data?.features?.length);
}
