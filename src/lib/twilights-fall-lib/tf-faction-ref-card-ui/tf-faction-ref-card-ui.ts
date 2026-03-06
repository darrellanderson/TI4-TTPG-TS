import {
  Card,
  GameObject,
  ImageWidget,
  Rotator,
  UIElement,
  UIZoomVisibility,
  Vector,
} from "@tabletop-playground/api";
import {
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
  ParsedNSID,
} from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";

export class TFFactionRefCardUI implements IGlobal {
  private _onObjectHandler = (obj: GameObject): void => {
    if (this._getFactionFromFactionRefCard(obj)) {
      this._addUI(obj);
    }
  };

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add(
      this._onObjectHandler
    );
  }

  _getFactionFromFactionRefCard(obj: GameObject): Faction | undefined {
    if (!(obj instanceof Card)) {
      return undefined;
    }

    const nsid: string = NSID.get(obj);
    if (!nsid.startsWith("card.faction-reference:")) {
      return undefined;
    }

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      return undefined;
    }
    const nsidName: string | undefined = parsed.nameParts[0];
    if (!nsidName) {
      return undefined;
    }
    const faction: Faction | undefined =
      TI4.factionRegistry.getByNsidName(nsidName);
    if (!faction) {
      return undefined;
    }

    return faction;
  }

  _addUI(obj: GameObject): void {
    // Remove existing UI to avoid duplicates.
    obj.getUIs().forEach((ui: UIElement): void => {
      obj.removeUIElement(ui);
    });

    // Add new UI.
    const faction: Faction | undefined =
      this._getFactionFromFactionRefCard(obj);
    if (!faction) {
      throw new Error("missing faction");
    }
    const homeImg: string = faction.getHomeImg();
    const homeImgPackageId: string = faction.getHomeImgPackageId();
    const scale: number = 4;
    const d: number = 32 * scale;
    const img: ImageWidget = new ImageWidget()
      .setImage(homeImg, homeImgPackageId)
      .setImageSize(d, d); // square image

    const ui: UIElement = new UIElement();
    ui.widget = img;
    ui.scale = 1 / scale;
    ui.zoomVisibility = UIZoomVisibility.ZoomedOnly;
    ui.position = new Vector(0.55 * scale, 0.95 * scale, -0.1);
    ui.rotation = new Rotator(180, 180, 0);

    obj.addUI(ui);
  }
}
