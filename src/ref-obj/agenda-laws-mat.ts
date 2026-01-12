import {
  Card,
  Color,
  GameObject,
  Player,
  refObject,
  SnapPoint,
  Vector,
  world,
  Zone,
  ZonePermission,
} from "@tabletop-playground/api";

const HEIGHT: number = 10;
const KEY_AGENDA_CARD_OBJ_ID: string = "agenda-card-obj-id";

export class AgendaLawsMat {
  private readonly _obj: GameObject;
  private readonly _firstSnapPoint: SnapPoint;
  private readonly _zone: Zone;

  private readonly onSnappedToHandler = (
    object: GameObject,
    player: Player,
    snapPoint: SnapPoint
  ): void => {
    if (object instanceof Card && snapPoint === this._firstSnapPoint) {
      console.log("onAgendaCard", object.getCardDetails().name);
      this._obj.setSavedData(object.getId(), KEY_AGENDA_CARD_OBJ_ID);
      TI4.events.onAgendaCard.trigger(object, player);
    }
  };

  private readonly onEndOverlapHandler = (
    _zone: Zone,
    object: GameObject
  ): void => {
    const id: string = this._obj.getSavedData(KEY_AGENDA_CARD_OBJ_ID);
    console.log("onEndOverlapHandler", id, object.getId());
    if (object instanceof Card && object.getId() === id) {
      console.log("onAgendaCardRemoved", object.getCardDetails().name);
      this._obj.setSavedData("", KEY_AGENDA_CARD_OBJ_ID);
      TI4.events.onAgendaCardRemoved.trigger();
    }
  };

  private readonly _resetZonePosition = (): void => {
    const pos: Vector = this._firstSnapPoint.getGlobalPosition();
    pos.z = world.getTableHeight() + HEIGHT / 2;
    this._zone.setPosition(pos);
  };

  constructor(obj: GameObject) {
    this._obj = obj;
    this._obj.onSnappedTo.add(this.onSnappedToHandler);

    const snapPoints: Array<SnapPoint> = obj.getAllSnapPoints();
    const firstSnapPoint: SnapPoint | undefined = snapPoints[0];
    if (!firstSnapPoint) {
      throw new Error("AgendaLawsMat must have a valid snap point.");
    }
    this._firstSnapPoint = firstSnapPoint;

    // Do this AFTER getting the first snap point.
    this._zone = this._findOrCreateZone();
    process.nextTick(this._resetZonePosition);
    this._obj.onReleased.add(this._resetZonePosition);

    // Just in case setup does not happen right away.
    setTimeout(this._resetZonePosition, 5000);
  }

  _findOrCreateZone(): Zone {
    const zoneId: string = "zone:" + this._obj.getId();
    let zone: Zone | undefined = world.getZoneById(zoneId);

    // Always recreate the zone -- once it appeared to be a in a bad state
    // where onEndOverlap was not being called.
    if (zone) {
      zone.destroy();
      zone = undefined;
    }

    const pos: Vector = this._firstSnapPoint.getGlobalPosition();
    pos.z = world.getTableHeight() + HEIGHT / 2;

    if (!zone) {
      zone = world.createZone(pos);
    }

    process.nextTick(() => {
      const color: Color = new Color(1, 1, 1, 0.1);
      const scale: Vector = new Vector(6, 4, HEIGHT);
      zone.setPosition(pos);
      zone.setColor(color);
      zone.setId(zoneId);
      zone.setScale(scale);
      zone.setStacking(ZonePermission.Nobody);
      zone.setAlwaysVisible(false);
      zone.onEndOverlap.add(this.onEndOverlapHandler);
    });
    return zone;
  }
}

new AgendaLawsMat(refObject);
