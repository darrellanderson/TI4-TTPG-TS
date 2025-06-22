import { ValidateFactions } from "./validate-factions";

it("getCommandName", () => {
  const validateFactions = new ValidateFactions();
  expect(validateFactions.getCommandName()).toBe("factions");
});

it("getDescription", () => {
  const validateFactions = new ValidateFactions();
  expect(validateFactions.getDescription()).toBeDefined();
});

it("getErrors", () => {
  const validateFactions = new ValidateFactions();
  const errors: Array<string> = [];

  validateFactions.getErrors(errors);
  expect(errors.length).toBeGreaterThan(0); // mock does not have all decks/cards
});
