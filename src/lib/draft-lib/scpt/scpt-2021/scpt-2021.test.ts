import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import { Scpt2021 } from "./scpt-2021";

it("constructor, getters", () => {
  const scpt: AbstractScpt = new Scpt2021();
  scpt.getScptDraftParams();
});
