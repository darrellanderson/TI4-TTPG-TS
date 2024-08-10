import { Spawn } from "ttpg-darrell";
import { MockGameObjectParams, mockWorld } from "ttpg-mock";

export function addObjectTemplatesToMockWorld(): void {
  const _templateIdToMockGameObjectParams: {
    [k: string]: MockGameObjectParams;
  } = {};

  for (const nsid of Spawn.getAllNsids()) {
    const templateId: string = Spawn.getTemplateIdOrThrow(nsid);

    if (
      nsid.startsWith("mat") ||
      nsid.startsWith("sheet") ||
      nsid.startsWith("tile") ||
      nsid.startsWith("token") ||
      nsid.startsWith("unit")
    ) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "GameObject",
      };
    }

    if (nsid.startsWith("card-holder")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "CardHolder",
      };
    }

    if (nsid.startsWith("container.")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "Container",
      };
    }
  }
  mockWorld._reset({ _templateIdToMockGameObjectParams });
}

it("addObjectTemplatesToMockWorld", () => {
  addObjectTemplatesToMockWorld();
});
