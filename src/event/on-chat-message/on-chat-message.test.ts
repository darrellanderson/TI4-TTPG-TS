import { Player } from "@tabletop-playground/api";
import { OnChatMessage } from "./on-chat-message";
import { mockGlobalEvents, MockPlayer, mockWorld } from "ttpg-mock";

it("constructor/init", () => {
  new OnChatMessage().init();
});

it("event", () => {
  new OnChatMessage().init();

  const player: Player = new MockPlayer({ name: "my-name" });
  mockWorld._addPlayer(player);
  mockGlobalEvents._chatMessageAsPlayer(player, "hello @my-name");
});
