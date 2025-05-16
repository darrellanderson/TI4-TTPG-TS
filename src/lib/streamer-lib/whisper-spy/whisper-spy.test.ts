import { Player } from "@tabletop-playground/api";
import { WhisperSpy } from "./whisper-spy";
import {
  MockCardHolder,
  mockGlobalEvents,
  MockPlayer,
  mockWorld,
} from "ttpg-mock";

it("constructor/init", () => {
  new WhisperSpy("@test/test").init();
});

it("_load/_save", () => {
  const player: Player = new MockPlayer({ name: "my-name" });
  let whisperSpy: WhisperSpy;

  whisperSpy = new WhisperSpy("@test/test");
  whisperSpy.addReportTo(player);
  expect(whisperSpy.hasReportTo(player)).toBe(true);

  // Load from state.
  whisperSpy = new WhisperSpy("@test/test");
  expect(whisperSpy.hasReportTo(player)).toBe(true);
});

it("has/add/removeReportTo", () => {
  const whisperSpy: WhisperSpy = new WhisperSpy("@test/test");
  const player: Player = new MockPlayer({ name: "my-name" });

  expect(whisperSpy.hasReportTo(player)).toBe(false);

  whisperSpy.addReportTo(player);
  expect(whisperSpy.hasReportTo(player)).toBe(true);

  whisperSpy.removeReportTo(player);
  expect(whisperSpy.hasReportTo(player)).toBe(false);
});

it("whisper (unseated)", () => {
  const whisperSpy: WhisperSpy = new WhisperSpy("@test/test");
  whisperSpy.init();

  const streamer: Player = new MockPlayer({ name: "streamer" });
  const src: Player = new MockPlayer({ name: "src" });
  const dst: Player = new MockPlayer({ name: "dst" });
  mockWorld._addPlayer(src);
  mockWorld._addPlayer(dst);
  mockWorld._addPlayer(streamer);

  whisperSpy.addReportTo(streamer);

  expect(whisperSpy.hasReportTo(streamer)).toBe(true);
  expect(whisperSpy.isLegalReportTo(streamer)).toBe(true);

  mockGlobalEvents._whisperAsPlayer(src, dst, "hello world");
});

it("whisper (seated)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const whisperSpy: WhisperSpy = new WhisperSpy("@test/test");
  whisperSpy.init();

  const streamer: Player = new MockPlayer({ name: "streamer", slot: 10 });
  const src: Player = new MockPlayer({ name: "src" });
  const dst: Player = new MockPlayer({ name: "dst" });
  mockWorld._addPlayer(src);
  mockWorld._addPlayer(dst);
  mockWorld._addPlayer(streamer);

  whisperSpy.addReportTo(streamer);

  expect(whisperSpy.hasReportTo(streamer)).toBe(true);
  expect(whisperSpy.isLegalReportTo(streamer)).toBe(false); // seated

  mockGlobalEvents._whisperAsPlayer(src, dst, "hello world");
});
