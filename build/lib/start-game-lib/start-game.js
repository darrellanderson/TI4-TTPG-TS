"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartGame = void 0;
const api_1 = require("@tabletop-playground/api");
const layout_all_1 = require("../../setup/layout/layout-all/layout-all");
const scrub_all_1 = require("../../setup/layout/layout-all/scrub-all");
const scoreboard_1 = require("../score-lib/scoreboard/scoreboard");
class StartGame {
    constructor() {
        this._onStartGameRequest = () => {
            TI4.config.setTimestamp(Date.now() / 1000);
            TI4.timer.start(0, 1); // count up from zero
            this._applyPlayerCount();
            this._doRemove();
            this._maybeFlipScoreboard();
            TI4.events.onStartGameComplete.trigger();
        };
    }
    init() {
        TI4.events.onStartGameRequest.add(this._onStartGameRequest);
    }
    _applyPlayerCount() {
        const currentCount = TI4.playerSeats.getAllSeats().length;
        if (currentCount === TI4.config.playerCount) {
            return; // already correct
        }
        (0, scrub_all_1.scrubAll)(undefined);
        const z = api_1.world.getTableHeight();
        const pos = new api_1.Vector(0, 0, z + 3);
        const yaw = 0;
        const playerCount = TI4.config.playerCount;
        const layout = new layout_all_1.LayoutAll(playerCount);
        layout.getLayout().doLayoutAtPoint(pos, yaw);
        api_1.world.resetScripting(); // mostly for the icon containers, they move at the end of layout
    }
    _doRemove() {
        const remove = TI4.removeRegistry.createRemoveFromRegistryAndConfig();
        remove.removeAll();
    }
    _maybeFlipScoreboard() {
        const scoreboard = new scoreboard_1.Scoreboard().getScoreboard();
        if (TI4.config.gamePoints === 14 && scoreboard) {
            const above = scoreboard.getPosition().add(new api_1.Vector(0, 0, 3));
            scoreboard.setObjectType(api_1.ObjectType.Regular);
            scoreboard.setPosition(above);
            scoreboard.setRotation([0, 0, 180]);
            scoreboard.snapToGround();
            scoreboard.setObjectType(api_1.ObjectType.Ground);
        }
    }
}
exports.StartGame = StartGame;
//# sourceMappingURL=start-game.js.map