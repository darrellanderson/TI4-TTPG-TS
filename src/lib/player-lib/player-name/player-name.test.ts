import { Player } from "@tabletop-playground/api";
import { PlayerName } from "./player-name";
import { MockPlayer } from "ttpg-mock";

it("constructor", () => {
  new PlayerName();
});

it("getByPlayer (found player color)", () => {
  const player: Player = new MockPlayer({ slot: 10 });
  const name: string = new PlayerName().getByPlayer(player);
  expect(name).toEqual("green");
});

it("getByPlayer (found player name)", () => {
  const player: Player = new MockPlayer({ slot: 1, name: "Alice" });
  const name: string = new PlayerName().getByPlayer(player);
  expect(name).toEqual("Alice");
});

it("getBySlot (found player color)", () => {
  const player: Player = new MockPlayer({ slot: 10 });
  const name: string = new PlayerName().getBySlot(player.getSlot());
  expect(name).toEqual("green");
});

it("getBySlot (found player name)", () => {
  const player: Player = new MockPlayer({ slot: 1, name: "Alice" });
  const name: string = new PlayerName().getBySlot(player.getSlot());
  expect(name).toEqual("Alice");
});

it("getByPlayer (not found)", () => {
  const name: string = new PlayerName().getBySlot(1);
  expect(name).toEqual("???");
});
