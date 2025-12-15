import { Card, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

/**
 * If an agenda card is errantly left in the agenda spot during the action
 * phase, agenda handling might interfere with turn order (e.g. skip a player).
 *
 * This class moves any such card off the agenda mat (do not discard in case a
 * law that wasn't placed on a reserved law spot).
 */
export class BootActiveAgendaCard {
  _agendaCardOnSpot(): Card | undefined {
    const find: Find = new Find();
    const snapPointTag: string = "active-agenda";
    const agendaCard: Card | undefined = find.findDeckOrDiscard(snapPointTag);
    return agendaCard;
  }

  bootCardOffSpot(): void {
    const agendaCard: Card | undefined = this._agendaCardOnSpot();
    if (agendaCard !== undefined) {
      const currentPos: Vector = agendaCard.getPosition();
      const leftPos: Vector = currentPos.add([0, -10, 10]);
      agendaCard.setPosition(leftPos);
      agendaCard.snapToGround();
    }
  }
}
