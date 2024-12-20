import { MockGameObject } from "ttpg-mock";
import { CreateDraftParams } from "./abstract-draft";
import { Milty } from "./milty";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("constructor", () => {
  new Milty();
});

it("getGenerateSlicesParams", () => {
  const milty = new Milty();
  const generateSlicesParams = milty.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  const milty = new Milty();
  const draftState = milty.createEmptyDraftState("@test/milty");
  expect(draftState).toBeDefined();

  TI4.config.setPlayerCount(7);
  milty.createEmptyDraftState("@test/milty");

  TI4.config.setPlayerCount(8);
  milty.createEmptyDraftState("@test/milty");
});

it("createDraftState", () => {
  const createDraftParams: CreateDraftParams = {
    namespaceId: "@test/milty",
    numSlices: 3,
    numFactions: 3,
    config: "labels=a",
  };

  const milty = new Milty();
  const draftState = milty.createDraftState(createDraftParams);
  expect(draftState).toBeDefined();
});
