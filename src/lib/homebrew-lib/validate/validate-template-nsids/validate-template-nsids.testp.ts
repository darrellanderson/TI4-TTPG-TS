import { ValidateTemplateNsids } from "./validate-template-nsids";

function go() {
  const errors: Array<string> = [];
  new ValidateTemplateNsids().getErrors(errors);
  console.log("Errors:\n", errors.join("\n"));
}

process.nextTick(go);
