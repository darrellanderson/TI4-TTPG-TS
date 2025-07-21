"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomableUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const wrapped_clickable_ui_1 = require("../wrapped-clickable-ui/wrapped-clickable-ui");
const ttpg_darrell_1 = require("ttpg-darrell");
const packageId = api_1.refPackageId;
const __playerSlotToZoomedScreenUiElement = new Map();
const __playerSlotToZoomedAbstractUI = new Map();
/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 *
 * Each player can only have one zoomed UI at a time, zomming a new UI will
 * close any existing one.
 */
class ZoomableUI extends abtract_ui_1.AbstractUI {
    static _getOnZoomClosedHandler() {
        return (_button, player) => {
            const screenUiElement = __playerSlotToZoomedScreenUiElement.get(player.getSlot());
            if (screenUiElement !== undefined) {
                __playerSlotToZoomedScreenUiElement.delete(player.getSlot());
                api_1.world.removeScreenUIElement(screenUiElement);
            }
            const abstractUi = __playerSlotToZoomedAbstractUI.get(player.getSlot());
            if (abstractUi !== undefined) {
                __playerSlotToZoomedAbstractUI.delete(player.getSlot());
                abstractUi.destroy();
            }
        };
    }
    static _getOnZoomOpenHandler(createZoomedUI, scale) {
        return (_button, player) => {
            // Remove any existing zoomed UI for this player.
            const existingScreenUiElement = __playerSlotToZoomedScreenUiElement.get(player.getSlot());
            if (existingScreenUiElement !== undefined) {
                api_1.world.removeScreenUIElement(existingScreenUiElement);
                __playerSlotToZoomedScreenUiElement.delete(player.getSlot());
            }
            // Display zoomed UI to player.
            // Wrap in a clickable to hide it.
            const zoomedUi = createZoomedUI(scale);
            const clickableUi = new wrapped_clickable_ui_1.WrappedClickableUI(zoomedUi, scale);
            clickableUi
                .getContentButton()
                .onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(ZoomableUI._getOnZoomClosedHandler()).get());
            const screenUiElement = new api_1.ScreenUIElement();
            screenUiElement.anchorX = 0.5;
            screenUiElement.anchorY = 0.5;
            screenUiElement.positionX = 0.5;
            screenUiElement.positionY = 0.5;
            screenUiElement.relativePositionX = true;
            screenUiElement.relativePositionY = true;
            screenUiElement.relativeWidth = false;
            screenUiElement.relativeHeight = false;
            screenUiElement.width = clickableUi.getSize().w;
            screenUiElement.height = clickableUi.getSize().h;
            screenUiElement.players = new api_1.PlayerPermission().addPlayer(player);
            screenUiElement.widget = clickableUi.getWidget();
            api_1.world.addScreenUI(screenUiElement);
            // Register as this player's zoomed UI.
            __playerSlotToZoomedScreenUiElement.set(player.getSlot(), screenUiElement);
            __playerSlotToZoomedAbstractUI.set(player.getSlot(), zoomedUi);
        };
    }
    constructor(unzoomedUi, scale, createZoomedUI) {
        const borderWidth = wrapped_clickable_ui_1.WRAPPED_BORDER_WIDTH * scale + 2;
        const unzoomedWidget = unzoomedUi.getWidget();
        const unzoomedSize = unzoomedUi.getSize();
        const zoomButtonSize = 30 * scale;
        const zoomButton = new api_1.ImageButton()
            .setImage("ui/window/grow.png", packageId)
            .setImageSize(zoomButtonSize, zoomButtonSize);
        // Place zoom button *over* the unzoomed UI.
        const canvas = new api_1.Canvas();
        canvas.addChild(unzoomedWidget, 0, 0, unzoomedSize.w, unzoomedSize.h);
        canvas.addChild(zoomButton, unzoomedSize.w - zoomButtonSize - borderWidth, borderWidth, zoomButtonSize, zoomButtonSize);
        const canvasBox = new api_1.LayoutBox()
            .setOverrideWidth(unzoomedSize.w)
            .setOverrideHeight(unzoomedSize.h)
            .setChild(canvas);
        super(canvasBox, unzoomedSize);
        this._unzoomedUi = unzoomedUi;
        this._zoomButton = zoomButton;
        zoomButton.onClicked.add(new ttpg_darrell_1.ThrottleClickHandler(ZoomableUI._getOnZoomOpenHandler(createZoomedUI, scale)).get());
    }
    destroy() {
        this._unzoomedUi.destroy();
        this._zoomButton.onClicked.clear();
        super.destroy();
    }
}
exports.ZoomableUI = ZoomableUI;
//# sourceMappingURL=zoomable-ui.js.map