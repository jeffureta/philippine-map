export function initFilter(map) {
    const filterPanel = document.getElementById('filter-panel');

    // Clear existing content
    filterPanel.innerHTML = '<h5>Map Data</h5>';

    const layers = [
        { id: 'regions', name: '18 Administrative Regions', checked: true },
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
                subInput.checked = index === 0; // Select first by default

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
    form.addEventListener('change', (event) => {
        const target = event.target;

        // If a main layer radio is clicked
        if (target.name === 'map-layer') {
            const selectedLayerId = target.id;
            console.log(`Selected layer: ${selectedLayerId}`);

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
        }
    });
}
