import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { ScptDraftsUi } from "./scpt-drafts-ui";
import { AbstractScpt } from "../../../lib/draft-lib/scpt/abstract-scpt/abstract-scpt";

it("static getScptDrafts", () => {
  const drafts: Array<AbstractScpt> = ScptDraftsUi.getScptDrafts();
  drafts.forEach((draft) => {
    expect(draft).toBeInstanceOf(AbstractScpt);
  });
});

it("constructor", () => {
  const scale: number = 1;
  const overrideHeight: number = 0;
  const onDraftStarted = new TriggerableMulticastDelegate<() => void>();
  new ScptDraftsUi(scale, overrideHeight, onDraftStarted).destroy();
});
