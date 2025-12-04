import { getLayerData } from './data-service.js';

// Data for the layers. This could be fetched from a JSON file in the future.
const layerData = [
    {
        id: 'regions-data',
        name: 'Regions',
        dataUrl: 'src/data/ph-regions.json'
    },
    {
        id: 'poverty-incidence-data',
        name: 'Poverty Incidence Data (2021)',
        subLayers: [
            { id: 'poverty-threshold-215', name: 'Poverty Threshold $2.15', dataUrl: 'src/data/ph-pi-rate.json', dataKey: 'Poverty_Threshold_2_15' },
            { id: 'poverty-threshold-365', name: 'Poverty Threshold $3.65', dataUrl: 'src/data/ph-pi-rate.json', dataKey: 'Poverty_Threshold_3_65' },
            { id: 'poverty-threshold-685', name: 'Poverty Threshold $6.85', dataUrl: 'src/data/ph-pi-rate.json', dataKey: 'Poverty_Threshold_6_85' }
        ]
    }
    // Other main layers can be added here
];

let layerSelectCallback = null;

/**
 * Registers a callback function to be called when a layer is selected.
 * @param {function} callback - The function to call with the selected layer object.
 */
export function onLayerSelect(callback) {
    layerSelectCallback = callback;
}

/**
 * Creates and returns a DOM element for a single layer or a layer group.
 * @param {object} layer - An object containing layer information.
 * @returns {HTMLElement} - The created layer element.
 */
function createLayerElement(layer) {
    const layerItem = document.createElement('div');
    layerItem.id = layer.id;
    layerItem.className = 'layer-item';
    layerItem.textContent = layer.name;

    if (layer.subLayers && layer.subLayers.length > 0) {
        const subLayersContainer = document.createElement('div');
        // Use a more specific ID for the sub-layer container
        subLayersContainer.id = `${layer.id}-sub-layers`;
        subLayersContainer.className = 'sub-layers';
        subLayersContainer.style.display = 'none'; // Initially hidden

        layer.subLayers.forEach(subLayerData => {
            const subLayerItem = createLayerElement(subLayerData); // Recursive call for sub-layers
            subLayerItem.classList.add('sub-layer-item');
            subLayersContainer.appendChild(subLayerItem);
        });

        layerItem.appendChild(subLayersContainer);

        // Toggle visibility of sub-layers on click
        layerItem.addEventListener('click', (event) => {
            // Make sure we are not clicking a sub-layer
            if (event.target === layerItem) {
                const isHidden = subLayersContainer.style.display === 'none' || subLayersContainer.style.display === '';
                subLayersContainer.style.display = isHidden ? 'block' : 'none';
            }
        });
    } else {
        // Handle click for individual layers (that are not groups)
        layerItem.addEventListener('click', async (event) => {
            event.stopPropagation(); // Prevent parent handlers from being notified
            console.log(`Layer clicked: ${layer.name}`);

            // Add animation class
            layerItem.classList.add('clicked-animation');
            setTimeout(() => {
                layerItem.classList.remove('clicked-animation');
            }, 300);

            // Fetch and process data when a layer is clicked
            const data = await getLayerData(layer);
            if (data && layerSelectCallback) {
                // Pass both layer info and the fetched data to the callback
                layerSelectCallback(layer, data);
            } else if (layerSelectCallback) {
                // If there's no data, still call the callback but with null data
                layerSelectCallback(layer, null);
            }
        });
    }

    return layerItem;
}

/**
 * Initializes the sidebar by generating the layer content dynamically.
 */
export function initializeSidebar() {
    const layerContent = document.getElementById('layer-content');
    if (!layerContent) {
        console.error('The "layer-content" element was not found in the DOM.');
        return;
    }

    // Clear any existing content
    layerContent.innerHTML = '';

    // Generate and append new layer elements
    layerData.forEach(layer => {
        const layerElement = createLayerElement(layer);
        layerContent.appendChild(layerElement);
    });

    // Select the first layer (Regions) by default
    if (layerData.length > 0 && layerSelectCallback) {
        const defaultLayer = layerData[0];
        layerSelectCallback(defaultLayer, null);
    }
}