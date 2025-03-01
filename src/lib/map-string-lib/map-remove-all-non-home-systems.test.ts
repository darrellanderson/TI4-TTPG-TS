import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageContainer } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { MapRemoveAllNonHomeSystems } from "./map-remove-all-non-home-systems";
import { RecycleSystemTile } from "../recycle-lib/handlers/system-tile/recycle-system-tile";

it("remove", () => {
  const systemObj: GameObject = MockGameObject.simple("tile.system:base/18");
  const container: Container = new MockContainer({
    templateMetadata: "container:base/systems",
  });
  GarbageContainer.addHandler(new RecycleSystemTile());

  expect(systemObj.getContainer()).toBeUndefined();
  expect(container.getNumItems()).toBe(0);

  new MapRemoveAllNonHomeSystems().removeAllNonHomeSystems();

  expect(systemObj.getContainer()).toBe(container);
  expect(container.getNumItems()).toBe(1);
});
