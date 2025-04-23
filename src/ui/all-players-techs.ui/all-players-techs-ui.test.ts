import { AllPlayersTechsUI } from "./all-players-techs-ui";

it("constructor", () => {
  const scale: number = 1;
  const gameData = {
    players: [
      {
        name: "my-name",
        technologies: ["Antimass Deflectors"],
      },
    ],
  };
  new AllPlayersTechsUI(scale, gameData);
});

it("constructor (empty)", () => {
  const scale: number = 1;
  const gameData = {
    players: [{}],
  };
  new AllPlayersTechsUI(scale, gameData);
});
