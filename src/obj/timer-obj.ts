import {
  Button,
  GameObject,
  HorizontalBox,
  Panel,
  refObject,
  refPackageId,
  UIElement,
  Vector,
  Widget,
  world,
} from "@tabletop-playground/api";
import { EditTimer } from "ttpg-darrell";

const packageId: string = refPackageId;
TI4.timer.onTimerExpired.add(() => {
  const sound = world.importSound("bing-bong.flac", packageId);
  if (!sound) {
    console.log("no sound?");
    return;
  }
  const startTime = 0;
  const volume = 0.75; // [0:2] range
  const loop = false;
  sound.play(startTime, volume, loop);
});

const timerText: Button = new Button()
  .setFontSize(20)
  .setTextColor([1, 0, 0, 1])
  .setText("00 : 00 : 00");
timerText.onClicked.add(() => {
  TI4.timer.toggle();
});

TI4.timer.onTimerTick.add((): void => {
  timerText.setText(TI4.timer.getTimeString());
});

const obj: GameObject = refObject;
const extent: Vector = obj.getExtent(false, false);

const editButton: Button = new Button().setFontSize(14).setText("@");
editButton.onClicked.add(() => {
  const editUI: UIElement = new UIElement();
  editUI.position = new Vector(0, 0, extent.z + 0.04);

  const onEditClose = (): void => {
    obj.removeUIElement(editUI);
  };

  const widget: Widget = new EditTimer(TI4.timer).createWidget(onEditClose);
  editUI.widget = widget;
  obj.addUI(editUI);
});

const panel: Panel = new HorizontalBox()
  .setChildDistance(5)
  .addChild(timerText)
  .addChild(editButton);

const ui: UIElement = new UIElement();
ui.position = new Vector(0, 0, extent.z + 0.02);
ui.widget = panel;

obj.addUI(ui);
