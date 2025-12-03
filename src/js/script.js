import { initializeSidebar, onLayerSelect } from './sidebar-module.js';
import { initializeMap } from './map-module.js';
import { initializeLegend } from './legend-module.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeMap();
    initializeLegend(); // Initialize the legend

    // Set up a callback to handle layer selection
    onLayerSelect((layer, data) => {
        console.log("Selected Layer:", layer);
        console.log("Associated Data:", data);
        // Here you can add logic to update the map with the new data
    });
});
