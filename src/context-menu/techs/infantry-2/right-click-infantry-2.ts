import { AbstractInfantry2 } from "./abstract-infantry-2";

export class RightClickInfantry2 extends AbstractInfantry2 {
  constructor() {
    const cardNsid: string = "card.technology.unit-upgrade:base/infantry-2";
    const rollValue: number = 6;
    super(cardNsid, rollValue);
  }
}
