import { mockWorld } from "ttpg-mock";
import { LayoutSheets } from "./layout-sheets";
import { Spawn } from "ttpg-darrell";

beforeEach(() => {
  mockWorld._reset({
    _templateIdToMockGameObjectParams: {
      "sheet:pok/leader": {
        _objType: "GameObject",
      },
      "faction-sheet:base/generic": {
        _objType: "GameObject",
      },
      "sheet:base/command": {
        _objType: "GameObject",
      },
    },
  });
});

it("getLayout", () => {
  expect(Spawn.has("sheet:pok/leader")).toBe(true);
  new LayoutSheets().getLayout();
});
