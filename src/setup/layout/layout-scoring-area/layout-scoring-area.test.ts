import { LayoutScoringArea } from "./layout-scoring-area";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new LayoutScoringArea(4);
});
