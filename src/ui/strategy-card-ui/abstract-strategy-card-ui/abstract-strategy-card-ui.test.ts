import { Widget } from "@tabletop-playground/api";
import { clickAll } from "ttpg-mock";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { AbstractStrategyCardUI } from "./abstract-strategy-card-ui";
import { ButtonUI } from "../../button-ui/button-ui";

class MyAbstractStrategyCardUI extends AbstractStrategyCardUI {
  getReport(): string | undefined {
    return "report";
  }
}

class MyAbstractStrategyCardUINoReport extends AbstractStrategyCardUI {}

it("constructor/destroy", () => {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = true;
  const body: AbstractUI | undefined = new ButtonUI(scale);
  new MyAbstractStrategyCardUI(scale, name, isPlay, body).destroy();
});

it("getReport 1", () => {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = true;
  const body: AbstractUI | undefined = undefined;
  new MyAbstractStrategyCardUI(scale, name, isPlay, body).getReport();
});

it("getReport 2", () => {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = true;
  const body: AbstractUI | undefined = undefined;
  new MyAbstractStrategyCardUINoReport(scale, name, isPlay, body).getReport();
});

it("click all (play)", () => {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = true;
  const body: AbstractUI | undefined = undefined;
  const widget: Widget = new MyAbstractStrategyCardUI(
    scale,
    name,
    isPlay,
    body
  ).getWidget();
  clickAll(widget);
});

it("click all (follow)", () => {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = false;
  const body: AbstractUI | undefined = undefined;
  const widget: Widget = new MyAbstractStrategyCardUI(
    scale,
    name,
    isPlay,
    body
  ).getWidget();
  clickAll(widget);
});
