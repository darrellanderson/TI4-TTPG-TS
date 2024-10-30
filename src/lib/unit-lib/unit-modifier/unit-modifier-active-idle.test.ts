import {
  Button,
  Card,
  GameObject,
  Player,
  UIElement,
  Widget,
} from "@tabletop-playground/api";
import {
  MockButton,
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import { UnitModifierActiveIdle } from "./unit-modifier-active-idle";

it("static set/is active", () => {
  const obj: GameObject = new MockGameObject();
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(false);

  UnitModifierActiveIdle.setActive(obj, true);
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(true);

  UnitModifierActiveIdle.setActive(obj, false);
  expect(UnitModifierActiveIdle.isActive(obj)).toBe(false);
});

it("on singleton / on deck", () => {
  // Card.
  MockCard.simple("card.technology.red:pok/supercharge");
  process.flushTicks();

  // Deck.
  new MockCard({
    cardDetails: [new MockCardDetails(), new MockCardDetails()],
  });
  process.flushTicks();
});

it("click button", () => {
  const card: Card = MockCard.simple("card.technology.red:pok/supercharge");
  process.flushTicks();

  const uis: Array<UIElement> = card.getUIs();
  expect(uis.length).toBe(1);
  const ui: UIElement | undefined = uis[0];
  const widget: Widget | undefined = ui?.widget;
  expect(widget).toBeInstanceOf(Button);

  const button: MockButton = widget as MockButton;
  const player: Player = new MockPlayer();

  expect(UnitModifierActiveIdle.isActive(card)).toBe(false);

  button._clickAsPlayer(player);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(true);

  button._clickAsPlayer(player);
  expect(UnitModifierActiveIdle.isActive(card)).toBe(false);

  // Remove button.
  new UnitModifierActiveIdle()._maybeRemoveActiveIdleButton(
    card,
    "card.technology.red:pok/supercharge"
  );
});
