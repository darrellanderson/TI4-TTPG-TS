import {
  Color,
  GameObject,
  ImageWidget,
  ObjectType,
  refObject,
  UIElement,
  UIPresentationStyle,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  ColorLib,
  ColorsType,
  DeletedItemsContainer,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";

// There's a TTPG bug where container UI causes problems such as
// looping animation of objects entering.  It is fixed in dev, but
// we need to wait for the next release.  In the meantime, create a
// second GameObject to host the UI (cannot use world because there
// are too many for the object size).
const PLACE_UI_ALTERNATE: boolean = true;

const SCALE: number = 4;

let iconImage: string;
const nsid: string = NSID.get(refObject);
const parsed: ParsedNSID | undefined = NSID.parse(nsid);
const firstPart: string = parsed?.nameParts[0] ?? "Unknown";
if (nsid.startsWith("container.unit:")) {
  iconImage = `icon/unit/${firstPart}.png`;
} else if (nsid === "container.token.command:base/generic") {
  iconImage = "icon/token/command.png";
} else if (nsid === "container.token.control:base/generic") {
  iconImage = "icon/token/control.png";
} else if (nsid.startsWith("container.token:")) {
  iconImage = `icon/token/${firstPart}.png`;
} else {
  throw new Error(`Unknown NSID: ${nsid}`);
}

let outlineImage: string = iconImage.replace(".png", "-outline-only.png");
if (nsid.startsWith("container.token:")) {
  outlineImage = "icon/token/circle-outline-only.png";
}

const widget: ImageWidget = new ImageWidget()
  .setImage(iconImage)
  .setImageSize(128, 128)
  .setTintColor(new Color(1, 1, 1, 1));

const ui: UIElement = new UIElement();
ui.position = new Vector(0, 0, -1.7);
ui.presentationStyle = UIPresentationStyle.ViewAligned;
ui.scale = 1 / SCALE;
ui.widget = widget;

if (firstPart.endsWith("-1")) {
  ui.scale = ui.scale * 0.75;
}

const outline: UIElement = new UIElement();
outline.position = ui.position;
outline.presentationStyle = ui.presentationStyle;
outline.scale = ui.scale;
outline.widget = new ImageWidget()
  .setImage(outlineImage)
  .setImageSize(128, 128)
  .setTintColor(new Color(1, 1, 1, 1));

// Owner not set at creation time, wait a frame.
const obj: GameObject = refObject;
obj.addUI(ui);
obj.addUI(outline);

const altId: string = obj.getId() + "-alt";
let altObject: GameObject | undefined = world.getObjectById(altId);
if (PLACE_UI_ALTERNATE) {
  obj.removeUIElement(ui);
  obj.removeUIElement(outline);

  const altPos: Vector = obj.getPosition().subtract([0, 0, 100]);
  if (!altObject) {
    const templateId = "83FDE12C4E6D912B16B85E9A00422F43"; // cube
    altObject = world.createObjectFromTemplate(templateId, altPos);
    if (altObject) {
      altObject.setId(altId);
      altObject.setObjectType(ObjectType.NonInteractive);
    }
  }
  if (altObject) {
    altObject.setPosition(altPos);
    ui.position = altObject.worldPositionToLocal(
      obj.localPositionToWorld(ui.position)
    );
    altObject.addUI(ui);

    outline.position = altObject.worldPositionToLocal(
      obj.localPositionToWorld(outline.position)
    );
    altObject.addUI(outline);
  }
} else if (altObject) {
  // Use the original object.
  DeletedItemsContainer.destroyWithoutCopying(altObject);
}

const update = (): void => {
  // Object might have moved.  If using the alternate object, move it too.
  if (PLACE_UI_ALTERNATE && altObject) {
    const altPos: Vector = obj.getPosition().subtract([0, 0, 100]);
    altObject.setObjectType(ObjectType.Regular);
    altObject.setPosition(altPos);
    altObject.setObjectType(ObjectType.NonInteractive);
  }

  const owner: number = obj.getOwningPlayerSlot();
  if (nsid.startsWith("container.unit") && owner === 19) {
    // Anonymous units.
    widget.setTintColor(obj.getPrimaryColor());
  } else if (owner >= 0) {
    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType = colorLib.getColorsByPlayerSlotOrThrow(owner);
    const widgetColor: Color = colorLib.parseColorOrThrow(colorsType.widget);
    widget.setTintColor(widgetColor);
  }
};

process.nextTick(update);
TI4.events.onPlayerChangedColor.add(update);
