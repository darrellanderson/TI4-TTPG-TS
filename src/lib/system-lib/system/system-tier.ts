import { System } from "../system/system";

export type SystemTierType = "red" | "high" | "med" | "low" | "other";

export class SystemTier {
  getTier(system: System): SystemTierType {
    if (
      system.isExcludeFromDraft() ||
      system.isHome() ||
      system.isHyperlane() ||
      system.getClass() !== "map"
    ) {
      return "other";
    }

    if (system.getAnomalies().length > 0 || system.getPlanets().length === 0) {
      return "red";
    }

    const tile: number = system.getSystemTileNumber();
    const planetCount: number = system.getPlanets().length;
    const techPlanetCount: number = system
      .getPlanets()
      .filter((planet) => planet.getTechs().length > 0).length;
    const hasLegendary: boolean = system
      .getPlanets()
      .some((planet) => planet.isLegendary());

    if (tile === 26 || tile === 64) {
      // Special case move Atlas/Lodor to med.
      return "med";
    } else if ((planetCount >= 2 && techPlanetCount >= 1) || hasLegendary) {
      return "high";
    } else if (planetCount >= 2 && techPlanetCount === 0) {
      return "med";
    }
    return "low"; // planetCount === 1
  }
}
