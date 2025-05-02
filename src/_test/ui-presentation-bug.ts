import {
  ImageWidget,
  refPackageId,
  UIElement,
  UIPresentationStyle,
  Vector,
  world,
} from "@tabletop-playground/api";

const packageId: string = refPackageId;

function createUI(pos: Vector): void {
  const ui: UIElement = new UIElement();
  ui.position = pos;
  ui.presentationStyle = UIPresentationStyle.ViewAligned;
  ui.scale = 0.2;
  ui.widget = new ImageWidget()
    .setImage("icon/token/fighter-1.png", packageId)
    .setImageSize(50, 50);
  world.addUI(ui);
}

/**
 * 2: client sees correct results.
 * 5: client sees SOME wrong presentation styles, but not all.
 * 10: client sees UI but with wrong scale and presentation style.
 * 30: client does not see any UI.
 */
const d: number = 5;

const z: number = world.getTableHeight() + 3;
for (let x: number = -d; x <= d; x += 1) {
  for (let y: number = -d; y <= d; y += 1) {
    createUI(new Vector(x, y, z));
  }
}
