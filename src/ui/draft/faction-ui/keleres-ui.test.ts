import { ContentButton, Player } from "@tabletop-playground/api";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { KeleresFlavorButton, KeleresUI } from "./keleres-ui";
import { MockContentButton, MockPlayer } from "ttpg-mock";

it("static _getKeleresIndex", () => {
  const draftState = new DraftState("@test/test");
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-mentak"),
  ]);
  const keleresIndex: number = KeleresFlavorButton._getKeleresIndex(draftState);
  expect(keleresIndex).toBe(0);
});

it("static _getLinkedFaction", () => {
  const flavorToLinkedNsid: { [key: string]: string } = {
    "faction:codex.vigil/keleres-argent": "faction:pok/argent",
    "faction:codex.vigil/keleres-mentak": "faction:base/mentak",
    "faction:codex.vigil/keleres-xxcha": "faction:base/xxcha",
  };
  for (const [flavor, linkedNsid] of Object.entries(flavorToLinkedNsid)) {
    const keleresFlavor = TI4.factionRegistry.getByNsidOrThrow(flavor);
    const linkedFaction = KeleresFlavorButton._getLinkedFaction(keleresFlavor);
    expect(linkedFaction.getNsid()).toBe(linkedNsid);
  }

  expect(() => {
    KeleresFlavorButton._getLinkedFaction(
      TI4.factionRegistry.getByNsidOrThrow("faction:base/arborec")
    );
  }).toThrow();
});

it("flavor button onClicked swaps flavor", () => {
  const draftState = new DraftState("@test/test");
  draftState.setFactions([
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-mentak"),
  ]);
  const keleresFlavorButton = new KeleresFlavorButton(
    draftState,
    "argent",
    1,
    1
  );

  expect(draftState.getFactions()[0]?.getNsid()).toBe(
    "faction:codex.vigil/keleres-mentak"
  );
  keleresFlavorButton.update();

  const contentButton: ContentButton = new MockContentButton();
  const player: Player = new MockPlayer();
  keleresFlavorButton._onClicked(contentButton, player);
  expect(draftState.getFactions()[0]?.getNsid()).toBe(
    "faction:codex.vigil/keleres-argent"
  );

  keleresFlavorButton.update();
});

it("constructor/destroy", () => {
  const draftState = new DraftState("@test/test");
  const keleresUI = new KeleresUI(draftState, 1);
  draftState.onDraftStateChanged.trigger(draftState);
  keleresUI.destroy();
});

it("getContentButton/getBorder", () => {
  const draftState = new DraftState("@test/test");
  const keleresUI = new KeleresUI(draftState, 1);
  expect(keleresUI.getContentButton()).toBeDefined();
  expect(keleresUI.getBorder()).toBeDefined();
  keleresUI.destroy();
});
