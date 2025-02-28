import { LayoutBox, Widget } from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { MapPlaceFrontierTokens } from "../../lib/map-string-lib/map-place-frontier-tokens";
import { MapPlacePlanetCards } from "../../lib/map-string-lib/map-place-planet-cards";
import { MapRemoveFrontierTokens } from "../../lib/map-string-lib/map-remove-frontier-tokens";
import { MapRemovePlanetCards } from "../../lib/map-string-lib/map-remove-planet-cards";
import { MapStringLoad } from "../../lib/map-string-lib/map-string-load";
import { MapStringSave } from "../../lib/map-string-lib/map-string-save";

export class MapToolUI extends AbstractUI {
  private readonly _onMapStringLoad = (): void => {
    const mapString: string = "";
    new MapStringLoad().load(mapString);
  };

  private readonly _onMapStringSave = (): void => {
    const _mapString: string = new MapStringSave().save();
  };

  private readonly _onPlacePlanetCards = (): void => {
    new MapPlacePlanetCards().placePlanetCards();
  };

  private readonly _onPlaceFrontierTokens = (): void => {
    new MapPlaceFrontierTokens().placeFrontierTokens();
  };

  private readonly _onRemovePlanetCards = (): void => {
    new MapRemovePlanetCards().removePlanetCards();
  };

  private readonly _onRemoveFrontierTokens = (): void => {
    new MapRemoveFrontierTokens().removeFrontierTokens();
  };

  constructor(scale: number) {
    const size: UI_SIZE = {
      w: 100 * scale,
      h: 100 * scale,
    };
    const widget: Widget = new LayoutBox();
    super(widget, size);
  }
}
