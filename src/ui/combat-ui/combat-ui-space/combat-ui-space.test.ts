import { Player } from "@tabletop-playground/api";
import { CombatUISpace } from "./combat-ui-space";
import { MockButton, MockPlayer } from "ttpg-mock";

it("consttructor/getters/destroy", () => {
  const combatUiSpace: CombatUISpace = new CombatUISpace(1);
  expect(combatUiSpace.getSpaceCannonOffense()).toBeDefined();
  expect(combatUiSpace.getAmbush()).toBeDefined();
  expect(combatUiSpace.getAntifighterBarrage()).toBeDefined();
  expect(combatUiSpace.getSpaceCombat()).toBeDefined();
  combatUiSpace.destroy();
});

it("click buttons", () => {
  const combatUiSpace: CombatUISpace = new CombatUISpace(1);

  let eventCombatType: string | undefined = undefined;
  let eventPlanetName: string | undefined = undefined;
  let eventPlayer: Player | undefined = undefined;
  TI4.onCombatClicked.add(
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
