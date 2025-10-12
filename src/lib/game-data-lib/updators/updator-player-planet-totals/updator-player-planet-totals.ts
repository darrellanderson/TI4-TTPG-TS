import { Card, Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, HexType, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorPlayerPlanetTotalsType } from "./updator-player-planet-totals-type";
import { Planet } from "../../../system-lib/planet/planet";

export class UpdatorPlayerPlanetTotals implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const planetCards: Array<Card> = [];

    const systemHexes: Set<HexType> = new Set();
    TI4.systemRegistry.getAllSystemsWithObjs().forEach((system) => {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      systemHexes.add(hex);
    });

    // Find planet cards in the world (not on system tiles).
    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      if (
        obj instanceof Card &&
        (nsid.startsWith("card.planet:") ||
          nsid.startsWith("card.deepwrought-ocean:")) &&
        this._cardUtil.isLooseCard(obj, allowFaceDown) &&
        !systemHexes.has(hex)
      ) {
        planetCards.push(obj);
      }
    }

    // Sort planet cards by player slot.
    const playerSlotToCards: Map<number, Array<Card>> = new Map();
    planetCards.forEach((card: Card): void => {
      const pos: Vector = card.getPosition();
      const playerSlot: PlayerSlot =
        this._find.closestOwnedCardHolderOwner(pos);
      let cards: Array<Card> | undefined = playerSlotToCards.get(playerSlot);
      if (!cards) {
        cards = [];
        playerSlotToCards.set(playerSlot, cards);
      }
      cards.push(card);
    });

    gameData.players.forEach(
      (player: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: PlayerSlot =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);

        const data: UpdatorPlayerPlanetTotalsType = {
          influence: { avail: 0, total: 0 },
          resources: { avail: 0, total: 0 },
          techs: { blue: 0, red: 0, green: 0, yellow: 0 },
          traits: { cultural: 0, hazardous: 0, industrial: 0 },
          legendary: 0,
        };

        const cards: Array<Card> = playerSlotToCards.get(playerSlot) ?? [];
        cards.forEach((card: Card): void => {
          const nsid: string = NSID.get(card);
          const isFaceUp: boolean = card.isFaceUp();
          const planet: Planet | undefined =
            TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
          if (planet) {
            data.influence.total += planet.getInfluence();
            data.resources.total += planet.getResources();
            if (isFaceUp) {
              data.influence.avail += planet.getInfluence();
              data.resources.avail += planet.getResources();
            }

            data.techs.blue += planet
              .getTechs()
              .filter((tech) => tech === "blue").length;
            data.techs.red += planet
              .getTechs()
              .filter((tech) => tech === "red").length;
            data.techs.green += planet
              .getTechs()
              .filter((tech) => tech === "green").length;
            data.techs.yellow += planet
              .getTechs()
              .filter((tech) => tech === "yellow").length;

            data.traits.cultural += planet
              .getTraits()
              .filter((trait) => trait === "cultural").length;
            data.traits.hazardous += planet
              .getTraits()
              .filter((trait) => trait === "hazardous").length;
            data.traits.industrial += planet
              .getTraits()
              .filter((trait) => trait === "industrial").length;

            if (planet.isLegendary()) {
              data.legendary += 1;
            }
          } else if (nsid.startsWith("card.deepwrought-ocean:")) {
            data.influence.total += 1;
            data.resources.total += 1;
            if (isFaceUp) {
              data.influence.avail += 1;
              data.resources.avail += 1;
            }
          }
        });

        player.planetTotals = data;
      }
    );
  }
}
