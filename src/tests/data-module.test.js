// --- Test Setup ---
console.log('Setting up test environment for data-module.js...');

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
try {
    const dataModuleCode = fs.readFileSync(path.join(__dirname, '../js/data-module.js'), 'utf8');
    const modifiedCode = dataModuleCode.replace('const DataHandler', 'global.DataHandler');
    eval(modifiedCode); // This defines `DataHandler` on the global scope
    console.log('DataHandler module loaded successfully.');
} catch (e) {
    console.error('Failed to load data-module.js', e);
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

test('should load data successfully on the first call', async () => {
    fetchCallCount = 0;
    const url = 'https://example.com/data.json';
    const data = await DataHandler.loadData(url);

    if (fetchCallCount !== 1) throw new Error('fetch should be called once');
    if (JSON.stringify(data) !== JSON.stringify(mockData)) throw new Error('should return correct data');
});

test('should return cached data on subsequent calls without fetching', async () => {
    fetchCallCount = 0;
    const url = 'https://example.com/cached-data.json';

    // First call to cache the data
    await DataHandler.loadData(url);
    if (fetchCallCount !== 1) throw new Error('fetch should be called on first load');

    // Second call
    const data = await DataHandler.loadData(url);
    if (fetchCallCount !== 1) throw new Error('fetch should not be called on second load');
    if (JSON.stringify(data) !== JSON.stringify(mockData)) throw new Error('should return cached data');
});

test('should throw an error when fetch response is not ok', async () => {
    fetchShouldBeOk = false;
    const url = 'https://example.com/not-found.json';
    let caughtError = null;
    try {
        await DataHandler.loadData(url);
    } catch (error) {
        caughtError = error;
    }
    
    if (caughtError === null) throw new Error('should have thrown an error');
    if (!caughtError.message.includes('Failed to load data')) throw new Error(`error message should be correct, but was "${caughtError.message}"`);
    fetchShouldBeOk = true; // reset for other tests
});

test('should throw an error when fetch request fails', async () => {
    fetchShouldSucceed = false;
    const url = 'https://example.com/network-error.json';
    let caughtError = null;
    try {
        await DataHandler.loadData(url);
    } catch (error) {
        caughtError = error;
    }

    if (caughtError === null) throw new Error('should have thrown an error');
    if (caughtError.message !== 'Network request failed') throw new Error(`error message should be correct, but was "${caughtError.message}"`);
    fetchShouldSucceed = true; // reset for other tests
});

// --- Execute ---
runTests();
