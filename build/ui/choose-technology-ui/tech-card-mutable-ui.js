"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechCardMutableUI = exports.ZoomedTechCardUI = exports.UnzoomedTechCardMutableUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const zoomable_ui_fully_clickable_1 = require("../zoomable-ui/zoomable-ui-fully-clickable");
const packageId = api_1.refPackageId;
class UnzoomedTechCardMutableUI extends abtract_ui_1.AbstractUI {
    constructor(scale, imageWidget) {
        const resize = 0.4;
        const size = {
            w: 750 * scale * resize,
            h: 500 * scale * resize,
        };
        imageWidget.setImageSize(size.w, size.h);
        super(imageWidget, size);
    }
}
exports.UnzoomedTechCardMutableUI = UnzoomedTechCardMutableUI;
class ZoomedTechCardUI extends abtract_ui_1.AbstractUI {
    constructor(scale, cardJson) {
        const extraScale = 1.2;
        const size = {
            w: 750 * scale * extraScale,
            h: 500 * scale * extraScale,
        };
        const imageWidget = new api_1.ImageWidget().setImageSize(size.w, size.h);
        if (cardJson) {
            const pos = new api_1.Vector(0, 0, 100);
            const card = api_1.world.createObjectFromJSON(cardJson, pos);
            if (card instanceof api_1.Card) {
                imageWidget.setSourceCard(card);
            }
            if (card) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(card);
            }
        }
        super(imageWidget, size);
        this._imageWidget = imageWidget;
    }
}
exports.ZoomedTechCardUI = ZoomedTechCardUI;
class TechCardMutableUI extends zoomable_ui_fully_clickable_1.ZoomableUiFullyClickable {
    constructor(scale) {
        const imageWidget = new api_1.ImageWidget().setImage("card/technology/unknown/base/base.back.jpg", packageId);
        const unzoomedUi = new UnzoomedTechCardMutableUI(scale, imageWidget);
        const createZoomedUI = (_scale) => {
            return new ZoomedTechCardUI(scale, this._cardJson);
        };
        super(unzoomedUi, scale, createZoomedUI);
        this._cardUitl = new ttpg_darrell_1.CardUtil();
        this._cardJson = undefined;
        this._imageWidget = imageWidget;
        this._createZoomedUI = createZoomedUI;
    }
    clearCard() {
        this._imageWidget.setImage("card/technology/unknown/base/base.back.jpg", packageId);
        this._cardJson = undefined;
    }
    setCard(card) {
        this._imageWidget.setSourceCard(card);
        this._cardJson = card.toJSONString();
    }
    /**
     * Spawn a new tech deck to get the card, use then destroy both.
     *
     * @param nsid
     * @returns
     */
    setCardNsid(techNsid) {
        const nsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => nsid.startsWith("card.technology"));
        const pos = new api_1.Vector(0, 0, 100);
        const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(nsids, pos);
        if (deck instanceof api_1.Card) {
            const card = this._cardUitl.filterCards(deck, (candidateNsid) => techNsid === candidateNsid);
            if (card) {
                this.setCard(card);
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(card);
            }
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(deck);
    }
}
exports.TechCardMutableUI = TechCardMutableUI;
//# sourceMappingURL=tech-card-mutable-ui.js.map