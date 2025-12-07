export function initFilter(map) {
    const filterPanel = document.getElementById('filter-panel');

    // Clear existing content
    filterPanel.innerHTML = '<h5>Map Data</h5>';

    const layers = [
        { id: 'regions', name: '18 Administrative Regions', checked: true },
        // { id: 'provinces', name: 'Provinces', checked: false },
        { id: 'pi-rate', name: 'Poverty Incidence Rate', checked: false },
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
    });

    filterPanel.appendChild(form);

    // Add event listener to handle layer switching
    form.addEventListener('change', (event) => {
        const selectedLayer = event.target.id;
        console.log(`Selected layer: ${selectedLayer}`);
        // Here you would add logic to switch map layers
        // For now, it just logs the selection.
    });
}
