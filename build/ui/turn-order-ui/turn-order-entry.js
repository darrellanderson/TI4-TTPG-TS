"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnOrderEntry = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const initiative_order_1 = require("../../lib/strategy-card-lib/initiative-order/initiative-order");
const scoreboard_1 = require("../../lib/score-lib/scoreboard/scoreboard");
const packageId = api_1.refPackageId;
// Shared map, resets when updating the first entry in the turn order list.
const __playerSlotToFaction = new Map();
const __playerSlotToScore = new Map();
const __playerSlotToStrategyCards = new Map();
class TurnOrderEntry extends ttpg_darrell_1.TurnEntryWart {
    constructor(turnEntryWidget) {
        super();
        this._scoreboard = new scoreboard_1.Scoreboard();
        this._factionIcon = new api_1.ImageWidget().setImageSize(40, 40);
        this._factionName = new api_1.Text()
            .setFontSize(7)
            .setBold(true)
            .setJustification(api_1.TextJustification.Center)
            .setText("FACTION");
        this._score = new api_1.Text()
            .setFontSize(26)
            .setBold(true)
            .setJustification(api_1.TextJustification.Center)
            .setText("14");
        this._strategyCardSolo = new api_1.Text()
            .setFont("handel-gothic-regular.ttf", packageId)
            .setFontSize(11)
            .setJustification(api_1.TextJustification.Center)
            .setText("LEADERSHIP");
        this._strategyCardSoloOverlay = new api_1.Border();
        this._strategyCardLeft = new api_1.Text()
            .setFont("handel-gothic-regular.ttf", packageId)
            .setFontSize(6)
            .setJustification(api_1.TextJustification.Center)
            .setText("LEADERSHIP");
        this._strategyCardLeftOverLay = new api_1.Border();
        this._strategyCardRight = new api_1.Text()
            .setFont("handel-gothic-regular.ttf", packageId)
            .setFontSize(6)
            .setJustification(api_1.TextJustification.Center)
            .setText("LEADERSHIP");
        this._strategyCardRightOverLay = new api_1.Border();
        const canvas = turnEntryWidget.getCanvas();
        // 220x58
        canvas
            .addChild(this._factionIcon, 4, 4, 40, 40)
            .addChild(this._factionName, 0, 44, 48, 15)
            .addChild(this._score, 175, 3, 45, 45)
            .addChild(this._strategyCardSolo, 45, 31, 130, 29)
            .addChild(this._strategyCardSoloOverlay, 50, 39, 120, 2)
            .addChild(this._strategyCardLeft, 45, 36, 65, 29)
            .addChild(this._strategyCardLeftOverLay, 45, 39, 60, 1)
            .addChild(this._strategyCardRight, 110, 36, 65, 29)
            .addChild(this._strategyCardRightOverLay, 110, 39, 60, 1);
    }
    destroy() { }
    _updatePlayerSlotToFaction() {
        __playerSlotToFaction.clear();
        for (const [playerSlot, faction,] of TI4.factionRegistry.getPlayerSlotToFaction()) {
            __playerSlotToFaction.set(playerSlot, faction);
        }
    }
    _updatePlayerSlotToScore() {
        __playerSlotToScore.clear();
        for (const [playerSlot, score] of this._scoreboard.getPlayerSlotToScore()) {
            __playerSlotToScore.set(playerSlot, score);
        }
    }
    _updatePlayerSlotToStrategyCards() {
        __playerSlotToStrategyCards.clear();
        const initiativeEntries = new initiative_order_1.InitiativeOrder().get();
        for (const initiativeEntry of initiativeEntries) {
            __playerSlotToStrategyCards.set(initiativeEntry.playerSlot, initiativeEntry.strategyCards);
        }
    }
    update(playerSlot, fgColor, _bgColor) {
        var _a, _b, _c, _d;
        // Reset shared state when updating the first entry in the turn order list.
        if (playerSlot === TI4.turnOrder.getTurnOrder()[0]) {
            this._updatePlayerSlotToFaction();
            this._updatePlayerSlotToScore();
            this._updatePlayerSlotToStrategyCards();
        }
        this._factionName.setTextColor(fgColor);
        this._score.setTextColor(fgColor);
        this._strategyCardSolo.setTextColor(fgColor);
        this._strategyCardSoloOverlay.setColor(fgColor);
        this._strategyCardLeft.setTextColor(fgColor);
        this._strategyCardLeftOverLay.setColor(fgColor);
        this._strategyCardRight.setTextColor(fgColor);
        this._strategyCardRightOverLay.setColor(fgColor);
        this._strategyCardSolo.setVisible(false);
        this._strategyCardLeft.setVisible(false);
        this._strategyCardRight.setVisible(false);
        this._strategyCardSoloOverlay.setVisible(false);
        this._strategyCardLeftOverLay.setVisible(false);
        this._strategyCardRightOverLay.setVisible(false);
        // Faction.
        const faction = __playerSlotToFaction.get(playerSlot);
        const factionName = (_a = faction === null || faction === void 0 ? void 0 : faction.getAbbr().toUpperCase()) !== null && _a !== void 0 ? _a : "N/A";
        const factionIcon = (_b = faction === null || faction === void 0 ? void 0 : faction.getIcon()) !== null && _b !== void 0 ? _b : "icon/token/circle-outline-only.png";
        const factionIconPackageId = (_c = faction === null || faction === void 0 ? void 0 : faction.getIconPackageId()) !== null && _c !== void 0 ? _c : packageId;
        this._factionName.setText(factionName);
        this._factionIcon.setImage(factionIcon, factionIconPackageId);
        // Score.
        const score = (_d = __playerSlotToScore.get(playerSlot)) !== null && _d !== void 0 ? _d : 0;
        this._score.setText(score.toString());
        // Strategy cards.
        const strategyCards = __playerSlotToStrategyCards.get(playerSlot);
        const strategyCard1 = strategyCards === null || strategyCards === void 0 ? void 0 : strategyCards[0];
        const strategyCard2 = strategyCards === null || strategyCards === void 0 ? void 0 : strategyCards[1];
        if (!strategyCards) {
            this._strategyCardSolo.setText("–");
            this._strategyCardSolo.setVisible(true);
        }
        else if (strategyCards.length === 1 && strategyCard1) {
            const name = strategyCard1.getName().toUpperCase();
            const active = ttpg_darrell_1.Facing.isFaceUp(strategyCard1);
            this._strategyCardSolo.setText(name);
            this._strategyCardSolo.setVisible(true);
            this._strategyCardSoloOverlay.setVisible(!active);
        }
        else if (strategyCards.length === 2 && strategyCard1 && strategyCard2) {
            const name1 = strategyCard1.getName().toUpperCase();
            const name2 = strategyCard2.getName().toUpperCase();
            const active1 = ttpg_darrell_1.Facing.isFaceUp(strategyCard1);
            const active2 = ttpg_darrell_1.Facing.isFaceUp(strategyCard2);
            this._strategyCardLeft.setText(name1);
            this._strategyCardLeft.setVisible(true);
            this._strategyCardRight.setText(name2);
            this._strategyCardRight.setVisible(true);
            this._strategyCardLeftOverLay.setVisible(!active1);
            this._strategyCardRightOverLay.setVisible(!active2);
        }
    }
}
exports.TurnOrderEntry = TurnOrderEntry;
//# sourceMappingURL=turn-order-entry.js.map