import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CreateAbstractUIType } from "../abstract-window/abstract-window";
export declare class MapToolUI extends AbstractUI {
    private readonly _editText;
    private _premadeMapWindow;
    private readonly _onUsePremadeMap;
    private readonly _onUseSliceDraft;
    private readonly _onMapStringLoad;
    private readonly _onMapStringSave;
    private readonly _onPlacePlanetCards;
    private readonly _onPlaceFrontierTokens;
    private readonly _onRemovePlanetCards;
    private readonly _onRemoveFrontierTokens;
    private readonly _onPlaceHyperlanes;
    private readonly _onClearMap;
    constructor(scale: number);
    _createMapPremadeUI: CreateAbstractUIType;
}
