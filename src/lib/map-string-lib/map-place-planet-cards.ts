import { Card } from "@tabletop-playground/api";
import { Planet } from "lib/system-lib/planet/planet";

type PlanetAndCardType = {
  planet: Planet;
  card?: Card;
};

export class MapPlacePlanetCards {
  static getPlanetAndCardEntries(): Array<PlanetAndCardType> {
    const entries: Array<PlanetAndCardType> = [];

    const skipContained: boolean = true;
    TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .forEach((system) => {
        system.getPlanets().forEach((planet) => {
          entries.push({
            planet,
          });
        });
      });

    return entries;
  }
}
