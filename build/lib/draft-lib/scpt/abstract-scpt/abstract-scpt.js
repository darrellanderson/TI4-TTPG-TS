"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractScpt = void 0;
class AbstractScpt {
    getPlayerCount() {
        return TI4.config.playerCount;
    }
    getScptDraftParams() {
        const label = this.getLabel();
        return {
            label,
            qual: this.getQual(),
            prelim: this.getPrelim(),
            semi: this.getSemi(),
            final: this.getFinal(),
        };
    }
}
exports.AbstractScpt = AbstractScpt;
//# sourceMappingURL=abstract-scpt.js.map