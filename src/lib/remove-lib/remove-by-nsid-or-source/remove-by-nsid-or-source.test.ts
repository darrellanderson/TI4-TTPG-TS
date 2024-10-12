import { Card, GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { MockCard, MockCardDetails, MockGameObject } from "ttpg-mock";
import { RemoveByNsidOrSource } from "./remove-by-nsid-or-source";

it("static createFromRegistry", () => {
  const remove = RemoveByNsidOrSource.createFromRegistry(["pok"]);
  expect(remove.hasSource("pok")).toBe(false);
  expect(remove.hasSource("codex.vigil")).toBe(true);
  expect(remove.hasNsid("card.agenda:base/research-team-warfare")).toBe(true);
});

it("constructor/add/has", () => {
  const remove = new RemoveByNsidOrSource();
  expect(remove.hasSource("source")).toBe(false);
  expect(remove.hasNsid("nsid")).toBe(false);

  remove.addSource("source");
  remove.addNsid("nsid");
  expect(remove.hasSource("source")).toBe(true);
  expect(remove.hasNsid("nsid")).toBe(true);
});

it("delete basic by source", () => {
  const dele: GameObject = MockGameObject.simple("type:source.dele/name");
  const keep: GameObject = MockGameObject.simple("type:source.keep/name");

  new RemoveByNsidOrSource().addSource("source.dele").remove();

  expect(dele.isValid()).toBe(false);
  expect(keep.isValid()).toBe(true);
});

it("delete basic by nsid", () => {
  const dele: GameObject = MockGameObject.simple("type:source.dele/name");
  const keep: GameObject = MockGameObject.simple("type:source.keep/name");

  new RemoveByNsidOrSource().addNsid("type:source.dele/name").remove();

  expect(dele.isValid()).toBe(false);
  expect(keep.isValid()).toBe(true);
});

it("delete card by source", () => {
  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "type:source.dele/name" }),
      new MockCardDetails({ metadata: "type:source.keep/name" }),
    ],
  });

  let nsids: Array<string> = [];
  nsids = NSID.getDeck(deck);
  expect(nsids).toEqual(["type:source.dele/name", "type:source.keep/name"]);

  new RemoveByNsidOrSource().addSource("source.dele").remove();
  nsids = NSID.getDeck(deck);
  expect(nsids).toEqual(["type:source.keep/name"]);
});

it("delete card by nsid", () => {
  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "type:source.dele/name" }),
      new MockCardDetails({ metadata: "type:source.keep/name" }),
    ],
  });

  let nsids: Array<string> = [];
  nsids = NSID.getDeck(deck);
  expect(nsids).toEqual(["type:source.dele/name", "type:source.keep/name"]);

  new RemoveByNsidOrSource().addNsid("type:source.dele/name").remove();
  nsids = NSID.getDeck(deck);
  expect(nsids).toEqual(["type:source.keep/name"]);
});
