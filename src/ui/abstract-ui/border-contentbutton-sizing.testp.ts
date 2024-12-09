/**
 * Examine how "add to size" widgets behave.
 *
 * Observations:
 *
 * LayoutBox needs H/V alignments to prevent stretching child.
 * Border inside a LayoutBox respects size.
 * ContentButton adds 4px external padding.
 */

import {
  Border,
  ContentButton,
  HorizontalAlignment,
  HorizontalBox,
  LayoutBox,
  Panel,
  ScreenUIElement,
  Text,
  VerticalAlignment,
  Widget,
  world,
} from "@tabletop-playground/api";

function getLayoutBox(label: string): LayoutBox {
  const labelText: Widget = new Text()
    .setText(label)
    .setTextColor([1, 1, 1, 1]);
  return new LayoutBox()
    .setOverrideWidth(100)
    .setOverrideHeight(20)
    .setChild(labelText);
}

function getBorder(label: string): Border {
  const child: Widget = getLayoutBox(label);
  return new Border().setChild(child);
}

function getBorderBox(label: string): LayoutBox {
  const child: Widget = getBorder(label);
  return new LayoutBox()
    .setOverrideWidth(100)
    .setOverrideHeight(20)
    .setHorizontalAlignment(HorizontalAlignment.Left)
    .setVerticalAlignment(VerticalAlignment.Top)
    .setChild(child);
}

function getDoubleBorderBox(label: string): LayoutBox {
  const grandChild: Widget = getBorderBox(label);
  const child: Widget = new Border()
    .setColor([1, 0, 0, 1])
    .setChild(grandChild);
  return new LayoutBox()
    .setOverrideWidth(100)
    .setOverrideHeight(20)
    .setHorizontalAlignment(HorizontalAlignment.Left)
    .setVerticalAlignment(VerticalAlignment.Top)
    .setChild(child);
}

function getContentButton(label: string): LayoutBox {
  const grandChild: Widget = getLayoutBox(label);
  const child: Widget = new ContentButton().setChild(grandChild);
  return new LayoutBox()
    .setOverrideWidth(100)
    .setOverrideHeight(20)
    .setHorizontalAlignment(HorizontalAlignment.Left)
    .setVerticalAlignment(VerticalAlignment.Top)
    .setChild(child);
}

function go() {
  const panel: Panel = new HorizontalBox().setChildDistance(10);

  panel
    .addChild(getLayoutBox("box"))
    .addChild(getBorder("border"))
    .addChild(getBorderBox("border box"))
    .addChild(getDoubleBorderBox("double border box"))
    .addChild(getContentButton("content button"));

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = 1000;
  screenUI.height = 500;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setColor([0, 0, 0, 1]).setChild(panel);

  world.addScreenUI(screenUI);
}

setTimeout(go, 100);
