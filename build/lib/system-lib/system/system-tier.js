"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTier = void 0;
class SystemTier {
    getTier(system) {
        if (system.isExcludeFromDraft() ||
            system.isHome() ||
            system.isHyperlane() ||
            system.getClass() !== "map") {
            return "other";
        }
        if (system.getAnomalies().length > 0 || system.getPlanets().length === 0) {
            return "red";
        }
        const tile = system.getSystemTileNumber();
        const planetCount = system.getPlanets().length;
        const techPlanetCount = system
            .getPlanets()
            .filter((planet) => planet.getTechs().length > 0).length;
        const hasLegendary = system
            .getPlanets()
            .some((planet) => planet.isLegendary());
        if (tile === 26 || tile === 64) {
            // Special case move Atlas/Lodor to med.
            return "med";
        }
        else if ((planetCount >= 2 && techPlanetCount >= 1) || hasLegendary) {
            return "high";
        }
        else if (planetCount >= 2 && techPlanetCount === 0) {
            return "med";
        }
        return "low"; // planetCount === 1
    }
}
exports.SystemTier = SystemTier;
//# sourceMappingURL=system-tier.js.map