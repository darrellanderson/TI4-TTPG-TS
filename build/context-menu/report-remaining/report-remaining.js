"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRemaining = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class ReportRemaining {
    constructor() {
        this._actionName = "*Report Remaining";
        this._customActionHandler = (obj, player, actionName) => {
            if (actionName === this._actionName && obj instanceof api_1.Card) {
                this.reportRemaining(obj, player);
            }
        };
        // Do NOT report remaining for action, agenda decks.
        // That can let players deduce cards in players' hands or otherwise hidden.
        this._prefixes = [
            "card.exploration",
            "card.relic",
        ];
    }
    init() {
        for (const obj of api_1.world.getAllObjects()) {
            this._maybeAddContextMenuItem(obj);
        }
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeAddContextMenuItem(obj);
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card) => {
            this._maybeAddContextMenuItem(card);
        });
    }
    _maybeAddContextMenuItem(obj) {
        if (obj instanceof api_1.Card) {
            const nsids = ttpg_darrell_1.NSID.getDeck(obj);
            const nsid = nsids[0];
            if (nsid && this._prefixes.some((prefix) => nsid.startsWith(prefix))) {
                obj.removeCustomAction(this._actionName);
                obj.addCustomAction(this._actionName);
                obj.onCustomAction.remove(this._customActionHandler);
                obj.onCustomAction.add(this._customActionHandler);
            }
        }
    }
    getCardNamesWithCountsMessage(deck) {
        var _a;
        const names = deck
            .getAllCardDetails()
            .map((cardDetails) => {
            return cardDetails.name.replace(/ \(\d\)$/, ""); // strip off card number ("morale boost (2)")
        });
        const nameToCount = new Map();
        for (const name of names) {
            const count = (_a = nameToCount.get(name)) !== null && _a !== void 0 ? _a : 0;
            nameToCount.set(name, count + 1);
        }
        const namesWithCounts = Array.from(nameToCount.keys())
            .sort()
            .map((name) => {
            const count = nameToCount.get(name);
            let result = "";
            if (count !== undefined) {
                if (count === 1) {
                    result = name;
                }
                else {
                    result = `${name} (${count})`;
                }
            }
            return result;
        });
        return "Remaining: " + namesWithCounts.join(", ");
    }
    reportRemaining(deck, player) {
        const msg = this.getCardNamesWithCountsMessage(deck);
        ttpg_darrell_1.Broadcast.chatOne(player, msg);
    }
}
exports.ReportRemaining = ReportRemaining;
//# sourceMappingURL=report-remaining.js.map