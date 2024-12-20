import { GameObject, Player } from "@tabletop-playground/api";
import {
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";

import { DraftState } from "../draft-state/draft-state";
import { DraftUnpack } from "./draft-unpack";
import { DraftToMapString } from "../draft-to-map-string/draft-to-map-string";
import { Milty } from "../drafts/milty";

beforeEach(() => {
  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
      position: new MockVector(playerSlot % 2 === 0 ? 1 : -1, playerSlot, 0),
    });
  }
});

it("constructor", () => {
  const draftState: DraftState = new DraftState("@test/test");
  new DraftUnpack(draftState);
});

it("movePlayersToSeats", () => {
  expect(TI4.playerSeats.getAllSeats().length).toBe(6);

  const player: Player = new MockPlayer({ slot: 10 });

  const draftState: DraftState = new DraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  draftState.setSeatIndexToPlayerSlot(0, 10); // choose seat

  draftUnpack.movePlayersToSeats();
  expect(player.getSlot()).toBe(19); // first moved to an open slot

  process.flushTicks();
  expect(player.getSlot()).toBe(15); // next tick moved to final slot
});

it("moveSpeakerToken", () => {
  expect(TI4.playerSeats.getAllSeats().length).toBe(6);

  const speakerToken: GameObject = MockGameObject.simple("token:base/speaker");

  const draftState: DraftState = new DraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  draftState.setSpeakerIndex(0);
  draftUnpack.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=-72.5,Y=15,Z=0)");

  draftState.setSpeakerIndex(4);
  draftUnpack.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=72.5,Y=12,Z=0)");
});

it("unpackMap", () => {
  const draftState: DraftState = new Milty().createDraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  // Place a faction home system in the map string.
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
  ]);
  draftState.setSeatIndexToPlayerSlot(0, 10);
  draftState.setFactionIndexToPlayerSlot(0, 10);
  expect(draftState.getSeatIndexToFaction(0)?.getNsid()).toBe(
    "faction:base/arborec"
  );

  const mapString: string =
    DraftToMapString.fromDraftState(draftState).mapString;
  expect(mapString).toBe(
    "{18} -112 -114 -115 -113 -111 -110 -112 -112 -114 -114 -115 -115 -113 -113 -111 -111 -110 -110 -112 -112 -114 -114 -114 -115 5 -115 -113 -113 -113 -111 -111 -111 -110 -110 -110 -112"
  );

  draftUnpack.unpackMap();
});
