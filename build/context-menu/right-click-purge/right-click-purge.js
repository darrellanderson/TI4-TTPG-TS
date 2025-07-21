"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickPurge = exports.PURGE_ACTION_NAME = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.PURGE_ACTION_NAME = "*Purge";
class RightClickPurge {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._onObjectCreatedHandler = (obj) => {
            this._maybeAddPurge(obj);
        };
        this._onCardMadeSingletonHandler = (card) => {
            this._maybeAddPurge(card);
        };
        this._onCardMakeDeckHandler = (card) => {
            card.removeCustomAction(exports.PURGE_ACTION_NAME);
            card.onCustomAction.remove(this._onCustomActionHandler);
        };
        this._onCustomActionHandler = (object, player, identifier) => {
            if (identifier === exports.PURGE_ACTION_NAME) {
                this._purge(object, player.getSlot());
            }
        };
    }
    static _isPurgeable(obj) {
        // This would be a good use for nsid attributes, however those lead to
        // ugly additions to metadata; need to find a better way to have attrs.
        const nsid = ttpg_darrell_1.NSID.get(obj);
        // Relic fragments.
        if (nsid.startsWith("card.exploration") &&
            nsid.includes("-relic-fragment.")) {
            return true;
        }
        // Most heroes.
        if (nsid.startsWith("card.leader.hero:") &&
            nsid !== "card.leader.hero:codex.vigil/xxekir-grom.omega") {
            return true;
        }
        return false;
    }
    init() {
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeAddPurge(obj);
        }
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(this._onCardMadeSingletonHandler);
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(this._onCardMakeDeckHandler);
    }
    _maybeAddPurge(obj) {
        if (RightClickPurge._isPurgeable(obj)) {
            obj.removeCustomAction(exports.PURGE_ACTION_NAME);
            obj.addCustomAction(exports.PURGE_ACTION_NAME);
            obj.onCustomAction.remove(this._onCustomActionHandler);
            obj.onCustomAction.add(this._onCustomActionHandler);
        }
    }
    _purge(obj, playerSlot) {
        const nsid = "container:base/purged";
        const containerOwningPlayerSlot = undefined;
        const skipContained = true;
        const purgeContainer = this._find.findContainer(nsid, containerOwningPlayerSlot, skipContained);
        if (purgeContainer) {
            const playerName = TI4.playerName.getBySlot(playerSlot);
            let objectName = obj.getName();
            if (obj instanceof api_1.Card && obj.getStackSize() === 1) {
                const cardDetails = obj.getCardDetails();
                objectName = cardDetails.name;
            }
            const msg = `${playerName} purged ${objectName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            purgeContainer.addObjects([obj]);
        }
    }
}
exports.RightClickPurge = RightClickPurge;
//# sourceMappingURL=right-click-purge.js.map