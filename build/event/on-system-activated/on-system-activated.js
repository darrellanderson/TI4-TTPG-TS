"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnSystemActivated = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const packageId = api_1.refPackageId;
// Persist the last activated system and the player slot that activated it.
const KEY = "@TI4/last-activated";
// Animation.
const PULSE_SECONDS = 3; // from 0->1->0
const DISPLAY_SECONDS_APPROX = 15; // 30 in TTS
const DISPLAY_SECONDS = Math.ceil(DISPLAY_SECONDS_APPROX / PULSE_SECONDS) * PULSE_SECONDS; // complete last pulse
class OnSystemActivated {
    constructor() {
        // System activated animation.
        this._lastActivatedTimestamp = -1;
        this._image = undefined;
        this._ui = undefined;
        /**
         * Dropping a command token is ONE way to activate a system, not the only way.
         *
         * @param object
         * @param player
         * @param _thrown
         * @param _grabPosition
         * @param _grabRotation
         */
        this._onReleasedHandler = (object, player, _thrown, _grabPosition, _grabRotation) => {
            const playerSlot = TI4.turnOrder.getCurrentTurn();
            const isActivePlayer = playerSlot === player.getSlot();
            if (isActivePlayer) {
                const pos = object.getPosition();
                const system = TI4.systemRegistry.getByPosition(pos);
                if (system) {
                    const state = {
                        tile: system.getSystemTileNumber(),
                        slot: player.getSlot(),
                    };
                    const json = JSON.stringify(state);
                    api_1.world.setSavedData(json, KEY);
                    TI4.events.onSystemActivated.trigger(system, player);
                }
            }
        };
        this._onTickHandler = () => {
            const ageSeconds = (Date.now() - this._lastActivatedTimestamp) / 1000;
            if (ageSeconds > DISPLAY_SECONDS) {
                this._cancelAnimation();
                return;
            }
            else if (this._image) {
                const u = (ageSeconds % PULSE_SECONDS) / PULSE_SECONDS;
                const phi = u * Math.PI * 2;
                const color = this._image.getTintColor();
                color.a = 1 - (Math.cos(phi) + 1) / 2;
                this._image.setTintColor(color);
            }
        };
    }
    static getLastActivatedSystem() {
        return this.__lastActivatedSystem;
    }
    static getLastActivatingPlayerSlot() {
        return this.__lastActivatingPlayerSlot;
    }
    init() {
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeLinkCommandToken(obj);
        });
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeLinkCommandToken(obj);
        }
        // Report system activation.
        TI4.events.onSystemActivated.add((system, player) => {
            this._rememberLastActivatedSystem(system, player); // do first to set static variables
            this._reportSystemActivation(system, player);
            this._displayActiveSystem(system, player);
        });
        // Restore last activated system.
        const json = api_1.world.getSavedData(KEY);
        if (json && json.length > 0) {
            const parsed = JSON.parse(json);
            const tile = parsed.tile;
            const slot = parsed.slot;
            OnSystemActivated.__lastActivatedSystem =
                TI4.systemRegistry.getBySystemTileNumber(tile);
            OnSystemActivated.__lastActivatingPlayerSlot = slot;
        }
    }
    _maybeLinkCommandToken(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("token.command:")) {
            obj.onReleased.remove(this._onReleasedHandler);
            obj.onReleased.add(this._onReleasedHandler);
        }
    }
    _rememberLastActivatedSystem(system, player) {
        OnSystemActivated.__lastActivatedSystem = system;
        OnSystemActivated.__lastActivatingPlayerSlot = player.getSlot();
    }
    _reportSystemActivation(system, player) {
        const name = TI4.playerName.getByPlayer(player);
        const systemSummary = system.getName();
        const message = `${name} activated ${systemSummary}`;
        ttpg_darrell_1.Broadcast.broadcastAll(message);
    }
    _displayActiveSystem(system, player) {
        var _a;
        const obj = system.getObj();
        const pos = obj.getPosition();
        pos.z = api_1.world.getTableHeight() + 0.3;
        // Remove any existing animation.
        this._cancelAnimation();
        // Start the animation.
        const playerSlot = player.getSlot();
        const color = (_a = TI4.playerColor.getSlotWidgetColor(playerSlot)) !== null && _a !== void 0 ? _a : new api_1.Color(0, 0, 0, 1);
        const scale = 4;
        this._lastActivatedTimestamp = Date.now();
        this._image = new api_1.ImageWidget()
            .setImage("ui/hex-highlight.png", packageId)
            .setImageSize(165 * scale, 0)
            .setTintColor(color);
        this._ui = new api_1.UIElement();
        this._ui.position = pos;
        this._ui.scale = 1 / scale;
        this._ui.useTransparency = true;
        this._ui.useWidgetSize = true;
        this._ui.widget = this._image;
        api_1.world.addUI(this._ui);
        api_1.globalEvents.onTick.remove(this._onTickHandler);
        api_1.globalEvents.onTick.add(this._onTickHandler);
    }
    _cancelAnimation() {
        api_1.globalEvents.onTick.remove(this._onTickHandler);
        if (this._ui) {
            api_1.world.removeUIElement(this._ui);
            this._ui = undefined;
        }
        if (this._image) {
            this._image = undefined;
        }
        this._lastActivatedTimestamp = -1;
    }
}
exports.OnSystemActivated = OnSystemActivated;
//# sourceMappingURL=on-system-activated.js.map