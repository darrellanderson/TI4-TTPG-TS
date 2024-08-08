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

const nsid: string = NSID.get(refObject);
const parsed: ParsedNSID | undefined = NSID.parse(nsid);
const unit: string = parsed?.nameParts[0] ?? "Unknown";

const widget: ImageWidget = new ImageWidget()
  .setImage(`icon/unit/${unit}.png`)
  .setImageSize(128, 128);

const ui: UIElement = new UIElement();
ui.position = new Vector(0, 0, 1.7);
ui.presentationStyle = UIPresentationStyle.ViewAligned;
ui.scale = 1 / SCALE;
ui.widget = widget;

// Owner not set at creation time, wait a frame.
const obj: GameObject = refObject;
process.nextTick(() => {
  const owner: number = obj.getOwningPlayerSlot();
  const slotColor: Color = world.getSlotColor(owner);
  const widgetColor: Color = new ColorLib().colorToWidgetColor(slotColor);
  widget.setTintColor(widgetColor);
  obj.addUI(ui);
});
