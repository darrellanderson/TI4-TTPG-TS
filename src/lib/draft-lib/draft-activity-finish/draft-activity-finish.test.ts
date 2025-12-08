import { GameObject, Player } from "@tabletop-playground/api";
import {
  MockCardHolder,
  MockGameObject,
  MockPlayer,
  MockVector,
} from "ttpg-mock";

import { DraftState } from "../draft-state/draft-state";
import { DraftActivityFinish } from "./draft-activity-finish";
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
  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );

  new DraftActivityFinish(draftState);
});

it("finishAll", () => {
  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );
  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );
  draftActivityFinish.finishAll();
});

it("finishAll (minor factions)", () => {
  const draftState: DraftState = new DraftState("@test/test")
    .setSpeakerIndex(0)
    .setOpaqueType("minorFactions")
    .setOpaques(["1", "2"]);
  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );
  draftActivityFinish.finishAll();
});

it("movePlayersToSeats", () => {
  expect(TI4.playerSeats.getAllSeats().length).toBe(6);

  const player: Player = new MockPlayer({ slot: 10 });

  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );

  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );

  draftState.setSeatIndexToPlayerSlot(0, 10); // choose seat

  draftActivityFinish.movePlayersToSeats();
  expect(player.getSlot()).toBe(19); // first moved to an open slot

  process.flushTicks();
  expect(player.getSlot()).toBe(15); // next tick moved to final slot
});

it("moveSpeakerToken", () => {
  expect(TI4.playerSeats.getAllSeats().length).toBe(6);

  const speakerToken: GameObject = MockGameObject.simple("token:base/speaker");

  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );

  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );

  draftState.setSpeakerIndex(0);
  draftActivityFinish.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=-72.5,Y=15,Z=0)");

  draftState.setSpeakerIndex(4);
  draftActivityFinish.moveSpeakerToken();
  expect(speakerToken.getPosition().toString()).toBe("(X=72.5,Y=12,Z=0)");
});

it("unpackFactions", () => {
  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );

  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec"),
  ]);
  draftState.setFactionIndexToPlayerSlot(0, 10);
  draftState.setSeatIndexToPlayerSlot(1, 10);

  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );
  expect(() => {
    draftActivityFinish.unpackFactions();
  }).toThrow(); // see faction/unpack-all for how to set up all the needed stuff
});

it("unpackMap", () => {
  const draftState: DraftState = new Milty()
    .createEmptyDraftState("@test/test")
    .setSpeakerIndex(0);
  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );

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
    "{112} -112 -114 -115 -113 -111 -110 -112 -112 -114 -114 -115 -115 -113 -113 -111 -111 -110 -110 -112 -112 -114 -114 -114 -115 5 -115 -113 -113 -113 -111 -111 -111 -110 -110 -110 -112"
  );

  draftActivityFinish.unpackMap();
});

it("set turn order", () => {
  const draftState: DraftState = new DraftState("@test/test").setSpeakerIndex(
    0
  );

  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );

  draftState.setSpeakerIndex(0);
  draftActivityFinish.setTurnOrder();

  const turnOrder: Array<number> = TI4.turnOrder.getTurnOrder();
  expect(turnOrder).toEqual([10, 11, 12, 13, 14, 15]);
});

it("dealMinorFactionAlliances", () => {
  MockGameObject.simple("tile.system:base/1");
  const draftState: DraftState = new DraftState("@test/test")
    .setOpaqueType("minorFactions")
    .setOpaques(["1", "2"])
    .setOpaqueToPlayerSlot(0, 10);

  const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
    draftState
  );

  draftActivityFinish.dealMinorFactionAlliances();
});
