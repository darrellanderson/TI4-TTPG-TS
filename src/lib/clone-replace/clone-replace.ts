import {
  GameObject,
  GameWorld,
  ObjectType,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer } from "ttpg-darrell";

export function cloneReplace(obj: GameObject): GameObject {
  if (GameWorld.getExecutionReason() === "unittest") {
    return obj;
  }

  const json: string = obj.toJSONString();
  const pos: Vector = obj.getPosition();
  const rot: Rotator = obj.getRotation();
  const objectType: ObjectType = obj.getObjectType();
  DeletedItemsContainer.destroyWithoutCopying(obj);
  const clone: GameObject | undefined = world.createObjectFromJSON(
    json,
    pos.add([0, 0, 10])
  );
  if (!clone) {
    throw new Error("Failed to clone object");
  }
  clone.setRotation(rot);
  clone.setPosition(pos);
  clone.setObjectType(objectType);
  return clone;
}
