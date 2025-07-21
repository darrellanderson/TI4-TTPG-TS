"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickAgenda = exports.ACTION_PLACE_BOTTOM = exports.ACTION_PLACE_TOP = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_PLACE_TOP = "*Place Agenda Top";
exports.ACTION_PLACE_BOTTOM = "*Place Agenda Bottom";
class RightClickAgenda {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._onSingletonCardCreated = (card, _player) => {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (nsid.startsWith("card.agenda:")) {
                card.addCustomAction(exports.ACTION_PLACE_TOP);
                card.addCustomAction(exports.ACTION_PLACE_BOTTOM);
                card.onCustomAction.add(this._onCustomAction);
            }
        };
        this._onSingletonCardMadeDeck = (card, oldNsid, _player) => {
            if (oldNsid.startsWith("card.agenda:")) {
                card.removeCustomAction(exports.ACTION_PLACE_TOP);
                card.removeCustomAction(exports.ACTION_PLACE_BOTTOM);
                card.onCustomAction.remove(this._onCustomAction);
            }
        };
        this._onCustomAction = (object, _player, identifier) => {
            if (identifier === exports.ACTION_PLACE_TOP) {
                this._place(true, object);
                this._addAgendaDeckDescription("top");
            }
            else if (identifier === exports.ACTION_PLACE_BOTTOM) {
                this._place(false, object);
                this._addAgendaDeckDescription("bottom");
            }
        };
        this._onStrategyCardPlayed = (strategyCard, _player) => {
            const nsid = ttpg_darrell_1.NSID.get(strategyCard);
            if (nsid.startsWith("tile.strategy-card:") && nsid.includes("/politics")) {
                this._clearAgendaDeckDescription();
            }
        };
    }
    _getAgendaDeck() {
        const deckSnapPointTag = "deck-agenda";
        const discardSnapPointTag = "discard-agenda";
        const shuffleDiscard = true;
        const deck = this._find.findDeckOrDiscard(deckSnapPointTag, discardSnapPointTag, shuffleDiscard);
        return deck;
    }
    _clearAgendaDeckDescription() {
        const deck = this._getAgendaDeck();
        if (deck) {
            deck.setName(""); // description is only visible when face up, use name
        }
    }
    _addAgendaDeckDescription(value) {
        const deck = this._getAgendaDeck();
        if (deck) {
            const desc = [...deck.getName().split("\n"), value]
                .filter((x) => x.length > 0)
                .join("\n");
            deck.setName(desc); // description is only visible when face up, use name
        }
    }
    init() {
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(this._onSingletonCardCreated);
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(this._onSingletonCardMadeDeck);
        TI4.events.onStrategyCardPlayed.add(this._onStrategyCardPlayed);
    }
    _place(isTop, card) {
        const deck = this._getAgendaDeck();
        if (deck) {
            const offset = 0;
            const animate = true;
            const flipped = false;
            deck.addCards(card, !isTop, offset, animate, flipped);
        }
    }
}
exports.RightClickAgenda = RightClickAgenda;
//# sourceMappingURL=right-click-agenda.js.map