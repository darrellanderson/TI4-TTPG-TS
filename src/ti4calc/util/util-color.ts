import _times from "lodash/times";
function hexStringToDec(s: string) {
  return parseInt(s, 16);
}

function decToHexColor(s: number) {
  const result = s.toString(16);
  if (result.length === 1) {
    return `0${result}`;
  } else {
    return result;
  }
}

function breakUpHexColor(h: string): [number, number, number] {
  if (h.length === 4) {
    const r = h[1];
    const g = h[2];
    const b = h[3];
    if (!r || !g || !b) {
      throw new Error(`Invalid hex color: ${h}`);
    }
    return [
      hexStringToDec(r + r),
      hexStringToDec(g + g),
      hexStringToDec(b + b),
    ];
  } else if (h.length === 7) {
    const r1 = h[1];
    const r2 = h[2];
    const g1 = h[3];
    const g2 = h[4];
    const b1 = h[5];
    const b2 = h[6];
    if (!r1 || !r2 || !g1 || !g2 || !b1 || !b2) {
      throw new Error(`Invalid hex color: ${h}`);
    }
    return [
      hexStringToDec(r1 + r2),
      hexStringToDec(g1 + g2),
      hexStringToDec(b1 + b2),
    ];
  } else {
    throw new Error(`Invalid hex color: ${h}`);
  }
}

function getStepsBetweenNumber(
  start: number,
  finish: number,
  steps: number
): number[] {
  if (steps === 1) {
    return [start];
  }

  const diff = finish - start;
  return _times(steps, (index) => {
    const progress = index / (steps - 1);
    const result = start + diff * progress;
    return Math.floor(result);
  });
}

export const getColorProgress = (
  start: string,
  finish: string,
  steps: number
) => {
  const startColors = breakUpHexColor(start);
  const finishColors = breakUpHexColor(finish);

  const a = getStepsBetweenNumber(startColors[0], finishColors[0], steps);
  const b = getStepsBetweenNumber(startColors[1], finishColors[1], steps);
  const c = getStepsBetweenNumber(startColors[2], finishColors[2], steps);

  return _times(steps, (index) => {
    const aVal = a[index];
    const bVal = b[index];
    const cVal = c[index];
    if (aVal === undefined || bVal === undefined || cVal === undefined) {
      throw new Error(`Invalid color index ${index}`);
    }
    return `#${decToHexColor(aVal)}${decToHexColor(bVal)}${decToHexColor(cVal)}`;
  });
};
