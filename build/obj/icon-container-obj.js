"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// There's a TTPG bug where container UI causes problems such as
// looping animation of objects entering.  It is fixed in dev, but
// we need to wait for the next release.  In the meantime, create a
// second GameObject to host the UI (cannot use world because there
// are too many for the object size).
const PLACE_UI_ALTERNATE = true;
const SCALE = 4;
const packageId = api_1.refPackageId;
class IconContainerObj {
    constructor(obj) {
        const altId = obj.getId() + "-alt";
        let altObj = api_1.world.getObjectById(altId);
        if (PLACE_UI_ALTERNATE) {
            // Create the alt object if missing.
            if (!altObj) {
                const altPos = obj.getPosition().subtract([0, 0, 100]);
                const templateId = "83FDE12C4E6D912B16B85E9A00422F43"; // cube
                altObj = api_1.world.createObjectFromTemplate(templateId, altPos);
                if (altObj) {
                    altObj.setId(altId);
                    altObj.setObjectType(api_1.ObjectType.NonInteractive);
                }
            }
        }
        else {
            // Not using alternate object, destroy it if it exists.
            if (altObj) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(altObj);
                altObj = undefined;
            }
        }
        const nsid = ttpg_darrell_1.NSID.get(obj);
        this._obj = obj;
        this._altObj = altObj;
        this._iconImage = new api_1.ImageWidget()
            .setImage(this.getIconFile(), packageId)
            .setImageSize(128, 128)
            .setTintColor(new api_1.Color(1, 1, 1, 1));
        this._outlineImage = new api_1.ImageWidget()
            .setImage(this.getOutlineFile(), packageId)
            .setImageSize(128, 128)
            .setTintColor(new api_1.Color(1, 1, 1, 1));
        this._iconUi = new api_1.UIElement();
        this._iconUi.position = new api_1.Vector(0, 0, -1.7);
        this._iconUi.presentationStyle = api_1.UIPresentationStyle.ViewAligned;
        this._iconUi.scale = 1 / SCALE;
        this._iconUi.widget = this._iconImage;
        if (nsid.endsWith("-1")) {
            this._iconUi.scale = this._iconUi.scale * 0.75;
        }
        this._outlineUi = new api_1.UIElement();
        this._outlineUi.position = this._iconUi.position;
        this._outlineUi.presentationStyle = this._iconUi.presentationStyle;
        this._outlineUi.scale = this._iconUi.scale;
        this._outlineUi.widget = this._outlineImage;
    }
    getIconFile() {
        var _a;
        const nsid = ttpg_darrell_1.NSID.get(this._obj);
        const parsed = ttpg_darrell_1.NSID.parse(nsid);
        const firstPart = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.nameParts[0]) !== null && _a !== void 0 ? _a : "Unknown";
        if (nsid.startsWith("container.unit:")) {
            return `icon/unit/${firstPart}.png`;
        }
        else if (nsid === "container.token.command:base/generic") {
            return "icon/token/command.png";
        }
        else if (nsid === "container.token.control:base/generic") {
            return "icon/token/control.png";
        }
        else if (nsid.startsWith("container.token:")) {
            return `icon/token/${firstPart}.png`;
        }
        else {
            throw new Error(`Unknown NSID: ${nsid}`);
        }
    }
    getOutlineFile() {
        const iconImage = this.getIconFile();
        const outlineImage = iconImage.replace(".png", "-outline-only.png");
        const nsid = ttpg_darrell_1.NSID.get(this._obj);
        if (nsid.startsWith("container.token:")) {
            return "icon/token/circle-outline-only.png";
        }
        return outlineImage;
    }
    addUi() {
        if (PLACE_UI_ALTERNATE) {
            this._addUiAlt();
            return;
        }
        this._obj.addUI(this._iconUi);
        this._obj.addUI(this._outlineUi);
    }
    /**
     * If using alt object, reposition and attach ui there.
     */
    _addUiAlt() {
        if (!this._altObj) {
            throw new Error("Cannot add UI to alternate object, it does not exist.");
        }
        // Use the alternate object.ui.position = altObject.worldPositionToLocal(
        const worldPos = this._obj.localPositionToWorld(this._iconUi.position);
        const localPos = this._altObj.worldPositionToLocal(worldPos);
        this._iconUi.position = localPos;
        this._outlineUi.position = localPos;
        this._altObj.addUI(this._iconUi);
        this._altObj.addUI(this._outlineUi);
    }
    updateColor() {
        const nsid = ttpg_darrell_1.NSID.get(this._obj);
        const owner = this._obj.getOwningPlayerSlot();
        if (nsid.startsWith("container.unit") && owner === 19) {
            // Anonymous units.
            this._iconImage.setTintColor(this._obj.getPrimaryColor());
        }
        else if (owner >= 0) {
            const colorLib = new ttpg_darrell_1.ColorLib();
            const colorsType = colorLib.getColorsByPlayerSlotOrThrow(owner);
            const widgetColor = colorLib.parseColorOrThrow(colorsType.widget);
            this._iconImage.setTintColor(widgetColor);
        }
    }
}
const iconContainerObj = new IconContainerObj(api_1.refObject);
// Wait a tick to add any UI (getExtent friendly for layout, plus may move).
process.nextTick(() => {
    iconContainerObj.addUi();
    iconContainerObj.updateColor();
});
TI4.events.onPlayerChangedColor.add(() => {
    iconContainerObj.updateColor();
});
//# sourceMappingURL=icon-container-obj.js.map