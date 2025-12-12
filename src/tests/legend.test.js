
import { it, assertEqual, assert, describe } from './test-helpers.js';
import { initModal, showFilterModal } from '../js/modal.js';
import { regionColorExpression } from '../js/color.js';

describe('Legend Tests', () => {
    it('should have 18 administrative regions', () => {
        // regionColorExpression format: ['match', ['get', 'name'], region1, color1, region2, color2, ..., default]
        // Count region names (every odd index from 2 onwards, excluding the last default color)
        const regionCount = (regionColorExpression.length - 3) / 2;
        assertEqual(regionCount, 18, 'Should have exactly 18 administrative regions');
    });

    it('should have 18 different colors', () => {
        // Extract colors (every even index from 3 onwards, excluding the last default color)
        const colors = [];
        for (let i = 3; i < regionColorExpression.length - 1; i += 2) {
            colors.push(regionColorExpression[i]);
        }

        const uniqueColors = new Set(colors);
        assertEqual(uniqueColors.size, 18, 'Should have 18 unique colors');
    });

    it('should not have any color as #6f9c76 (the fallback color)', () => {
        // Check all colors except we allow the default fallback to be #6f9c76
        const colors = [];
        for (let i = 3; i < regionColorExpression.length - 1; i += 2) {
            colors.push(regionColorExpression[i]);
        }

        const hasDefaultColor = colors.includes('#6f9c76');
        assert(!hasDefaultColor, 'No region should have the default color #6f9c76');
    });
});
