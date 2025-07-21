"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaLawsMat = void 0;
const api_1 = require("@tabletop-playground/api");
const HEIGHT = 10;
const KEY_AGENDA_CARD_OBJ_ID = "agenda-card-obj-id";
class AgendaLawsMat {
    constructor(obj) {
        this.onSnappedToHandler = (object, player, snapPoint) => {
            if (object instanceof api_1.Card && snapPoint === this._firstSnapPoint) {
                console.log("onAgendaCard", object.getCardDetails().name);
                this._obj.setSavedData(object.getId(), KEY_AGENDA_CARD_OBJ_ID);
                TI4.events.onAgendaCard.trigger(object, player);
            }
        };
        this.onEndOverlapHandler = (_zone, object) => {
            const id = this._obj.getSavedData(KEY_AGENDA_CARD_OBJ_ID);
            console.log("onEndOverlapHandler", id, object.getId());
            if (object instanceof api_1.Card && object.getId() === id) {
                console.log("onAgendaCardRemoved", object.getCardDetails().name);
                this._obj.setSavedData("", KEY_AGENDA_CARD_OBJ_ID);
                TI4.events.onAgendaCardRemoved.trigger();
            }
        };
        this._obj = obj;
        this._obj.onSnappedTo.add(this.onSnappedToHandler);
        const snapPoints = obj.getAllSnapPoints();
        const firstSnapPoint = snapPoints[0];
        if (!firstSnapPoint) {
            throw new Error("AgendaLawsMat must have a valid snap point.");
        }
        this._firstSnapPoint = firstSnapPoint;
        // Do this AFTER getting the first snap point.
        this._zone = this._findOrCreateZone();
        this._zone.onEndOverlap.add(this.onEndOverlapHandler);
        this._obj.onReleased.add(() => {
            const pos = this._firstSnapPoint.getGlobalPosition();
            pos.z = api_1.world.getTableHeight() + HEIGHT / 2;
            this._zone.setPosition(pos);
        });
        process.nextTick(() => {
            console.log("AgendaLawsMat created", this._obj.getId());
        });
    }
    _findOrCreateZone() {
        const zoneId = "zone:" + this._obj.getId();
        let zone = api_1.world.getZoneById(zoneId);
        // Always recreate the zone -- once it appeared to be a in a bad state
        // where onEndOverlap was not being called.
        if (zone) {
            zone.destroy();
            zone = undefined;
        }
        const pos = this._firstSnapPoint.getGlobalPosition();
        pos.z = api_1.world.getTableHeight() + HEIGHT / 2;
        if (!zone) {
            zone = api_1.world.createZone(pos);
        }
        const color = new api_1.Color(1, 1, 1, 0.1);
        const scale = new api_1.Vector(6, 4, HEIGHT);
        zone.setPosition(pos);
        zone.setColor(color);
        zone.setId(zoneId);
        zone.setScale(scale);
        zone.setStacking(api_1.ZonePermission.Nobody);
        zone.setAlwaysVisible(false);
        return zone;
    }
}
exports.AgendaLawsMat = AgendaLawsMat;
new AgendaLawsMat(api_1.refObject);
//# sourceMappingURL=agenda-laws-mat.js.map