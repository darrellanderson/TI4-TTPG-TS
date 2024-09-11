import { LayoutTableContainers } from "./layout-table-containers";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new LayoutTableContainers();
});
