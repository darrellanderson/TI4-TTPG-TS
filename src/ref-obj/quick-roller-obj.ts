import {
  Border,
  Button,
  Canvas,
  Color,
  GameObject,
  Player,
  refObject,
  Rotator,
  UIElement,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  ColorLib,
  DiceGroup,
  DiceGroupParams,
  DiceResult,
} from "ttpg-darrell";

const WAIT_MSECS_BEFORE_ROLL = 2500;

class QuickRoller {
  private readonly _obj: GameObject;
  private readonly _buttons: Array<Button> = [];
  private readonly _borders: Array<Border> = [];
  private readonly _rollButton: Button;

  private _value: number = 5;
  private _diceGroupParams: DiceGroupParams | undefined;
  private _pendingRollHandle: NodeJS.Timeout | undefined;

  constructor(gameObject: GameObject) {
    this._obj = gameObject;

    const scale: number = 8;
    const w: number = 95 * scale;
    const h: number = w;
    const buttonW: number = 15 * scale;
    const buttonH: number = buttonW;
    const canvas: Canvas = new Canvas();

    const ui = new UIElement();
    ui.useWidgetSize = false;
    ui.width = w;
    ui.height = h;
    ui.position = new Vector(0, 0, 0.24);
    ui.rotation = new Rotator(0, 0, 0);
    ui.scale = 1 / scale;
    ui.widget = canvas;
    gameObject.addUI(ui);

    const r: number = (w / 2 - buttonW / 2) * 0.95;
    for (let i = 1; i <= 10; i++) {
      const phi: number = (Math.PI / 5) * i;
      const x: number = Math.sin(phi) * r + w / 2 - buttonW / 2;
      const y: number = -Math.cos(phi) * r + h / 2 - buttonH / 2;
      const button: Button = new Button().setFontSize(60).setText(i.toString());
      button.onClicked.add((_button: Button, player: Player): void => {
        this.onClickedValue(i, player);
      });
      this._buttons.push(button);

      const border: Border = new Border().setChild(button);
      this._borders.push(border);

      canvas.addChild(border, x, y, buttonW, buttonH);
    }

    const s: number = w * 0.4;
    this._rollButton = new Button().setFontSize(140).setText("@");
    this._rollButton.onClicked.add((_button: Button, player: Player): void => {
      this.onClickedRoll(player);
    });
    canvas.addChild(this._rollButton, w / 2 - s / 2, h / 2 - s / 2, s, s);

    this.update();
  }

  update() {
    const colorLib: ColorLib = new ColorLib();
    this._buttons.forEach((button, i) => {
      const active: boolean = this._value === i + 1;
      button.setEnabled(!active);
    });

    this._borders.forEach((border, i) => {
      const active: boolean = this._value === i + 1;
      const colorHex: string = active ? "#ff0000" : "#000000";
      const color: Color = colorLib.parseColorOrThrow(colorHex);
      border.setColor(color);
    });

    if (this._diceGroupParams) {
      const count: number = this._diceGroupParams.diceParams.length;
      this._rollButton.setText(`x${count}`);
    } else {
      this._rollButton.setText("@");
    }
  }

  onClickedValue(value: number, _player: Player) {
    this._value = value;
    this.update();
  }

  onClickedRoll(player: Player) {
    if (!this._diceGroupParams) {
      this._diceGroupParams = {
        callback: (
          diceResults: Array<DiceResult>,
          rollingPlayer: Player
        ): void => {
          this.onRollFinished(diceResults, rollingPlayer);
        },
        diceParams: [],
        player,
        position: this._obj.getPosition(),
      };
    }
    this._diceGroupParams.diceParams.push({
      sides: 10,
      hit: this._value,
    });

    if (this._pendingRollHandle) {
      clearTimeout(this._pendingRollHandle);
      this._pendingRollHandle = undefined;
    }
    this._pendingRollHandle = setTimeout(() => {
      this._pendingRollHandle = undefined;
      this.doRoll(player);
    }, WAIT_MSECS_BEFORE_ROLL);

    this.update();
  }

  doRoll(_player: Player) {
    if (this._diceGroupParams) {
      DiceGroup.roll(this._diceGroupParams);
      this._diceGroupParams = undefined;
    }
    this.update();
  }

  onRollFinished(dice: Array<DiceResult>, player: Player) {
    console.log("onRollFinished");

    const firstResult: DiceResult | undefined = dice[0];
    const value: number = firstResult?.diceParams.hit ?? 0;

    const formatted: Array<string> = [];
    let hits: number = 0;
    dice.forEach((die) => {
      formatted.push(DiceGroup.format(die));
      if (die.hit) {
        hits += 1;
      }
    });

    const playerName: string = TI4.playerName.getByPlayer(player);
    const color: Color = world.getSlotColor(player.getSlot());
    const summary: string = `${playerName} rolled ${hits} hits (need ${value}): ${formatted.join(
      ", "
    )}`;
    Broadcast.broadcastAll(summary, color);
  }
}

const obj: GameObject = refObject;
process.nextTick((): void => {
  new QuickRoller(obj);
});
