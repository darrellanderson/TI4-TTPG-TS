import { MockCard, MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";
import {
  ACTION_FETCH_NANO_FORGE,
  NANO_FORGE_NSID,
  NANO_FORGE_TOKEN_NSID,
  RightClickNanoForge,
} from "./right-click-nano-forge";
import { Container, GameObject, Player } from "@tabletop-playground/api";

it("constructor/init", () => {
  new RightClickNanoForge().init();
});

it("custom action", () => {
  const token: GameObject = MockGameObject.simple(NANO_FORGE_TOKEN_NSID);
  const container: Container = new MockContainer({ items: [token] });

  expect(container.getItems()).toContain(token);

  new RightClickNanoForge().init();

  const card: MockCard = MockCard.simple(NANO_FORGE_NSID);
  process.flushTicks();

  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, ACTION_FETCH_NANO_FORGE);

  expect(container.getItems()).not.toContain(token);
});
