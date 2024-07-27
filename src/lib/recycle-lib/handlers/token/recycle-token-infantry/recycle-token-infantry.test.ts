import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { RecycleTokenInfantry } from "./recycle-token-infantry";

it("recycle", () => {
  const objs: Array<GameObject> = [
    MockGameObject.simple("token:base/infantry-1"),
    MockGameObject.simple("token:base/infantry-3"),
  ];

  const recycle: GarbageHandler = new RecycleTokenInfantry();
  for (const obj of objs) {
    expect(obj.isValid()).toBe(true);

    expect(recycle.canRecycle(obj)).toBe(true);
    expect(recycle.recycle(obj)).toBe(true);

    expect(obj.isValid()).toBe(false);
  }
});
