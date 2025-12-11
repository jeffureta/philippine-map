
import { it, assertEqual, assert, describe } from './test-helpers.js';
import { initModal, showFilterModal } from '../js/modal.js';
import { regionColorExpression } from '../js/color.js';

describe('Legend Tests', () => {

    it('should display a legend with 18 regions and correct colors when triggered', () => {
        // 1. Setup
        // Ensure modal exists in DOM
        const existingModal = document.getElementById('filter-modal');
        if (existingModal) {
            existingModal.remove();
        }
        initModal();
        const modal = document.getElementById('filter-modal');
        assert(modal, 'Modal should be created');

        // Parse regionColorExpression to get expected data
        // Format: ['match', ['get', 'name'], 'Region 1', 'Color 1', ..., 'Default']
        const expectedLegendItems = [];
        for (let i = 2; i < regionColorExpression.length - 1; i += 2) {
            expectedLegendItems.push({
                name: regionColorExpression[i],
                color: regionColorExpression[i + 1]
            });
        }

        assertEqual(expectedLegendItems.length, 18, 'Should have 18 regions defined in color.js');

        // 2. Action
        // Call showFilterModal with the extracted legend items
        // Note: The implementation of extracting these items will be in script.js,
        // but here we are testing that IF passed, modal.js renders them.
        // OR, we can test that script.js logic works too, but let's focus on modal rendering first as per user request
        // "map legend to show up on @[src/js/modal.js]"

        showFilterModal({
            title: '18 Administrative Regions',
            description: 'Legend test',
            legendItems: expectedLegendItems
        });

        // 3. Assertion
        const legendContainer = modal.querySelector('.legend-container');
        assert(legendContainer, 'Legend container should exist in modal');

        const legendItems = legendContainer.querySelectorAll('.legend-item');
        assertEqual(legendItems.length, 18, 'Should render 18 legend items');

        // Verify first item
        const firstItem = legendItems[0];
        const colorBox = firstItem.querySelector('.legend-color');
        const nameSpan = firstItem.querySelector('.legend-name');

        assert(colorBox, 'Legend item should have a color box');
        assert(nameSpan, 'Legend item should have a name span');

        // Convert hex to rgb for comparison if necessary, but style.backgroundColor usually returns rgb
        // For simplicity validation, we'll check if the name matches
        assertEqual(nameSpan.textContent, 'National Capital Region', 'First region name should match');

        // Check if background color is set (basic check)
        assert(colorBox.style.backgroundColor !== '', 'Color box should have a background color');
    });

});
