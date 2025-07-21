"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetCardLayout = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const TOP = {
    x0: 2.2,
    y0: -0.4,
    dx: -1.6,
    dy: 1.6,
    numCols: 2,
};
const BOT = {
    x0: 2.2,
    y0: 0.4,
    dx: -1.6,
    dy: -1.6,
    numCols: 2,
};
/**
 * Add attachment icons to planet cards.
 */
class PlanetCardLayout {
    layout(planet) {
        const card = this._getCard(planet);
        if (card) {
            this._removeUIs(card);
            planet
                .getAttachments()
                .forEach((attachment, index) => {
                this._addImageCardFace(card, attachment, index);
                this._addImageCardBack(card, attachment, index);
            });
        }
    }
    _getCard(planet) {
        const cardNsid = planet.getPlanetCardNsid();
        const owningPlayerSlot = undefined;
        const skipContained = true;
        return new ttpg_darrell_1.Find().findCard(cardNsid, owningPlayerSlot, skipContained);
    }
    _removeUIs(card) {
        for (const ui of card.getUIs()) {
            card.removeUIElement(ui);
        }
    }
    _addImageCardFace(card, attachment, index) {
        if (index >= 2) {
            index += 1; // obscures values
        }
        if (index >= 4) {
            index += 2; // obscures name, trait
        }
        const col = index % BOT.numCols;
        let row = Math.floor(index / TOP.numCols);
        if (row > 2) {
            row -= 0.5;
        }
        const ui = new api_1.UIElement();
        ui.position = new api_1.Vector(BOT.x0 + row * BOT.dx, BOT.y0 + col * BOT.dy, -0.11);
        ui.rotation = new api_1.Rotator(180, 180, 0);
        ui.scale = 0.3;
        ui.widget = new api_1.ImageWidget()
            .setImage(attachment.getImg(), attachment.getImgPackageId())
            .setImageSize(50, 50);
        ui.zoomVisibility = api_1.UIZoomVisibility.Both;
        card.addUI(ui);
    }
    _addImageCardBack(card, attachment, index) {
        if (index >= 4) {
            index += 2; // obscures values, name, and trait
        }
        const col = index % TOP.numCols;
        const row = Math.floor(index / TOP.numCols);
        const ui = new api_1.UIElement();
        ui.position = new api_1.Vector(TOP.x0 + row * TOP.dx, TOP.y0 + col * TOP.dy, 0.11);
        ui.rotation = new api_1.Rotator(0, 0, 0);
        ui.scale = 0.3;
        ui.widget = new api_1.ImageWidget()
            .setImage(attachment.getImg(), attachment.getImgPackageId())
            .setImageSize(50, 50);
        ui.zoomVisibility = api_1.UIZoomVisibility.Both;
        card.addUI(ui);
    }
}
exports.PlanetCardLayout = PlanetCardLayout;
//# sourceMappingURL=planet-card-layout.js.map