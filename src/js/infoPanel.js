// In infoPanel.js
const panel = document.getElementById('info-panel');

export function show(content) {
    if (panel) {
        panel.innerHTML = content;
        panel.style.display = 'block';
    }
}

export function hide() {
    if (panel) {
        panel.style.display = 'none';
    }
}
