import { Card, GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { MockCard, MockCardDetails, MockGameObject } from "ttpg-mock";
import { RemoveByNsidOrSource } from "./remove-by-nsid-or-source";

it("static createFromRegistry", () => {
  RemoveByNsidOrSource.createFromRegistry(["pok"]);
});

it("constructor", () => {
  new RemoveByNsidOrSource();
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
