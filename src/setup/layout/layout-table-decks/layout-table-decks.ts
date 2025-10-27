import {
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import { Find, LayoutObjects } from "ttpg-darrell";
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

    const pos: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);
    const deck: GameObject = TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow(
      nsidPrefix,
      pos
    );
    deck.snapToGround();
    deck.snap();
  }

  constructor() {
    this._layout = new LayoutObjects();

    const explorationMat: GameObject = TI4.spawn.spawnOrThrow(
      "mat.deck:pok/exploration"
    );
    const baseMat: GameObject = TI4.spawn.spawnOrThrow("mat.deck:base/base");
    const planetMat: GameObject = TI4.spawn.spawnOrThrow(
      "mat.deck:base/planet"
    );
    const factionReferenceMat: GameObject = TI4.spawn.spawnOrThrow(
      "mat.deck:base/faction-reference"
    );
    const eventMat: GameObject = TI4.spawn.spawnOrThrow("mat.deck:base/event");

    const planetsAndBase: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(planetMat)
      .add(baseMat)
      .addAfterLayout(() => {
        planetMat.setObjectType(ObjectType.Ground);
        baseMat.setObjectType(ObjectType.Ground);
      });

    const factionAndEvent: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(factionReferenceMat)
      .add(eventMat)
      .addAfterLayout(() => {
        factionReferenceMat.setObjectType(ObjectType.Ground);
        eventMat.setObjectType(ObjectType.Ground);
      });

    const speakerToken: GameObject =
      TI4.spawn.spawnOrThrow("token:base/speaker");
    const benedictionToken: GameObject = TI4.spawn.spawnOrThrow(
      "token:twilights-fall/benediction"
    );
    const codex4scenario: GameObject = TI4.spawn.spawnOrThrow(
      "container:codex.liberation/liberation-scenario"
    );

    const speakerTokenMisc: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(speakerToken)
      .add(benedictionToken)
      .add(codex4scenario);

    const matTwilightsFall: GameObject = TI4.spawn.spawnOrThrow(
      "mat.deck:twilights-fall/twilights-fall"
    );

    this._layout
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(explorationMat)
      .add(planetsAndBase)
      .add(factionAndEvent)
      .add(speakerTokenMisc)
      .add(matTwilightsFall)
      .addAfterLayout(() => {
        explorationMat.setObjectType(ObjectType.Ground);
        codex4scenario.setObjectType(ObjectType.Ground);
        matTwilightsFall.setObjectType(ObjectType.Ground);
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
      LayoutTableDecks._spawnDeck("card.event", "deck-event");
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
