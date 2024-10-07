import { MockGameObject } from "ttpg-mock";
import { BuildArea } from "./build-area";

it("constructor", () => {
  const obj = new MockGameObject();
  obj.setOwningPlayerSlot(10);
  const buildArea = new BuildArea(obj);
  expect(buildArea).toBeDefined();
});
