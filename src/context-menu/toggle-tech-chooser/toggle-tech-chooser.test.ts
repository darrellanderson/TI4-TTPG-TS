import { ToggleTechChooser } from "./toggle-tech-chooser";

it("constructor", () => {
  new ToggleTechChooser().init();
});

it("_onTechChooserRequestHandler", () => {
  const toggleTechChooser = new ToggleTechChooser();
  toggleTechChooser.init();

  const playerSlot: number = 10;
  TI4.events.onTechChooserRequest.trigger(playerSlot);
  TI4.events.onTechChooserRequest.trigger(playerSlot); // again
});
