import { Card, GameObject, world } from "@tabletop-playground/api";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";
import { RightClickScorePrivate } from "../../../../context-menu/right-click-score/right-click-score-private";
import { RightClickScorePublic } from "../../../../context-menu/right-click-score/right-click-score-public";

export class UpdatorObjectives implements IGameDataUpdator {
  update(gameData: GameData): void {
    const controlTokens: Array<GameObject> = [];
    const objectiveCards: Array<Card> = [];

    // Root objectives.
    // Per-player scored objectives.

    // If a secret objective is on an "extra" slot on the stage 1/2 mat count it as a public.
    // TODO XXX
  }

  _getRelevanCards(): Array<Card> {
    const objectiveCards: Array<Card> = [];

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof Card) {
        if (
          RightClickScorePrivate.isScorablePrivate(obj) ||
          RightClickScorePublic.isScorablePublic(obj)
        ) {
          objectiveCards.push(obj);
        }
      }
    }
    return objectiveCards;
  }

  _getAvailableObjectives(): UpdatorObjectivesType {
    const objectives: UpdatorObjectivesType = {
      "Public Objectives I": [],
      "Public Objectives II": [],
      "Secret Objectives": [],
      Agenda: [],
      Other: [],
      Relics: [],
    };
    return objectives;
  }
}
