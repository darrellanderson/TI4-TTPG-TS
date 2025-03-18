import { Button, Player, refPackageId, Widget } from "@tabletop-playground/api";
import { LabelUI } from "../../button-ui/label-ui";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { ThrottleClickHandler } from "ttpg-darrell";

const packageId: string = refPackageId;

export abstract class AbstractStrategyCardUI extends AbstractUI {
  private readonly _onPrimary = new ThrottleClickHandler<Button>(
    (_button: Button, _player: Player): void => {
      //
    }
  );

  constructor(name: string, scale: number) {
    const labelUi: LabelUI = new LabelUI(scale);
    labelUi
      .getText()
      .setFont("handel-gothic-regular.tff", packageId)
      .setText(name);

    const widget: Widget = labelUi.getWidget();
    const size: UI_SIZE = labelUi.getSize();
    super(widget, size);
  }
}
