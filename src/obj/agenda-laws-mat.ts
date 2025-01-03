import {
  Card,
  GameObject,
  Player,
  refObject,
  SnapPoint,
} from "@tabletop-playground/api";

const snapPoints: Array<SnapPoint> = refObject.getAllSnapPoints();
const firstSnapPoint: SnapPoint | undefined = snapPoints[0];

refObject.onSnappedTo.add(
  (object: GameObject, player: Player, snapPoint: SnapPoint): void => {
    if (object instanceof Card && snapPoint === firstSnapPoint) {
      console.log("onAgendaCard", object.getCardDetails().name);
      TI4.events.onAgendaCard.trigger(object, player);
    }
  }
);
