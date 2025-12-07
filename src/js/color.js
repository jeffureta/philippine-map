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
    'Davao', '#fabebe',
    'Bicol', '#008080',
    'Eastern Visayas', '#e6beff',
    'Ilocos', '#9a6324',
    'Mimaropa', '#fffac8',
    'Caraga', '#800000',
    'Cagayan Valley', '#aaffc3',
    'Soccsksargen', '#808000',
    'Central Luzon', '#ffd8b1',
    '#6f9c76' // default fallback
];
