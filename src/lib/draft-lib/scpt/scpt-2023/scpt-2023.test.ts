import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2023 } from "./scpt-2023";

it("constructor, getters", () => {
  const scpt: AbstractScpt = new Scpt2023();
  scpt.getScptDraftParams();
});
