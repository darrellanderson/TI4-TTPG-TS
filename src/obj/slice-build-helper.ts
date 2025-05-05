import {
  GameObject,
  LayoutBox,
  refObject,
  Text,
  TextJustification,
  UIElement,
  Vector,
  VerticalAlignment,
} from "@tabletop-playground/api";
import { Hex, HexType } from "ttpg-darrell";
import { System } from "../lib/system-lib/system/system";
import {
  SystemSummary,
  SystemSummaryType,
} from "../lib/system-lib/system/system-summary";

const SCALE: number = 2;

export class SliceBuildHelper {
  private readonly _obj: GameObject;
  private readonly _text: Text;
  private readonly _intervalHandle: NodeJS.Timeout;

  constructor(obj: GameObject) {
    this._obj = obj;
    this._text = new Text()
      .setAutoWrap(false)
      .setFontSize(10 * SCALE)
      .setJustification(TextJustification.Center)
      .setTextColor([0, 0, 0, 1]);

    const widget = new LayoutBox()
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(this._text);

    const z = obj.getExtent(false, false).z;
    const ui = new UIElement();
    ui.position = new Vector(0, 0, z + 0.1);
    ui.scale = 1 / SCALE;
    ui.widget = widget;
    obj.addUI(ui);

    this._intervalHandle = setInterval(() => {
      this.update();
    }, 1000);

    obj.onDestroyed.add(() => {
      clearInterval(this._intervalHandle);
    });
  }

  update(): void {
    const systems: Array<System> = this._getTransitiveAdjacentSystems();
    const summary: SystemSummaryType = new SystemSummary(
      systems
    ).getSummaryRaw();

    let name = this._obj.getName();
    if (name.length === 0) {
      name = "<name>";
    }

    const result = [
      name,
      `${summary.resources}/${summary.influence}`,
      `(${summary.optResources}/${summary.optInfluence})`,
    ];
    result.push(`Tech: ${summary.techs}`);
    result.push(`Traits: ${summary.traits}`);
    result.push(`Wormholes: ${summary.wormholes}`);
    result.push(`Legendaries: ${summary.legendary.length}`);

    const value = result.join("\n");

    this._text.setText(value);
  }

  _getHexToSystem(): Map<HexType, System> {
    const hexToSystem = new Map<HexType, System>();
    const systems = TI4.systemRegistry.getAllSystemsWithObjs();
    for (const system of systems) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexToSystem.set(hex, system);
    }
    return hexToSystem;
  }

  _getTransitiveAdjacentSystems(): Array<System> {
    const toVisit: Set<HexType> = new Set();
    const visited: Set<HexType> = new Set();

    // Seed with our hex.
    const objPos = this._obj.getPosition();
    const objHex = TI4.hex.fromPosition(objPos);
    for (const neighbor of Hex.neighbors(objHex)) {
      toVisit.add(neighbor);
    }

    const hexToSystem: Map<HexType, System> = this._getHexToSystem();
    const result: Array<System> = [];

    while (toVisit.size > 0) {
      const hex: HexType | undefined = toVisit.values().next().value;
      if (hex) {
        toVisit.delete(hex);
        visited.add(hex);

        // Check hex.
        const system: System | undefined = hexToSystem.get(hex);
        if (!system) {
          continue;
        }
        result.push(system);

        // Expand to neighbors.
        for (const neighbor of Hex.neighbors(hex)) {
          if (!visited.has(neighbor)) {
            toVisit.add(neighbor);
          }
        }
      }
    }
    return result;
  }
}

new SliceBuildHelper(refObject);
