import { Card, GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, HexType, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../game-data/game-data";
import { UpdatorPlayerPlanetTotalsType } from "../updators/updator-player-planet-totals/updator-player-planet-totals-type";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { Faction } from "../../faction-lib/faction/faction";
import { System } from "../../system-lib/system/system";
import { Planet } from "../../system-lib/planet/planet";
import { PlanetAttachment } from "../../system-lib/planet-attachment/planet-attachment";

export class GoalCounter {
  private readonly _find: Find = new Find();

  _getSystemHexes(): Set<HexType> {
    const result: Set<HexType> = new Set();
    TI4.systemRegistry.getAllSystemsWithObjs().forEach((system) => {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      result.add(hex);
    });
    return result;
  }

  _getPlayerSlotToPlanetCards(): Map<PlayerSlot, Array<Card>> {
    const result = new Map<PlayerSlot, Array<Card>>();

    // Do not count planet cards on system tiles.
    const validHexes: Set<HexType> = this._getSystemHexes();

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof Card) {
        const nsid: string = NSID.get(obj);
        if (nsid.startsWith("card.planet:")) {
          const pos: Vector = obj.getPosition();
          const hex: HexType = TI4.hex.fromPosition(pos);
          if (!validHexes.has(hex)) {
            const playerSlot: PlayerSlot =
              this._find.closestOwnedCardHolderOwner(pos);
            let cards: Array<Card> | undefined = result.get(playerSlot);
            if (!cards) {
              cards = [];
              result.set(playerSlot, cards);
            }
            cards.push(obj);
          }
        }
      }
    }
    return result;
  }

  _getPlayerSlotToHomePlanetCardNsids(): Map<PlayerSlot, Set<string>> {
    const playerSlotToHomePlanetCardNsids: Map<
      PlayerSlot,
      Set<string>
    > = new Map();

    const playerSlotToFaction: Map<PlayerSlot, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();

    playerSlotToFaction.forEach((faction: Faction, playerSlot: PlayerSlot) => {
      const homeTile: number = faction.getHomeSystemTileNumber();
      const homeSystem: System | undefined =
        TI4.systemRegistry.getBySystemTileNumber(homeTile);
      if (homeSystem) {
        // Get my home planet card nsids.
        const myHomePlanetNsids: Set<string> = new Set();
        homeSystem.getPlanets().forEach((planet: Planet): void => {
          const nsid: string = planet.getPlanetCardNsid();
          myHomePlanetNsids.add(nsid);
        });
        playerSlotToHomePlanetCardNsids.set(playerSlot, myHomePlanetNsids);
      }
    });

    return playerSlotToHomePlanetCardNsids;
  }

  _getAllHomePlanetCardNsids(): Set<string> {
    const allHomePlanetCardNsids: Set<string> = new Set();

    const playerSlotToHomePlanetCardNsids: Map<
      PlayerSlot,
      Set<string>
    > = this._getPlayerSlotToHomePlanetCardNsids();
    playerSlotToHomePlanetCardNsids.forEach(
      (myHomePlanetNsids: Set<string>, _playerSlot: PlayerSlot) => {
        myHomePlanetNsids.forEach((nsid: string): void => {
          allHomePlanetCardNsids.add(nsid);
        });
      }
    );

    return allHomePlanetCardNsids;
  }

  /**
   * Count per-player number of flagships and war suns.
   *
   * @returns
   */
  countFlagshipsAndWarSuns(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    // Get all flagships and war suns (UnitPlastic restricts to valid hexes).
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        const nsid: string = NSID.get(plastic.getObj());
        return (
          nsid.startsWith("unit:base/flagship") ||
          nsid.startsWith("unit:base/war-sun")
        );
      }
    );

    for (const plastic of plastics) {
      const obj: GameObject = plastic.getObj();
      const playerSlot: PlayerSlot = obj.getOwningPlayerSlot();
      const count: number = result.get(playerSlot) || 0;
      result.set(playerSlot, count + 1);
    }

    return result;
  }

  countInfResTgs(): Map<PlayerSlot, { inf: number; res: number; tgs: number }> {
    const result = new Map<
      PlayerSlot,
      { inf: number; res: number; tgs: number }
    >();

    const gameData: GameData | undefined = TI4.lastGameData.getLastGameData();
    if (gameData) {
      gameData.players.forEach((player: PerPlayerGameData, index: number) => {
        let inf: number = 0;
        let res: number = 0;
        const planetTotals: UpdatorPlayerPlanetTotalsType | undefined =
          player.planetTotals;
        if (planetTotals) {
          inf = planetTotals.influence.total;
          res = planetTotals.resources.total;
        }

        const tgs: number = player.tradeGoods || 0;

        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(index);
        result.set(playerSlot, { inf, res, tgs });
      });
    }

    return result;
  }

  countMaxNonFighterShipsInSingleSystem(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    // Non-fighter ship UnitTypes.
    const nonFighterShips: Set<UnitType> = new Set();
    TI4.unitAttrsRegistry
      .defaultUnitAttrsSet()
      .getAll()
      .forEach((unitAttrs: UnitAttrs): void => {
        const unitType: UnitType = unitAttrs.getUnit();
        if (unitAttrs.isShip() && unitType !== "fighter") {
          nonFighterShips.add(unitType);
        }
      });

    // Get all non-fighter ships (UnitPlastic restricts to valid hexes).
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        return nonFighterShips.has(plastic.getUnit());
      }
    );

    // Group by hex.
    const hexToPlastics: Map<string, Array<UnitPlastic>> = new Map();
    for (const plastic of plastics) {
      const hex: HexType = plastic.getHex();
      let hexPlastics: Array<UnitPlastic> | undefined = hexToPlastics.get(hex);
      if (!hexPlastics) {
        hexPlastics = [];
        hexToPlastics.set(hex, hexPlastics);
      }
      hexPlastics.push(plastic);
    }

    // Count per-player number of non-fighter ships in each hex.
    for (const hexPlastics of hexToPlastics.values()) {
      // Per-player counts.
      const playerSlotToCount: Map<PlayerSlot, number> = new Map();
      for (const plastic of hexPlastics) {
        const playerSlot: PlayerSlot = plastic.getOwningPlayerSlot();
        let count: number = playerSlotToCount.get(playerSlot) || 0;
        count += 1;
        playerSlotToCount.set(playerSlot, count);
      }

      for (const [playerSlot, count] of playerSlotToCount.entries()) {
        const oldCount: number = result.get(playerSlot) || 0;
        if (count > oldCount) {
          result.set(playerSlot, count);
        }
      }
    }

    return result;
  }

  countPlanetsAndGetNeighbors(): Map<
    PlayerSlot,
    { planets: number; neighbors: Array<PlayerSlot> }
  > {
    const result = new Map<
      PlayerSlot,
      { planets: number; neighbors: Array<PlayerSlot> }
    >();

    // Fill in neighbors, initial planet count of 0.
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    playerSeats.forEach((playerSeat: PlayerSeatType, index: number): void => {
      const leftIndex: number = (index + 1) % playerSeats.length;
      const left: PlayerSeatType | undefined = playerSeats[leftIndex];

      const rightIndex: number =
        (index + playerSeats.length - 1) % playerSeats.length;
      const right: PlayerSeatType | undefined = playerSeats[rightIndex];

      if (left && right) {
        result.set(playerSeat.playerSlot, {
          planets: 0,
          neighbors: [left.playerSlot, right.playerSlot],
        });
      }
    });

    // Count planets.  GameData does not have this info.
    const playerSlotToCards: Map<
      PlayerSlot,
      Array<Card>
    > = this._getPlayerSlotToPlanetCards();
    playerSlotToCards.forEach(
      (cards: Array<Card>, playerSlot: PlayerSlot): void => {
        const entry:
          | { planets: number; neighbors: Array<PlayerSlot> }
          | undefined = result.get(playerSlot);
        if (entry) {
          entry.planets += cards.length;
        }
      }
    );

    return result;
  }

  countPlanetsInOthersHome(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    const playerSlotToPlanetCards: Map<
      PlayerSlot,
      Array<Card>
    > = this._getPlayerSlotToPlanetCards();

    const playerSlotToHomePlanetCardNsids: Map<
      PlayerSlot,
      Set<string>
    > = this._getPlayerSlotToHomePlanetCardNsids();

    const allHomePlanetCardNsids: Set<string> =
      this._getAllHomePlanetCardNsids();

    TI4.playerSeats
      .getAllSeats()
      .forEach((playerSeat: PlayerSeatType): void => {
        const playerSlot: PlayerSlot = playerSeat.playerSlot;
        const planetCards: Array<Card> | undefined =
          playerSlotToPlanetCards.get(playerSlot);
        const myHomePlanetCardNsids: Set<string> | undefined =
          playerSlotToHomePlanetCardNsids.get(playerSlot);
        if (planetCards && myHomePlanetCardNsids) {
          let count: number = 0;
          planetCards.forEach((planetCard: Card): void => {
            const nsid: string = NSID.get(planetCard);
            if (
              allHomePlanetCardNsids.has(nsid) &&
              !myHomePlanetCardNsids.has(nsid)
            ) {
              count += 1;
            }
          });
          result.set(playerSlot, count);
        }
      });

    return result;
  }

  countPlanetsNonHome(
    excludeCustodiaVigilia: boolean
  ): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    const allHomePlanetCardNsids: Set<string> =
      this._getAllHomePlanetCardNsids();

    const playerSlotToPlanetCards: Map<
      PlayerSlot,
      Array<Card>
    > = this._getPlayerSlotToPlanetCards();

    TI4.playerSeats
      .getAllSeats()
      .forEach((playerSeat: PlayerSeatType): void => {
        const playerSlot: PlayerSlot = playerSeat.playerSlot;
        const planetCards: Array<Card> | undefined =
          playerSlotToPlanetCards.get(playerSlot);
        if (planetCards) {
          let count: number = 0;
          planetCards.forEach((planetCard: Card): void => {
            const nsid: string = NSID.get(planetCard);
            if (
              excludeCustodiaVigilia &&
              nsid === "card.planet:codex.vigil/custodia-vigilia"
            ) {
              return;
            }
            if (!allHomePlanetCardNsids.has(nsid)) {
              count += 1;
            }
          });
          result.set(playerSlot, count);
        }
      });

    return result;
  }

  countPlanetTraits(): Map<
    PlayerSlot,
    {
      cultural: number;
      industrial: number;
      hazardous: number;
    }
  > {
    const result = new Map<
      PlayerSlot,
      {
        cultural: number;
        industrial: number;
        hazardous: number;
      }
    >();

    const gameData: GameData | undefined = TI4.lastGameData.getLastGameData();
    if (gameData) {
      gameData.players.forEach((player: PerPlayerGameData, index: number) => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(index);
        let entry:
          | {
              cultural: number;
              industrial: number;
              hazardous: number;
            }
          | undefined = result.get(playerSlot);
        if (!entry) {
          entry = {
            cultural: 0,
            industrial: 0,
            hazardous: 0,
          };
          result.set(playerSlot, entry);
        }
        const planetTotals: UpdatorPlayerPlanetTotalsType | undefined =
          player.planetTotals;
        if (planetTotals) {
          entry.cultural += planetTotals.traits.cultural;
          entry.industrial += planetTotals.traits.industrial;
          entry.hazardous += planetTotals.traits.hazardous;
        }
      });
    }

    return result;
  }

  countPlanetsWithAttachments(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    const playerSlotToPlanetCards: Map<
      PlayerSlot,
      Array<Card>
    > = this._getPlayerSlotToPlanetCards();

    const ignoreAttachments: Set<string> = new Set([
      "token.attachment.planet:pok/sleeper-token",
      "token.attachment.planet:codex.vigil/custodia-vigilia",
    ]);

    playerSlotToPlanetCards.forEach(
      (cards: Array<Card>, playerSlot: PlayerSlot): void => {
        let count: number = 0;
        cards.forEach((card: Card): void => {
          const nsid: string = NSID.get(card);
          const planet: Planet | undefined =
            TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
          if (planet) {
            count += planet
              .getAttachments()
              .filter((attachment: PlanetAttachment): boolean => {
                // Some attachments are not *actually* attachments for this purpose.
                const attachmentNsid: string = NSID.get(attachment.getObj());
                return !ignoreAttachments.has(attachmentNsid);
              }).length;
          }
        });
        result.set(playerSlot, count);
      }
    );

    return result;
  }

  countPlanetsWithStructuresOutsidePlayersHome(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    const hexToSystem: Map<string, System> = new Map();
    TI4.systemRegistry
      .getAllSystemsWithObjs()
      .forEach((system: System): void => {
        const pos: Vector = system.getObj().getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        hexToSystem.set(hex, system);
      });

    // Assign structures to planets.
    const planetToStructureOwners: Map<Planet, Array<GameObject>> = new Map();
    const structureNsids: Set<string> = new Set([
      "unit:base/space-dock",
      "unit:base/space-dock.token",
      "unit:base/pds",
      "unit:base/pds.token",
    ]);
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (structureNsids.has(nsid)) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        const system: System | undefined = hexToSystem.get(hex);
        if (system) {
          const planet: Planet | undefined = system.getPlanetClosest(pos);
          if (planet) {
            const planetCardNsid: string = planet.getPlanetCardNsid();
            const playerSlot: PlayerSlot = obj.getOwningPlayerSlot();
          }
        }
      }
    }

    // Which planets each player controls (ignores cards on system tiles).
    const playerSlotToPlanetCards: Map<
      PlayerSlot,
      Array<Card>
    > = this._getPlayerSlotToPlanetCards();

    const playerSlotToHomePlanetCardNsids: Map<
      PlayerSlot,
      Set<string>
    > = this._getPlayerSlotToHomePlanetCardNsids();

    return result;
  }
}
