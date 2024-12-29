import { System } from "lib/system-lib/system/system";
import { CombatUIPlanet } from "./combat-ui-planet";
import { Planet } from "lib/system-lib/planet/planet";
import { MockButton, MockGameObject, MockPlayer } from "ttpg-mock";
import { Player } from "@tabletop-playground/api";
import { CombatRollType } from "lib/combat-lib/combat-roll/combat-roll";

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

it("constructor/getters/destroy", () => {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1);
  if (!system) {
    throw new Error("system is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet is undefined");
  }
  const player: Player = new MockPlayer();
  TI4.onSystemActivated.trigger(system, player);

  const planetIndex: number = 0;
  const scale: number = 0;
  const combatUiPlanet: CombatUIPlanet = new CombatUIPlanet(planetIndex, scale);
  expect(combatUiPlanet.getBombardment()).toBeDefined();
  expect(combatUiPlanet.getSpaceCannonDefense()).toBeDefined();
  expect(combatUiPlanet.getGroundCombat()).toBeDefined();
  combatUiPlanet.destroy();
});

it("click buttons", () => {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1);
  if (!system) {
    throw new Error("system is undefined");
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet is undefined");
  }
  const player: Player = new MockPlayer();
  TI4.onSystemActivated.trigger(system, player);

  const planetIndex: number = 0;
  const scale: number = 0;
  const combatUiPlanet: CombatUIPlanet = new CombatUIPlanet(planetIndex, scale);

  // Again just to exercise the handler.
  TI4.onSystemActivated.trigger(system, player);

  let eventCombatRollType: CombatRollType | undefined = undefined;
  let eventPlanetName: string | undefined = undefined;
  let eventPlayer: Player | undefined = undefined;
  TI4.onCombatClicked.add((combatRollType, planetName, player) => {
    eventCombatRollType = combatRollType;
    eventPlanetName = planetName;
    eventPlayer = player;
  });
  expect(eventCombatRollType).toBeUndefined();
  expect(eventPlanetName).toBeUndefined();
  expect(eventPlayer).toBeUndefined();

  let mockButtton: MockButton;
  mockButtton = combatUiPlanet.getBombardment() as MockButton;
  mockButtton._clickAsPlayer(player);
  expect(eventCombatRollType).toBe("bombardment");
  expect(eventPlanetName).toBe("Jord");
  expect(eventPlayer).toBe(player);

  mockButtton = combatUiPlanet.getSpaceCannonDefense() as MockButton;
  mockButtton._clickAsPlayer(player);
  expect(eventCombatRollType).toBe("spaceCannonDefense");
  expect(eventPlanetName).toBe("Jord");
  expect(eventPlayer).toBe(player);

  mockButtton = combatUiPlanet.getGroundCombat() as MockButton;
  mockButtton._clickAsPlayer(player);
  expect(eventCombatRollType).toBe("groundCombat");
  expect(eventPlanetName).toBe("Jord");
  expect(eventPlayer).toBe(player);
});
