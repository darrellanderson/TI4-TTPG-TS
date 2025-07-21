"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftActivityFinish = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const draft_to_map_string_1 = require("../draft-to-map-string/draft-to-map-string");
const map_string_format_1 = require("../../map-string-lib/map-string/map-string-format");
const map_string_load_1 = require("../../map-string-lib/map-string/map-string-load");
const map_string_parser_1 = require("../../map-string-lib/map-string/map-string-parser");
const unpack_all_1 = require("../../faction-lib/unpack/unpack-all/unpack-all");
class DraftActivityFinish {
    constructor(draftState) {
        this._find = new ttpg_darrell_1.Find();
        this._draftState = draftState;
    }
    finishAll() {
        this.movePlayersToSeats();
        this.moveSpeakerToken();
        this.unpackFactions();
        this.unpackMap();
        this.setTurnOrder();
        this._draftState.destroy();
        return this;
    }
    movePlayersToSeats() {
        const playerCount = TI4.config.playerCount;
        // Get the player for each seat.
        const seatIndexToDstPlayer = new Map();
        for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
            const playerSlot = this._draftState.getSeatIndexToPlayerSlot(seatIndex);
            if (playerSlot >= 0) {
                const player = api_1.world.getPlayerBySlot(playerSlot);
                if (player) {
                    seatIndexToDstPlayer.set(seatIndex, player);
                }
            }
        }
        // Find unused player slots.
        const seats = TI4.playerSeats.getAllSeats();
        const openSlots = new Set(new Array(20).fill(0).map((_, i) => i));
        for (const player of api_1.world.getAllPlayers()) {
            openSlots.delete(player.getSlot());
        }
        for (const seat of seats) {
            openSlots.delete(seat.playerSlot);
        }
        // Move players to open slots.
        const openSlotsArray = new Array(...openSlots);
        seatIndexToDstPlayer.forEach((player, seatIndex) => {
            const openSlot = openSlotsArray.pop();
            player.switchSlot(openSlot);
            const seat = seats[seatIndex];
            if (seat) {
                const dstSlot = seat.playerSlot;
                process.nextTick(() => {
                    player.switchSlot(dstSlot);
                });
            }
        });
        return this;
    }
    moveSpeakerToken() {
        const nsid = "token:base/speaker";
        const speakerToken = this._find.findGameObject(nsid);
        const speakerIndex = this._draftState.getSpeakerIndex();
        const playerSeats = TI4.playerSeats.getAllSeats();
        const playerSeat = playerSeats[speakerIndex];
        if (speakerToken && playerSeat) {
            const cardHolderPos = playerSeat.cardHolder.getPosition();
            const tokenPos = cardHolderPos.clone();
            tokenPos.x = (tokenPos.x < 0 ? -1 : 1) * 72.5;
            tokenPos.z = api_1.world.getTableHeight() + 10;
            speakerToken.setPosition(tokenPos);
            speakerToken.snapToGround();
        }
        return this;
    }
    unpackFactions() {
        const seats = TI4.playerSeats.getAllSeats();
        seats.forEach((seat, index) => {
            const faction = this._draftState.getSeatIndexToFaction(index);
            if (faction) {
                new unpack_all_1.UnpackAll(faction, seat.playerSlot).unpack();
            }
        });
        return this;
    }
    unpackMap() {
        // Get baked map string, included faction home systems.
        const mapString = draft_to_map_string_1.DraftToMapString.fromDraftState(this._draftState).mapString;
        const mapStringEntries = new map_string_parser_1.MapStringParser().parseOrThrow(mapString);
        mapStringEntries.forEach((entry) => {
            const tile = entry.tile;
            const faction = TI4.factionRegistry.getByHomeSystemTileNumber(tile);
            if (faction) {
                entry.tile = 0;
                entry.rot = undefined;
                entry.side = undefined;
            }
        });
        const scrubbedMapString = new map_string_format_1.MapStringFormat().format(mapStringEntries);
        new map_string_load_1.MapStringLoad().load(scrubbedMapString);
        return this;
    }
    setTurnOrder() {
        const speakerIndex = this._draftState.getSpeakerIndex();
        const playerCount = TI4.config.playerCount;
        const order = [];
        for (let i = 0; i < playerCount; i++) {
            order.push(((speakerIndex + i) % playerCount) + 10);
        }
        TI4.turnOrder.setTurnOrder(order, "forward", speakerIndex);
        return this;
    }
}
exports.DraftActivityFinish = DraftActivityFinish;
//# sourceMappingURL=draft-activity-finish.js.map