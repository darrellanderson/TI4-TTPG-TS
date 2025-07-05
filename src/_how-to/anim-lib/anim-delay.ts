export class AnimDelay {
  static simple(msecs: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, msecs);
    });
  }
}
