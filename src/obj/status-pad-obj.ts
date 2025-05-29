import {
  Border,
  Button,
  GameObject,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Player,
  refObject,
  refPackageId,
  Rotator,
  UIElement,
  Vector,
  Widget,
} from "@tabletop-playground/api";
import { locale, TurnOrder } from "ttpg-darrell";

const packageId: string = refPackageId;

class StatusPad {
  private readonly _obj: GameObject;
  private readonly _awayImage: ImageWidget;
  private readonly _passImage: ImageWidget;
  private readonly _passButton: Button;
  private readonly _awayButton: Button;
  private readonly _elimButton: Button;

  constructor(obj: GameObject) {
    this._obj = obj;

    const imageSize = 150;
    const fontSize = 28;

    this._awayImage = new ImageWidget().setImageSize(imageSize);
    this._awayButton = new Button()
      .setFontSize(fontSize)
      .setText(locale("AWAY"));
    this._awayButton.onClicked.add((_button: Button, _player: Player): void => {
      const playerSlot: number = this._obj.getOwningPlayerSlot();
      const value: boolean = !TI4.turnOrder.getAway(playerSlot);
      TI4.turnOrder.setAway(playerSlot, value);
    });

    this._passImage = new ImageWidget().setImageSize(imageSize);
    this._passButton = new Button()
      .setFontSize(fontSize)
      .setText(locale("PASS"));
    this._passButton.onClicked.add((_button: Button, _player: Player): void => {
      const playerSlot: number = this._obj.getOwningPlayerSlot();
      const value: boolean = !TI4.turnOrder.getPassed(playerSlot);
      TI4.turnOrder.setPassed(playerSlot, value);
    });

    this._elimButton = new Button()
      .setFontSize(fontSize)
      .setText(locale("ELIM"));
    this._elimButton.onClicked.add((_button: Button, _player: Player): void => {
      const playerSlot: number = this._obj.getOwningPlayerSlot();
      const value: boolean = !TI4.turnOrder.getEliminated(playerSlot);
      TI4.turnOrder.setEliminated(playerSlot, value);
    });

    const forwardWidget: Widget = new HorizontalBox()
      .setChildDistance(10)
      .addChild(this._awayImage)
      .addChild(this._passImage);

    const forwardUi = new UIElement();
    forwardUi.anchorY = 1;
    forwardUi.position = new Vector(0, 0, 0.39); // 0, 0, 1.2
    forwardUi.rotation = new Rotator(0, 0, 0); // 15, 0, 0
    forwardUi.scale = 0.2;
    forwardUi.widget = forwardWidget;

    obj.addUI(forwardUi);

    const awayPassButtons = new HorizontalBox()
      .setChildDistance(10)
      .addChild(this._awayButton, 1)
      .addChild(this._passButton, 1)
      .addChild(this._elimButton, 1);

    const layoutBox = new LayoutBox()
      .setChild(awayPassButtons)
      .setMinimumHeight(150)
      .setMinimumWidth(450)
      .setPadding(10, 10, 10, 10);

    const reverseUi = new UIElement();
    reverseUi.anchorY = 0;
    reverseUi.position = new Vector(0, 0, 0.39);
    reverseUi.scale = 0.2;
    reverseUi.widget = new Border().setChild(layoutBox);

    obj.addUI(reverseUi);
  }

  update() {
    const playerSlot: number = this._obj.getOwningPlayerSlot();
    const eliminated: boolean = TI4.turnOrder.getEliminated(playerSlot);
    const away: boolean = TI4.turnOrder.getAway(playerSlot);
    const pass: boolean = TI4.turnOrder.getPassed(playerSlot);

    let awayImgPath: string = away
      ? "status-pad/panel_away_on.png"
      : "status-pad/panel_away_off.png";
    let passImgPath: string = pass
      ? "status-pad/panel_pass_on.png"
      : "status-pad/panel_pass_off.png";
    if (eliminated) {
      awayImgPath = "status-pad/panel_eliminated.png";
      passImgPath = "status-pad/panel_eliminated.png";
    }

    this._awayButton.setEnabled(!eliminated);
    this._passButton.setEnabled(!eliminated);
    this._awayImage.setImage(awayImgPath, packageId);
    this._passImage.setImage(passImgPath, packageId);
  }
}

const obj: GameObject = refObject;
process.nextTick(() => {
  const statusPad = new StatusPad(obj);
  statusPad.update();

  TurnOrder.onTurnStateChanged.add((turnOrder: TurnOrder): void => {
    if (turnOrder === TI4.turnOrder) {
      statusPad.update();
    }
  });
});
