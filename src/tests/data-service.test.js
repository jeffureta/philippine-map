// --- Test Setup ---
console.log('Setting up test environment for data-service.js...');

// Mock necessary browser/Node.js features
let mockData = { message: 'success' };
let fetchShouldSucceed = true;
let fetchShouldBeOk = true;
let fetchCallCount = 0;

global.fetch = (url) => {
    fetchCallCount++;
    console.log(`Mock fetch called for URL: ${url}. Call count: ${fetchCallCount}`);
    return new Promise((resolve, reject) => {
        if (fetchShouldSucceed) {
            if (fetchShouldBeOk) {
                resolve({
                    ok: true,
                    statusText: 'OK',
                    json: () => Promise.resolve(mockData),
                });
            } else {
                resolve({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found',
                    json: () => Promise.resolve({ message: 'error' }),
                });
            }
        } else {
            reject(new Error('Network request failed'));
        }
    });
};

// Load the script to be tested
const fs = require('fs');
const path = require('path');
let getLayerData; // Declare getLayerData in a scope accessible by tests
try {
    const dataServiceCode = fs.readFileSync(path.join(__dirname, '../js/data-service.js'), 'utf8');
    // To make the exported function accessible, we can use a trick:
    // Replace 'export async function getLayerData' with 'global.getLayerData = async function'
    // or simply eval the code and access it from the global scope if it's the only export.
    // For simplicity and consistency with data-module.test.js, let's modify the export.
    const modifiedCode = dataServiceCode.replace('export async function getLayerData', 'global.getLayerData = async function');
    eval(modifiedCode); // This defines `getLayerData` on the global scope
    getLayerData = global.getLayerData; // Assign to our local variable
    console.log('data-service.js module loaded successfully.');
} catch (e) {
    console.error('Failed to load data-service.js', e);
    process.exit(1);
}


// --- Test Runner ---
const tests = [];
function test(description, fn) {
    tests.push({ description, fn });
}

async function runTests() {
    console.log('\n--- Running Tests ---');
    let passed = 0;
    for (const t of tests) {
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
        process.exit(1); // Exit with error code if any test fails
    }
}

// --- Test Cases ---

test('should fetch data successfully for a given layer', async () => {
    fetchCallCount = 0;
    fetchShouldSucceed = true;
    fetchShouldBeOk = true;
    mockData = { id: 1, name: 'Test Data' };

    const layer = { name: 'Test Layer', dataUrl: 'https://example.com/test-data.json' };
    const result = await getLayerData(layer);

    if (fetchCallCount !== 1) throw new Error('fetch should be called once');
    if (JSON.stringify(result) !== JSON.stringify(mockData)) throw new Error('should return the correct data');
});

test('should return null if layer.dataUrl is not provided', async () => {
    fetchCallCount = 0;
    const layer = { name: 'No Data URL Layer' };
    const result = await getLayerData(layer);

    if (fetchCallCount !== 0) throw new Error('fetch should not be called');
    if (result !== null) throw new Error('should return null for missing dataUrl');
});

test('should return null and log error if fetch response is not ok', async () => {
    fetchCallCount = 0;
    fetchShouldSucceed = true;
    fetchShouldBeOk = false; // Simulate a non-ok response
    mockData = { message: 'error' }; // This will be returned by json()

    const layer = { name: 'Error Layer', dataUrl: 'https://example.com/error.json' };
    const result = await getLayerData(layer);

    if (fetchCallCount !== 1) throw new Error('fetch should be called once');
    if (result !== null) throw new Error('should return null on non-ok response');
    // In a real test, you might mock console.error to check if it was called
});

test('should return null and log error if fetch request fails', async () => {
    fetchCallCount = 0;
    fetchShouldSucceed = false; // Simulate a network error

    const layer = { name: 'Network Error Layer', dataUrl: 'https://example.com/network-error.json' };
    const result = await getLayerData(layer);

    if (fetchCallCount !== 1) throw new Error('fetch should be called once');
    if (result !== null) throw new Error('should return null on network failure');
    // In a real test, you might mock console.error to check if it was called
});


// --- Execute ---
runTests();
