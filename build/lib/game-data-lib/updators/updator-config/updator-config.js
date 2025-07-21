"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorConfig = void 0;
class UpdatorConfig {
    update(gameData) {
        const sources = new Set(TI4.config.sources);
        const config = {
            pok: sources.has("pok"),
            codex1: sources.has("codex.affinity"),
            codex2: sources.has("codex.ordinian"),
            codex3: sources.has("codex.vigil"),
            codex4: false,
        };
        gameData.config = config;
        gameData.platform = "ttpg";
    }
}
exports.UpdatorConfig = UpdatorConfig;
//# sourceMappingURL=updator-config.js.map