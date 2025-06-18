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
  private readonly _text1: Text = new Text();
  private readonly _text2: Text = new Text();
  private readonly _text3: Text = new Text();
  private readonly _border: Border = new Border();

  _createTitleUI(): UIElement {
    const scale: number = 4;

    const ui: UIElement = new UIElement();
    ui.anchorX = 0.5;
    ui.anchorY = 1;
    ui.position = new Vector(40, 0, world.getTableHeight() + 1);
    ui.presentationStyle = UIPresentationStyle.ViewAligned;
    ui.scale = 1 / scale;
    ui.widget = this._createTitleWidget(scale);
    ui.useTransparency = true;
    return ui;
  }

  _createTitleWidget(scale: number): Widget {
    this._text1
      .setText("How to Play".toUpperCase())
      .setBold(true)
      .setFontSize(24 * scale)
      .setJustification(TextJustification.Center);

    this._text2
      .setText("TWILIGHT IMPERIUM".toUpperCase())
      .setBold(true)
      .setFont("ambroise-firmin-bold.otf", packageId)
      .setFontSize(48 * scale)
      .setJustification(TextJustification.Center);

    this._text3
      .setText("on Tabletop Playground".toUpperCase())
      .setBold(true)
      .setFontSize(24 * scale)
      .setJustification(TextJustification.Center);

    const panel: Panel = new VerticalBox()
      .setChildDistance(1)
      .addChild(this._text1)
      .addChild(this._text2)
      .addChild(this._text3);

    const p: number = 3 * scale;
    const box: Widget = new LayoutBox().setPadding(p, p, p, p).setChild(panel);

    this._border.setColor([0, 0, 0, 0.8]).setChild(box);
    this.tint(1);

    return this._border;
  }

  tint(alpha: number) {
    this._text1.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
    this._text2.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
    this._text3.setTextColor([1, 1, 1, alpha]).setVisible(alpha > 0);
    this._border.setColor([0, 0, 0, 0.8 * alpha]).setVisible(alpha > 0);
  }
}
