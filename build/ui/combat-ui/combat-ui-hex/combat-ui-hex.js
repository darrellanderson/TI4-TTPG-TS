"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatUIHex = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const on_system_activated_1 = require("../../../event/on-system-activated/on-system-activated");
const config_1 = require("../../config/config");
const HALF_HEX_W_PX = config_1.CONFIG.BUTTON_WIDTH + config_1.CONFIG.SPACING / 2;
const packageId = api_1.refPackageId;
class CombatUIHex extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const halfScaledHexWidth = HALF_HEX_W_PX * scale;
        const halfScaledHexHeight = halfScaledHexWidth * 0.866;
        const canvas = new api_1.Canvas();
        const size = {
            w: halfScaledHexWidth * 2,
            h: halfScaledHexHeight * 2,
        };
        const canvasBox = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(canvas);
        super(canvasBox, size);
        this._onSystemActivatedHandler = (_system, _player) => {
            this.update();
        };
        this._canvas = canvas;
        TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
        this.update();
    }
    destroy() {
        TI4.events.onSystemActivated.remove(this._onSystemActivatedHandler);
    }
    update() {
        for (const child of this._canvas.getChildren()) {
            this._canvas.removeChild(child);
        }
        const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        let imgFile = "tile/system/tile-000.png";
        let imgPackageId = packageId;
        if (system) {
            imgFile = system.getImg();
            imgPackageId = system.getImgPackageId();
        }
        const size = this.getSize();
        const img = new api_1.ImageWidget()
            .setImage(imgFile, imgPackageId)
            .setImageSize(size.w, size.h);
        this._canvas.addChild(img, 0, -(size.w - size.h) / 2, size.w, size.w); // hex is square
    }
}
exports.CombatUIHex = CombatUIHex;
//# sourceMappingURL=combat-ui-hex.js.map