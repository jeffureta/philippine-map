// This section handles the event listeners for the poverty data layers.
// It can be modularized into a separate 'ui-module.js' or 'sidebar-module.js' file.

function initializeSidebar() {
    // Get references to the layer elements
    const povertyIncidenceData = document.getElementById('poverty-incidence-data');
    const povertyThresholdLayers = document.getElementById('poverty-threshold-layers');

    // Add event listener to toggle visibility of sub-layers
    povertyIncidenceData.addEventListener('click', () => {
        if (povertyThresholdLayers.style.display === 'none' || povertyThresholdLayers.style.display === '') {
            povertyThresholdLayers.style.display = 'block';
        } else {
            povertyThresholdLayers.style.display = 'none';
        }
    });

    // Optional: Add event listeners for sub-layers if they need to do something
    document.getElementById('poverty-threshold-215').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to parent
        console.log('Poverty Threshold $2.15 clicked');
        // Add logic for this layer
    });

    document.getElementById('poverty-threshold-365').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to parent
        console.log('Poverty Threshold $3.65 clicked');
        // Add logic for this layer
    });

    document.getElementById('poverty-threshold-685').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling up to parent
        console.log('Poverty Threshold $6.85 clicked');
        // Add logic for this layer
    });
}
