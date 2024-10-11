import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockSnapPoint } from "ttpg-mock";

import { LayoutMats } from "./layout-mats";
import { Tech } from "../../../lib/tech-lib/tech/tech";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutMats(1).getLayout().doLayoutAtPoint(pos, yaw);
});

it("_spawnTechDeck", () => {
  const snapPoint = new MockSnapPoint();
  new LayoutMats(1)._spawnTechDeck(snapPoint);
});

it("missing owner", () => {
  expect(() => new LayoutMats(-1)).toThrow();
});

it("_filterTechDeck", () => {
  const nsid: string = "card.technology.unit-upgrade:base/advanced-carrier-2";
  const tech: Tech | undefined = TI4.techRegistry.getByNsid(nsid);
  expect(tech).toBeDefined();
  expect(tech?.isFactionTech()).toBe(true);

  const deck: Card = MockCard.simple(nsid);
  new LayoutMats(1)._filterTechDeck(deck);
});
