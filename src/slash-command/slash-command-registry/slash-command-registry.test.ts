import { SlashCommandRegistry } from "./slash-command-registry";

it("constructor/init", () => {
  const registry = new SlashCommandRegistry();
  registry.init();
});
