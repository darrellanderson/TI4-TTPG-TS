"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickStellarConverter = exports.STELLAR_CONVERTER_TOKEN_NSID = exports.STELLAR_CONVERTER_NSID = exports.ACTION_FETCH_STELLAR_CONVERTER = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_FETCH_STELLAR_CONVERTER = "*Fetch Stellar Converter Token";
exports.STELLAR_CONVERTER_NSID = "card.relic:codex.affinity/nanoforge";
exports.STELLAR_CONVERTER_TOKEN_NSID = "token.attachment.planet:codex.affinity/nanoforge";
class RightClickStellarConverter extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const customActionHandler = (object, _player, identifier) => {
            if (identifier === exports.ACTION_FETCH_STELLAR_CONVERTER) {
                const pos = object.getPosition().add([0, 0, 3]);
                this.fetchNanoForgeToken(pos);
            }
        };
        super(exports.STELLAR_CONVERTER_NSID, exports.ACTION_FETCH_STELLAR_CONVERTER, customActionHandler);
    }
    fetchNanoForgeToken(pos) {
        const find = new ttpg_darrell_1.Find();
        const token = find.findGameObject(exports.STELLAR_CONVERTER_TOKEN_NSID);
        if (token) {
            const container = token.getContainer();
            if (container) {
                container.take(token, pos);
            }
            token.setPosition(pos);
            token.snapToGround();
        }
    }
}
exports.RightClickStellarConverter = RightClickStellarConverter;
//# sourceMappingURL=right-click-stellar-converter.js.map