"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const layout_all_1 = require("./layout-all");
const setup_player_slot_colors_1 = require("../../setup-player-slot-colors/setup-player-slot-colors");
const scrub_all_1 = require("./scrub-all");
const refObjectCopy = api_1.refObject;
function go() {
    console.log("LAYOUT-ALL.TESTP");
    (0, scrub_all_1.scrubAll)(refObjectCopy);
    //world.setSavedData("", "@config/ti4");
    TI4.config.setPlayerCount(6);
    new setup_player_slot_colors_1.SetupPlayerSlotColors().setup();
    const z = api_1.world.getTableHeight();
    const pos = new api_1.Vector(0, 0, z + 3);
    const yaw = 0;
    const playerCount = TI4.config.playerCount;
    const layout = new layout_all_1.LayoutAll(playerCount);
    layout.getLayout().doLayoutAtPoint(pos, yaw);
    //process.flushTicks();
    //refObjectCopy.setScript("");
    //world.resetScripting();
}
setTimeout(go, 1000);
//# sourceMappingURL=layout-all.testp.js.map