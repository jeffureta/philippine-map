const regionColors = [
    { name: 'Autonomous Region in Muslim Mindanao', color: '#e6194b' },
    { name: 'Bicol', color: '#3cb44b' },
    { name: 'Cagayan Valley', color: '#ffe119' },
    { name: 'Calabarzon', color: '#4363d8' },
    { name: 'Caraga', color: '#f58231' },
    { name: 'Central Luzon', color: '#911eb4' },
    { name: 'Central Visayas', color: '#46f0f0' },
    { name: 'Cordillera Administrative Region', color: '#f032e6' },
    { name: 'Davao', color: '#bcf60c' },
    { name: 'Eastern Visayas', color: '#fabebe' },
    { name: 'Ilocos', color: '#008080' },
    { name: 'Mimaropa', color: '#e6beff' },
    { name: 'National Capital Region', color: '#9a6324' },
    { name: 'Northern Mindanao', color: '#fffac8' },
    { name: 'Soccsksargen', color: '#800000' },
    { name: 'Western Visayas', color: '#aaffc3' },
    { name: 'Zamboanga Peninsula', color: '#808000' }
];

function initializeLegend() {
    const legend = document.getElementById('legend');
    if (!legend) return;

    legend.innerHTML = ''; // Clear existing

    regionColors.forEach(region => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color" style="background-color: ${region.color};"></div>
            <span>${region.name}</span>
        `;
        legend.appendChild(item);
    });
}
