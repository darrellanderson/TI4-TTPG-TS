import {
  Border,
  Color,
  GameObject,
  GameWorld,
  LayoutBox,
  Player,
  PlayerPermission,
  refObject,
  Text,
  TextJustification,
  UIElement,
  Vector,
  VerticalAlignment,
  world,
  Zone,
  ZonePermission,
} from "@tabletop-playground/api";
import { Broadcast } from "ttpg-darrell";

import { CombatRoll } from "../lib/combat-lib/combat-roll/combat-roll";
import { Faction } from "../lib/faction-lib/faction/faction";
import { System } from "../lib/system-lib/system/system";
import { BuildConsume } from "../lib/build-lib/build-consume";
import { BuildProduce } from "../lib/build-lib/build-produce";

const HEIGHT: number = 4;

export class BuildArea {
  private readonly _obj: GameObject;
  private readonly _zone: Zone;
  private readonly _summaryText: Text;
  private readonly _ui: UIElement;

  private _lastActivatedSystemTileObj: GameObject | undefined;
  private _lastActivatedActionName: string | undefined;

  // public for testing
  _onUpdateHandler: () => void = () => {
    this.update();
  };

  constructor(obj: GameObject) {
    if (!obj.isValid()) {
      this._obj = obj;
      this._zone = new Zone();
      this._summaryText = new Text();
      this._ui = new UIElement();
      return;
    }
    if (obj.getOwningPlayerSlot() === -1) {
      console.log("obj", obj.getId());
      throw new Error("BuildArea must have an owning player slot.");
    }

    this._obj = obj;
    this._zone = this._findOrCreateZone();
    this._summaryText = new Text();
    this._ui = this._addUI();

    this._obj.onReleased.add(() => {
      const pos: Vector = this._obj.getPosition();
      pos.z = world.getTableHeight() + HEIGHT / 2;
      this._zone.setPosition(pos);
    });

    this._zone.onBeginOverlap.add(this._onUpdateHandler);
    this._zone.onEndOverlap.add(this._onUpdateHandler);

    TI4.onSystemActivated.add((system: System, player: Player) => {
      if (player.getSlot() === this._obj.getOwningPlayerSlot()) {
        this._lastActivatedSystemTileObj = system.getObj();
        if (this._lastActivatedActionName) {
          this._obj.removeCustomAction(this._lastActivatedActionName);
          this._lastActivatedActionName = undefined;
        }
        let name: string = system.getName();
        const maxLength: number = 30;
        if (name.length > maxLength) {
          name = name.substring(0, maxLength - 3) + "...";
        }
        this._lastActivatedActionName = "*Warp to " + name;
      }
    });

    const togglePrivacyActionName: string = "*Toggle Privacy";
    this._obj.addCustomAction(togglePrivacyActionName);

    const reportActionName: string = "*Report";
    this._obj.addCustomAction(reportActionName);

    const warpToHomeActionName: string = "*Warp to Home";
    this._obj.addCustomAction(warpToHomeActionName);

    this._obj.onCustomAction.add(
      (_obj: GameObject, _player: Player, action: string) => {
        if (action === togglePrivacyActionName) {
          this.togglePrivacyMode();
        }
        if (action === reportActionName) {
          this.report();
        }
        if (action === warpToHomeActionName) {
          this._warpToHome();
        }
        if (action === this._lastActivatedActionName) {
          this._warpToLastActivated();
        }
      }
    );

    this.update();
  }

  _addUI(): UIElement {
    const extent: Vector = this._obj.getExtent(false, false);

    // Get layout position and size.
    const scale: number = 4;
    const pad: number = 0.35;
    const fontSize: number = 5.8 * scale;
    const size = {
      w: (extent.y * 2 * 10 - pad * 20) * scale, // ui is 10x
      h: 15 * scale,
    };
    const pos: Vector = new Vector(
      extent.x - pad,
      -extent.y + pad,
      extent.z + 0.02
    );

    this._summaryText
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center);

    const border: Border = new Border().setChild(this._summaryText);
    const box: LayoutBox = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(border);

    const ui: UIElement = new UIElement();
    ui.anchorX = 0;
    ui.anchorY = 0;
    ui.position = pos;
    ui.scale = 1 / scale;
    ui.widget = box;
    this._obj.addUI(ui);
    return ui;
  }

  _findOrCreateZone(): Zone {
    const zoneId: string = "zone:" + this._obj.getId();
    let zone: Zone | undefined = world.getZoneById(zoneId);

    if (!zone) {
      const pos: Vector = this._obj.getPosition();
      pos.z = world.getTableHeight() + HEIGHT / 2;

      const scale: Vector = this._obj.getExtent(false, false).multiply(2);
      scale.x = scale.x - 0.1; // inset slightly to prefent "z fighting" on edges
      scale.y = scale.y - 0.1;
      scale.z = HEIGHT;

      const playerSlot: number = this._obj.getOwningPlayerSlot();
      const color: Color =
        TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
      color.a = 0.1;

      zone = world.createZone(pos);
      zone.setColor(color);
      zone.setId(zoneId);
      zone.setScale(scale);
      zone.setSlotOwns(playerSlot, true);
      zone.setStacking(ZonePermission.Nobody);
      zone.setObjectVisibility(ZonePermission.Everybody);
      zone.setInserting(ZonePermission.Everybody);
    }

    zone.setAlwaysVisible(false);
    return zone;
  }

  _getSystemTileHome(): GameObject | undefined {
    const playerSlot: number = this._obj.getOwningPlayerSlot();
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (faction) {
      return faction.getHomeSystemTileObj(playerSlot);
    }
    return undefined;
  }

  _getSystemTileLastActivated(): GameObject | undefined {
    return this._lastActivatedSystemTileObj;
  }

  _getProduceAndConsume(): { produce: BuildProduce; consume: BuildConsume } {
    // CombatRoll finds and applies unit modifiers.
    const combatRoll: CombatRoll = CombatRoll.createCooked({
      rollType: "production",
      hex: "<0,0,0>",
      activatingPlayerSlot: this._obj.getOwningPlayerSlot(),
      rollingPlayerSlot: this._obj.getOwningPlayerSlot(),
    });
    const objs: Array<GameObject> = this._zone.getOverlappingObjects();
    const produce = new BuildProduce(objs, combatRoll.self.unitAttrsSet);
    const consume = new BuildConsume(objs, combatRoll.getUnitModifierNames());
    return { produce, consume };
  }

  _warpToHome() {
    const { produce } = this._getProduceAndConsume();
    const home: GameObject | undefined = this._getSystemTileHome();
    if (home) {
      produce.moveToSystemTile(home);
    }
  }

  _warpToLastActivated() {
    const { produce } = this._getProduceAndConsume();
    const lastActivated: GameObject | undefined =
      this._getSystemTileLastActivated();
    if (lastActivated) {
      produce.moveToSystemTile(lastActivated);
    }
  }

  getSummary(): string {
    const { produce, consume } = this._getProduceAndConsume();

    const cost: number = produce.getCost();
    const spend: string = consume.getTotalValueWithModifiers();
    const unitCount: number = produce.getPlasticCount();

    return `Cost: ${cost}   Resources: ${spend}  #Units: ${unitCount}`;
  }

  togglePrivacyMode(): this {
    const oldIsPrivate: boolean = this._zone.isAlwaysVisible();
    const newIsPrivate: boolean = !oldIsPrivate;

    this._zone.setAlwaysVisible(newIsPrivate);
    this._zone.setObjectVisibility(
      newIsPrivate ? ZonePermission.OwnersOnly : ZonePermission.Everybody
    );

    this._ui.players = new PlayerPermission().setPlayerSlots(
      newIsPrivate ? [this._obj.getOwningPlayerSlot()] : []
    );
    this._obj.updateUI(this._ui);

    return this;
  }

  update() {
    const summary: string = this.getSummary();
    this._summaryText.setText(summary);
  }

  report() {
    const { produce, consume } = this._getProduceAndConsume();

    const playerSlot: number = this._obj.getOwningPlayerSlot();
    const name: string = TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);

    const msg: string =
      name +
      " " +
      [
        produce.report(),
        consume.report(),
        `#Units: ${produce.getPlasticCount()}`,
      ].join("\n");
    Broadcast.chatAll(msg, color);
  }
}

export function delayedCreateBuildArea(
  obj: GameObject,
  executionReason: string
): void {
  if (executionReason !== "unittest") {
    process.nextTick(() => {
      new BuildArea(obj);
    });
  }
}
delayedCreateBuildArea(refObject, GameWorld.getExecutionReason());
