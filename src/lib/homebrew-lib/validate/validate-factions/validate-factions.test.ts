import { ValidateFactions } from "./validate-factions";

it("getErrors", () => {
  const validateFactions = new ValidateFactions();
  const errors: Array<string> = [];

  validateFactions.getErrors(errors);
  expect(errors.length).toBeGreaterThan(0); // mock does not have all decks/cards
});
