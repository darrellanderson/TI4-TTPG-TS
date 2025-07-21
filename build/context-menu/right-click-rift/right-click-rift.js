"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickRift = exports.RIFT_ACTION_TOOLTIP = exports.RIFT_ACTION_NAME = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_plastic_1 = require("../../lib/unit-lib/unit-plastic/unit-plastic");
exports.RIFT_ACTION_NAME = "*Rift All Ships In System";
exports.RIFT_ACTION_TOOLTIP = "Roll for all ships in the system, show result on ship (lift and drop to remove)";
class RightClickRift {
    constructor() {
        this._onObjectCreatedHandler = (obj) => {
            if (RightClickRift.isRiftSystemTile(obj)) {
                obj.removeCustomAction(exports.RIFT_ACTION_NAME);
                obj.addCustomAction(exports.RIFT_ACTION_NAME, exports.RIFT_ACTION_TOOLTIP);
                obj.onCustomAction.remove(this._onCustomActionHandler);
                obj.onCustomAction.add(this._onCustomActionHandler);
            }
        };
        this._onCustomActionHandler = (obj, _player, identifier) => {
            if (identifier === exports.RIFT_ACTION_NAME) {
                RightClickRift.rollRift(obj);
            }
        };
    }
    /**
     * Display the rift result as UI, goes away on object drop.
     *
     * @param unitObj
     * @param rollValue
     * @param surviveOn
     */
    static applyRiftResult(unitObj, rollValue, surviveOn = 4) {
        const extraZ = 0.5;
        const currentRotation = true;
        const includeGeometry = false;
        const extent = unitObj.getExtent(currentRotation, includeGeometry);
        const above = unitObj.getPosition().add([0, 0, extent.z + extraZ]);
        const localAbove = unitObj.worldPositionToLocal(above);
        const isSurvivor = rollValue >= surviveOn;
        const bbColor = isSurvivor ? "#00ff00" : "#ff0000";
        const symbol = isSurvivor ? "√" : "X";
        const scale = 4;
        const widget = new api_1.RichText()
            .setBold(true)
            .setFontSize(12 * scale)
            .setText(`[color=${bbColor}]${rollValue}${symbol}[/color]`);
        const c = 0.02;
        const ui = new api_1.UIElement();
        ui.position = localAbove;
        ui.presentationStyle = api_1.UIPresentationStyle.ViewAligned;
        ui.scale = 1 / scale;
        ui.useTransparency = true;
        ui.widget = new api_1.Border().setColor([c, c, c, 0.3]).setChild(widget);
        unitObj.addUI(ui);
        const onReleasedHandler = (obj) => {
            obj.removeUIElement(ui);
            obj.onReleased.remove(onReleasedHandler);
        };
        unitObj.onReleased.add(onReleasedHandler);
        // Also report in chat.
        const plastic = unit_plastic_1.UnitPlastic.getOne(unitObj);
        if (plastic) {
            ttpg_darrell_1.Broadcast.chatAll(`${plastic === null || plastic === void 0 ? void 0 : plastic.getUnit} rolled ${rollValue}: (${isSurvivor ? "survived" : "destroyed"})`);
        }
    }
    static getShipsInRift(riftObj) {
        const hex = TI4.hex.fromPosition(riftObj.getPosition());
        const unitAttrsSet = TI4.unitAttrsRegistry.defaultUnitAttrsSet();
        const plastics = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => {
            const isHex = plastic.getHex() === hex;
            if (!isHex) {
                return false;
            }
            const unitAttrs = unitAttrsSet.get(plastic.getUnit());
            return unitAttrs !== undefined && unitAttrs.isShip();
        });
        unit_plastic_1.UnitPlastic.assignOwners(plastics);
        return plastics.map((plastic) => plastic.getObj());
    }
    static isRiftSystemTile(obj) {
        const system = TI4.systemRegistry.getBySystemTileObjId(obj.getId());
        return (system !== undefined && system.getAnomalies().includes("gravity-rift"));
    }
    static rollRift(riftObj) {
        ttpg_darrell_1.Broadcast.chatAll(`Rolling for all ships in the rift`);
        const ships = RightClickRift.getShipsInRift(riftObj);
        for (const ship of ships) {
            const rollValue = Math.floor(Math.random() * 10) + 1;
            RightClickRift.applyRiftResult(ship, rollValue);
        }
    }
    init() {
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._onObjectCreatedHandler(obj);
        }
    }
}
exports.RightClickRift = RightClickRift;
//# sourceMappingURL=right-click-rift.js.map