export function setRegionColor(map, regionId, color) {
    if (map.getLayer(regionId)) {
        map.setPaintProperty(regionId, 'fill-color', color);
    } else {
        console.warn(`Layer ${regionId} not found`);
    }
}

export const regionColorExpression = [
    'match',
    ['get', 'name'],
    'National Capital Region', '#e6194b',
    'Autonomous Region in Muslim Mindanao', '#3cb44b',
    'Calabarzon', '#ffe119',
    'Western Visayas', '#4363d8',
    'Cordillera Administrative Region', '#f58231',
    'Northern Mindanao', '#911eb4',
    'Negros Island Region', '#46f0f0',
    'Central Visayas', '#f032e6',
    'Zamboanga Peninsula', '#bcf60c',
    'Davao Region', '#fabebe',
    'Bicol Region', '#008080',
    'Eastern Visayas', '#e6beff',
    'Ilocos Region', '#9a6324',
    'MIMAROPA Region', '#fffac8',
    'Caraga', '#800000',
    'Cagayan Valley', '#aaffc3',
    'Soccsksargen', '#808000',
    'Central Luzon', '#ffd8b1',
    '#6f9c76' // default fallback
];

// --- New code for poverty incidence rate color saturation ---

import unifiedData from '../data/region_data.js';

function lerpColor(color1, color2, value) {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * value);
    const g = Math.round(g1 + (g2 - g1) * value);
    const b = Math.round(b1 + (b2 - b1) * value);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

async function createPovertyColorExpression(thresholdKey) {
    const rates = unifiedData.features
        .map(d => d.properties[thresholdKey.toLowerCase()])
        .filter(rate => rate !== undefined);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    const colorExpression = ['match', ['get', 'name']];

    unifiedData.features.forEach(feature => {
        const regionName = feature.properties.name;
        const rate = feature.properties[thresholdKey.toLowerCase()];

        if (rate !== undefined) {
            const normalizedRate = (maxRate - minRate > 0) ? (rate - minRate) / (maxRate - minRate) : 0;
            const color = lerpColor('#fee5d9', '#a50f15', normalizedRate); // From light red to dark red
            colorExpression.push(regionName, color);
        }
    });

    colorExpression.push('#ccc'); // Default color for regions not in the data

    return colorExpression;
}

export function createPovertyColorExpression215() {
    return createPovertyColorExpression('Poverty_Threshold_2_15');
}

export function createPovertyColorExpression365() {
    return createPovertyColorExpression('Poverty_Threshold_3_65');
}

export function createPovertyColorExpression685() {
    return createPovertyColorExpression('Poverty_Threshold_6_85');
}
