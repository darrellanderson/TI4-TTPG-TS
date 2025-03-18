import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2025 } from "./scpt-2025";

it("constructor, getters", () => {
  TI4.config.setPlayerCount(5); // prune to player count
  const scpt: AbstractScpt = new Scpt2025();
  scpt.getScptDraftParams();
});
