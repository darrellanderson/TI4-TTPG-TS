"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickNanoForge = exports.NANO_FORGE_TOKEN_NSID = exports.NANO_FORGE_NSID = exports.ACTION_FETCH_NANO_FORGE = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_FETCH_NANO_FORGE = "*Fetch Nano Forge Token";
exports.NANO_FORGE_NSID = "card.relic:codex.affinity/nanoforge";
exports.NANO_FORGE_TOKEN_NSID = "token.attachment.planet:codex.affinity/nanoforge";
class RightClickNanoForge extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const customActionHandler = (object, _player, identifier) => {
            if (identifier === exports.ACTION_FETCH_NANO_FORGE) {
                const pos = object.getPosition().add([0, 0, 3]);
                this.fetchNanoForgeToken(pos);
            }
        };
        super(exports.NANO_FORGE_NSID, exports.ACTION_FETCH_NANO_FORGE, customActionHandler);
    }
    fetchNanoForgeToken(pos) {
        const find = new ttpg_darrell_1.Find();
        const nanoForgeToken = find.findGameObject(exports.NANO_FORGE_TOKEN_NSID);
        if (nanoForgeToken) {
            const container = nanoForgeToken.getContainer();
            if (container) {
                container.take(nanoForgeToken, pos);
            }
            nanoForgeToken.setPosition(pos);
            nanoForgeToken.snapToGround();
        }
    }
}
exports.RightClickNanoForge = RightClickNanoForge;
//# sourceMappingURL=right-click-nano-forge.js.map