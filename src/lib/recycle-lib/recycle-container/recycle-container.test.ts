import { Container } from "@tabletop-playground/api";
import { RecycleContainer } from "./recycle-container";
import { GameObject, MockCard, MockContainer, MockGameObject } from "ttpg-mock";
import { GarbageContainer } from "ttpg-darrell";

it("constructor", () => {
  const container: Container = new MockContainer();
  new RecycleContainer(container);
});

it("exercise recycle handler", () => {
  const obj: GameObject = new MockGameObject();
  const name: string = "test";

  // Singleton.
  GarbageContainer.onRecycled.trigger(obj, name);
  process.flushTicks();

  // Multiple.
  GarbageContainer.onRecycled.trigger(obj, name);
  GarbageContainer.onRecycled.trigger(obj, name);
  process.flushTicks();

  // Secret objective.
  const secret: GameObject = MockCard.simple(
    "card.objective.secret:my-source/my-name"
  );
  GarbageContainer.onRecycled.trigger(secret, name);
  process.flushTicks();
});
