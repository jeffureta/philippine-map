
/**
 * Fetches and processes data for a given layer.
 * @param {object} layer - The layer object containing dataUrl and dataKey.
 * @returns {Promise<object>} - A promise that resolves to the processed data.
 */
export async function getLayerData(layer) {
    if (!layer.dataUrl) {
        return Promise.resolve(null); // No data to fetch for this layer
    }

    try {
        const response = await fetch(layer.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // For now, we just return the data associated with the layer.
        // We can add more complex processing here if needed.
        console.log(`Data for layer "${layer.name}":`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching or processing data for layer "${layer.name}":`, error);
        return null;
    }
}
