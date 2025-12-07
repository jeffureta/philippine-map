import { map } from './map.js';
import { initFilter } from './filter.js';

map.on('load', function () {
    initFilter(map);
});