import {
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";
import { DraftState } from "../draft-state/draft-state";
import { DraftUnpack } from "./draft-unpack";
import { GameObject, Player } from "@tabletop-playground/api";

it("constructor", () => {
  const draftState: DraftState = new DraftState("@test/test");
  new DraftUnpack(draftState);
});

it("movePlayersToSeats", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });
  expect(TI4.playerSeats.getAllSeats().map((seat) => seat.playerSlot)).toEqual([
    10, 11,
  ]);

  const player: Player = new MockPlayer({ slot: 10 });

  const draftState: DraftState = new DraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  draftState.setSeatIndexToPlayerSlot(1, 10); // choose seat with slot 11

  draftUnpack.movePlayersToSeats();
  expect(player.getSlot()).toBe(19); // first moved to an open slot

  process.flushTicks();
  expect(player.getSlot()).toBe(11); // next tick moved to final slot
});

it("moveSpeakerToken", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: new MockVector(1, 0, 0),
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: new MockVector(-1, 0, 0),
    owningPlayerSlot: 10,
  });
  expect(TI4.playerSeats.getAllSeats().length).toBe(2);

  const speakerToken: GameObject = MockGameObject.simple("token:base/speaker");

  const draftState: DraftState = new DraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  draftState.setSpeakerIndex(0);
  draftUnpack.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=-72.5,Y=0,Z=0)");

  draftState.setSpeakerIndex(1);
  draftUnpack.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=72.5,Y=0,Z=0)");
});
