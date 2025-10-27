import {
  MockCardDetails,
  MockCardParams,
  MockGameObjectParams,
  mockWorld,
} from "ttpg-mock";

export function addObjectTemplatesToMockWorld(): void {
  const _templateIdToMockGameObjectParams: {
    [k: string]: MockGameObjectParams;
  } = {};

  for (const nsid of __spawn.getAllNsids()) {
    const templateId: string = __spawn.getTemplateIdOrThrow(nsid);

    if (
      nsid.startsWith("mat") ||
      nsid.startsWith("misc") ||
      nsid.startsWith("sheet") ||
      nsid.startsWith("tile") ||
      nsid.startsWith("token") ||
      nsid.startsWith("unit")
    ) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "GameObject",
        templateMetadata: nsid,
      };
    }

    if (nsid.startsWith("card.")) {
      const params: MockCardParams = {
        _objType: "Card",
        templateMetadata: nsid,
        cardDetails: [new MockCardDetails({ metadata: nsid })],
      };
      _templateIdToMockGameObjectParams[templateId] = params;
    }

    if (nsid.startsWith("card-holder")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "CardHolder",
        templateMetadata: nsid,
      };
    }

    if (nsid.startsWith("container")) {
      _templateIdToMockGameObjectParams[templateId] = {
        _objType: "Container",
        templateMetadata: nsid,
      };
    }
  }
  mockWorld._reset({ _templateIdToMockGameObjectParams });
}

it("addObjectTemplatesToMockWorld", () => {
  addObjectTemplatesToMockWorld();
});
