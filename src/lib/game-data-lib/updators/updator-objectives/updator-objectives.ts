import { Card, GameObject } from "@tabletop-playground/api";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";

export class UpdatorObjectives implements IGameDataUpdator {
  update(gameData: GameData): void {
    const controlTokens: Array<GameObject> = [];
    const objectiveCards: Array<Card> = [];

    // Root objectives.
    // Per-player scored objectives.

    // If a secret objective is on an "extra" slot on the stage 1/2 mat count it as a public.
    // TODO XXX
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
