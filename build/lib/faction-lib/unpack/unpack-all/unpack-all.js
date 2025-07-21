"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackAll = void 0;
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const unpack_control_tokens_1 = require("../unpack-control-tokens/unpack-control-tokens");
const unpack_command_tokens_1 = require("../unpack-command-tokens/unpack-command-tokens");
const unpack_faction_alliance_1 = require("../unpack-faction-alliance/unpack-faction-alliance");
const unpack_faction_extras_1 = require("../unpack-faction-extras/unpack-faction-extras");
const unpack_faction_promissory_1 = require("../unpack-faction-promissory/unpack-faction-promissory");
const unpack_faction_sheet_1 = require("../unpack-faction-sheet/unpack-faction-sheet");
const unpack_faction_tech_1 = require("../unpack-faction-tech/unpack-faction-tech");
const unpack_home_system_1 = require("../unpack-home-system/unpack-home-system");
const unpack_leaders_1 = require("../unpack-leaders/unpack-leaders");
const unpack_starting_tech_1 = require("../unpack-starting-tech/unpack-starting-tech");
const unpack_starting_units_1 = require("../unpack-starting-units/unpack-starting-units");
const unpack_home_planet_cards_1 = require("../unpack-home-planet-cards/unpack-home-planet-cards");
class UnpackAll extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._unpacks = [
            new unpack_command_tokens_1.UnpackCommandTokens(faction, playerSlot),
            new unpack_control_tokens_1.UnpackControlTokens(faction, playerSlot),
            new unpack_faction_alliance_1.UnpackFactionAlliance(faction, playerSlot),
            new unpack_faction_extras_1.UnpackFactionExtras(faction, playerSlot),
            new unpack_faction_promissory_1.UnpackFactionPromissory(faction, playerSlot),
            new unpack_faction_sheet_1.UnpackFactionSheet(faction, playerSlot),
            new unpack_faction_tech_1.UnpackFactionTech(faction, playerSlot),
            new unpack_home_system_1.UnpackHomeSystem(faction, playerSlot),
            new unpack_leaders_1.UnpackLeaders(faction, playerSlot),
            new unpack_starting_tech_1.UnpackStartingTech(faction, playerSlot),
            new unpack_starting_units_1.UnpackStartingUnits(faction, playerSlot),
            // Do after unpacking home system tile.
            new unpack_home_planet_cards_1.UnpackHomePlanetCards(faction, playerSlot),
        ];
    }
    unpack() {
        for (const unpack of this._unpacks) {
            unpack.unpack();
        }
        TI4.events.onFactionChanged.trigger(this.getPlayerSlot());
    }
    remove() {
        for (const unpack of this._unpacks) {
            unpack.remove();
        }
        TI4.events.onFactionChanged.trigger(this.getPlayerSlot());
    }
}
exports.UnpackAll = UnpackAll;
//# sourceMappingURL=unpack-all.js.map