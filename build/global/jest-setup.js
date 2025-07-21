"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_player_slot_colors_1 = require("../setup/setup-player-slot-colors/setup-player-slot-colors");
const nsid_to_template_id_test_1 = require("../nsid/nsid-to-template-id.test");
const global_1 = require("./global");
beforeEach(() => {
    (0, nsid_to_template_id_test_1.addObjectTemplatesToMockWorld)(); // does a MockWorld._reset!
    (0, global_1.resetGlobalThisTI4)();
    new setup_player_slot_colors_1.SetupPlayerSlotColors().setup(); // normally part of table state creation
});
//# sourceMappingURL=jest-setup.js.map