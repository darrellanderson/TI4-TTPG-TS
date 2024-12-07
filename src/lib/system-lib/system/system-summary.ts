import { System } from "../system/system";

const WORMHOLE_TO_CODE: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
};

export type SystemSummaryType = {
  influence: number;
  optInfluence: number;
  resources: number;
  optResources: number;
  legendary: string;
  techs: string;
  traits: string;
  wormholes: string;
};

export class SystemSummary {
  private readonly _systems: ReadonlyArray<System> = [];

  static getFromSystemTileNumbers(
    systemTileNumbers: ReadonlyArray<number>
  ): SystemSummary {
    const systems: Array<System> = [];
    systemTileNumbers.forEach((tile: number) => {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(tile);
      if (system) {
        systems.push(system);
      }
    });
    return new SystemSummary(systems);
  }

  constructor(systems: Array<System>) {
    this._systems = [...systems];
  }

  getSummaryRaw() {
    const result: SystemSummaryType = {
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
        const inf: number = planet.getInfluence();
        const res: number = planet.getResources();

        result.influence += inf;
        if (inf > res) {
          result.optInfluence += inf;
        } else if (inf === res) {
          result.optInfluence += inf / 2;
        }

        result.resources += res;
        if (res > inf) {
          result.optResources += res;
        } else if (res === inf) {
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
        const code: string | undefined = WORMHOLE_TO_CODE[wormhole];
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

  getSummary(): string {
    const raw: SystemSummaryType = this.getSummaryRaw();

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
