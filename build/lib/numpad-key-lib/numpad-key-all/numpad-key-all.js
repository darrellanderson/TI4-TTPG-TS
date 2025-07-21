"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumpadKeyAll = void 0;
const numpad_key_spawn_1 = require("../numpad-key-spawn/numpad-key-spawn");
const numpad_key_recycle_1 = require("../numpad-key-recycle/numpad-key-recycle");
const numpad_key_look_seat_1 = require("../numpad-key-look-seat/numpad-key-look-seat");
const numpad_key_look_active_system_1 = require("../numpad-key-look-active-system/numpad-key-look-active-system");
const numpad_key_look_map_1 = require("../numpad-key-look-map/numpad-key-look-map");
const numpad_key_look_my_seat_1 = require("../numpad-key-look-my-seat/numpad-key-look-my-seat");
const numpad_key_look_scoring_1 = require("../numpad-key-look-scoring/numpad-key-look-scoring");
class NumpadKeyAll {
    init() {
        new numpad_key_look_seat_1.NumpadKeyLookSeat(); // ctrl + numpad 1 to 8 (seat count)
        new numpad_key_spawn_1.NumpadKeySpawn({
            1: "token:base/tradegood-commodity-1",
            2: "token:base/fighter-1",
            3: "token:base/infantry-1",
        });
        new numpad_key_look_active_system_1.NumpadKeyLookActiveSystem(5);
        new numpad_key_look_map_1.NumpadKeyLookMap(6);
        new numpad_key_look_scoring_1.NumpadKeyLookScoring(7);
        new numpad_key_look_my_seat_1.NumpadKeyLookMySeat(9);
        new numpad_key_recycle_1.NumpadKeyRecycle(10); // 10 is zero key
        // Unused: 4 (ui), 8 (agenda)
    }
}
exports.NumpadKeyAll = NumpadKeyAll;
//# sourceMappingURL=numpad-key-all.js.map