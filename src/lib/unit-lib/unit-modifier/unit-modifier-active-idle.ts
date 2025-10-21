import {
  Button,
  Card,
  GameObject,
  Rotator,
  UIElement,
  Vector,
} from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";
import { UnitModifier } from "./unit-modifier";

export class UnitModifierActiveIdle implements IGlobal {
  private static readonly ACTIVE_KEY: string = "isActive";

  static isActive(obj: GameObject): boolean {
    const value: string = obj.getSavedData(UnitModifierActiveIdle.ACTIVE_KEY);
    return value === "true";
  }

  static setActive(obj: GameObject, active: boolean): void {
    const value: string = active ? "true" : "false";
    obj.setSavedData(value, UnitModifierActiveIdle.ACTIVE_KEY);
  }

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      (card: Card): void => {
        this._maybeAddActiveIdleButton(card);
      }
    );

    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add(
      (card: Card, oldNsid: string): void => {
        this._maybeRemoveActiveIdleButton(card, oldNsid);
      }
    );
  }

  _maybeAddActiveIdleButton(card: Card): void {
    const nsid: string = NSID.get(card);
    const unitModifier: UnitModifier | undefined =
      TI4.unitModifierRegistry.getByNsid(nsid);
    if (unitModifier && unitModifier.isActiveIdle()) {
      // Careful not to add button twice.
      this._maybeRemoveActiveIdleButton(card, nsid);

      const button: Button = new Button().setFontSize(14).setText("<?>");

      // Apply current state.
      const updateButton = (): void => {
        const text: string = UnitModifierActiveIdle.isActive(card)
          ? "ACTIVE"
          : "IDLE";
        button.setText(text);
      };
      updateButton();

      // Click to toggle and update state.
      button.onClicked.add(() => {
        const toggled: boolean = !UnitModifierActiveIdle.isActive(card);
        UnitModifierActiveIdle.setActive(card, toggled);
        updateButton();
      });

      const ui = new UIElement();
      ui.scale = 1 / 2;
      ui.widget = button;

      const extent = card.getExtent(false, false);
      ui.position = new Vector(-extent.x, 0, -extent.z - 0.1);
      ui.rotation = new Rotator(180, 180, 0);

      card.addUI(ui);
    }
  }

  _maybeRemoveActiveIdleButton(deck: Card, oldNsid: string): void {
    const unitModifier: UnitModifier | undefined =
      TI4.unitModifierRegistry.getByNsid(oldNsid);
    if (unitModifier && unitModifier.isActiveIdle()) {
      // Don't be clever (yet), just remove all UI.
      for (const ui of deck.getUIs()) {
        deck.removeUIElement(ui);
      }
    }
  }
}
