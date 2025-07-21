"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLASH_COMMANDS = void 0;
const slash_perf_1 = require("./commands/slash-perf/slash-perf");
const slash_toggle_units_1 = require("./commands/slash-toggle-units/slash-toggle-units");
const slash_validate_1 = require("./commands/slash-validate/slash-validate");
exports.SLASH_COMMANDS = [
    new slash_perf_1.SlashPerf(),
    new slash_toggle_units_1.SlashToggleUnits(),
    new slash_validate_1.SlashValidate(),
];
//# sourceMappingURL=slash-command.data.js.map