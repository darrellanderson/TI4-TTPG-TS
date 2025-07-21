"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const WAIT_MSECS_BEFORE_ROLL = 2500;
class QuickRoller {
    constructor(gameObject) {
        this._buttons = [];
        this._borders = [];
        this._value = 5;
        this._obj = gameObject;
        const scale = 8;
        const w = 95 * scale;
        const h = w;
        const buttonW = 15 * scale;
        const buttonH = buttonW;
        const canvas = new api_1.Canvas();
        const ui = new api_1.UIElement();
        ui.useWidgetSize = false;
        ui.width = w;
        ui.height = h;
        ui.position = new api_1.Vector(0, 0, 0.24);
        ui.rotation = new api_1.Rotator(0, 0, 0);
        ui.scale = 1 / scale;
        ui.widget = canvas;
        gameObject.addUI(ui);
        const r = (w / 2 - buttonW / 2) * 0.95;
        for (let i = 1; i <= 10; i++) {
            const phi = (Math.PI / 5) * i;
            const x = Math.sin(phi) * r + w / 2 - buttonW / 2;
            const y = -Math.cos(phi) * r + h / 2 - buttonH / 2;
            const button = new api_1.Button().setFontSize(60).setText(i.toString());
            button.onClicked.add((_button, player) => {
                this.onClickedValue(i, player);
            });
            this._buttons.push(button);
            const border = new api_1.Border().setChild(button);
            this._borders.push(border);
            canvas.addChild(border, x, y, buttonW, buttonH);
        }
        const s = w * 0.4;
        this._rollButton = new api_1.Button().setFontSize(140).setText("@");
        this._rollButton.onClicked.add((_button, player) => {
            this.onClickedRoll(player);
        });
        canvas.addChild(this._rollButton, w / 2 - s / 2, h / 2 - s / 2, s, s);
        this.update();
    }
    update() {
        const colorLib = new ttpg_darrell_1.ColorLib();
        this._buttons.forEach((button, i) => {
            const active = this._value === i + 1;
            button.setEnabled(!active);
        });
        this._borders.forEach((border, i) => {
            const active = this._value === i + 1;
            const colorHex = active ? "#ff0000" : "#000000";
            const color = colorLib.parseColorOrThrow(colorHex);
            border.setColor(color);
        });
        if (this._diceGroupParams) {
            const count = this._diceGroupParams.diceParams.length;
            this._rollButton.setText(`x${count}`);
        }
        else {
            this._rollButton.setText("@");
        }
    }
    onClickedValue(value, _player) {
        this._value = value;
        this.update();
    }
    onClickedRoll(player) {
        if (!this._diceGroupParams) {
            this._diceGroupParams = {
                callback: (diceResults, rollingPlayer) => {
                    this.onRollFinished(diceResults, rollingPlayer);
                },
                diceParams: [],
                player,
                position: this._obj.getPosition(),
            };
        }
        this._diceGroupParams.diceParams.push({
            sides: 10,
            hit: this._value,
        });
        if (this._pendingRollHandle) {
            clearTimeout(this._pendingRollHandle);
            this._pendingRollHandle = undefined;
        }
        this._pendingRollHandle = setTimeout(() => {
            this._pendingRollHandle = undefined;
            this.doRoll(player);
        }, WAIT_MSECS_BEFORE_ROLL);
        this.update();
    }
    doRoll(_player) {
        if (this._diceGroupParams) {
            ttpg_darrell_1.DiceGroup.roll(this._diceGroupParams);
            this._diceGroupParams = undefined;
        }
        this.update();
    }
    onRollFinished(dice, _player) {
        var _a;
        console.log("onRollFinished");
        const firstResult = dice[0];
        const value = (_a = firstResult === null || firstResult === void 0 ? void 0 : firstResult.diceParams.hit) !== null && _a !== void 0 ? _a : 0;
        const formatted = [];
        let hits = 0;
        dice.forEach((die) => {
            formatted.push(ttpg_darrell_1.DiceGroup.format(die));
            if (die.hit) {
                hits += 1;
            }
        });
        const summary = `Target ${value}: ${formatted.join(", ")} (${hits} hits)`;
        ttpg_darrell_1.Broadcast.broadcastAll(summary);
    }
}
const obj = api_1.refObject;
process.nextTick(() => {
    new QuickRoller(obj);
});
//# sourceMappingURL=quick-roller-obj.js.map