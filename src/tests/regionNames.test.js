it('should have consistent region names between data files', async () => {
    // Normalization function to make region names comparable
    const normalizeRegionName = (name) => {
        if (!name) return '';
        let normalized = name.toLowerCase();
        // Remove common administrative terms and special characters
        normalized = normalized.replace(/\b(region|administrative|peninsula|autonomous|in muslim mindanao)\b/g, '');
        normalized = normalized.replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric chars
        return normalized;
    };

    // Fetch both data files
    const nirResponse = await fetch('../data/ph_updated_nir.json');
    const nirData = await nirResponse.json();

    const piRateResponse = await fetch('../data/ph-pi-rate.json');
    const piRateData = await piRateResponse.json();

    // Extract and normalize region names from the GeoJSON file
    const nirRegionNames = new Set(
        nirData.features.map(feature => normalizeRegionName(feature.properties.name))
    );

    // Extract and normalize region names from the poverty rate data, ignoring the "Philippines" summary entry
    const piRateRegionNames = new Set(
        piRateData
            .filter(region => region.region_name.toLowerCase() !== 'philippines')
            .map(region => normalizeRegionName(region.region_name))
    );

    // Find discrepancies between the two sets of names
    const inPiRateOnly = [...piRateRegionNames].filter(name => !nirRegionNames.has(name));
    const inNirOnly = [...nirRegionNames].filter(name => !piRateRegionNames.has(name));

    // Build an informative error message if any discrepancies are found
    const errorMessage = [];
    if (inPiRateOnly.length > 0) {
        errorMessage.push(`Regions in ph-pi-rate.json but not in the GeoJSON: [${inPiRateOnly.join(', ')}]`);
    }
    if (inNirOnly.length > 0) {
        errorMessage.push(`Regions in the GeoJSON but not in ph-pi-rate.json: [${inNirOnly.join(', ')}]`);
    }

    // Assert that there are no differences between the two sets
    assert(
        inPiRateOnly.length === 0 && inNirOnly.length === 0,
        errorMessage.join('; ') || 'Region names are consistent.'
    );
});
