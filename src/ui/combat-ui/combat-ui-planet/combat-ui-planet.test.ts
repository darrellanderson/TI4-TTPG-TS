import { System } from "lib/system-lib/system/system";
import { CombatUIPlanet } from "./combat-ui-planet";
import { Planet } from "lib/system-lib/planet/planet";
import { MockGameObject } from "ttpg-mock";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("constructor", () => {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1);
  if (!system) {
    throw new Error("system is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet is undefined");
  }
  new CombatUIPlanet(planet, 1);
});
