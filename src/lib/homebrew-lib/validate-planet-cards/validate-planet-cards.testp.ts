import { ValidatePlanetCards } from "./validate-planet-cards";

function go() {
  const errors: Array<string> = [];
  new ValidatePlanetCards().getErrors(errors);
  console.log("Errors:\n", errors.join("\n"));
}

process.nextTick(go);
