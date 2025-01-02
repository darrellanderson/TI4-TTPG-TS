import { refPackageId, Widget } from "@tabletop-playground/api";
import { LabelUI } from "../../button-ui/label-ui";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";

const packageId: string = refPackageId;

export abstract class AbstractStrategyCardUI extends AbstractUI {
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
