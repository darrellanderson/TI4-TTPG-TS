"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnOrderMini = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
class TurnOrderMini extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const entrySize = { w: 200 * scale, h: 30 * scale };
        const fontSize = entrySize.h * 0.4;
        const playerCount = TI4.config.playerCount;
        const panelSize = { w: entrySize.w, h: entrySize.h * playerCount };
        const panel = new api_1.VerticalBox();
        const entries = [];
        for (let i = 0; i < playerCount; i++) {
            const text = new api_1.Text()
                .setBold(true)
                .setFontSize(fontSize)
                .setJustification(api_1.TextJustification.Center);
            const bg = new api_1.Border();
            bg.setChild(text);
            entries.push({ text, bg });
            panel.addChild(bg, 1);
        }
        const box = new api_1.LayoutBox()
            .setOverrideWidth(panelSize.w)
            .setOverrideHeight(panelSize.h)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Fill)
            .setVerticalAlignment(api_1.VerticalAlignment.Fill)
            .setChild(panel);
        super(box, panelSize);
        this._entries = [];
        this._onTurnOrderChanged = () => {
            const order = TI4.turnOrder.getTurnOrder();
            const current = TI4.turnOrder.getCurrentTurn();
            order.forEach((playerSlot, index) => {
                const playerColor = TI4.playerColor.getSlotWidgetColorOrThrow(playerSlot);
                const otherColor = new api_1.Color(0, 0, 0, 1);
                const fg = playerSlot === current ? otherColor : playerColor;
                const bg = playerSlot === current ? playerColor : otherColor;
                let playerName = `Player ${playerSlot + 1}`;
                const player = api_1.world.getPlayerBySlot(playerSlot);
                if (player) {
                    playerName = player.getName();
                }
                const entry = this._entries[index];
                if (entry) {
                    entry.text.setText(playerName).setTextColor(fg);
                    entry.bg.setColor(bg);
                }
            });
        };
        this._entries = entries;
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.add(this._onTurnOrderChanged);
        this._onTurnOrderChanged();
    }
    destroy() {
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.remove(this._onTurnOrderChanged);
        super.destroy();
    }
}
exports.TurnOrderMini = TurnOrderMini;
//# sourceMappingURL=turn-order-mini.js.map