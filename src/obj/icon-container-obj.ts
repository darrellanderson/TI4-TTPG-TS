import {
  Color,
  GameObject,
  ImageWidget,
  refObject,
  UIElement,
  UIPresentationStyle,
  Vector,
  world,
} from "@tabletop-playground/api";
import { ColorLib, NSID, ParsedNSID } from "ttpg-darrell";

const SCALE: number = 4;

let iconImage: string;
const nsid: string = NSID.get(refObject);
const parsed: ParsedNSID | undefined = NSID.parse(nsid);
if (nsid.startsWith("container.unit:")) {
  const unit: string = parsed?.nameParts[0] ?? "Unknown";
  iconImage = `icon/unit/${unit}.png`;
} else if (nsid === "container.token.command:base/generic") {
  iconImage = "icon/token/command.png";
} else if (nsid === "container.token.control:base/generic") {
  iconImage = "icon/token/control.png";
} else {
  throw new Error(`Unknown NSID: ${nsid}`);
}
const outlineImage: string = iconImage.replace(".png", "-outline-only.png");

const widget: ImageWidget = new ImageWidget()
  .setImage(iconImage)
  .setImageSize(128, 128)
  .setTintColor(new Color(1, 1, 1));

const ui: UIElement = new UIElement();
ui.position = new Vector(0, 0, -1.7);
ui.presentationStyle = UIPresentationStyle.ViewAligned;
ui.scale = 1 / SCALE;
ui.widget = widget;

const outline: UIElement = new UIElement();
outline.position = ui.position;
outline.presentationStyle = ui.presentationStyle;
outline.scale = ui.scale;
outline.widget = new ImageWidget()
  .setImage(outlineImage)
  .setImageSize(128, 128);

// Owner not set at creation time, wait a frame.
const obj: GameObject = refObject;
process.nextTick(() => {
  const owner: number = obj.getOwningPlayerSlot();
  if (owner >= 0) {
    const slotColor: Color = world.getSlotColor(owner);
    const widgetColor: Color = new ColorLib().colorToWidgetColor(slotColor);
    widget.setTintColor(widgetColor);
  }
  obj.addUI(ui);
  obj.addUI(outline);
});
