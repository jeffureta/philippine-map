// --- Test Setup ---
console.log('Setting up test environment for map-module.js...');

const fs = require('fs');
const path = require('path');

// Simple mock functions to replace jest.fn()
const jest = {
    fn: (implementation) => {
        let impl = implementation;
        function mockFn(...args) {
            mockFn.mock.calls.push(args);
            return impl ? impl.apply(this, args) : undefined;
        }
        mockFn.mock = {
            calls: [],
        };
        mockFn.mockClear = () => {
            mockFn.mock.calls = [];
        };
        mockFn.mockImplementation = (newImpl) => {
            impl = newImpl;
        };
        return mockFn;
    }
};

// Mock dependencies before loading the module
const mockMapInstance = {
    on: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    getCanvas: jest.fn(() => ({ style: {} })),
};

const mockPopupInstance = {};
mockPopupInstance.setLngLat = jest.fn(() => mockPopupInstance);
mockPopupInstance.setHTML = jest.fn(() => mockPopupInstance);
mockPopupInstance.addTo = jest.fn(() => mockPopupInstance);

global.maplibregl = {
    Map: jest.fn(() => mockMapInstance),
    Popup: jest.fn(() => mockPopupInstance),
};

// --- Mocked Modules ---
// These are the modules that map-module.js imports.
// We will define them in the global scope so the evaluated code can access them.
const regionColors = [{ name: 'Test Region', color: '#ff0000' }];
const highlightLegendItem = jest.fn();
const getLayerData = jest.fn();


// --- Load Module ---
// We need to load the module code, but since it uses ES6 imports, we can't `require` it directly
// in this simple Node test runner. We'll read the file and strip the imports.
let initializeMap;
try {
    let mapModuleCode = fs.readFileSync(path.join(__dirname, '../js/map-module.js'), 'utf8');

    // Remove import lines
    mapModuleCode = mapModuleCode.replace(/import .* from '.*';/g, '');

    // Expose the function for testing
    mapModuleCode = mapModuleCode.replace('export function initializeMap', 'global.initializeMap = function');

    // Evaluate the modified code
    eval(mapModuleCode);
    initializeMap = global.initializeMap;
    console.log('map-module.js module loaded and modified for testing.');

} catch (e) {
    console.error('Failed to load or modify map-module.js', e);
    process.exit(1);
}


// --- Test Runner ---
const tests = [];
function test(description, fn) {
    tests.push({ description, fn });
}

async function runTests() {
    console.log('\n--- Running Tests for map-module.js ---');
    let passed = 0;
    for (const t of tests) {
        // Reset mocks before each test
        mockMapInstance.on.mockClear();
        mockMapInstance.addSource.mockClear();
        mockMapInstance.addLayer.mockClear();
        mockMapInstance.getCanvas.mockClear();
        mockPopupInstance.setLngLat.mockClear();
        mockPopupInstance.setHTML.mockClear();
        mockPopupInstance.addTo.mockClear();
        global.maplibregl.Map.mockClear();
        global.maplibregl.Popup.mockClear();
        highlightLegendItem.mockClear();
        getLayerData.mockClear();

        try {
            await t.fn();
            console.log(`✅ PASSED: ${t.description}`);
            passed++;
        } catch (error) {
            console.error(`❌ FAILED: ${t.description}`);
            console.error(error);
        }
    }
    console.log(`\n--- Test Summary ---`);
    console.log(`Total tests: ${tests.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${tests.length - passed}`);

    if (passed !== tests.length) {
        process.exit(1);
    }
}

// --- Test Cases ---

test('should initialize map and set load event listener', () => {
    initializeMap();
    if (global.maplibregl.Map.mock.calls.length !== 1) throw new Error('maplibregl.Map should be called once');
    if (mockMapInstance.on.mock.calls[0][0] !== 'load') throw new Error('should register a "load" event handler');
});

test('on map load, should add source and layer', () => {
    initializeMap();
    const loadCallback = mockMapInstance.on.mock.calls.find(call => call[0] === 'load')[1];
    loadCallback();

    if (mockMapInstance.addSource.mock.calls.length !== 1) throw new Error('addSource should be called once');
    if (mockMapInstance.addSource.mock.calls[0][0] !== 'philippines') throw new Error('should add "philippines" source');

    if (mockMapInstance.addLayer.mock.calls.length !== 1) throw new Error('addLayer should be called once');
    if (mockMapInstance.addLayer.mock.calls[0][0].id !== 'philippines-layer') throw new Error('should add "philippines-layer"');
});

test('on layer click, should call dependencies and show popup', async () => {
    initializeMap();
    const loadCallback = mockMapInstance.on.mock.calls.find(call => call[0] === 'load')[1];
    loadCallback();

    const clickCallback = mockMapInstance.on.mock.calls.find(call => call[0] === 'click' && call[1] === 'philippines-layer')[2];

    const mockEvent = {
        lngLat: { lng: 123, lat: 14 },
        features: [{ properties: { name: 'Test Region' } }],
    };

    const mockPovertyData = {
        Region: 'Test Region',
        Poverty_Threshold_2_15: '100',
        Poverty_Threshold_3_65: '200',
        Poverty_Threshold_6_85: '300',
        Year_of_Estimate: '2023',
    };
    getLayerData.mockClear(); // Clear previous calls if any
    getLayerData.mockImplementation(() => Promise.resolve([mockPovertyData]));


    await clickCallback(mockEvent);

    if (highlightLegendItem.mock.calls.length !== 1) throw new Error('highlightLegendItem should be called');
    if (highlightLegendItem.mock.calls[0][0] !== 'Test Region') throw new Error('highlightLegendItem called with wrong region');

    if (getLayerData.mock.calls.length !== 1) throw new Error('getLayerData should be called');

    if (global.maplibregl.Popup.mock.calls.length !== 1) throw new Error('maplibregl.Popup should be called');
    if (mockPopupInstance.setLngLat.mock.calls[0][0] !== mockEvent.lngLat) throw new Error('Popup LngLat not set correctly');
    if (!mockPopupInstance.setHTML.mock.calls[0][0].includes('Poverty Threshold (2.15): 100')) throw new Error('Popup HTML content is incorrect');
    if (mockPopupInstance.addTo.mock.calls.length !== 1) throw new Error('Popup should be added to the map');
});

test('on layer click, should handle region name mapping', async () => {
    initializeMap();
    const loadCallback = mockMapInstance.on.mock.calls.find(call => call[0] === 'load')[1];
    loadCallback();
    const clickCallback = mockMapInstance.on.mock.calls.find(call => call[0] === 'click' && call[1] === 'philippines-layer')[2];
    const mockEvent = {
        lngLat: { lng: 125, lat: 7 },
        features: [{ properties: { name: 'Davao' } }],
    };
    getLayerData.mockClear();
    getLayerData.mockImplementation(() => Promise.resolve([]));

    await clickCallback(mockEvent);

    if (getLayerData.mock.calls.length !== 1) throw new Error('getLayerData should be called');
    if (getLayerData.mock.calls[0][0].name !== 'Davao Region') throw new Error('Region name should have been mapped to "Davao Region"');
});


// --- Execute ---
runTests();
