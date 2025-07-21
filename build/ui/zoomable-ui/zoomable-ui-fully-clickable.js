"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomableUiFullyClickable = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const zoomable_ui_1 = require("./zoomable-ui");
/**
 * Make the unzoomed UI clickable, show the zoomed version when clicked.
 */
class ZoomableUiFullyClickable extends abtract_ui_1.AbstractUI {
    constructor(unzoomedUi, scale, createZoomedUI) {
        const unzoomedWidget = unzoomedUi.getWidget();
        const unzoomedSize = unzoomedUi.getSize();
        const contentButton = new api_1.ContentButton().setChild(unzoomedWidget);
        // Place zoom button *over* the unzoomed UI.
        const canvas = new api_1.Canvas();
        canvas.addChild(contentButton, -4, -4, unzoomedSize.w + 8, unzoomedSize.h + 8);
        const canvasBox = new api_1.LayoutBox()
            .setOverrideWidth(unzoomedSize.w)
            .setOverrideHeight(unzoomedSize.h)
            .setChild(canvas);
        super(canvasBox, unzoomedSize);
        this._unzoomedUi = unzoomedUi;
        contentButton.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(zoomable_ui_1.ZoomableUI._getOnZoomOpenHandler(createZoomedUI, scale)).get());
    }
    destroy() {
        this._unzoomedUi.destroy();
        super.destroy();
    }
}
exports.ZoomableUiFullyClickable = ZoomableUiFullyClickable;
//# sourceMappingURL=zoomable-ui-fully-clickable.js.map