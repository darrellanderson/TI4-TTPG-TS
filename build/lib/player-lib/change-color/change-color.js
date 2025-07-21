"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeColor = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Change player color.
 *
 * - Recolor status pad.
 * - Recolor command, leader sheets.
 * - Recolor units.
 * - Recolor unit containers.
 * - Recolor command, control tokens.
 * - Recolor faction-extras, command, control containers.
 * - Replace generic-color promissories.
 * - Recolor player area border lines.
 *
 * - Send on color changed event (unit containers).
 *
 * - Card holder hand / secret should automatically pick up slot color change.
 */
class ChangeColor {
    constructor(playerSlot) {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        this._recolorNsids = new Set([
            "mat:base/status-pad",
            "sheet:base/command",
            "sheet:pok/leader",
            "unit:base/carrier",
            "unit:base/cruiser",
            "unit:base/destroyer",
            "unit:base/dreadnought",
            "unit:base/fighter",
            "unit:base/flagship",
            "unit:base/infantry",
            "unit:base/pds",
            "unit:base/space-dock",
            "unit:base/war-sun",
            "unit:pok/mech",
            "container.unit:base/carrier",
            "container.unit:base/cruiser",
            "container.unit:base/destroyer",
            "container.unit:base/dreadnought",
            "container.unit:base/fighter",
            "container.unit:base/flagship",
            "container.unit:base/infantry",
            "container.unit:base/pds",
            "container.unit:base/space-dock",
            "container.unit:base/war-sun",
            "container.unit:pok/mech",
            "container:base/faction-extras",
            "container.token.command:base/generic",
            "container.token.control:base/generic",
        ]);
        this._recolorNsidPrefixes = [
            "token.command:",
            "token.control:",
        ];
        this._playerSlot = playerSlot;
    }
    _shouldChangeColor(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        const owner = obj.getOwningPlayerSlot();
        if (owner === this._playerSlot) {
            if (this._recolorNsids.has(nsid)) {
                return true;
            }
            for (const prefix of this._recolorNsidPrefixes) {
                if (nsid.startsWith(prefix)) {
                    return true;
                }
            }
        }
        return false;
    }
    changeColor(newColorName, newColorHex) {
        const oldColorName = TI4.playerColor.getSlotColorNameOrThrow(this._playerSlot);
        TI4.playerColor.setSlotColor(this._playerSlot, newColorName, newColorHex);
        const plasticColor = TI4.playerColor.getSlotPlasticColorOrThrow(this._playerSlot);
        const skipContained = false; // look inside containers
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (this._shouldChangeColor(obj)) {
                obj.setPrimaryColor(plasticColor);
            }
        }
        this._recolorPlayerAreaBorderLines();
        if (oldColorName !== newColorName) {
            this._replaceGenericPromissories(oldColorName, newColorName);
        }
    }
    _recolorPlayerAreaBorderLines() {
        const widgetColor = TI4.playerColor.getSlotWidgetColorOrThrow(this._playerSlot);
        const tag = `player-area-${this._playerSlot}`;
        for (const line of api_1.world.getDrawingLines()) {
            if (line.tag === tag) {
                api_1.world.removeDrawingLineObject(line);
                line.color = widgetColor;
                api_1.world.addDrawingLine(line);
            }
        }
    }
    _replaceGenericPromissories(oldColorName, newColorName) {
        const sourcesAndNames = [
            "base/ceasefire",
            "base/political-secret",
            "base/support-for-the-throne",
            "base/trade-agreement",
            "pok/alliance",
        ];
        const _getPromissoryDeck = () => {
            const deckNsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => nsid.startsWith("card.promissory"));
            const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(deckNsids);
            return deck;
        };
        const promissoryDeck = _getPromissoryDeck();
        const _getGenericPromissoryCard = (deck, wantNsid) => {
            const cardStack = this._cardUtil.filterCards(deck, (nsid) => {
                return nsid === wantNsid;
            });
            if (!cardStack || cardStack.getStackSize() !== 1) {
                throw new Error(`Expected 1 card in stack: ${wantNsid}`);
            }
            return cardStack;
        };
        const nsids = new Set(sourcesAndNames.map((sourceAndName) => {
            return `card.promissory.${oldColorName}:${sourceAndName}`;
        }));
        const skipContained = false; // look inside containers
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsids.has(nsid) && obj instanceof api_1.Card) {
                const newNsid = nsid.replace(oldColorName, newColorName);
                if (obj.isHeld()) {
                    obj.release();
                }
                const pos = obj.getPosition();
                const rot = obj.getRotation();
                // If in a card holder (likely) rememeber the holder and index.
                const holder = obj.getHolder();
                let index = -1;
                if (holder) {
                    index = holder.getCards().indexOf(obj);
                    if (index >= 0) {
                        holder.removeAt(index);
                    }
                }
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
                const newCard = _getGenericPromissoryCard(promissoryDeck, newNsid);
                newCard.setPosition(pos);
                newCard.setRotation(rot);
                if (holder) {
                    index = Math.min(index, holder.getCards().length);
                    holder.insert(newCard, index);
                }
            }
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(promissoryDeck);
    }
}
exports.ChangeColor = ChangeColor;
//# sourceMappingURL=change-color.js.map