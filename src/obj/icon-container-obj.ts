import {
  Color,
  GameObject,
  ImageWidget,
  ObjectType,
  refObject,
  refPackageId,
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

const packageId: string = refPackageId;

class IconContainerObj {
  private readonly _obj: GameObject;
  private readonly _altObj: GameObject | undefined;

  private readonly _iconImage: ImageWidget;
  private readonly _outlineImage: ImageWidget;

  private readonly _iconUi: UIElement;
  private readonly _outlineUi: UIElement;

  constructor(obj: GameObject) {
    const altId: string = obj.getId() + "-alt";
    let altObj: GameObject | undefined = world.getObjectById(altId);
    if (PLACE_UI_ALTERNATE) {
      // Create the alt object if missing.
      if (!altObj) {
        const altPos: Vector = obj.getPosition().subtract([0, 0, 100]);
        const templateId = "83FDE12C4E6D912B16B85E9A00422F43"; // cube
        altObj = world.createObjectFromTemplate(templateId, altPos);
        if (altObj) {
          altObj.setId(altId);
          altObj.setObjectType(ObjectType.NonInteractive);
        }
      }
    } else {
      // Not using alternate object, destroy it if it exists.
      if (altObj) {
        DeletedItemsContainer.destroyWithoutCopying(altObj);
        altObj = undefined;
      }
    }

    const nsid: string = NSID.get(obj);

    this._obj = obj;
    this._altObj = altObj;

    this._iconImage = new ImageWidget()
      .setImage(this.getIconFile(), packageId)
      .setImageSize(128, 128)
      .setTintColor(new Color(1, 1, 1, 1));
    this._outlineImage = new ImageWidget()
      .setImage(this.getOutlineFile(), packageId)
      .setImageSize(128, 128)
      .setTintColor(new Color(1, 1, 1, 1));

    this._iconUi = new UIElement();
    this._iconUi.position = new Vector(0, 0, -1.7);
    this._iconUi.presentationStyle = UIPresentationStyle.ViewAligned;
    this._iconUi.scale = 1 / SCALE;
    this._iconUi.widget = this._iconImage;
    if (nsid.endsWith("-1")) {
      this._iconUi.scale = this._iconUi.scale * 0.75;
    }

    this._outlineUi = new UIElement();
    this._outlineUi.position = this._iconUi.position;
    this._outlineUi.presentationStyle = this._iconUi.presentationStyle;
    this._outlineUi.scale = this._iconUi.scale;
    this._outlineUi.widget = this._outlineImage;
  }

  getIconFile(): string {
    const nsid: string = NSID.get(this._obj);
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const firstPart: string = parsed?.nameParts[0] ?? "Unknown";
    if (nsid.startsWith("container.unit:")) {
      return `icon/unit/${firstPart}.png`;
    } else if (nsid === "container.token.command:base/generic") {
      return "icon/token/command.png";
    } else if (nsid === "container.token.control:base/generic") {
      return "icon/token/control.png";
    } else if (nsid.startsWith("container.token:")) {
      return `icon/token/${firstPart}.png`;
    } else {
      throw new Error(`Unknown NSID: ${nsid}`);
    }
  }

  getOutlineFile(): string {
    const iconImage: string = this.getIconFile();
    const outlineImage: string = iconImage.replace(".png", "-outline-only.png");
    const nsid: string = NSID.get(this._obj);
    if (nsid.startsWith("container.token:")) {
      return "icon/token/circle-outline-only.png";
    }
    return outlineImage;
  }

  addUi(): void {
    if (PLACE_UI_ALTERNATE) {
      this._addUiAlt();
      return;
    }
    this._obj.addUI(this._iconUi);
    this._obj.addUI(this._outlineUi);
  }

  /**
   * If using alt object, reposition and attach ui there.
   */
  _addUiAlt(): void {
    if (!this._altObj) {
      throw new Error("Cannot add UI to alternate object, it does not exist.");
    }
    // Use the alternate object.ui.position = altObject.worldPositionToLocal(
    const worldPos: Vector = this._obj.localPositionToWorld(
      this._iconUi.position
    );
    const localPos: Vector = this._altObj.worldPositionToLocal(worldPos);

    this._iconUi.position = localPos;
    this._outlineUi.position = localPos;

    this._altObj.addUI(this._iconUi);
    this._altObj.addUI(this._outlineUi);
  }

  updateColor(): void {
    const nsid: string = NSID.get(this._obj);
    const owner: number = this._obj.getOwningPlayerSlot();
    if (nsid.startsWith("container.unit") && owner === 19) {
      // Anonymous units.
      this._iconImage.setTintColor(this._obj.getPrimaryColor());
    } else if (owner >= 0) {
      const colorLib: ColorLib = new ColorLib();
      const colorsType: ColorsType =
        colorLib.getColorsByPlayerSlotOrThrow(owner);
      const widgetColor: Color = colorLib.parseColorOrThrow(colorsType.widget);
      this._iconImage.setTintColor(widgetColor);
    }
  }
}

const iconContainerObj: IconContainerObj = new IconContainerObj(refObject);

// Wait a tick to add any UI (getExtent friendly for layout, plus may move).
process.nextTick(() => {
  iconContainerObj.addUi();
  iconContainerObj.updateColor();
});
TI4.events.onPlayerChangedColor.add(() => {
  iconContainerObj.updateColor();
});
