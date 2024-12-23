import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import { DraftToMapString } from "../draft-to-map-string/draft-to-map-string";
import { Faction } from "../../faction-lib/faction/faction";
import { MapStringFormat } from "../../map-string-lib/map-string-format";
import { MapStringLoad } from "../../map-string-lib/map-string-load";
import {
  MapStringEntry,
  MapStringParser,
} from "../../map-string-lib/map-string-parser";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

export class DraftActivityFinish {
  private readonly _draftState: DraftState;
  private readonly _find: Find = new Find();

  constructor(draftState: DraftState) {
    this._draftState = draftState;
  }

  finishAll(): this {
    this.movePlayersToSeats();
    this.moveSpeakerToken();
    this.unpackMap();
    this.setTurnOrder();

    return this;
  }

  movePlayersToSeats(): this {
    const playerCount: number = TI4.config.playerCount;

    // Get the player for each seat.
    const seatIndexToDstPlayer: Map<number, Player> = new Map();
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      const playerSlot: number =
        this._draftState.getSeatIndexToPlayerSlot(seatIndex);
      if (playerSlot >= 0) {
        const player: Player | undefined = world.getPlayerBySlot(playerSlot);
        if (player) {
          seatIndexToDstPlayer.set(seatIndex, player);
        }
      }
    }

    // Find unused player slots.
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const openSlots: Set<number> = new Set(
      new Array(20).fill(0).map((_, i) => i)
    );
    for (const player of world.getAllPlayers()) {
      openSlots.delete(player.getSlot());
    }
    for (const seat of seats) {
      openSlots.delete(seat.playerSlot);
    }

    // Move players to open slots.
    const openSlotsArray = new Array(...openSlots);
    seatIndexToDstPlayer.forEach((player: Player, seatIndex: number) => {
      const openSlot: number = openSlotsArray.pop();
      player.switchSlot(openSlot);

      const seat: PlayerSeatType | undefined = seats[seatIndex];
      if (seat) {
        const dstSlot: number = seat.playerSlot;
        process.nextTick(() => {
          player.switchSlot(dstSlot);
        });
      }
    });

    return this;
  }

  moveSpeakerToken(): this {
    const nsid: string = "token:base/speaker";
    const speakerToken: GameObject | undefined =
      this._find.findGameObject(nsid);

    const speakerIndex: number = this._draftState.getSpeakerIndex();
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const playerSeat: PlayerSeatType | undefined = playerSeats[speakerIndex];

    if (speakerToken && playerSeat) {
      const cardHolderPos: Vector = playerSeat.cardHolder.getPosition();
      const tokenPos: Vector = cardHolderPos.clone();
      tokenPos.x = (tokenPos.x < 0 ? -1 : 1) * 72.5;
      tokenPos.z = world.getTableHeight() + 10;
      speakerToken.setPosition(tokenPos);
      speakerToken.snapToGround();
    }

    return this;
  }

  unpackMap(): this {
    // Get baked map string, included faction home systems.
    const mapString: string = DraftToMapString.fromDraftState(
      this._draftState
    ).mapString;

    const mapStringEntries: Array<MapStringEntry> =
      new MapStringParser().parseOrThrow(mapString);
    mapStringEntries.forEach((entry: MapStringEntry) => {
      const tile: number = entry.tile;
      const faction: Faction | undefined =
        TI4.factionRegistry.getByHomeSystemTileNumber(tile);
      if (faction) {
        entry.tile = 0;
        entry.rot = undefined;
        entry.side = undefined;
      }
    });
    const scrubbedMapString: string = new MapStringFormat().format(
      mapStringEntries
    );

    new MapStringLoad().load(scrubbedMapString);

    return this;
  }

  setTurnOrder(): this {
    const speakerIndex: number = this._draftState.getSpeakerIndex();
    const playerCount: number = TI4.config.playerCount;

    const order: Array<number> = [];
    for (let i = 0; i < playerCount; i++) {
      order.push(((speakerIndex + i) % playerCount) + 10);
    }
    TI4.turnOrder.setTurnOrder(order, "forward", speakerIndex);

    return this;
  }
}
