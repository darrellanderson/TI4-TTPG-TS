"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnCombatClicked = void 0;
const api_1 = require("@tabletop-playground/api");
const combat_roll_1 = require("../../lib/combat-lib/combat-roll/combat-roll");
const on_system_activated_1 = require("../on-system-activated/on-system-activated");
/**
 * Listen for combat UI clicks, turn into combat rolls.
 */
class OnCombatClicked {
    constructor() {
        this._onCombatClickedHandler = (rollType, planetName, player) => {
            const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
            const activatingPlayerSlot = on_system_activated_1.OnSystemActivated.getLastActivatingPlayerSlot();
            const rollingPlayerSlot = player.getSlot();
            if (system && activatingPlayerSlot !== undefined) {
                const pos = system.getObj().getPosition();
                const hex = TI4.hex.fromPosition(pos);
                const params = {
                    rollType,
                    hex,
                    planetName,
                    activatingPlayerSlot,
                    rollingPlayerSlot,
                };
                // Choose a roll position based on the rolling player.
                let rollPos = new api_1.Vector(0, 0, 0);
                for (const seat of TI4.playerSeats.getAllSeats()) {
                    if (seat.playerSlot === rollingPlayerSlot) {
                        rollPos = seat.cardHolder.getPosition();
                        rollPos.x *= 0.75; // move toward center
                        break;
                    }
                }
                rollPos.z = api_1.world.getTableHeight() + 10;
                const combatRoll = combat_roll_1.CombatRoll.createCooked(params);
                combatRoll.roll(player, rollPos);
            }
        };
    }
    init() {
        TI4.events.onCombatClicked.add(this._onCombatClickedHandler);
    }
    destroy() {
        TI4.events.onCombatClicked.remove(this._onCombatClickedHandler);
    }
}
exports.OnCombatClicked = OnCombatClicked;
//# sourceMappingURL=on-combat-clicked.js.map