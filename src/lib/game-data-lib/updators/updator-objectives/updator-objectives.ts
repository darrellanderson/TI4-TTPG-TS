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
import { Atop, Find, NSID, PlayerSlot } from "ttpg-darrell";
import { GameData, PerPlayerGameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";
import { RightClickScorePrivate } from "../../../../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../../../../context-menu/right-click-score/right-click-score-public";

export class UpdatorObjectives implements IGameDataUpdator {
  update(gameData: GameData): void {
    const controlTokens: Array<GameObject> = this._getControlTokens();
    const objectiveCards: Array<Card> = this._getRelevantCards();

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

      // Assign to closest player.
      const nsid: string = NSID.get(objectiveCard);
      if (nsid === "card.planet:thunders-edge/styx") {
        const pos: Vector = objectiveCard.getPosition();
        const owningPlayerSlot: number = new Find().closestOwnedCardHolderOwner(
          pos
        );
        let cardNames: Array<string> | undefined =
          playerSlotToCardNames.get(owningPlayerSlot);
        if (!cardNames) {
          cardNames = [];
          playerSlotToCardNames.set(owningPlayerSlot, cardNames);
        }
        cardNames.push(cardName);
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
      "card.planet:thunders-edge/styx",
    ]);

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof Card) {
        if (obj.isHeld()) {
          continue;
        }
        const snapPoint: SnapPoint | undefined = obj.getSnappedToPoint();
        if (snapPoint) {
          const tags: Array<string> = snapPoint.getTags();
          if (
            tags.includes("discard-agenda") ||
            tags.includes("active-agenda") ||
            tags.includes("deck-planet")
          ) {
            continue;
          }
        }

        const nsid: string = NSID.get(obj);
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
    return objectivesType;
  }
}
