"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUnpackTestP = exports.PLAYER_SLOT = exports.FACTION = void 0;
const api_1 = require("@tabletop-playground/api");
exports.FACTION = TI4.factionRegistry.getByNsid("faction:base/arborec");
exports.PLAYER_SLOT = 10;
class AbstractUnpackTestP {
    constructor(unpack) {
        api_1.refObject.addCustomAction("*Unpack");
        api_1.refObject.addCustomAction("*Remove");
        api_1.refObject.onCustomAction.add((_obj, _player, _identifier) => {
            if (_identifier === "*Unpack") {
                unpack.unpack();
                TI4.events.onFactionChanged.trigger(exports.PLAYER_SLOT);
            }
            else if (_identifier === "*Remove") {
                unpack.remove();
                TI4.events.onFactionChanged.trigger(exports.PLAYER_SLOT);
            }
        });
    }
}
exports.AbstractUnpackTestP = AbstractUnpackTestP;
//# sourceMappingURL=abstract-unpack.testp.js.map