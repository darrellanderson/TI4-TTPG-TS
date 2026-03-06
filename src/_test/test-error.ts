function bar(): void {
  throw new Error("bar error");
}

function foo(): void {
  bar();
}

foo();
