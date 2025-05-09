import { Card, Vector, world } from "@tabletop-playground/api";
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

export class GoalCounter {
  private readonly _find: Find = new Find();

  /**
   * Count per-player number of flagships and war suns.
   *
   * @returns
   */
  countFlagshipsAndWarSuns(): Map<PlayerSlot, number> {
    const result = new Map<PlayerSlot, number>();

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("unit:base/flagship") ||
        nsid.startsWith("unit:base/war-sun")
      ) {
        const playerSlot: PlayerSlot = obj.getOwningPlayerSlot();
        const count: number = result.get(playerSlot) || 0;
        result.set(playerSlot, count + 1);
      }
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

    // Get valid hexes (must be on a system tile).
    const validHexes: Set<HexType> = new Set();
    TI4.systemRegistry.getAllSystemsWithObjs().forEach((system) => {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      validHexes.add(hex);
    });

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

    // Get all non-fighter ships in valid hexes.
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        return (
          nonFighterShips.has(plastic.getUnit()) &&
          validHexes.has(plastic.getHex())
        );
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

  _getPlayerSlotToPlanetCards(): Map<PlayerSlot, Array<Card>> {
    const result = new Map<PlayerSlot, Array<Card>>();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof Card) {
        const nsid: string = NSID.get(obj);
        if (nsid.startsWith("card.planet:")) {
          const pos: Vector = obj.getPosition();
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

    const playerSlotToFaction: Map<PlayerSlot, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();

    const allHomePlanetCardNsids: Set<string> = new Set();
    const playerSlotToHomePlanetCardNsids: Map<
      PlayerSlot,
      Set<string>
    > = new Map();

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
          allHomePlanetCardNsids.add(nsid);
        });
        playerSlotToHomePlanetCardNsids.set(playerSlot, myHomePlanetNsids);
      }
    });

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
}
