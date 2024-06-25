export type GenericTokenType = {
  name: string;
  nsidName: string;
  imgBack?: boolean;
  modelScale?: number;
  model?: string; // assets/Textures/token/${model}.obj
};

export const SOURCE_TO_GENERIC_TOKENS: Record<
  string,
  Array<GenericTokenType>
> = {
  base: [
    { name: "Custodians Token", nsidName: "custodians", modelScale: 2 },
    { name: "Fighter x1", nsidName: "fighter-1", modelScale: 0.8 },
    { name: "Fighter x3", nsidName: "fighter-3" },
    { name: "Infantry x1", nsidName: "infantry-1", modelScale: 0.8 },
    { name: "Infantry x3", nsidName: "infantry-3" },
    //{ name: "Naalu X", nsidName: "naalu-x" },
    //{ name: "Naalu Y", nsidName: "naalu-y" },
    { name: "Naalu Zero", nsidName: "naalu-zero", modelScale: 1.5 },
    { name: "Nekro Prediction", nsidName: "nekro-prediction", modelScale: 1.5 },
    {
      name: "Scoreboard",
      nsidName: "scoreboard",
      modelScale: 6.56,
      model: "scoreboard",
    },
    {
      name: "Tradegood/Commodity x1",
      nsidName: "tradegood-commodity-1",
      modelScale: 0.8,
      imgBack: true,
    },
    {
      name: "Tradegood/Commodity x3",
      nsidName: "tradegood-commodity-3",
      imgBack: true,
    },
  ],
  pok: [],
  "codex.vigil": [],
};
