"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildArea = void 0;
exports.delayedCreateBuildArea = delayedCreateBuildArea;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const combat_roll_1 = require("../lib/combat-lib/combat-roll/combat-roll");
const build_consume_1 = require("../lib/build-lib/build-consume");
const build_produce_1 = require("../lib/build-lib/build-produce");
const HEIGHT = 4;
class BuildArea {
    constructor(obj) {
        // public for testing
        this._onUpdateHandler = () => {
            this.update();
        };
        if (obj.getOwningPlayerSlot() === -1) {
            throw new Error("BuildArea must have an owning player slot.");
        }
        this._obj = obj;
        this._zone = this._findOrCreateZone();
        this._summaryText = new api_1.Text();
        this._ui = this._addUI();
        this._obj.onReleased.add(() => {
            const pos = this._obj.getPosition();
            pos.z = api_1.world.getTableHeight() + HEIGHT / 2;
            this._zone.setPosition(pos);
        });
        this._zone.onBeginOverlap.add(this._onUpdateHandler);
        this._zone.onEndOverlap.add(this._onUpdateHandler);
        TI4.events.onSystemActivated.add((system, player) => {
            if (player.getSlot() === this._obj.getOwningPlayerSlot()) {
                this._lastActivatedSystemTileObj = system.getObj();
                if (this._lastActivatedActionName) {
                    this._obj.removeCustomAction(this._lastActivatedActionName);
                    this._lastActivatedActionName = undefined;
                }
                let name = system.getName();
                const maxLength = 30;
                if (name.length > maxLength) {
                    name = name.substring(0, maxLength - 3) + "...";
                }
                this._lastActivatedActionName = "*Warp to " + name;
            }
        });
        const togglePrivacyActionName = "*Toggle Privacy";
        this._obj.addCustomAction(togglePrivacyActionName);
        const reportActionName = "*Report";
        this._obj.addCustomAction(reportActionName);
        const warpToHomeActionName = "*Warp to Home";
        this._obj.addCustomAction(warpToHomeActionName);
        this._obj.onCustomAction.add((_obj, _player, action) => {
            if (action === togglePrivacyActionName) {
                this.togglePrivacyMode();
            }
            if (action === reportActionName) {
                this.report();
            }
            if (action === warpToHomeActionName) {
                this._warpToHome();
            }
            if (action === this._lastActivatedActionName) {
                this._warpToLastActivated();
            }
        });
        this.update();
    }
    _addUI() {
        const extent = this._obj.getExtent(false, false);
        // Get layout position and size.
        const scale = 4;
        const pad = 0.35;
        const fontSize = 5.8 * scale;
        const size = {
            w: (extent.y * 2 * 10 - pad * 20) * scale, // ui is 10x
            h: 15 * scale,
        };
        const pos = new api_1.Vector(extent.x - pad, -extent.y + pad, extent.z + 0.02);
        this._summaryText
            .setFontSize(fontSize)
            .setJustification(api_1.TextJustification.Center);
        const border = new api_1.Border().setChild(this._summaryText);
        const box = new api_1.LayoutBox()
            .setOverrideWidth(size.w)
            .setOverrideHeight(size.h)
            .setVerticalAlignment(api_1.VerticalAlignment.Center)
            .setChild(border);
        const ui = new api_1.UIElement();
        ui.anchorX = 0;
        ui.anchorY = 0;
        ui.position = pos;
        ui.scale = 1 / scale;
        ui.widget = box;
        this._obj.addUI(ui);
        return ui;
    }
    _findOrCreateZone() {
        const zoneId = "zone:" + this._obj.getId();
        let zone = api_1.world.getZoneById(zoneId);
        const pos = this._obj.getPosition();
        pos.z = api_1.world.getTableHeight() + HEIGHT / 2;
        if (!zone) {
            zone = api_1.world.createZone(pos);
        }
        const scale = this._obj.getExtent(false, false).multiply(2);
        scale.x = scale.x - 0.1; // inset slightly to prefent "z fighting" on edges
        scale.y = scale.y - 0.1;
        scale.z = HEIGHT;
        const playerSlot = this._obj.getOwningPlayerSlot();
        const color = TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
        color.a = 0.1;
        zone.setPosition(pos);
        zone.setColor(color);
        zone.setId(zoneId);
        zone.setScale(scale);
        zone.setSlotOwns(playerSlot, true);
        zone.setStacking(api_1.ZonePermission.Nobody);
        zone.setObjectVisibility(api_1.ZonePermission.Everybody);
        zone.setInserting(api_1.ZonePermission.Everybody);
        zone.setAlwaysVisible(false);
        return zone;
    }
    _getSystemTileHome() {
        const playerSlot = this._obj.getOwningPlayerSlot();
        const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
        if (faction) {
            return faction.getHomeSystemTileObj(playerSlot);
        }
        return undefined;
    }
    _getSystemTileLastActivated() {
        return this._lastActivatedSystemTileObj;
    }
    _getProduceAndConsume() {
        // CombatRoll finds and applies unit modifiers.
        const combatRoll = combat_roll_1.CombatRoll.createCooked({
            rollType: "production",
            hex: "<0,0,0>",
            activatingPlayerSlot: this._obj.getOwningPlayerSlot(),
            rollingPlayerSlot: this._obj.getOwningPlayerSlot(),
        });
        const objs = this._zone.getOverlappingObjects();
        const produce = new build_produce_1.BuildProduce(objs, combatRoll.self.unitAttrsSet);
        const consume = new build_consume_1.BuildConsume(objs, combatRoll.getUnitModifierNames());
        return { produce, consume };
    }
    _warpToHome() {
        const { produce } = this._getProduceAndConsume();
        const home = this._getSystemTileHome();
        if (home) {
            produce.moveToSystemTile(home);
        }
    }
    _warpToLastActivated() {
        const { produce } = this._getProduceAndConsume();
        const lastActivated = this._getSystemTileLastActivated();
        if (lastActivated) {
            produce.moveToSystemTile(lastActivated);
        }
    }
    getSummary() {
        const { produce, consume } = this._getProduceAndConsume();
        const cost = produce.getCost();
        const spend = consume.getTotalValueWithModifiers();
        const unitCount = produce.getPlasticCount();
        return `Cost: ${cost}   Resources: ${spend}  #Units: ${unitCount}`;
    }
    togglePrivacyMode() {
        const oldIsPrivate = this._zone.isAlwaysVisible();
        const newIsPrivate = !oldIsPrivate;
        this._zone.setAlwaysVisible(newIsPrivate);
        this._zone.setObjectVisibility(newIsPrivate ? api_1.ZonePermission.OwnersOnly : api_1.ZonePermission.Everybody);
        this._ui.players = new api_1.PlayerPermission().setPlayerSlots(newIsPrivate ? [this._obj.getOwningPlayerSlot()] : []);
        this._obj.updateUI(this._ui);
        return this;
    }
    update() {
        const summary = this.getSummary();
        this._summaryText.setText(summary);
    }
    report() {
        const { produce, consume } = this._getProduceAndConsume();
        const playerSlot = this._obj.getOwningPlayerSlot();
        const name = TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
        const color = api_1.world.getSlotColor(playerSlot);
        const msg = name +
            " " +
            [
                produce.report(),
                consume.report(),
                `#Units: ${produce.getPlasticCount()}`,
            ].join("\n");
        ttpg_darrell_1.Broadcast.chatAll(msg, color);
    }
}
exports.BuildArea = BuildArea;
function delayedCreateBuildArea(obj, executionReason) {
    if (executionReason !== "unittest") {
        process.nextTick(() => {
            if (obj.isValid()) {
                new BuildArea(obj);
            }
        });
    }
}
delayedCreateBuildArea(api_1.refObject, api_1.GameWorld.getExecutionReason());
//# sourceMappingURL=build-area.js.map