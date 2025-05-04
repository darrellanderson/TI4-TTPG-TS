import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start-params";
import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2025 } from "./scpt-2025";

it("constructor, getters", () => {
  TI4.config.setPlayerCount(5); // prune to player count
  const scpt: AbstractScpt = new Scpt2025();
  scpt.getScptDraftParams();
});

it("_placeFinalsOuterSystemsAndWormholes", () => {
  const scpt: Scpt2025 = new Scpt2025();
  scpt._placeFinalsOuterSystemsAndWormholes();
});

it("onStart", () => {
  const final: DraftActivityStartParams | undefined = new Scpt2025().getFinal();
  if (final === undefined || final.onStart === undefined) {
    throw new Error("Final is undefined");
  }
  final.onStart();
});
