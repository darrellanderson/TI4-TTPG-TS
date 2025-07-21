"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashValidate = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_slash_command_1 = require("../abstract-slash-command/abstract-slash-command");
const validate_attachments_1 = require("../../../../homebrew-lib/validate/validate-attachments/validate-attachments");
const validate_factions_1 = require("../../../../homebrew-lib/validate/validate-factions/validate-factions");
const validate_planet_cards_1 = require("../../../../homebrew-lib/validate/validate-planet-cards/validate-planet-cards");
const validate_systems_1 = require("../../../../homebrew-lib/validate/validate-systems/validate-systems");
const validate_template_nsids_1 = require("../../../../homebrew-lib/validate/validate-template-nsids/validate-template-nsids");
class SlashValidate extends abstract_slash_command_1.AbstractSlashCommand {
    constructor() {
        super(...arguments);
        this._validates = [
            new validate_attachments_1.ValidateAttachments(),
            new validate_factions_1.ValidateFactions(),
            new validate_planet_cards_1.ValidatePlanetCards(),
            new validate_systems_1.ValidateSystems(),
            new validate_template_nsids_1.ValidateTemplateNsids(),
        ];
    }
    getSlashCommand() {
        return "/validate";
    }
    getDescription() {
        return "Run various validations on the game state (e.g. verify homebrew).";
    }
    isHostOnly() {
        return true;
    }
    run(argv, player) {
        let commandName = argv[0];
        // If no command given, list all commands.
        if (!commandName) {
            const nameDescs = this._validates.map((validate) => {
                const name = validate.getCommandName();
                const desc = validate.getDescription();
                return ` - ${name} : ${desc}`;
            });
            nameDescs.unshift(" - all : Run all validations");
            ttpg_darrell_1.Broadcast.chatOne(player, `Usage: /validate <name>\n${nameDescs.join("\n")}`);
            return;
        }
        commandName = commandName.toLowerCase();
        const errors = [];
        for (const validate of this._validates) {
            if (validate.getCommandName().toLowerCase() === commandName ||
                commandName === "all") {
                validate.getErrors(errors);
            }
        }
        ttpg_darrell_1.Broadcast.chatOne(player, `Errors found: [\n${errors.join("\n")}\n]`);
    }
}
exports.SlashValidate = SlashValidate;
//# sourceMappingURL=slash-validate.js.map