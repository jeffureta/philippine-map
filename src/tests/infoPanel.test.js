import { show, hide } from '../js/infoPanel.js';

// Mock the DOM element that infoPanel.js interacts with
let mockInfoPanel;

// Helper to set up the DOM before each test
function setupMockPanel() {
    mockInfoPanel = document.createElement('div');
    mockInfoPanel.id = 'info-panel';
    document.body.appendChild(mockInfoPanel);
}

// Helper to clean up the DOM after each test
function cleanupMockPanel() {
    if (mockInfoPanel && document.body.contains(mockInfoPanel)) {
        document.body.removeChild(mockInfoPanel);
    }
    mockInfoPanel = null; // Clear reference
}

it('infoPanel.show should update content and display the panel', () => {
    setupMockPanel();
    const testContent = '<h3>Test Title</h3><p>Some test content.</p>';
    show(testContent);

    assertEqual(mockInfoPanel.innerHTML, testContent);
    assertEqual(mockInfoPanel.style.display, 'block');
    cleanupMockPanel();
});

it('infoPanel.hide should hide the panel', () => {
    setupMockPanel();
    // Ensure it's visible first, then hide
    mockInfoPanel.style.display = 'block';
    hide();

    assertEqual(mockInfoPanel.style.display, 'none');
    cleanupMockPanel();
});

it('infoPanel.show should do nothing if panel element is not found', () => {
    // Do not call setupMockPanel, so the element is not in the DOM
    const initialBodyHTML = document.body.innerHTML; // Capture initial state
    const testContent = '<h3>Test Title</h3><p>Some test content.</p>';
    show(testContent);

    // Verify that the body's HTML hasn't changed (no panel was added or modified)
    assertEqual(document.body.innerHTML, initialBodyHTML);
    // No error should be thrown, and no panel should appear
});

it('infoPanel.hide should do nothing if panel element is not found', () => {
    // Do not call setupMockPanel, so the element is not in the DOM
    const initialBodyHTML = document.body.innerHTML; // Capture initial state
    hide();

    // Verify that the body's HTML hasn't changed
    assertEqual(document.body.innerHTML, initialBodyHTML);
    // No error should be thrown
});
