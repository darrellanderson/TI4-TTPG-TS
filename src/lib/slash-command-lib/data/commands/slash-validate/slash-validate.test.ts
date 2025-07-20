import { MockPlayer } from "ttpg-mock";
import { Spawn } from "ttpg-darrell";
import { SlashValidate } from "./slash-validate";
import { ValidateTemplateNsids } from "../../../../homebrew-lib/validate/validate-template-nsids/validate-template-nsids";

it("getSlashCommand", () => {
  const slashValidate = new SlashValidate();
  expect(slashValidate.getSlashCommand()).toBe("/validate");
  expect(slashValidate.getDescription()).toBeDefined();
});

it("isHostOnly", () => {
  const slashValidate = new SlashValidate();
  expect(slashValidate.isHostOnly()).toBe(true);
});

it("run (no command)", () => {
  const slashValidate = new SlashValidate();
  const player = new MockPlayer({ isHost: true });
  slashValidate.run([], player);
});

it("run (all commands)", () => {
  const slashValidate = new SlashValidate();
  const player = new MockPlayer({ isHost: true });
  slashValidate.run(["all"], player);
});

it("run (template-nsids, nsid mismatch)", () => {
  const slashValidate = new SlashValidate();
  const player = new MockPlayer({ isHost: true });

  Spawn.inject({
    "my-nsid": "abc123",
  });

  const commandName: string = new ValidateTemplateNsids().getCommandName();
  slashValidate.run([commandName], player);
});

it("run (template-nsids, no errors)", () => {
  const slashValidate = new SlashValidate();
  const player = new MockPlayer({ isHost: true });

  const commandName: string = new ValidateTemplateNsids().getCommandName();
  slashValidate.run([commandName], player);
});
