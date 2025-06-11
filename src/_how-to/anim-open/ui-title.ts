import {
  Border,
  LayoutBox,
  Panel,
  refPackageId,
  Text,
  TextJustification,
  UIElement,
  UIPresentationStyle,
  Vector,
  VerticalBox,
  Widget,
  world,
} from "@tabletop-playground/api";

const packageId: string = refPackageId;

export class UiTitle {
  _createTitleUI(): UIElement {
    const scale: number = 4;

    const ui: UIElement = new UIElement();
    ui.anchorX = 0.5;
    ui.anchorY = 1;
    ui.position = new Vector(20, 0, world.getTableHeight() + 1);
    ui.presentationStyle = UIPresentationStyle.ViewAligned;
    ui.scale = 1 / scale;
    ui.widget = this._createTitleWidget(scale);
    ui.useTransparency = true;
    return ui;
  }

  _createTitleWidget(scale: number): Widget {
    const panel: Panel = new VerticalBox()
      .setChildDistance(1)
      .addChild(
        new Text()
          .setText("How to Play")
          .setFontSize(12 * scale)
          .setJustification(TextJustification.Center)
      )
      .addChild(
        new Text()
          .setText("TWILIGHT IMPERIUM")
          .setFont("ambroise-firmin-bold.otf", packageId)
          .setFontSize(24 * scale)
          .setJustification(TextJustification.Center)
      )
      .addChild(
        new Text()
          .setText("on Tabletop Playground")
          .setFontSize(12 * scale)
          .setJustification(TextJustification.Center)
      );

    const p: number = 1 * scale;
    const box: Widget = new LayoutBox().setPadding(p, p, p, p).setChild(panel);

    const c: number = 0;
    const border: Widget = new Border().setColor([c, c, c, 0.7]).setChild(box);

    return border;
  }
}
