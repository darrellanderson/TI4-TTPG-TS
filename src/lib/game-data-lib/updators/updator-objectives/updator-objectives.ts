import { GameData } from "lib/game-data-lib/game-data/game-data";
import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
import { UpdatorObjectivesType } from "./updator-objectives-type";
import { Card, GameObject } from "@tabletop-playground/api";

export const OTHER_SCORABLE_NSIDS = new Set([
  "card.action:base/imperial-rider",
  "card.agenda:base.only/holy-planet-of-ixth",
  "card.agenda:base.only/shard-of-the-throne",
  "card.agenda:base.only/the-crown-of-emphidia",
  "card.agenda:base/mutiny",
  "card.agenda:base/seed-of-an-empire",
  "card.agenda:pok/political-censure",
  "card.relic:pok/shard-of-the-throne",
  "card.relic:pok/the-crown-of-emphidia",
]);

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
      Other: [],
    };
    return objectives;
  }
}
