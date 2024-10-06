import {
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
  VerticalAlignment,
} from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";

export class LayoutMats {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    const buildMat: GameObject = Spawn.spawnOrThrow("mat.player:base/build");
    const planetMat: GameObject = Spawn.spawnOrThrow("mat.player:base/planet");
    const techMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology"
    );
    const techDeckMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology-deck"
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(buildMat)
      .add(planetMat)
      .add(techMat)
      .add(techDeckMat);

    this._layout.addAfterLayout(() => {
      buildMat.setOwningPlayerSlot(playerSlot);
      planetMat.setOwningPlayerSlot(playerSlot);
      techMat.setOwningPlayerSlot(playerSlot);
      techDeckMat.setOwningPlayerSlot(playerSlot);

      buildMat.setObjectType(ObjectType.Ground);
      planetMat.setObjectType(ObjectType.Ground);
      techMat.setObjectType(ObjectType.Ground);
      techDeckMat.setObjectType(ObjectType.Ground);
    });

    this._layout.addAfterLayout(() => {
      const snapPoints: Array<SnapPoint> = techDeckMat.getAllSnapPoints();
      const snapPoint: SnapPoint | undefined = snapPoints[0];
      if (snapPoint) {
        this._spawnTechDeck(snapPoint);
      }
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  _spawnTechDeck(snapPoint: SnapPoint): void {
    const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
      nsid.startsWith("card.technology")
    );
    const pos: Vector = snapPoint.getGlobalPosition().add([0, 0, 10]);

    const deck: GameObject = Spawn.spawnMergeDecksOrThrow(nsids, pos);
    deck.snapToGround();
    deck.snap();
  }
}
