export type UpdatorTimerType = {
  seconds: number; // current value
  anchorTimestamp: number; // timestamp when started
  anchorSeconds: number; // value when started
  direction: -1 | 0 | 1; // [-1, 0, 1]
  countDown: number;
};
