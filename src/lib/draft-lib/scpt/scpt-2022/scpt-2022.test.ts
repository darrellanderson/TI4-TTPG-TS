import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2022 } from "./scpt-2022";

it("constructor, getters", () => {
  const scpt: AbstractScpt = new Scpt2022();
  scpt.getScptDraftParams();
});
