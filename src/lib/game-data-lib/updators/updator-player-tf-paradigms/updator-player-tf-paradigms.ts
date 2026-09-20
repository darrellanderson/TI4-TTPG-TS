import {
  Card,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Atop,
  CardUtil,
  Find,
  NSID,
  OnCardBecameSingletonOrDeck,
  ParsedNSID,
  PlayerSlot,
} from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { __atopCacheGet } from "../../../combat-lib/combat-roll/combat-roll";
import { Paradigm } from "../../../twilights-fall-lib/twilights-fall/paradigm";

export class UpdatorPlayerTFParadigms implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  static getTimestamp(card: Card): number {
    const data: string = card.getSavedData("timestamp");
    if (data && data.length > 0) {
      return parseInt(data, 10);
    }
    return 0;
  }

  static setTimestamp(card: Card): void {
    const oldData: string = card.getSavedData("timestamp");
    if (!oldData || oldData.length === 0) {
      const data: string = Date.now().toString();
      card.setSavedData(data, "timestamp");
    }
  }

  constructor() {
    // world.getAllObjects does not return cards in creation order.
    // Add a creation timestamp to tech cards so we can sort them by creation order.
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card, _player?: Player): void => {
        const nsid: string = NSID.get(card);
        if (card instanceof Card && nsid.startsWith("card.tf-paradigm")) {
          UpdatorPlayerTFParadigms.setTimestamp(card);
        }
      },
    );
  }

  update(gameData: GameData): void {
    // Only apply if a TF game.
    if (!TI4.config.sources.includes("twilights-fall")) {
      return;
    }

    let paradigmCards: Array<Card> = [];
    let draftMat: GameObject | undefined = undefined;

    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        obj instanceof Card &&
        nsid.startsWith("card.tf-paradigm") &&
        this._cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        paradigmCards.push(obj);
      }

      if (nsid === "mat.deck:twilights-fall/twilights-fall") {
        draftMat = obj;
      }
    }

    // Remove any cards on the mat.
    if (draftMat) {
      const atop: Atop = __atopCacheGet(draftMat);
      paradigmCards = paradigmCards.filter((paradigmCard: Card): boolean => {
        return !atop.isAtop(paradigmCard.getPosition());
      });
    }

    // Sort cards by creation order.
    paradigmCards.sort((a: Card, b: Card): number => {
      const aTimestamp: number = UpdatorPlayerTFParadigms.getTimestamp(a);
      const bTimestamp: number = UpdatorPlayerTFParadigms.getTimestamp(b);
      if (aTimestamp !== bTimestamp) {
        return aTimestamp - bTimestamp;
      }
      // Break ties by alpha order of name.
      return a.getName().localeCompare(b.getName());
    });

    // Group cards by player slot.
    const playerSlotToCards: Map<number, Array<Card>> = new Map();
    paradigmCards.forEach((card: Card): void => {
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
        const cards: Array<Card> = playerSlotToCards.get(playerSlot) ?? [];

        player.tfParadigms = cards
          .map((card: Card): string => {
            const nsid: string = NSID.get(card);
            const paradigm: Paradigm | undefined = TI4.tfParadigmRegistry.getByNsid(nsid);
            return paradigm?.getAbbr() ?? "";
          })
          .filter((name: string): boolean => name.length > 0)
          .filter(
            (name: string, index: number, array: Array<string>): boolean =>
              array.indexOf(name) === index,
          ); // unique
      },
    );
  }
}
