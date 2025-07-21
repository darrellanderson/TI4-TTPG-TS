"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSummary = void 0;
const WORMHOLE_TO_CODE = {
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
};
class SystemSummary {
    static getFromSystemTileNumbers(systemTileNumbers) {
        const systems = [];
        systemTileNumbers.forEach((tile) => {
            const system = TI4.systemRegistry.getBySystemTileNumber(tile);
            if (system) {
                systems.push(system);
            }
        });
        return new SystemSummary(systems);
    }
    constructor(systems) {
        this._systems = [];
        this._systems = [...systems];
    }
    getSummaryRaw() {
        const result = {
            influence: 0,
            optInfluence: 0,
            resources: 0,
            optResources: 0,
            legendary: "",
            techs: "",
            traits: "",
            wormholes: "",
        };
        for (const system of this._systems) {
            for (const planet of system.getPlanets()) {
                const inf = planet.getInfluence();
                const res = planet.getResources();
                result.influence += inf;
                if (inf > res) {
                    result.optInfluence += inf;
                }
                else if (inf === res) {
                    result.optInfluence += inf / 2;
                }
                result.resources += res;
                if (res > inf) {
                    result.optResources += res;
                }
                else if (res === inf) {
                    result.optResources += res / 2;
                }
                if (planet.isLegendary()) {
                    result.legendary += "L";
                }
                for (const tech of planet.getTechs()) {
                    result.techs += tech.substring(0, 1).toUpperCase();
                }
                for (const trait of planet.getTraits()) {
                    result.traits += trait.substring(0, 1).toUpperCase();
                }
            }
            for (const wormhole of system.getWormholes()) {
                const code = WORMHOLE_TO_CODE[wormhole];
                if (code) {
                    result.wormholes += code;
                }
            }
        }
        // Sort grouped strings.
        result.techs = result.techs.split("").sort().join("");
        result.traits = result.traits.split("").sort().join("");
        result.wormholes = result.wormholes.split("").sort().join("");
        return result;
    }
    getSummary() {
        const raw = this.getSummaryRaw();
        return [
            `${raw.resources}/${raw.influence}`,
            `(${raw.optResources}/${raw.optInfluence})`,
            raw.techs,
            raw.wormholes,
            raw.legendary,
        ]
            .filter((x) => x.length > 0)
            .join(" ");
    }
}
exports.SystemSummary = SystemSummary;
//# sourceMappingURL=system-summary.js.map