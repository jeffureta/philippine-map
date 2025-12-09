import { setRegionColor, regionColorExpression, createPovertyColorExpression215, createPovertyColorExpression365, createPovertyColorExpression685 } from '../js/color.js';
import { it, assert, assertEqual, assertTrue } from './test-helpers.js';




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

it('createPovertyColorExpression should generate a valid color expression', async () => {
    const expression = await createPovertyColorExpression215();

    assertTrue(Array.isArray(expression), 'Expression should be an array');
    assertEqual(expression[0], 'match', 'Expression should start with "match"');
    assertEqual(expression[1][0], 'get', 'Second element should be a "get" expression');
    assertEqual(expression[1][1], 'name', 'It should get the "name" property');

    // Check for region data
    const ilocosIndex = expression.indexOf('Ilocos Region');
    assertTrue(ilocosIndex > -1, 'Expression should contain Ilocos Region');
    assertTrue(typeof expression[ilocosIndex + 1] === 'string' && expression[ilocosIndex + 1].startsWith('#'), 'Ilocos Region should have a color string');

    const calabarzonIndex = expression.indexOf('Calabarzon');
    assertTrue(calabarzonIndex > -1, 'Expression should contain Calabarzon');
    assertTrue(typeof expression[calabarzonIndex + 1] === 'string' && expression[calabarzonIndex + 1].startsWith('#'), 'Calabarzon should have a color string');

    // Check that "Philippines" is ignored
    const philippinesIndex = expression.indexOf('Philippines');
    assertTrue(philippinesIndex === -1, 'Expression should not contain "Philippines" data');

    // Check for default color
    const defaultColor = expression[expression.length - 1];
    assertEqual(defaultColor, '#ccc', 'Expression should have a default color');
});

it('createPovertyColorExpression should handle different thresholds', async () => {
    const expression365 = await createPovertyColorExpression365();
    const centralVisayasIndex365 = expression365.indexOf('Central Visayas');
    assertTrue(centralVisayasIndex365 > -1, '3.65 threshold expression should contain Central Visayas');

    const expression685 = await createPovertyColorExpression685();
    const centralVisayasIndex685 = expression685.indexOf('Central Visayas');
    assertTrue(centralVisayasIndex685 > -1, '6.85 threshold expression should contain Central Visayas');
});