"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashPerf = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_slash_command_1 = require("../abstract-slash-command/abstract-slash-command");
class SlashPerf extends abstract_slash_command_1.AbstractSlashCommand {
    constructor() {
        super(...arguments);
        this._perfWidget = undefined;
    }
    getSlashCommand() {
        return "/perf";
    }
    getDescription() {
        return "Toggle the performance widget (FPS).";
    }
    isHostOnly() {
        return true;
    }
    run(_argv, player) {
        if (this._perfWidget) {
            this._perfWidget.detach().destroy();
            this._perfWidget = undefined;
        }
        else {
            this._perfWidget = new ttpg_darrell_1.PerfWidget()
                .toggleVisibility(player.getSlot())
                .attachToScreen();
        }
    }
}
exports.SlashPerf = SlashPerf;
//# sourceMappingURL=slash-perf.js.map