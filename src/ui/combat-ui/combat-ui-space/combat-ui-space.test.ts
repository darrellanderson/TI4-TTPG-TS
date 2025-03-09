import { Player } from "@tabletop-playground/api";
import {
  clickAll,
  MockButton,
  MockCardHolder,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CombatUISpace } from "./combat-ui-space";
import { Faction } from "../../../lib/faction-lib/faction/faction";

it("consttructor/getters/destroy", () => {
  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  const combatUiSpace: CombatUISpace = new CombatUISpace(scale, playerSlot);
  expect(combatUiSpace.getSpaceCannonOffense()).toBeDefined();
  expect(combatUiSpace.getAmbush()).toBeDefined();
  expect(combatUiSpace.getAntifighterBarrage()).toBeDefined();
  expect(combatUiSpace.getSpaceCombat()).toBeDefined();
  combatUiSpace.destroy();
});

it("constructor (faction with ambush)", () => {
  new MockCardHolder({ position: [10, 0, 0], owningPlayerSlot: 10 });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:base/mentak",
  });

  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(10);
  if (!faction) {
    throw new Error("faction is undefined");
  }
  expect(
    faction.getAbilityNsids().includes("faction-ability:base/ambush")
  ).toBe(true);

  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  const ui: AbstractUI = new CombatUISpace(scale, playerSlot);

  let ambushCount: number = 0;
  TI4.events.onCombatClicked.add(
    (combatType: string, _planetName: string | undefined, _player: Player) => {
      if (combatType === "ambush") {
        ambushCount++;
      }
    }
  );
  clickAll(ui.getWidget());
  expect(ambushCount).toEqual(1);
});

it("constructor (faction without ambush)", () => {
  new MockCardHolder({ position: [10, 0, 0], owningPlayerSlot: 10 });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:base/arborec",
  });

  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(10);
  if (!faction) {
    throw new Error("faction is undefined");
  }
  expect(
    faction.getAbilityNsids().includes("faction-ability:base/ambush")
  ).toBe(false);

  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  const ui: AbstractUI = new CombatUISpace(scale, playerSlot);

  let ambushCount: number = 0;
  TI4.events.onCombatClicked.add(
    (combatType: string, _planetName: string | undefined, _player: Player) => {
      if (combatType === "ambush") {
        ambushCount++;
      }
    }
  );
  clickAll(ui.getWidget());
  expect(ambushCount).toEqual(0);
});

it("click buttons", () => {
  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  const combatUiSpace: CombatUISpace = new CombatUISpace(scale, playerSlot);

  let eventCombatType: string | undefined = undefined;
  let eventPlanetName: string | undefined = undefined;
  let eventPlayer: Player | undefined = undefined;
  TI4.events.onCombatClicked.add(
    (combatType: string, planetName: string | undefined, player: Player) => {
      eventCombatType = combatType;
      eventPlanetName = planetName;
      eventPlayer = player;
    }
  );

  let mockButton: MockButton;
  const player: Player = new MockPlayer();

  mockButton = combatUiSpace.getSpaceCannonOffense() as MockButton;
  mockButton._clickAsPlayer(player);
  expect(eventCombatType).toEqual("spaceCannonOffense");
  expect(eventPlanetName).toBeUndefined();
  expect(eventPlayer).toBe(player);

  mockButton = combatUiSpace.getAmbush() as MockButton;
  mockButton._clickAsPlayer(player);
  expect(eventCombatType).toEqual("ambush");
  expect(eventPlanetName).toBeUndefined();
  expect(eventPlayer).toBe(player);

  mockButton = combatUiSpace.getAntifighterBarrage() as MockButton;
  mockButton._clickAsPlayer(player);
  expect(eventCombatType).toEqual("antiFighterBarrage");
  expect(eventPlanetName).toBeUndefined();
  expect(eventPlayer).toBe(player);

  mockButton = combatUiSpace.getSpaceCombat() as MockButton;
  mockButton._clickAsPlayer(player);
  expect(eventCombatType).toEqual("spaceCombat");
  expect(eventPlanetName).toBeUndefined();
  expect(eventPlayer).toBe(player);
});
