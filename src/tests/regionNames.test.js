import { it, assert, assertTrue, describe } from './test-helpers.js';
import unifiedData from '../data/region_data.js';

describe('Region Names Tests', () => {

    it('unifiedData should have poverty data for all regions', () => {
        unifiedData.features.forEach(feature => {
            const props = feature.properties;
            assertTrue(props.hasOwnProperty('poverty_threshold_2_15'), `Region ${props.name} should have poverty_threshold_2_15`);
            assertTrue(typeof props.poverty_threshold_2_15 === 'number', `poverty_threshold_2_15 for ${props.name} should be a number`);

            assertTrue(props.hasOwnProperty('poverty_threshold_3_65'), `Region ${props.name} should have poverty_threshold_3_65`);
            assertTrue(typeof props.poverty_threshold_3_65 === 'number', `poverty_threshold_3_65 for ${props.name} should be a number`);

            assertTrue(props.hasOwnProperty('poverty_threshold_6_85'), `Region ${props.name} should have poverty_threshold_6_85`);
            assertTrue(typeof props.poverty_threshold_6_85 === 'number', `poverty_threshold_6_85 for ${props.name} should be a number`);
        });
    });

});
