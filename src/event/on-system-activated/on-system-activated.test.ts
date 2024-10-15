import { MockGameObject, MockPlayer } from "ttpg-mock";
import { OnSystemActivated } from "./on-system-activated";

it("constructor", () => {
  new OnSystemActivated();
});

it("trigger", () => {
  new MockGameObject(); // so an object is present for checking

  new MockGameObject({
    templateMetadata: "tile.system:base/18",
  });

  const commandToken = new MockGameObject({
    templateMetadata: "token.command:my-source/my-faction",
  });

  let triggerCount: number = 0;
  TI4.onSystemActivated.add((system, player) => {
    triggerCount++;
    expect(system.getSystemTileNumber()).toBe(18);
    expect(player.getName()).toBe("my-player");
  });

  expect(OnSystemActivated.getLastActivatedSystem()).toBeUndefined();
  expect(triggerCount).toBe(0);

  const player = new MockPlayer({ name: "my-player" });
  TI4.turnOrder.setCurrentTurn(player.getSlot());

  const thrown = false;
  commandToken._releaseAsPlayer(player, thrown);

  expect(OnSystemActivated.getLastActivatedSystem()).toBeDefined();
  expect(triggerCount).toBe(1);
});

it("init after token created", () => {
  new MockGameObject({
    templateMetadata: "token.command:my-source/my-faction",
  });
  new OnSystemActivated().init();
});
