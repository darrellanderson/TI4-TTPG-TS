import {
  Border,
  Color,
  GameObject,
  LayoutBox,
  refObject,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";

console.log("color-thing");

for (const obj of world.getAllObjects()) {
  if (obj !== refObject) {
    obj.destroy();
  }
}

const templateId: string = refObject.getTemplateId();
const z: number = world.getTableHeight() + 4;
const allColors = [];
for (let i = 0; i < 20; i++) {
  let color: Color = world.getSlotColor(i);
  if (i === -1) {
    console.log("override color");
    color = new Color(
      Number.parseInt("7a", 16) / 255,
      Number.parseInt("0", 16) / 255,
      Number.parseInt("b2", 16) / 255
    );
  }
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
      .setChild(new LayoutBox().setOverrideWidth(25).setOverrideHeight(25));
    obj.addUI(ui);
  }

  console.log("XXX");
  for (const player of world.getAllPlayers()) {
    const message: string = "XXXX";
    player.sendChatMessage(message, color);
  }
}
