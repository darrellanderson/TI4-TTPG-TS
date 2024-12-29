import { CombatUISpace } from "./combat-ui-space";

it("consttructor/getters/destroy", () => {
  const combatUiSpace: CombatUISpace = new CombatUISpace(1);
  expect(combatUiSpace.getSpaceCannonOffense()).toBeDefined();
  expect(combatUiSpace.getAmbush()).toBeDefined();
  expect(combatUiSpace.getAntifighterBarrage()).toBeDefined();
  expect(combatUiSpace.getSpaceCombat()).toBeDefined();
  combatUiSpace.destroy();
});
