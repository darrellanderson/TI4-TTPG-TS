import { MockGameObjectParams, mockWorld } from "ttpg-mock";
import { LayoutMats } from "./layout-mats";
import { Spawn } from "ttpg-darrell";
import { Vector } from "@tabletop-playground/api";

beforeEach(() => {
  const _templateIdToMockGameObjectParams: {
    [k: string]: MockGameObjectParams;
  } = {};

  let templateId: string;

  templateId = Spawn.getTemplateIdOrThrow("mat.player:base/build");
  _templateIdToMockGameObjectParams[templateId] = {
    _objType: "GameObject",
  };

  templateId = Spawn.getTemplateIdOrThrow("mat.player:base/planet");
  _templateIdToMockGameObjectParams[templateId] = {
    _objType: "GameObject",
  };

  templateId = Spawn.getTemplateIdOrThrow("mat.player:base/technology");
  _templateIdToMockGameObjectParams[templateId] = {
    _objType: "GameObject",
  };

  mockWorld._reset({
    _templateIdToMockGameObjectParams,
  });
});

it("getLayout", () => {
  expect(Spawn.has("mat.player:base/build")).toBe(true);
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutMats().getLayout().doLayoutAtPoint(pos, yaw);
});
