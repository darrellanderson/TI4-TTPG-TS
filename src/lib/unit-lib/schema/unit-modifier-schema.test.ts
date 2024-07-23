import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import {
  UnitModifierSchema,
  UnitModifierSchemaType,
} from "./unit-modifier-schema";

it("parse", () => {
  const params: UnitModifierSchemaType = {
    name: "name",
    description: "description",
    owner: "self",
    priority: "mutate",
    triggers: [
      {
        cardClass: "technology.red",
        nsidName: "my-nsid-name",
      },
    ],
    applies: (_x: CombatRoll): boolean => {
      return true;
    },
    apply: (_x: CombatRoll): void => {},
  };
  const parsed = UnitModifierSchema.parse(params);
  expect(parsed).toBeDefined(); // toEqual fails for function values, just check exists
});
