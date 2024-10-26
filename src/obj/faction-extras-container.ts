import {
  Color,
  GameObject,
  ImageWidget,
  refObject,
  refPackageId,
  UIElement,
  UIPresentationStyle,
  Vector,
} from "@tabletop-playground/api";

import { Faction } from "../lib/faction-lib/faction/faction";

const SCALE: number = 4;

const widget: ImageWidget = new ImageWidget()
  .setImageSize(128, 128)
  .setTintColor(new Color(1, 1, 1));

const ui: UIElement = new UIElement();
ui.position = new Vector(0, 0, -1.7);
ui.presentationStyle = UIPresentationStyle.ViewAligned;
ui.scale = 1 / SCALE;
ui.widget = widget;

const outlineWidget: ImageWidget = new ImageWidget().setImageSize(128, 128);

const outline: UIElement = new UIElement();
outline.position = ui.position;
outline.presentationStyle = ui.presentationStyle;
outline.scale = ui.scale;
outline.widget = outlineWidget;

const obj: GameObject = refObject;
const packageId: string = refPackageId;
obj.addUI(ui);
obj.addUI(outline);

function update() {
  const owner: number = obj.getOwningPlayerSlot();
  const faction: Faction | undefined =
    TI4.factionRegistry.getByPlayerSlot(owner);
  if (owner >= 0 && faction) {
    const icon: string = faction.getIcon();
    const outline: string = icon.replace(".png", "-outline-only.png");
    widget.setImage(icon, faction.getIconPackageId());
    widget.setTintColor([1, 1, 1, 1]);
    outlineWidget.setImage(outline, faction.getIconPackageId());
  } else {
    widget.setImage("icon/token/circle.png", packageId);
    widget.setTintColor([0, 0, 0, 1]);
    outlineWidget.setImage("icon/token/circle-outline-only.png", packageId);
  }
}

// Owner not set at creation time, wait a frame.
process.nextTick(update);

TI4.onFactionChanged.add(update);
