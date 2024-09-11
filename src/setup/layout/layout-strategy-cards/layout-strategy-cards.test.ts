import { LayoutStrategyCards } from "./layout-strategy-cards";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new LayoutStrategyCards();
});
