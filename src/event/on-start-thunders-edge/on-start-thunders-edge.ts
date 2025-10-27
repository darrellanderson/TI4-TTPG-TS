import {
  GameObject,
  ObjectType,
  Rotator,
  Vector,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, Find, IGlobal } from "ttpg-darrell";
import { MapStringLoad } from "../../lib/map-string-lib/map-string/map-string-load";

export class OnStartThundersEdge implements IGlobal {
  init(): void {
    TI4.events.onStartGameComplete.add(() => {
      if (TI4.config.sources.includes("thunders-edge")) {
        this._replaceStrategyCards();
        this._replaceMecatolRex();
        this._placeFracture();
      }
    });
  }

  _replaceStrategyCards(): void {
    const find: Find = new Find();

    // Replace strategy cards.
    const construction: GameObject | undefined = find.findGameObject(
      "tile.strategy-card:pok/construction",
      undefined,
      true
    );
    if (construction) {
      const pos: Vector = construction.getPosition();
      const rot: Rotator = construction.getRotation();
      DeletedItemsContainer.destroyWithoutCopying(construction);
      TI4.spawn.spawnOrThrow(
        "tile.strategy-card:thunders-edge/construction",
        pos,
        rot
      );
    }

    const warfare: GameObject | undefined = find.findGameObject(
      "tile.strategy-card:base/warfare",
      undefined,
      true
    );
    if (warfare) {
      const pos: Vector = warfare.getPosition();
      const rot: Rotator = warfare.getRotation();
      DeletedItemsContainer.destroyWithoutCopying(warfare);
      TI4.spawn.spawnOrThrow(
        "tile.strategy-card:thunders-edge/warfare",
        pos,
        rot
      );
    }
  }

  _replaceMecatolRex(): void {
    const find: Find = new Find();

    const mecatol: GameObject | undefined = find.findGameObject(
      "tile.system:base/18",
      undefined,
      true
    );
    if (mecatol) {
      const pos: Vector = mecatol.getPosition();
      const rot: Rotator = mecatol.getRotation();
      DeletedItemsContainer.destroyWithoutCopying(mecatol);
      const newMecatol: GameObject | undefined = TI4.spawn.spawnOrThrow(
        "tile.system:thunders-edge/112",
        pos,
        rot
      );
      if (newMecatol) {
        newMecatol.setObjectType(ObjectType.Ground);
      }
    }
  }

  _placeFracture(): void {
    const find: Find = new Find();

    // Add the fracture.
    const fractureString6: string =
      "{-1} -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 901B0 902B0 903B0 904B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 905B0 906B0 900B0";
    const fractureString7: string =
      "{-1} -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 0 -1 -1 901B0 902B0 903B0 904B0 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 905B0 906B0 900B0";
    if (
      !find.findGameObject("tile.system:thunders-edge/901", undefined, true)
    ) {
      const mapStringLoad: MapStringLoad = new MapStringLoad();
      if (!mapStringLoad) {
        throw new Error("Failed to create MapStringLoad instance");
      }
      if (TI4.config.playerCount <= 6) {
        mapStringLoad.load(fractureString6);
      } else {
        mapStringLoad.load(fractureString7);
      }
    }
  }
}
