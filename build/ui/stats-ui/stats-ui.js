"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const config_1 = require("../config/config");
class StatsEntry {
    constructor(scale) {
        const fontSize = config_1.CONFIG.FONT_SIZE * scale;
        this._name = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Left);
        this._resources = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center);
        this._influence = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center);
        this._tradegoods = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center);
        this._commandTokens = new api_1.Text()
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center);
        const panel = new api_1.HorizontalBox()
            .addChild(this._name, 3)
            .addChild(this._resources, 2)
            .addChild(this._influence, 2)
            .addChild(this._tradegoods, 2)
            .addChild(this._commandTokens, 3);
        const size = { w: 350 * scale, h: 20 * scale };
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setChild(panel);
        this._abstractUI = new abtract_ui_1.AbstractUI(box, size);
    }
    updateAsHeader() {
        this._name.setText("Player");
        this._resources.setText("Res");
        this._influence.setText("Inf");
        this._tradegoods.setText("TGs");
        this._commandTokens.setText("Tokens");
    }
    getAbstractUI() {
        return this._abstractUI;
    }
    update(player) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this._name.setText((_a = player.steamName) !== null && _a !== void 0 ? _a : "");
        this._resources.setText([
            `${(_c = (_b = player.planetTotals) === null || _b === void 0 ? void 0 : _b.resources.avail) !== null && _c !== void 0 ? _c : ""}`,
            `${(_e = (_d = player.planetTotals) === null || _d === void 0 ? void 0 : _d.resources.total) !== null && _e !== void 0 ? _e : ""}`,
        ].join("/"));
        this._influence.setText([
            `${(_g = (_f = player.planetTotals) === null || _f === void 0 ? void 0 : _f.influence.avail) !== null && _g !== void 0 ? _g : ""}`,
            `${(_j = (_h = player.planetTotals) === null || _h === void 0 ? void 0 : _h.influence.total) !== null && _j !== void 0 ? _j : ""}`,
        ].join("/"));
        this._tradegoods.setText(`${(_k = player.tradeGoods) !== null && _k !== void 0 ? _k : ""}`);
        this._commandTokens.setText([
            (_l = player.commandTokens) === null || _l === void 0 ? void 0 : _l.tactics,
            (_m = player.commandTokens) === null || _m === void 0 ? void 0 : _m.fleet,
            (_o = player.commandTokens) === null || _o === void 0 ? void 0 : _o.strategy,
        ].join("/"));
    }
}
class StatsUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const statsEntries = [];
        for (let i = 0; i < TI4.config.playerCount; i++) {
            const statsEntryUI = new StatsEntry(scale);
            statsEntries.push(statsEntryUI);
        }
        const uis = statsEntries.map((entry) => {
            return entry.getAbstractUI();
        });
        // Add header
        const header = new StatsEntry(scale);
        header.updateAsHeader();
        uis.unshift(header.getAbstractUI());
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(0 * scale)
            .addUIs(uis)
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._onGameData = (gameData) => {
            this.update(gameData);
        };
        this._statsEntries = statsEntries;
        TI4.events.onGameData.add(this._onGameData);
    }
    destroy() {
        TI4.events.onGameData.remove(this._onGameData);
        super.destroy();
    }
    update(gameData) {
        gameData.players.forEach((player, seatIndex) => {
            const statsEntry = this._statsEntries[seatIndex];
            if (statsEntry) {
                statsEntry.update(player);
            }
        });
    }
}
exports.StatsUI = StatsUI;
//# sourceMappingURL=stats-ui.js.map