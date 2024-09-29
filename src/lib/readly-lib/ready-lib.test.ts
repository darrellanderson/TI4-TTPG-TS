import { Card, GameObject } from "@tabletop-playground/api";
import { ReadyLib } from "./ready-lib";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { Facing } from "ttpg-darrell";

it("constructor", () => {
  new ReadyLib();
});

it("ready leader-agent card", () => {
  const faceUp: Card = MockCard.simple("card.leader.agent:my-source/my-name");
  const faceDown: Card = MockCard.simple(
    "card.leader.agent:my-source/my-name",
    { isFaceUp: false },
  );

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
});

it("ready legendary-planet card", () => {
  const faceUp: Card = MockCard.simple(
    "card.legendary-planet:my-source/my-name",
  );
  const faceDown: Card = MockCard.simple(
    "card.legendary-planet:my-source/my-name",
    { isFaceUp: false },
  );
  const deck: Card = MockCard.simple(
    "card.legendary-planet:my-source/my-name",
    {
      isFaceUp: false,
      snappedToPoint: new MockSnapPoint({ tags: ["deck-legendary-planet"] }),
    },
  );

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);
  expect(Facing.isFaceUp(deck)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
  expect(Facing.isFaceUp(deck)).toBe(false);
});

it("ready planet card", () => {
  const faceUp: Card = MockCard.simple("card.planet:my-source/my-name");
  const faceDown: Card = MockCard.simple("card.planet:my-source/my-name", {
    isFaceUp: false,
  });
  const deck: Card = MockCard.simple("card.planet:my-source/my-name", {
    isFaceUp: false,
    snappedToPoint: new MockSnapPoint({ tags: ["deck-planet"] }),
  });

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);
  expect(Facing.isFaceUp(deck)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
  expect(Facing.isFaceUp(deck)).toBe(false);
});

it("ready relic card", () => {
  const faceUp: Card = MockCard.simple("card.relic:my-source/my-name");
  const faceDown: Card = MockCard.simple("card.relic:my-source/my-name", {
    isFaceUp: false,
  });
  const deck: Card = MockCard.simple("card.relic:my-source/my-name", {
    isFaceUp: false,
    snappedToPoint: new MockSnapPoint({ tags: ["deck-relic"] }),
  });
  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);
  expect(Facing.isFaceUp(deck)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
  expect(Facing.isFaceUp(deck)).toBe(false);
});

it("ready technology card", () => {
  const faceUp: Card = MockCard.simple("card.technology.red:my-source/my-name");
  const faceDown: Card = MockCard.simple(
    "card.technology.red:my-source/my-name",
    { isFaceUp: false },
  );

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
});

it("ready units", () => {
  const faceUp: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
  });
  const faceDown: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
    rotation: [0, 0, 180],
  });

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
});

it("ready units (held)", () => {
  const faceUp: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
  });
  const faceDown: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
    rotation: [0, 0, 180],
    isHeld: true,
  });

  expect(faceDown.isHeld()).toBe(true);
  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false); // held, not readied
});
