import { AbstractCopyCards } from "./abstract-copy-cards";

const copyCards: AbstractCopyCards = new AbstractCopyCards("action");

console.log(JSON.stringify(copyCards.getCreateCardsheetParams(), null, 2));
