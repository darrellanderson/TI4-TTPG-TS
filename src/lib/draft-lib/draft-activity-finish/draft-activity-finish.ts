import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { ErrorHandler, Find } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import { DraftToMapString } from "../draft-to-map-string/draft-to-map-string";
import { Faction } from "../../faction-lib/faction/faction";
import { MapStringFormat } from "../../map-string-lib/map-string/map-string-format";
import { MapStringLoad } from "../../map-string-lib/map-string/map-string-load";
import {
  MapStringEntry,
  MapStringParser,
} from "../../map-string-lib/map-string/map-string-parser";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { UnpackAll } from "../../faction-lib/unpack/unpack-all/unpack-all";
import { System } from "../../system-lib/system/system";
import { RightClickMinorFactions } from "../../../context-menu/events/minor-factions/right-click-minor-factions";
import { TFSetupMatsDraftExt } from "../../twilights-fall-lib/setup/tf-setup-mats-draft-ext";
import { TFUnpackFaction } from "../../twilights-fall-lib/tf-unpack-faction/tf-unpack-faction";
import { TFUnpackHomeSystem } from "../../twilights-fall-lib/tf-unpack-home-system/tf-unpack-home-system";
import { TFUnpackStartingUnits } from "../../twilights-fall-lib/tf-unpack-starting-units/tf-unpack-starting-units";
import { TFSetupFactionSheets } from "../../twilights-fall-lib/setup/tf-setup-faction-sheets";

export class DraftActivityFinish {
  private readonly _draftState: DraftState;
  private readonly _find: Find = new Find();

  constructor(draftState: DraftState) {
    this._draftState = draftState;
  }

  finishAll(): this {
    this.movePlayersToSeats();
    this.moveSpeakerToken();
    this.unpackFactions();
    this.unpackMap();
    this.setTurnOrder();

    if (this._draftState.getOpaqueType() === "minorFactions") {
      this.dealMinorFactionAlliances();
    }

    this._draftState.destroy();

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
      new Array(20).fill(0).map((_, i) => i),
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

  unpackFactions(): this {
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    seats.forEach((seat: PlayerSeatType, seatIndex: number) => {
      const dstPlayerSlot: number = seat.playerSlot;
      const faction: Faction | undefined =
        this._draftState.getSeatIndexToFaction(seatIndex);
      if (faction) {
        // Bug report of (default) white seat unpacking twice after a draft.
        // Other seats are fine, just white duplicated...
        // Unclear how that would happen, but as a precaution validate empty.
        const existingFaction: Faction | undefined =
          TI4.factionRegistry.getByPlayerSlot(dstPlayerSlot);
        if (existingFaction) {
          // This could technically happen if a player unpacked a faction
          // before the draft.  In any case report the error to get a sense of things.
          const errMsg: string = [
            "Draft",
            `found existing faction "${existingFaction.getAbbr()}"`,
            `(wanted "${faction.getAbbr()}")`,
            `for player slot ${dstPlayerSlot}`,
          ].join(" ");
          ErrorHandler.onError.trigger(errMsg);
        } else {
          this._unpackFaction(faction, dstPlayerSlot, seatIndex);
        }
      }
    });

    if (TI4.config.sources.includes("twilights-fall")) {
      TFSetupMatsDraftExt.removeAllMatsAndReferenceCards();
      TFSetupFactionSheets.removeMiniFactionSheets();
    }

    return this;
  }

  _unpackFaction(
    faction: Faction,
    dstPlayerSlot: number,
    seatIndex: number,
  ): void {
    const chooserPlayerSlot: number =
      this._draftState.getSeatIndexToPlayerSlot(seatIndex);

    if (TI4.config.sources.includes("twilights-fall")) {
      new TFUnpackFaction(faction, dstPlayerSlot).unpack();

      const homeFaction: Faction | undefined =
        TFSetupMatsDraftExt.getFactionChoice(
          chooserPlayerSlot,
          "tf-draft-home",
        );
      if (homeFaction) {
        new TFUnpackHomeSystem(homeFaction, dstPlayerSlot).unpack();
      }

      const unitFaction: Faction | undefined =
        TFSetupMatsDraftExt.getFactionChoice(
          chooserPlayerSlot,
          "tf-draft-starting-units",
        );
      if (unitFaction) {
        new TFUnpackStartingUnits(unitFaction, dstPlayerSlot).unpack();
      }
    } else {
      new UnpackAll(faction, dstPlayerSlot).unpack();
    }
  }

  unpackMap(): this {
    // Get baked map string, included faction home systems.
    const mapString: string = DraftToMapString.fromDraftState(
      this._draftState,
    ).mapString;

    const exclude: Set<number> = new Set();
    if (this._draftState.getOpaqueType() === "minorFactions") {
      this._draftState.getOpaques().forEach((opaque: string) => {
        const tile: number = Number.parseInt(opaque, 10);
        exclude.add(tile);
      });
    }

    const mapStringEntries: Array<MapStringEntry> =
      new MapStringParser().parseOrThrow(mapString);
    mapStringEntries.forEach((entry: MapStringEntry) => {
      const tile: number = entry.tile;
      const faction: Faction | undefined =
        TI4.factionRegistry.getByHomeSystemTileNumber(tile);
      if (faction && !exclude.has(tile)) {
        entry.tile = 0;
        entry.rot = undefined;
        entry.side = undefined;
      }
    });
    const scrubbedMapString: string = new MapStringFormat().format(
      mapStringEntries,
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

  dealMinorFactionAlliances(): this {
    const systemTileObjs: Array<GameObject> = [];

    const opaques: Array<string> = this._draftState.getOpaques();
    opaques.forEach((opaque: string) => {
      const tile: number = Number.parseInt(opaque, 10);
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(tile);
      if (system) {
        systemTileObjs.push(system.getObj());
      }
    });

    RightClickMinorFactions.dealAllianceCards(systemTileObjs);
    RightClickMinorFactions.enableExplorationTraits(systemTileObjs);

    return this;
  }
}
