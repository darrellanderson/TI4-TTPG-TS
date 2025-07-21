"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFactions = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class GenerateFactions {
    /**
     * Generate random factions, with some logic to deal with Keleres.
     *
     * @param count
     */
    generate(count) {
        let factions = TI4.factionRegistry.getAllFactionsFilteredByConfigSources();
        factions = new ttpg_darrell_1.Shuffle().shuffle(factions);
        return this._resolveOrThrow(count, factions);
    }
    _resolve(count, factions) {
        const result = [];
        // Keleres uses either Argent, Mentak, or Xxcha home systems.
        // Prevent an impossible combination of factions.
        let sawKeleres = false;
        let sawArgent = false;
        let sawMentak = false;
        let sawXxcha = false;
        while (result.length < count && factions.length > 0) {
            const faction = factions.shift();
            const abbr = faction.getAbbr();
            if (abbr.startsWith("Keleres")) {
                if (sawKeleres) {
                    continue; // already present
                }
                if (sawArgent && sawMentak && sawXxcha) {
                    continue; // all candidates already present
                }
                sawKeleres = true;
            }
            if (abbr === "Argent") {
                if (sawKeleres && sawMentak && sawXxcha) {
                    continue; // keleres needs argent home system
                }
                sawArgent = true;
            }
            if (abbr === "Mentak") {
                if (sawKeleres && sawArgent && sawXxcha) {
                    continue; // keleres needs mentak home system
                }
                sawMentak = true;
            }
            if (abbr === "Xxcha") {
                if (sawKeleres && sawArgent && sawMentak) {
                    continue; // keleres needs xxcha home system
                }
                sawXxcha = true;
            }
            result.push(faction);
        }
        return result;
    }
    _resolveOrThrow(count, factions) {
        const result = this._resolve(count, factions);
        if (result.length < count) {
            throw new Error("Insufficient factions");
        }
        return result;
    }
}
exports.GenerateFactions = GenerateFactions;
//# sourceMappingURL=generate-factions.js.map