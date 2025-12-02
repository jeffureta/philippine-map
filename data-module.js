/**
 * DataHandler module to manage data loading and caching.
 */
const DataHandler = (function () {
    const cache = {};

    /**
     * Loads JSON data from a URL.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<object>} - A promise that resolves to the JSON data.
     */
    async function loadData(url) {
        if (cache[url]) {
            return cache[url];
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load data from ${url}: ${response.statusText}`);
            }
            const data = await response.json();
            cache[url] = data;
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    return {
        loadData
    };
})();
