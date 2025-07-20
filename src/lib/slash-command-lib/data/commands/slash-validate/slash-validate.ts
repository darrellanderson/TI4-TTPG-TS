import { Player } from "@tabletop-playground/api";
import { Broadcast } from "ttpg-darrell";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
import { AbstractValidate } from "../../../../homebrew-lib/validate/abstract-validate/abstract-validate";

import { ValidateAttachments } from "../../../../homebrew-lib/validate/validate-attachments/validate-attachments";
import { ValidateFactions } from "../../../../homebrew-lib/validate/validate-factions/validate-factions";
import { ValidatePlanetCards } from "../../../../homebrew-lib/validate/validate-planet-cards/validate-planet-cards";
import { ValidateSystems } from "../../../../homebrew-lib/validate/validate-systems/validate-systems";
import { ValidateTemplateNsids } from "../../../../homebrew-lib/validate/validate-template-nsids/validate-template-nsids";

export class SlashValidate extends AbstractSlashCommand {
  private readonly _validates: Array<AbstractValidate> = [
    new ValidateAttachments(),
    new ValidateFactions(),
    new ValidatePlanetCards(),
    new ValidateSystems(),
    new ValidateTemplateNsids(),
  ];

  getSlashCommand(): `/${string}` {
    return "/validate";
  }

  getDescription(): string {
    return "Run various validations on the game state (e.g. verify homebrew).";
  }

  isHostOnly(): boolean {
    return true;
  }

  run(argv: Array<string>, player: Player): void {
    let commandName: string | undefined = argv[0];

    // If no command given, list all commands.
    if (!commandName) {
      const nameDescs: Array<string> = this._validates.map(
        (validate: AbstractValidate): string => {
          const name: string = validate.getCommandName();
          const desc: string = validate.getDescription();
          return ` - ${name} : ${desc}`;
        }
      );
      nameDescs.unshift(" - all : Run all validations");
      Broadcast.chatOne(
        player,
        `Usage: /validate <name>\n${nameDescs.join("\n")}`
      );
      return;
    }
    commandName = commandName.toLowerCase();

    const errors: Array<string> = [];
    for (const validate of this._validates) {
      if (
        validate.getCommandName().toLowerCase() === commandName ||
        commandName === "all"
      ) {
        validate.getErrors(errors);
      }
    }

    Broadcast.chatOne(player, `Errors found: [\n${errors.join("\n")}\n]`);
  }
}
