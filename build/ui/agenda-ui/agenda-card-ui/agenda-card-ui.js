"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaCardFaceDownUI = exports.AgendaCardUI = exports.UnzoomedCardUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const create_zoomed_card_ui_1 = require("../../zoomable-ui/create-zoomed-card-ui");
const zoomable_ui_fully_clickable_1 = require("../../zoomable-ui/zoomable-ui-fully-clickable");
const packageId = api_1.refPackageId;
class UnzoomedCardUI extends abtract_ui_1.AbstractUI {
    constructor(agendaCard, scale) {
        const numRows = 7;
        const h = config_1.CONFIG.BUTTON_HEIGHT * numRows * scale +
            config_1.CONFIG.SPACING * (numRows - 1) * scale;
        const size = {
            w: (h * 500) / 750,
            h,
        };
        const widget = new api_1.ImageWidget()
            .setImageSize(size.w, size.h)
            .setSourceCard(agendaCard);
        super(widget, size);
    }
}
exports.UnzoomedCardUI = UnzoomedCardUI;
class AgendaCardUI extends zoomable_ui_fully_clickable_1.ZoomableUiFullyClickable {
    static _getCreateZoomedUI(agendaCard, scale) {
        return () => new UnzoomedCardUI(agendaCard, scale * 2);
    }
    constructor(agendaCard, scale) {
        const unzoomedUi = new UnzoomedCardUI(agendaCard, scale);
        const createZoomedUI = new create_zoomed_card_ui_1.CreateZoomedCardUI(agendaCard).get();
        super(unzoomedUi, scale, createZoomedUI);
    }
}
exports.AgendaCardUI = AgendaCardUI;
class AgendaCardFaceDownUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const numRows = 7;
        const h = config_1.CONFIG.BUTTON_HEIGHT * numRows * scale +
            config_1.CONFIG.SPACING * (numRows - 1) * scale;
        const size = {
            w: (h * 500) / 750,
            h,
        };
        const widget = new api_1.ImageWidget()
            .setImageSize(size.w, size.h)
            .setImage("card/shared-back/agenda.back.jpg", packageId);
        super(widget, size);
    }
}
exports.AgendaCardFaceDownUI = AgendaCardFaceDownUI;
//# sourceMappingURL=agenda-card-ui.js.map