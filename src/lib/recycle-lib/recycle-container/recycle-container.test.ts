import { Container, Player } from "@tabletop-playground/api";
import { RecycleContainer } from "./recycle-container";
import { MockContainer, MockPlayer } from "ttpg-mock";
import { GarbageContainer } from "ttpg-darrell";

it("constructor", () => {
  const container: Container = new MockContainer();
  new RecycleContainer(container);
});

it("exercise recycle handler", () => {
  const objName: string = "my-name";
  const objMetadata: string = "my-metadata";
  const player: Player | undefined = new MockPlayer();

  // Singleton.
  GarbageContainer.onRecycled.trigger(objName, objMetadata, player);
  process.flushTicks();

  // Multiple.
  GarbageContainer.onRecycled.trigger(objName, objMetadata, player);
  GarbageContainer.onRecycled.trigger(objName, objMetadata, player);
  process.flushTicks();

  // Secret objective.
  const secret: string = "card.objective.secret:my-source/my-name";
  GarbageContainer.onRecycled.trigger(objName, secret, player);
  process.flushTicks();
});

it("recycle without player", () => {
  const objName: string = "my-name";
  const objMetadata: string = "my-metadata";
  const player: Player | undefined = undefined;

  // Singleton.
  GarbageContainer.onRecycled.trigger(objName, objMetadata, player);
  process.flushTicks();
});
