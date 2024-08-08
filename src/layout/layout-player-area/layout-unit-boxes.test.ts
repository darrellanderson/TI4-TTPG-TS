import { Spawn } from "ttpg-darrell";
import { LayoutUnitBoxes } from "./layout-unit-boxes";
import { MockGameObjectParams, mockWorld } from "ttpg-mock";

beforeEach(() => {
  const _templateIdToMockGameObjectParams: {
    [k: string]: MockGameObjectParams;
  } = {};
  for (const nsid of Spawn.getAllNsids()) {
    const templateId: string = Spawn.getTemplateIdOrThrow(nsid);
    if (nsid.startsWith("unit:")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "GameObject",
      };
    }
    if (nsid.startsWith("container.unit:")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "Container",
      };
    }
  }
  mockWorld._reset({
    _templateIdToMockGameObjectParams,
  });
});

it("constructor", () => {
  new LayoutUnitBoxes(1);
});
