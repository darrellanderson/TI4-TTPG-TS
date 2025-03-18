import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2025 } from "./scpt-2025";

it("constructor, getters", () => {
  const scpt: AbstractScpt = new Scpt2025();
  scpt.getScptDraftParams();
});
