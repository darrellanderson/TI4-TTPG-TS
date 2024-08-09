import { LayoutUnitBox } from "./layout-unit-box";

import { MockGameObjectParams, mockWorld } from "ttpg-mock";
import { Spawn } from "ttpg-darrell";
import { Vector } from "@tabletop-playground/api";

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

it("constructor (infantry)", () => {
  new LayoutUnitBox("infantry", 1);
});

it("constructor (mech)", () => {
  new LayoutUnitBox("mech", 1);
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutUnitBox("infantry", 1).getLayout().doLayoutAtPoint(pos, yaw);
});
