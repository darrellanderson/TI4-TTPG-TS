import { ScptDraftButtonUI, ScptDraftParams } from "./scpt-draft-button-ui";

it("constructor", () => {
  const scale = 1;
  const params: ScptDraftParams = {
    label: "YEAR",
  };
  new ScptDraftButtonUI(scale, params);
});
