"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnStrategyCardPlayed = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Adds a custom action to strategy cards, and triggers an event when played.
 */
class OnStrategyCardPlayed {
    constructor() {
        this._onCustomAction = (object, player, identifier) => {
            if (identifier === OnStrategyCardPlayed.ACTION_NAME) {
                // Flip if not already flipped.
                if (ttpg_darrell_1.Facing.isFaceUp(object)) {
                    object.flipOrUpright();
                }
                // Report.
                const playerName = TI4.playerName.getByPlayer(player);
                const msg = `${playerName} played ${object.getName()}`;
                const color = api_1.world.getSlotColor(player.getSlot());
                ttpg_darrell_1.Broadcast.broadcastAll(msg, color);
                // Tell listeners.
                TI4.events.onStrategyCardPlayed.trigger(object, player);
            }
        };
    }
    init() {
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeAdd(obj);
        });
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeAdd(obj);
        }
    }
    _maybeAdd(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("tile.strategy-card:")) {
            obj.removeCustomAction(OnStrategyCardPlayed.ACTION_NAME);
            obj.addCustomAction(OnStrategyCardPlayed.ACTION_NAME);
            obj.onCustomAction.remove(this._onCustomAction);
            obj.onCustomAction.add(this._onCustomAction);
        }
    }
}
exports.OnStrategyCardPlayed = OnStrategyCardPlayed;
OnStrategyCardPlayed.ACTION_NAME = "*Play Strategy Card";
//# sourceMappingURL=on-strategy-card-played.js.map