export function initModal() {
    // Create the modal structure if it doesn't exist
    if (!document.getElementById('filter-modal')) {
        const modal = document.createElement('div');
        modal.id = 'filter-modal';
        modal.className = 'card blue-grey darken-1'; // Materialize card classes
        modal.style.display = 'none'; // Hidden by default

        // Inner HTML structure
        modal.innerHTML = `
            <a href="#!" class="modal-close-btn">x</a>
            <div class="card-content white-text">
                <span class="card-title" id="modal-title">Card Title</span>
                <p id="modal-description">I am a very simple card. I am good at containing small bits of information.</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listener for the close button
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hideFilterModal();
            });
        }
    }
}

export function showFilterModal(layerInfo) {
    const modal = document.getElementById('filter-modal');
    if (!modal) return;

    // Check if 'no filter' is selected
    const noFilterRadio = document.getElementById('no-filter');
    if (noFilterRadio && noFilterRadio.checked) {
        hideFilterModal();
        return;
    }

    const titleCtx = modal.querySelector('#modal-title');
    const descCtx = modal.querySelector('#modal-description');

    if (titleCtx) titleCtx.textContent = layerInfo.title || 'Filter Selected';
    if (descCtx) descCtx.textContent = layerInfo.description || `You have selected the ${layerInfo.title} layer.`;

    // Clear existing legend
    const existingLegend = modal.querySelector('.legend-container');
    if (existingLegend) {
        existingLegend.remove();
    }

    // Add legend if provided
    if (layerInfo.legendItems && layerInfo.legendItems.length > 0) {
        const legendContainer = document.createElement('div');
        legendContainer.className = 'legend-container';
        legendContainer.style.marginTop = '20px';
        legendContainer.style.display = 'grid';
        legendContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        legendContainer.style.gap = '10px';
        legendContainer.style.maxHeight = '300px';
        legendContainer.style.overflowY = 'auto';

        layerInfo.legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.style.display = 'flex';
            legendItem.style.alignItems = 'center';

            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.width = '20px';
            colorBox.style.height = '20px';
            colorBox.style.backgroundColor = item.color;
            colorBox.style.marginRight = '10px';
            colorBox.style.border = '1px solid #ccc';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'legend-name';
            nameSpan.textContent = item.name;
            nameSpan.style.color = 'white';

            legendItem.appendChild(colorBox);
            legendItem.appendChild(nameSpan);
            legendContainer.appendChild(legendItem);
        });

        const cardContent = modal.querySelector('.card-content');
        if (cardContent) {
            cardContent.appendChild(legendContainer);
        }
    }

    modal.style.display = 'block';
}

export function hideFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
