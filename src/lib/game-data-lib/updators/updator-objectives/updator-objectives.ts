import {
  Card,
  CardDetails,
  CardHolder,
  GameObject,
  SnapPoint,
  StaticObject,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Atop, CardUtil, Find, HexType, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";
import { RightClickScorePrivate } from "../../../../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../../../../context-menu/right-click-score/right-click-score-public";

const ASSIGN_NSIDS_TO_CLOSEST_PLAYER: Set<string> = new Set<string>([
  "card.planet:thunders-edge/styx",
  "card.relic:pok/the-obsidian",
  "card.relic:pok/shard-of-the-throne",
]);

export class UpdatorObjectives implements IGameDataUpdator {
  update(gameData: GameData): void {
    const controlTokens: Array<GameObject> = this._getControlTokens();
    const objectiveCards: Array<Card> = this._getRelevantCards();

    const find: Find = new Find();
    const cardUtil: CardUtil = new CardUtil();

    // Root objectives.
    gameData.objectives = this._fillObjectivesType(objectiveCards);

    // Per-player scored objectives.
    const playerSlotToCardNames: Map<PlayerSlot, Array<string>> = new Map();
    for (const objectiveCard of objectiveCards) {
      const cardDetails: CardDetails = objectiveCard.getCardDetails();
      const cardName: string = cardDetails.name;

      // Is card in a player-scoring card holder?
      const cardHolder: CardHolder | undefined = objectiveCard.getHolder();
      if (cardHolder) {
        const holderNsid: string = NSID.get(cardHolder);
        const owningPlayerSlot: number = cardHolder.getOwningPlayerSlot();
        if (holderNsid === "card-holder:base/player-scoring") {
          let cardNames: Array<string> | undefined =
            playerSlotToCardNames.get(owningPlayerSlot);
          if (!cardNames) {
            cardNames = [];
            playerSlotToCardNames.set(owningPlayerSlot, cardNames);
          }
          cardNames.push(cardName);
        }
      }

      // Look for control tokens on card.
      const atop: Atop = new Atop(objectiveCard);
      for (const controlToken of controlTokens) {
        const pos: Vector = controlToken.getPosition();
        if (atop.isAtop(pos)) {
          const owningPlayerSlot: number = controlToken.getOwningPlayerSlot();
          let cardNames: Array<string> | undefined =
            playerSlotToCardNames.get(owningPlayerSlot);
          if (!cardNames) {
            cardNames = [];
            playerSlotToCardNames.set(owningPlayerSlot, cardNames);
          }
          cardNames.push(cardName);
        }
      }

      // Assign some cards to closest player IF not on a system tile.
      const nsid: string = NSID.get(objectiveCard);
      if (ASSIGN_NSIDS_TO_CLOSEST_PLAYER.has(nsid)) {
        const pos: Vector = objectiveCard.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);

        // Ignore if on a system tile.
        const systemHexes: Set<HexType> =
          TI4.systemRegistry.getAllSystemHexes();
        if (!systemHexes.has(hex)) {
          const owningPlayerSlot: number =
            find.closestOwnedCardHolderOwner(pos);
          let cardNames: Array<string> | undefined =
            playerSlotToCardNames.get(owningPlayerSlot);
          if (!cardNames) {
            cardNames = [];
            playerSlotToCardNames.set(owningPlayerSlot, cardNames);
          }
          cardNames.push(cardName);
        }
      }
    }

    // Breakthrough?
    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.breakthrough:") &&
        cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        const pos: Vector = obj.getPosition();
        const owner: number = find.closestOwnedCardHolderOwner(pos);
        let cardNames: Array<string> | undefined =
          playerSlotToCardNames.get(owner);
        if (!cardNames && owner >= 0) {
          cardNames = [];
          playerSlotToCardNames.set(owner, cardNames);
        }
        if (cardNames) {
          cardNames.push("Breakthrough");
        }
      }
    }

    gameData.players.forEach(
      (playerData: PerPlayerGameData, seatIndex: number): void => {
        const playerSlot: number =
          TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
        const cardNames: Array<string> | undefined =
          playerSlotToCardNames.get(playerSlot);
        if (cardNames) {
          playerData.objectives = cardNames;
        } else {
          playerData.objectives = [];
        }
      }
    );
  }

  _getControlTokens(): Array<GameObject> {
    const controlTokens: Array<GameObject> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token.control:")) {
        controlTokens.push(obj);
      }
    }
    return controlTokens;
  }

  _getRelevantCards(): Array<Card> {
    const objectiveCards: Array<Card> = [];

    const trackOtherNsids: Set<string> = new Set<string>([
      "card.relic:pok/the-obsidian", // not scorable, but wanted for streamer display
      "card.relic:codex.liberation/book-of-latvinia",
      "card.relic:pok/the-crown-of-emphidia",
      "card.planet:thunders-edge/styx",
    ]);

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (obj instanceof Card) {
        if (obj.isHeld()) {
          continue;
        }

        // Ignore if in player card holder (NOT scoring card holder).
        const holder: CardHolder | undefined = obj.getHolder();
        if (holder) {
          const holderNsid: string = NSID.get(holder);
          if (holderNsid === "card-holder:base/player-hand") {
            continue;
          }
        }

        // Ignore decks and discards.
        const snapPoint: SnapPoint | undefined = obj.getSnappedToPoint();
        if (snapPoint) {
          const tags: Array<string> = snapPoint.getTags();
          if (
            tags.includes("discard-agenda") ||
            tags.includes("active-agenda") ||
            tags.includes("deck-planet") ||
            tags.includes("deck-relic")
          ) {
            continue;
          }
        }

        // Ignore face-down objectives.
        if (nsid.startsWith("card.objective") && !obj.isFaceUp()) {
          continue;
        }

        if (
          RightClickScorePrivate.isScorablePrivate(obj) ||
          RightClickScorePublic.isScorablePublic(obj) ||
          trackOtherNsids.has(nsid)
        ) {
          objectiveCards.push(obj);
        }
      }
    }
    return objectiveCards;
  }

  _fillObjectivesType(objectiveCards: Array<Card>): UpdatorObjectivesType {
    const public1s: Array<Card> = [];
    const public2s: Array<Card> = [];
    const secrets: Array<Card> = [];
    const agendas: Array<Card> = [];
    const relics: Array<Card> = [];
    const other: Array<Card> = [];

    for (const card of objectiveCards) {
      const nsid: string = NSID.get(card);
      if (nsid.startsWith("card.objective.public-1:")) {
        public1s.push(card);
      } else if (nsid.startsWith("card.objective.public-2:")) {
        public2s.push(card);
      } else if (nsid.startsWith("card.objective.secret:")) {
        // If a secret objective is on an "extra" slot on the stage 1/2 mat count it as a public.
        let consumed: boolean = false;
        const snapPoint: SnapPoint | undefined = card.getSnappedToPoint();
        if (snapPoint) {
          const mat: StaticObject | undefined = snapPoint.getParentObject();
          if (mat) {
            const matNsid: string = NSID.get(mat);
            if (
              matNsid === "mat:base/objective-1" ||
              matNsid === "mat:base/objective-2" ||
              matNsid === "mat:base/agenda-laws"
            ) {
              public1s.push(card);
              consumed = true;
            }
          }
        }
        if (!consumed) {
          secrets.push(card);
        }
      } else if (nsid.startsWith("card.relic:")) {
        relics.push(card);
      } else {
        other.push(card); // support for the throne
      }
    }

    const getCardNames = (cards: Array<Card>): Array<string> => {
      return cards.map((card: Card): string => {
        const cardDetails: CardDetails = card.getCardDetails();
        return cardDetails.name;
      });
    };
    const objectivesType: UpdatorObjectivesType = {
      "Public Objectives I": getCardNames(public1s),
      "Public Objectives II": getCardNames(public2s),
      "Secret Objectives": getCardNames(secrets),
      Agenda: getCardNames(agendas),
      Other: getCardNames(other),
      Relics: getCardNames(relics),
    };

    objectivesType.Other?.push("Breakthrough");

    return objectivesType;
  }
}
