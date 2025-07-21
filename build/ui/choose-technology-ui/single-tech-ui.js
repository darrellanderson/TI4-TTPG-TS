"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTechUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const config_1 = require("../config/config");
const button_ui_1 = require("../button-ui/button-ui");
const packageId = api_1.refPackageId;
const MAX_NAME_LENGTH = 20;
class SingleTechUI extends abtract_ui_1.AbstractUI {
    constructor(scale, tech, faction, playerTechSummary) {
        const size = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale * 1.3,
        };
        const canvas = new api_1.Canvas();
        const techButtonUi = new button_ui_1.ButtonUI(scale);
        let name = tech.getName();
        if (name.length > MAX_NAME_LENGTH) {
            name = name.substring(0, MAX_NAME_LENGTH - 3) + "...";
        }
        techButtonUi
            .getButton()
            .setEnabled(!playerTechSummary.isOwned(tech.getNsid()))
            .setText(name);
        // Add the tech button.
        const bsize = techButtonUi.getSize();
        canvas.addChild(techButtonUi.getWidget(), 0, 0, bsize.w, bsize.h);
        // Add prequisite tech colors.
        const prereqSize = bsize.h * 0.6;
        const margin = prereqSize * 0.2;
        let x = margin;
        const y = bsize.h - prereqSize * 0.4;
        const colors = ["blue", "green", "red", "yellow"];
        for (const color of colors) {
            const count = tech.getPrerequisites(color);
            const enabled = `ui/tech/${color}-enabled.png`;
            const disabled = `ui/tech/${color}-disabled.png`;
            for (let i = 0; i < count; i++) {
                const isEnabled = i < playerTechSummary.getOwnedCount(color);
                const use = isEnabled ? enabled : disabled;
                const image = new api_1.ImageWidget().setImage(use, packageId);
                canvas.addChild(image, x, y, prereqSize, prereqSize);
                x += prereqSize;
            }
        }
        // Note if a faction tech.
        if (tech.isFactionTech() && faction) {
            const img = faction.getIcon();
            const imgPackageId = faction.getIconPackageId();
            x = bsize.w - prereqSize - margin;
            const image = new api_1.ImageWidget().setImage(img, imgPackageId);
            canvas.addChild(image, x, y, prereqSize, prereqSize);
        }
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(canvas);
        super(box, size);
        this._button = techButtonUi.getButton();
    }
    getButton() {
        return this._button;
    }
}
exports.SingleTechUI = SingleTechUI;
//# sourceMappingURL=single-tech-ui.js.map