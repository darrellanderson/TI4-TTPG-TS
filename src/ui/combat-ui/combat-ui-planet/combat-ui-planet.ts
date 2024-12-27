import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";

export class CombatUIPlanet extends AbstractUI {
  constructor() {
    const abstractUi: AbstractUI = new HorizontalUIBuilder().build();

    super(abstractUi.getWidget(), abstractUi.getSize());
  }
}
