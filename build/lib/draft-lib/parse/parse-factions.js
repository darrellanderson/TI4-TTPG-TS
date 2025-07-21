"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseFactions = void 0;
class ParseFactions {
    parseFactions(config, errors) {
        let index;
        const prefix = "factions=";
        index = config.indexOf(prefix);
        if (index !== -1) {
            config = config.substring(index + prefix.length);
        }
        else {
            // factions= MUST exist to find them.
            return undefined;
        }
        const suffix = "&";
        index = config.indexOf(suffix);
        if (index !== -1) {
            config = config.substring(0, index);
        }
        config = config.toLowerCase();
        const nsidNames = config
            .split("|")
            .filter((s) => s.length > 0);
        const factions = [];
        for (const nsidName of nsidNames) {
            const faction = TI4.factionRegistry.getByNsidName(nsidName);
            if (faction) {
                factions.push(faction);
            }
            else {
                errors.push(`unknown faction "${nsidName}"`);
            }
        }
        return factions.length > 0 ? factions : undefined;
    }
}
exports.ParseFactions = ParseFactions;
//# sourceMappingURL=parse-factions.js.map