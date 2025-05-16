// {Array.{abbr:string,nsid:string,stage:number,progress:
// Object.{header:string,values:Array.{value:string|number,success:boolean}},
// scoredBy:Array.{number}}}
export type UpdatorObjectiveProgressType = {
  name: string;
  abbr: string;
  stage: number;
  progress: {
    header: string;
    values: Array<{ value: string | number | boolean; success: boolean }>;
    scoredBy: Array<number>;
  };
};
