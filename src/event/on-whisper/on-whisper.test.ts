import { Player } from "@tabletop-playground/api";
import { mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { OnWhisper } from "./on-whisper";

it("constructor/init", () => {
  new OnWhisper().init();
});

it("event", () => {
  new OnWhisper().init();
  const src: Player = new MockPlayer();
  const dst: Player = new MockPlayer();
  const msg: string = "test message";
  mockGlobalEvents._whisperAsPlayer(src, dst, msg);
});
