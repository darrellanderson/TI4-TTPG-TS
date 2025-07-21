"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickMinorFactions = exports.MINOR_FACTIONS_ACTION_NAME = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
exports.MINOR_FACTIONS_ACTION_NAME = "*Deal home systems";
/**
 * Give each player:
 * - one unused home system,
 * - linked alliance card,
 * - 3 neutral infantry
 *
 * Minor faction planets have all traits.
 */
class RightClickMinorFactions extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const cardNsidPrefix = "card.event:codex.liberation/minor-factions";
        const customActionHandler = (_object, player, identifier) => {
            if (identifier === exports.MINOR_FACTIONS_ACTION_NAME) {
                const playerName = TI4.playerName.getByPlayer(player);
                const msg = `${playerName} dealing minor faction home systems.`;
                ttpg_darrell_1.Broadcast.chatAll(msg);
                this._dealHomeSystemTiles();
            }
        };
        super(cardNsidPrefix, exports.MINOR_FACTIONS_ACTION_NAME, customActionHandler);
    }
    _getInPlayFactionHomeSystemNsids() {
        // Using nsids is better than factions b/c Keleres.
        const inPlayHomeSystemNsids = new Set();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            if (system.isHome()) {
                const nsid = ttpg_darrell_1.NSID.get(system.getObj());
                inPlayHomeSystemNsids.add(nsid);
            }
        }
        return inPlayHomeSystemNsids;
    }
    _getAllHomeSystemTileNsids() {
        const result = new Set();
        TI4.factionRegistry
            .getAllFactionsFilteredByConfigSources()
            .forEach((faction) => {
            const surrogate = faction.getHomeSurrogateTileNumber();
            const tile = faction.getHomeSystemTileNumber();
            const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
            // Ignore homes with surrogate tiles, gets complicated.
            if (surrogate < 0 && nsid) {
                result.add(nsid);
            }
        });
        return result;
    }
    _getAvailableHomeSystemNsids() {
        const allHomeSystemNsids = this._getAllHomeSystemTileNsids();
        const inPlayHomeSystemNsids = this._getInPlayFactionHomeSystemNsids();
        const availableNsids = Array.from(allHomeSystemNsids).filter((nsid) => {
            return !inPlayHomeSystemNsids.has(nsid);
        });
        return availableNsids;
    }
    _getHomeSystemTiles(count) {
        const availableNsids = new ttpg_darrell_1.Shuffle().shuffle(this._getAvailableHomeSystemNsids());
        // Get the requested number of system tiles.
        // Let spawn fail, might be bad homebrew.
        const systemTileObjs = [];
        while (systemTileObjs.length < count && availableNsids.length > 0) {
            const nsid = availableNsids.pop();
            if (nsid) {
                const systemTileObj = ttpg_darrell_1.Spawn.spawn(nsid);
                if (systemTileObj) {
                    systemTileObjs.push(systemTileObj);
                }
            }
        }
        return systemTileObjs;
    }
    _dealHomeSystemTiles() {
        const systemTileObjs = this._getHomeSystemTiles(TI4.config.playerCount);
        TI4.playerSeats
            .getAllSeats()
            .forEach((seat, seatIndex) => {
            const playerSlot = seat.playerSlot;
            const pos = TI4.playerSeats.getDealPosition(playerSlot);
            const systemTileObj = systemTileObjs[seatIndex];
            if (systemTileObj) {
                systemTileObj.setPosition(pos);
                systemTileObj.snapToGround();
            }
        });
    }
}
exports.RightClickMinorFactions = RightClickMinorFactions;
//# sourceMappingURL=right-click-minor-factions.js.map