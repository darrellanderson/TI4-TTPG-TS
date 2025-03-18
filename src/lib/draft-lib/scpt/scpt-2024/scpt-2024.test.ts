import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2024 } from "./scpt-2024";

it("constructor, getters", () => {
  const scpt: AbstractScpt = new Scpt2024();
  scpt.getScptDraftParams();
});
