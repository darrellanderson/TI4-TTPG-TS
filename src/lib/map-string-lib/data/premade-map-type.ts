export type PremadeMapType = {
  playerCount: number;
  name: string;
  mapString: string;

  attributes?: string;
  sliceNames?: Array<string>; // ["name1", "name2", ...] clockwise from SE
  author?: string;
  comments?: string;
  difficulty?: string;
};
