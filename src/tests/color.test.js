import { setRegionColor, regionColorExpression } from '../js/color.js';
import { assert, assertEqual } from './test-helpers.js';

it('setRegionColor should set paint property if layer exists', () => {
    const mockMap = {
        layers: { 'test-layer': true },
        getLayer: function(id) {
            return this.layers[id];
        },
        setPaintProperty: function(id, property, value) {
            this.paintProperties[id] = { [property]: value };
        },
        paintProperties: {}
    };

    const regionId = 'test-layer';
    const color = '#FF0000';
    setRegionColor(mockMap, regionId, color);

    assertEqual(mockMap.paintProperties[regionId]['fill-color'], color, 'Should set fill-color property');
});

it('setRegionColor should log a warning if layer does not exist', () => {
    const mockMap = {
        getLayer: function(id) {
            return undefined;
        },
        setPaintProperty: function() {
            // This should not be called
            assert(false, 'setPaintProperty should not be called if layer does not exist');
        }
    };

    // Mock console.warn to capture its output
    const originalWarn = console.warn;
    let warnedMessage = '';
    console.warn = (message) => { warnedMessage = message; };

    const regionId = 'non-existent-layer';
    const color = '#0000FF';
    setRegionColor(mockMap, regionId, color);

    assertEqual(warnedMessage, `Layer ${regionId} not found`, 'Should log a warning for non-existent layer');

    // Restore original console.warn
    console.warn = originalWarn;
});

it('regionColorExpression should be an array', () => {
    assert(Array.isArray(regionColorExpression), 'regionColorExpression should be an array');
});

it('regionColorExpression should start with "match" and "get" expressions', () => {
    assertEqual(regionColorExpression[0], 'match', 'First element should be "match"');
    assert(Array.isArray(regionColorExpression[1]), 'Second element should be an array');
    assertEqual(regionColorExpression[1][0], 'get', 'Second element array should start with "get"');
    assertEqual(regionColorExpression[1][1], 'name', 'Second element array should get "name"');
});

it('regionColorExpression should contain specific region-color pairs', () => {
    // Check a few specific entries
    const ncrIndex = regionColorExpression.indexOf('National Capital Region');
    assert(ncrIndex !== -1, 'National Capital Region should be in the expression');
    assertEqual(regionColorExpression[ncrIndex + 1], '#e6194b', 'National Capital Region should have correct color');

    const calabarzonIndex = regionColorExpression.indexOf('Calabarzon');
    assert(calabarzonIndex !== -1, 'Calabarzon should be in the expression');
    assertEqual(regionColorExpression[calabarzonIndex + 1], '#ffe119', 'Calabarzon should have correct color');
});

it('regionColorExpression should have a default fallback color', () => {
    const lastElement = regionColorExpression[regionColorExpression.length - 1];
    assert(typeof lastElement === 'string' && lastElement.startsWith('#'), 'Last element should be a hex color string');
    assertEqual(lastElement, '#6f9c76', 'Default fallback color should be #6f9c76');
});
