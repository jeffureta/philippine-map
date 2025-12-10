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

    const titleCtx = modal.querySelector('#modal-title');
    const descCtx = modal.querySelector('#modal-description');

    if (titleCtx) titleCtx.textContent = layerInfo.title || 'Filter Selected';
    if (descCtx) descCtx.textContent = layerInfo.description || `You have selected the ${layerInfo.title} layer.`;

    modal.style.display = 'block';
}

export function hideFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}
