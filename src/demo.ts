import {
  Border,
  Container,
  GameObject,
  Text,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";

const z = world.getTableHeight() + 10;
const stone = world.createObjectFromTemplate(
  "2EDB21DD496F8596F621BFBA42C381F8",
  [-10, 0, z]
) as GameObject;
stone.setTags(["my-tag"]);

const container = world.createObjectFromTemplate(
  "C134C94B496A8D48C79534A5BDBC8A3D",
  [0, 0, z]
) as Container;
container.snapToGround();
container.setType(1); // type does not matter
container.setContainerTags(["my-tag"]);

const ui = new UIElement();
ui.position = new Vector(0, 0, 5);
ui.widget = new Border().setChild(new Text().setFontSize(5).setText("TEST"));
container.addUI(ui);

container.insert([stone], 0, false);
const found = container.takeAt(0, [10, 0, z], false, true);
found?.setPosition([20, 0, z]);
found?.snapToGround();
