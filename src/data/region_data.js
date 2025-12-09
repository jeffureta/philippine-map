
import mapData from './ph_updated_nir.json' with { type: 'json' };
import povertyData from './ph-pi-rate.json' with { type: 'json' };

const nameMapping = {
    "Autonomous Region in Muslim Mindanao": "BARMM",
    "Caraga": "Caraga Region",
    "MIMAROPA Region": "Mimaropa"
};

const povertyDataByRegion = {};
povertyData.forEach(item => {
    const regionName = nameMapping[item.region_name] || item.region_name;
    povertyDataByRegion[regionName] = {
        poverty_threshold_2_15: parseFloat(item.Poverty_Threshold_2_15.replace('%', '')),
        poverty_threshold_3_65: parseFloat(item.Poverty_Threshold_3_65.replace('%', '')),
        poverty_threshold_6_85: parseFloat(item.Poverty_Threshold_6_85.replace('%', '')),
    };
});

const unifiedData = {
    ...mapData,
    features: mapData.features.map(feature => {
        const regionName = feature.properties.name;
        const povertyInfo = povertyDataByRegion[regionName];
        return {
            ...feature,
            properties: {
                ...feature.properties,
                ...povertyInfo
            }
        };
    })
};

export default unifiedData;
