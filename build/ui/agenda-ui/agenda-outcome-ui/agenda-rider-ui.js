"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaRiderUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const config_1 = require("../../config/config");
const zoomable_ui_1 = require("../../zoomable-ui/zoomable-ui");
const create_zoomed_card_ui_1 = require("../../zoomable-ui/create-zoomed-card-ui");
class AgendaRiderUI extends abtract_ui_1.AbstractUI {
    static _createRiderButton(rider, scale) {
        const obj = api_1.world.getObjectById(rider.objId);
        if (!obj) {
            return undefined;
        }
        let name = obj.getName();
        if (obj instanceof api_1.Card) {
            name = obj.getCardDetails().name;
        }
        const maxLength = 20;
        if (name.length > maxLength) {
            name = name.substring(0, maxLength - 3) + "...";
        }
        const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(rider.seat);
        const playerColor = api_1.world.getSlotColor(playerSlot);
        const button = new api_1.Button()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setTextColor(playerColor)
            .setText(name);
        if (obj instanceof api_1.Card) {
            const createZoomedUi = new create_zoomed_card_ui_1.CreateZoomedCardUI(obj).get();
            const onClicked = zoomable_ui_1.ZoomableUI._getOnZoomOpenHandler(createZoomedUi, scale);
            button.onClicked.add(onClicked);
        }
        return button;
    }
    constructor(agendaState, outcomeIndex, scale) {
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale * 4 + config_1.CONFIG.SPACING * 3 * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const panel = new api_1.HorizontalBox().setChildDistance(config_1.CONFIG.SPACING * scale);
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Left)
            .setChild(panel);
        super(box, size);
        let oldKey = "";
        agendaState.onAgendaStateChanged.add(() => {
            const myRiders = agendaState
                .getRiders()
                .filter((r) => r.outcome === outcomeIndex);
            const newKey = myRiders
                .map((r) => r.objId)
                .sort()
                .join("|");
            if (oldKey === newKey) {
                return;
            }
            oldKey = newKey;
            panel.removeAllChildren();
            for (const rider of agendaState.getRiders()) {
                const widget = AgendaRiderUI._createRiderButton(rider, scale);
                if (widget) {
                    panel.addChild(widget);
                }
            }
        });
    }
}
exports.AgendaRiderUI = AgendaRiderUI;
//# sourceMappingURL=agenda-rider-ui.js.map