import {
  Container,
  GameObject,
  Rotator,
  Vector,
} from "@tabletop-playground/api";
import { PlayerSlot, Spawn } from "ttpg-darrell";
import { MockCardHolder, MockContainer, MockGameObject } from "ttpg-mock";
import { SliceTiles } from "../generate-slices/generate-slices";
import { BagDraft } from "./bag-draft";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of globalThis.TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      globalThis.TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("IDraft", () => {
  const bagDraft: BagDraft = new BagDraft();
  expect(bagDraft.isEnabled()).toBe(true);
  expect(bagDraft.getDraftName()).toBe("Bag Draft");
  expect(bagDraft.getGenerateSlicesParams()).toBeDefined();
  expect(() => {
    bagDraft.createEmptyDraftState("@test/test");
  }).toThrow();
});

it("_getSlices", () => {
  const bagDraft: BagDraft = new BagDraft();
  const slices: Array<SliceTiles> = bagDraft._getSlices();
  expect(slices).toBeDefined();
  expect(slices.length).toBeGreaterThan(0);
});

it("_createContainer", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const spawnInstance: Spawn = globalThis.TI4.spawn;
  jest
    .spyOn(spawnInstance, "spawn")
    .mockImplementation(
      (
        nsid: string,
        position?: Vector | [x: number, y: number, z: number] | undefined,
        rotation?:
          | Rotator
          | [pitch: number, yaw: number, roll: number]
          | undefined
      ): GameObject | undefined => {
        let obj: GameObject | undefined = undefined;
        if (nsid === "container:base/bag-draft") {
          obj = new MockContainer();
        }
        if (obj && position) {
          obj.setPosition(position);
        }
        if (obj && rotation) {
          obj.setRotation(rotation);
        }
        return obj;
      }
    );

  const bagDraft: BagDraft = new BagDraft();
  const playerSlot: PlayerSlot = 10;
  const container: Container = bagDraft._createContainer(playerSlot);
  expect(container).toBeDefined();
  expect(container.getPosition()).toBeDefined();
});

it("_createContainer (missing card holder)", () => {
  const bagDraft: BagDraft = new BagDraft();
  const playerSlot: PlayerSlot = 10;
  expect(() => {
    bagDraft._createContainer(playerSlot);
  }).toThrow();
});

it("_createContainer (invalid container nsid)", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const bagDraft: BagDraft = new BagDraft().setContainerNsid("~~invalid~~");
  const playerSlot: PlayerSlot = 10;
  expect(() => {
    bagDraft._createContainer(playerSlot);
  }).toThrow();
});

it("_fillContainer", () => {
  const container: Container = new MockContainer();
  expect(container.getNumItems()).toBe(0);

  const bagDraft: BagDraft = new BagDraft();
  bagDraft._fillContainer(container, [19, 20]);
  expect(container.getNumItems()).toBe(2);

  // Again, will remove from container before re-adding.
  bagDraft._fillContainer(container, [19, 20]);
  expect(container.getNumItems()).toBe(2);
});

it("_fillContainer (missing systems)", () => {
  const container: Container = new MockContainer();
  expect(container.getNumItems()).toBe(0);

  const bagDraft: BagDraft = new BagDraft();
  expect(() => {
    bagDraft._fillContainer(container, [-3, -4]);
  }).toThrow();
});

it("createDraftObjects", () => {
  for (let i = 0; i < globalThis.TI4.config.playerCount; i++) {
    const playerSlot: number = 10 + i;
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  const bagDraft: BagDraft = new BagDraft();
  bagDraft.createDraftObjects();
});
