export type UpdatorPlayerPlanetTotalsType = {
  influence: { avail: number; total: number };
  resources: { avail: number; total: number };
  techs: { blue: number; red: number; green: number; yellow: number };
  traits: { cultural: number; hazardous: number; industrial: number };
  legendary: number;
  numPlanets: number;
};
