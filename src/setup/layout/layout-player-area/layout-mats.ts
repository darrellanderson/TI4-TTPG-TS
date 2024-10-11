import {
  Card,
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
  VerticalAlignment,
} from "@tabletop-playground/api";
import {
  CardUtil,
  DeletedItemsContainer,
  LayoutObjects,
  Spawn,
} from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { Tech } from "lib/tech-lib/tech/tech";

export class LayoutMats {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    if (playerSlot < 0) {
      throw new Error("must have a player slot");
    }

    const buildMat: GameObject = Spawn.spawnOrThrow("mat.player:base/build");
    const planetMat: GameObject = Spawn.spawnOrThrow("mat.player:base/planet");
    const techMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology"
    );
    const techDeckMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology-deck"
    );

    buildMat.setOwningPlayerSlot(playerSlot);
    planetMat.setOwningPlayerSlot(playerSlot);
    techMat.setOwningPlayerSlot(playerSlot);
    techDeckMat.setOwningPlayerSlot(playerSlot);

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(buildMat)
      .add(planetMat)
      .add(techMat)
      .add(techDeckMat);

    this._layout.addAfterLayout(() => {
      buildMat.setObjectType(ObjectType.Ground);
      planetMat.setObjectType(ObjectType.Ground);
      techMat.setObjectType(ObjectType.Ground);
      techDeckMat.setObjectType(ObjectType.Ground);
    });

    this._layout.addAfterLayout(() => {
      const snapPoints: Array<SnapPoint> = techDeckMat.getAllSnapPoints();
      const snapPoint: SnapPoint | undefined = snapPoints[0];
      this._spawnTechDeck(snapPoint);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  _spawnTechDeck(snapPoint: SnapPoint | undefined): void {
    if (snapPoint) {
      const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
        nsid.startsWith("card.technology")
      );
      const pos: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);

      const deck: GameObject = Spawn.spawnMergeDecksOrThrow(nsids, pos);

      // Remove faction tech.
      if (deck instanceof Card) {
        this._filterTechDeck(deck);
      }
      deck.snapToGround();
      deck.snap();
    }
  }

  _filterTechDeck(deck: Card): void {
    deck.setName("Technology");
    const filtered: Card | undefined = new CardUtil().filterCards(
      deck,
      (nsid: string): boolean => {
        let result: boolean = false;
        const tech: Tech | undefined = TI4.techRegistry.getByNsid(nsid);
        if (!tech || tech.isFactionTech()) {
          result = true;
        }
        return result;
      }
    );
    if (filtered) {
      DeletedItemsContainer.destroyWithoutCopying(filtered);
    }
  }
}
