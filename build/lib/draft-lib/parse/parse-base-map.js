"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseBaseMap = void 0;
const map_string_parser_1 = require("../../map-string-lib/map-string/map-string-parser");
class ParseBaseMap {
    parseBaseMap(config, errors) {
        let index;
        const prefix = "base=";
        index = config.indexOf(prefix);
        if (index !== -1) {
            config = config.substring(index + prefix.length);
        }
        else {
            // prefix MUST exist to find them.
            return undefined;
        }
        const suffix = "&";
        index = config.indexOf(suffix);
        if (index !== -1) {
            config = config.substring(0, index);
        }
        config = config.toLowerCase();
        const mapParserErrors = [];
        new map_string_parser_1.MapStringParser().parse(config, mapParserErrors);
        if (mapParserErrors.length > 0) {
            errors.push("base map bad tiles: " + mapParserErrors.join(", "));
        }
        if (config.length === 0 || errors.length > 0) {
            return undefined;
        }
        return config;
    }
}
exports.ParseBaseMap = ParseBaseMap;
//# sourceMappingURL=parse-base-map.js.map