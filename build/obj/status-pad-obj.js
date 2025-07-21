"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const packageId = api_1.refPackageId;
class StatusPad {
    constructor(obj) {
        this._obj = obj;
        const imageSize = 150;
        const fontSize = 28;
        this._awayImage = new api_1.ImageWidget().setImageSize(imageSize);
        this._awayButton = new api_1.Button()
            .setFontSize(fontSize)
            .setText((0, ttpg_darrell_1.locale)("AWAY"));
        this._awayButton.onClicked.add((_button, _player) => {
            const playerSlot = this._obj.getOwningPlayerSlot();
            const value = !TI4.turnOrder.getAway(playerSlot);
            TI4.turnOrder.setAway(playerSlot, value);
        });
        this._passImage = new api_1.ImageWidget().setImageSize(imageSize);
        this._passButton = new api_1.Button()
            .setFontSize(fontSize)
            .setText((0, ttpg_darrell_1.locale)("PASS"));
        this._passButton.onClicked.add((_button, _player) => {
            const playerSlot = this._obj.getOwningPlayerSlot();
            const value = !TI4.turnOrder.getPassed(playerSlot);
            TI4.turnOrder.setPassed(playerSlot, value);
        });
        this._elimButton = new api_1.Button()
            .setFontSize(fontSize)
            .setText((0, ttpg_darrell_1.locale)("ELIM"));
        this._elimButton.onClicked.add((_button, _player) => {
            const playerSlot = this._obj.getOwningPlayerSlot();
            const value = !TI4.turnOrder.getEliminated(playerSlot);
            TI4.turnOrder.setEliminated(playerSlot, value);
        });
        const forwardWidget = new api_1.HorizontalBox()
            .setChildDistance(10)
            .addChild(this._awayImage)
            .addChild(this._passImage);
        const forwardUi = new api_1.UIElement();
        forwardUi.anchorY = 1;
        forwardUi.position = new api_1.Vector(0, 0, 0.39); // 0, 0, 1.2
        forwardUi.rotation = new api_1.Rotator(0, 0, 0); // 15, 0, 0
        forwardUi.scale = 0.2;
        forwardUi.widget = forwardWidget;
        obj.addUI(forwardUi);
        const awayPassButtons = new api_1.HorizontalBox()
            .setChildDistance(10)
            .addChild(this._awayButton, 1)
            .addChild(this._passButton, 1)
            .addChild(this._elimButton, 1);
        const layoutBox = new api_1.LayoutBox()
            .setChild(awayPassButtons)
            .setMinimumHeight(150)
            .setMinimumWidth(450)
            .setPadding(10, 10, 10, 10);
        const reverseUi = new api_1.UIElement();
        reverseUi.anchorY = 0;
        reverseUi.position = new api_1.Vector(0, 0, 0.39);
        reverseUi.scale = 0.2;
        reverseUi.widget = new api_1.Border().setChild(layoutBox);
        obj.addUI(reverseUi);
    }
    update() {
        const playerSlot = this._obj.getOwningPlayerSlot();
        const eliminated = TI4.turnOrder.getEliminated(playerSlot);
        const away = TI4.turnOrder.getAway(playerSlot);
        const pass = TI4.turnOrder.getPassed(playerSlot);
        let awayImgPath = away
            ? "status-pad/panel_away_on.png"
            : "status-pad/panel_away_off.png";
        let passImgPath = pass
            ? "status-pad/panel_pass_on.png"
            : "status-pad/panel_pass_off.png";
        if (eliminated) {
            awayImgPath = "status-pad/panel_eliminated.png";
            passImgPath = "status-pad/panel_eliminated.png";
        }
        this._awayButton.setEnabled(!eliminated);
        this._passButton.setEnabled(!eliminated);
        this._awayImage.setImage(awayImgPath, packageId);
        this._passImage.setImage(passImgPath, packageId);
    }
}
const obj = api_1.refObject;
process.nextTick(() => {
    const statusPad = new StatusPad(obj);
    statusPad.update();
    ttpg_darrell_1.TurnOrder.onTurnStateChanged.add((turnOrder) => {
        if (turnOrder === TI4.turnOrder) {
            statusPad.update();
        }
    });
});
//# sourceMappingURL=status-pad-obj.js.map