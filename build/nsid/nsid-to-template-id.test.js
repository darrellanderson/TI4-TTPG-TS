"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addObjectTemplatesToMockWorld = addObjectTemplatesToMockWorld;
const ttpg_darrell_1 = require("ttpg-darrell");
const ttpg_mock_1 = require("ttpg-mock");
function addObjectTemplatesToMockWorld() {
    const _templateIdToMockGameObjectParams = {};
    for (const nsid of ttpg_darrell_1.Spawn.getAllNsids()) {
        const templateId = ttpg_darrell_1.Spawn.getTemplateIdOrThrow(nsid);
        if (nsid.startsWith("mat") ||
            nsid.startsWith("sheet") ||
            nsid.startsWith("tile") ||
            nsid.startsWith("token") ||
            nsid.startsWith("unit")) {
            _templateIdToMockGameObjectParams[templateId] = {
                _objType: "GameObject",
                templateMetadata: nsid,
            };
        }
        if (nsid.startsWith("card.")) {
            const params = {
                _objType: "Card",
                templateMetadata: nsid,
                cardDetails: [new ttpg_mock_1.MockCardDetails({ metadata: nsid })],
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
    ttpg_mock_1.mockWorld._reset({ _templateIdToMockGameObjectParams });
}
it("addObjectTemplatesToMockWorld", () => {
    addObjectTemplatesToMockWorld();
});
//# sourceMappingURL=nsid-to-template-id.test.js.map