import {
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import { Find, LayoutObjects, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutTableDecks {
  private readonly _layout: LayoutObjects;

  static _spawnDeck(nsidPrefix: string, snapPointTag: string): void {
    const find: Find = new Find();
    const snapPoint: SnapPoint | undefined =
      find.findSnapPointByTag(snapPointTag);
    if (!snapPoint) {
      throw new Error(`Snap point not found: ${snapPointTag}`);
    }

    const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
      nsid.startsWith(nsidPrefix)
    );
    const pos: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);

    const deck: GameObject = Spawn.spawnMergeDecksOrThrow(nsids, pos);
    deck.snapToGround();
    deck.snap();
  }

  constructor() {
    this._layout = new LayoutObjects();

    const baseMat: GameObject = Spawn.spawnOrThrow("mat.deck:base/base");
    const explorationMat: GameObject = Spawn.spawnOrThrow(
      "mat.deck:pok/exploration"
    );
    const factionReferenceMat: GameObject = Spawn.spawnOrThrow(
      "mat.deck:base/faction-reference"
    );
    const planetMat: GameObject = Spawn.spawnOrThrow("mat.deck:base/planet");

    const planetsAndBase: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(planetMat)
      .add(baseMat)
      .addAfterLayout(() => {
        planetMat.setObjectType(ObjectType.Ground);
        baseMat.setObjectType(ObjectType.Ground);
      });

    this._layout
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(explorationMat)
      .add(planetsAndBase)
      .add(factionReferenceMat)
      .addAfterLayout(() => {
        explorationMat.setObjectType(ObjectType.Ground);
        factionReferenceMat.setObjectType(ObjectType.Ground);
      });

    this._layout.addAfterLayout(() => {
      LayoutTableDecks._spawnDeck("card.action", "deck-action");
      LayoutTableDecks._spawnDeck("card.agenda", "deck-agenda");
      LayoutTableDecks._spawnDeck(
        "card.objective.secret",
        "deck-objective-secret"
      );

      LayoutTableDecks._spawnDeck("card.planet", "deck-planet");
      LayoutTableDecks._spawnDeck(
        "card.legendary-planet",
        "deck-legendary-planet"
      );

      LayoutTableDecks._spawnDeck(
        "card.exploration.cultural",
        "deck-exploration-cultural"
      );
      LayoutTableDecks._spawnDeck(
        "card.exploration.industrial",
        "deck-exploration-industrial"
      );
      LayoutTableDecks._spawnDeck(
        "card.exploration.hazardous",
        "deck-exploration-hazardous"
      );
      LayoutTableDecks._spawnDeck(
        "card.exploration.frontier",
        "deck-exploration-frontier"
      );
      LayoutTableDecks._spawnDeck("card.relic", "deck-relic");

      LayoutTableDecks._spawnDeck(
        "card.faction-reference",
        "deck-faction-reference"
      );
    });

    const speakerToken: GameObject = Spawn.spawnOrThrow("token:base/speaker");
    this._layout.addAfterLayout(() => {
      const center: Vector = this._layout.getCenter();
      const { h } = this._layout.calculateSize();
      const extent: Vector = speakerToken.getExtent(false, false);
      const dx: number = h / 2 + LayoutConfig.spacingWide + extent.x;
      const pos: Vector = center.add([-dx, 0, 10]);
      speakerToken.setPosition(pos);
      speakerToken.snapToGround();
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
