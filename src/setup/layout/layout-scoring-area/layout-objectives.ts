import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { LayoutTableDecks } from "../layout-table-decks/layout-table-decks";

export class LayoutObjectives {
  private readonly _layout: LayoutObjects;
  private readonly _scoreboard: GameObject;

  constructor() {
    const objectivesMat1: GameObject = TI4.spawn.spawnOrThrow(
      "mat:base/objective-1"
    );
    this._scoreboard = TI4.spawn.spawnOrThrow("token:base/scoreboard");
    const objectivesMat2: GameObject = TI4.spawn.spawnOrThrow(
      "mat:base/objective-2"
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(objectivesMat1)
      .add(this._scoreboard)
      .add(objectivesMat2);

    this._layout.addAfterLayout(() => {
      objectivesMat1.setObjectType(ObjectType.Ground);
      this._scoreboard.setObjectType(ObjectType.Ground);
      objectivesMat2.setObjectType(ObjectType.Ground);
    });

    this._layout.addAfterLayout(() => {
      LayoutTableDecks._spawnDeck(
        "card.objective.public-1",
        "deck-objective-1"
      );
      LayoutTableDecks._spawnDeck(
        "card.objective.public-2",
        "deck-objective-2"
      );
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  getScoreboard(): GameObject {
    return this._scoreboard;
  }
}
