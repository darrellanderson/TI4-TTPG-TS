import { LayoutUnitBox } from "./layout-unit-box";

import * as NSID_TO_TEMPLATE_ID from "../../nsid-to-template-id.json";
import { mockWorld } from "ttpg-mock";

it("constructor", () => {
  const unitTemplateId: string | undefined =
    NSID_TO_TEMPLATE_ID["unit:pok/mech"];
  expect(unitTemplateId).toBeDefined();

  const containerTemplateId: string | undefined =
    NSID_TO_TEMPLATE_ID["container.unit:pok/mech"];
  expect(containerTemplateId).toBeDefined();

  mockWorld._reset({
    _templateIdToMockGameObjectParams: {
      unitTemplateId: { _objType: "GameObject" },
      containerTemplateId: { _objType: "Container" },
    },
  });

  new LayoutUnitBox("mech");
});
