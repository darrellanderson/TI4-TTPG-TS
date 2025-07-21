"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
const map_ui_1 = require("../../../ui/map-ui/map-ui");
const draft_to_map_string_1 = require("./draft-to-map-string");
const map_string_load_1 = require("../../map-string-lib/map-string/map-string-load");
function go() {
    const seatIndexToSliceTiles = new Map();
    const seatIndexToFaction = new Map();
    const setIndexToPlayerName = new Map();
    seatIndexToSliceTiles.set(1, [21, 22, 23, 24, 25]);
    seatIndexToSliceTiles.set(2, [31, 32, 33, 34, 35]);
    const arborec = TI4.factionRegistry.getByNsid("faction:base/arborec");
    if (!arborec) {
        throw new Error("arborec not found");
    }
    seatIndexToFaction.set(1, arborec);
    const { mapString, hexToPlayerName } = new draft_to_map_string_1.DraftToMapString(milty_1.MILTY_SLICE_SHAPE).buildMapString(seatIndexToSliceTiles, seatIndexToFaction, setIndexToPlayerName);
    console.log("xxx", mapString);
    new map_string_load_1.MapStringLoad().load(mapString);
    const mapUI = new map_ui_1.MapUI(mapString, hexToPlayerName, 1);
    const widget = mapUI.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = mapUI.getSize().w;
    screenUI.height = mapUI.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=draft-to-map-string.testp.js.map