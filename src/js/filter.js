import { createPovertyColorExpression215, createPovertyColorExpression365, createPovertyColorExpression685 } from './color.js';

export function initFilter(map) {
    const filterPanel = document.getElementById('filter-panel');

    // Clear existing content
    filterPanel.innerHTML = '<h5>Map Data</h5>';

    const layers = [
        { id: 'no-filter', name: 'No Filter', checked: true },
        { id: 'regions', name: '18 Administrative Regions', checked: false },
        // { id: 'provinces', name: 'Provinces', checked: false },
        {
            id: 'pi-rate',
            name: 'Poverty Incidence Rate',
            checked: false,
            subLayers: [
                { id: 'pi-2-15', name: 'Threshold $2.15', value: 'Poverty_Threshold_2_15' },
                { id: 'pi-3-65', name: 'Threshold $3.65', value: 'Poverty_Threshold_3_65' },
                { id: 'pi-6-85', name: 'Threshold $6.85', value: 'Poverty_Threshold_6_85' }
            ]
        },
    ];

    const form = document.createElement('form');
    form.action = '#';

    layers.forEach(layerInfo => {
        const p = document.createElement('p');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.name = 'map-layer';
        input.type = 'radio';
        input.id = layerInfo.id;
        input.checked = layerInfo.checked;

        const span = document.createElement('span');
        span.textContent = layerInfo.name;

        label.appendChild(input);
        label.appendChild(span);
        p.appendChild(label);
        form.appendChild(p);

        // Handle sub-layers if they exist
        if (layerInfo.subLayers) {
            const subLayerContainer = document.createElement('div');
            subLayerContainer.id = `sub-layers-${layerInfo.id}`;
            subLayerContainer.style.marginLeft = '20px';
            subLayerContainer.style.display = layerInfo.checked ? 'block' : 'none';

            layerInfo.subLayers.forEach((subLayer, index) => {
                const subP = document.createElement('p');
                const subLabel = document.createElement('label');
                const subInput = document.createElement('input');
                subInput.name = `sub-layer-${layerInfo.id}`; // Group for this parent
                subInput.type = 'radio';
                subInput.id = subLayer.id;
                subInput.value = subLayer.value;

                const subSpan = document.createElement('span');
                subSpan.textContent = subLayer.name;
                // subSpan.style.fontSize = '0.9em'; // Optional: make it slightly smaller

                subLabel.appendChild(subInput);
                subLabel.appendChild(subSpan);
                subP.appendChild(subLabel);
                subLayerContainer.appendChild(subP);
            });
            form.appendChild(subLayerContainer);
        }
    });

    filterPanel.appendChild(form);

    // Add event listener to handle layer switching
    form.addEventListener('change', async (event) => { // Made async to handle promises
        const target = event.target;

                    // If a main layer radio is clicked
                if (target.name === 'map-layer') {
                    const selectedLayerId = target.id;
                    console.log(`Selected layer: ${selectedLayerId}`);
        
                    let dataType = null;
                    let subLayerValue = null;
        
                    if (selectedLayerId === 'pi-rate') {
                        dataType = 'poverty incidence';
                        // If 'pi-rate' is selected, check if a sub-layer is already checked
                        const checkedSubLayer = document.querySelector(`input[name="sub-layer-${selectedLayerId}"]:checked`);
                        if (checkedSubLayer) {
                            subLayerValue = checkedSubLayer.value;
                        }
                    }
        
                    // Dispatch custom event for script.js to handle
                    const filterEvent = new CustomEvent('filterChange', {
                        detail: {
                            layerId: selectedLayerId,
                            dataType: dataType,
                            subLayer: subLayerValue
                        }
                    });
                    map.getCanvas().dispatchEvent(filterEvent);
        
                    // Add 'interactive-map-mode' class to #app when a filter is selected
                    document.getElementById('app').classList.add('interactive-map-mode');
        
                    // Show/Hide sub-layers
                    layers.forEach(layer => {
                        const container = document.getElementById(`sub-layers-${layer.id}`);
                        if (container) {
                            container.style.display = (layer.id === selectedLayerId) ? 'block' : 'none';
                        }
                    });
                }
        
                // If a sub-layer radio is clicked
                if (target.name.startsWith('sub-layer-')) {
                    console.log(`Selected sub-layer value: ${target.value}`);
                    const subLayerId = target.id;
                    const subLayerValue = target.value;
                    const parentLayerId = target.name.replace('sub-layer-', ''); // e.g., 'pi-rate'
        
                    let colorExpressionPromise;
        
                    if (subLayerId === 'pi-2-15') {
                        colorExpressionPromise = createPovertyColorExpression215();
                    } else if (subLayerId === 'pi-3-65') {
                        colorExpressionPromise = createPovertyColorExpression365();
                    } else if (subLayerId === 'pi-6-85') {
                        colorExpressionPromise = createPovertyColorExpression685();
                    }
        
                    if (colorExpressionPromise) {
                        try {
                            const expression = await colorExpressionPromise;
                            map.setLayoutProperty('philippines-fill', 'visibility', 'visible'); // Ensure layer is visible
                            if (map.getLayer('philippines-fill')) { // Assuming 'philippines-fill' is the layer ID for the administrative regions
                                map.setPaintProperty('philippines-fill', 'fill-color', expression);
                            } else {
                                console.warn("Map layer 'philippines-fill' not found for coloring.");
                            }
                        } catch (error) {
                            console.error("Error creating poverty color expression:", error);
                        }
                    }
        
                    // Dispatch custom event for script.js to handle with sub-layer info
                    const filterEvent = new CustomEvent('filterChange', {
                        detail: {
                            layerId: parentLayerId, // The main layer ID
                            dataType: 'poverty incidence',
                            subLayer: subLayerValue
                        }
                    });
                    map.getCanvas().dispatchEvent(filterEvent);
                }    });
}
