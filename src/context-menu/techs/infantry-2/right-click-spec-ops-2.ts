import { AbstractInfantry2 } from "./abstract-infantry-2";

export class RightClickSpecOps2 extends AbstractInfantry2 {
  constructor() {
    const cardNsid: string = "card.technology.unit-upgrade:base/spec-ops-2";
    const rollValue: number = 5;
    super(cardNsid, rollValue);
  }
}
