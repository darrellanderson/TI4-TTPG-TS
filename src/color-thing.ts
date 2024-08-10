import {
  Border,
  Color,
  GameObject,
  LayoutBox,
  refObject,
  Text,
  TextJustification,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import { ColorLib } from "ttpg-darrell";

console.log("color-thing");

const CORRECT: boolean = true;

for (const obj of world.getAllObjects()) {
  if (obj !== refObject) {
    obj.destroy();
  }
}

const templateId: string = refObject.getTemplateId();
const z: number = world.getTableHeight() + 4;
const allColors = [];
for (let i = 0; i < 20; i++) {
  const color: Color = world.getSlotColor(i);
  allColors.push([
    Math.round(color.r * 255),
    Math.round(color.g * 255),
    Math.round(color.b * 255),
  ]);

  const pos: Vector = new Vector(
    Math.floor(i / 10) * 20 - 10,
    8 * ((i % 10) - 5),
    z
  );
  const obj: GameObject | undefined = world.createObjectFromTemplate(
    templateId,
    pos
  );
  if (obj) {
    obj.setPrimaryColor(color);
    obj.setRoughness(1);
    obj.setMetallic(0);

    obj.setName(color.toHex());

    const ui: UIElement = new UIElement();
    ui.position = new Vector(-4, 0, 2);
    ui.widget = new Border()
      .setColor(color)
      .setChild(
        new LayoutBox()
          .setOverrideWidth(25)
          .setOverrideHeight(25)
          .setChild(
            new Text().setText("UI").setJustification(TextJustification.Center)
          )
      );
    obj.addUI(ui);

    if (CORRECT) {
      const colorLib: ColorLib = new ColorLib();

      const objColor: Color = colorLib.colorToObjectColor(color);
      obj.setPrimaryColor(objColor);

      const widgetColor: Color = colorLib.colorToWidgetColor(color);
      (ui.widget as Border).setColor(widgetColor);

      console.log(i, color.toHex(), objColor.toHex(), widgetColor.toHex());
    }
  }

  console.log("XXX");
  for (const player of world.getAllPlayers()) {
    const message: string = "XXXX";
    player.sendChatMessage(message, color);
  }
}
