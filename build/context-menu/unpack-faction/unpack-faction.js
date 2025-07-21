"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionContextMenuItem = exports.ACTION_REMOVE = exports.ACTION_UNPACK = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const unpack_all_1 = require("../../lib/faction-lib/unpack/unpack-all/unpack-all");
exports.ACTION_UNPACK = "*Unpack Faction";
exports.ACTION_REMOVE = "*Remove Faction";
/**
 * Right click a faction reference card, "unpack" option.
 */
class UnpackFactionContextMenuItem {
    constructor() {
        this._onCustomActionHandler = (obj, _player, identifier) => {
            if (identifier === exports.ACTION_UNPACK) {
                this._unpackFaction(obj);
            }
            else if (identifier === exports.ACTION_REMOVE) {
                this._removeFaction(obj);
            }
        };
    }
    init() {
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card) => {
            card.removeCustomAction(exports.ACTION_UNPACK);
            card.removeCustomAction(exports.ACTION_REMOVE);
            card.onCustomAction.remove(this._onCustomActionHandler);
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card) => {
            this._maybeAddContextMenuItem(card);
        });
    }
    _maybeAddContextMenuItem(card) {
        const nsid = ttpg_darrell_1.NSID.get(card);
        if (nsid.startsWith("card.faction-reference:")) {
            card.removeCustomAction(exports.ACTION_UNPACK);
            card.removeCustomAction(exports.ACTION_REMOVE);
            card.addCustomAction(exports.ACTION_UNPACK);
            card.addCustomAction(exports.ACTION_REMOVE);
            card.onCustomAction.remove(this._onCustomActionHandler);
            card.onCustomAction.add(this._onCustomActionHandler);
        }
    }
    _getFaction(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        const parsed = ttpg_darrell_1.NSID.parse(nsid);
        if (!parsed) {
            throw new Error(`bad NSID "${nsid}"`);
        }
        const nsidName = parsed.nameParts.join(".");
        const faction = TI4.factionRegistry.getByNsidNameOrThrow(nsidName);
        return faction;
    }
    _getClosest(obj) {
        const pos = obj.getPosition();
        const playerSlot = new ttpg_darrell_1.Find().closestOwnedCardHolderOwner(pos);
        return playerSlot;
    }
    _unpackFaction(obj) {
        const faction = this._getFaction(obj);
        const playerSlot = this._getClosest(obj);
        new unpack_all_1.UnpackAll(faction, playerSlot).unpack();
    }
    _removeFaction(obj) {
        const faction = this._getFaction(obj);
        const playerSlot = this._getClosest(obj);
        new unpack_all_1.UnpackAll(faction, playerSlot).remove();
    }
}
exports.UnpackFactionContextMenuItem = UnpackFactionContextMenuItem;
//# sourceMappingURL=unpack-faction.js.map