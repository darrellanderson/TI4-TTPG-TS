import {
  Card,
  CardDetails,
  GameObject,
  SnapPoint,
  world,
} from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
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

    // If a secret objective is on an "extra" slot on the stage 1/2 mat count it as a public.
    // TODO XXX
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
            tags.includes("active-agenda")
          ) {
            continue;
          }
        }

        const nsid: string = NSID.get(obj);
        if (
          RightClickScorePrivate.isScorablePrivate(obj) ||
          RightClickScorePublic.isScorablePublic(obj) ||
          nsid === "card.relic:pok/the-obsidian" // not scorable, but wanted for streamer display
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
        secrets.push(card);
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
