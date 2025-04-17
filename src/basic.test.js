/** @format */

describe("Basic tests", () => {
  test("true is true", () => {
    expect(true).toBe(true);
  });

  test("numbers can be added", () => {
    expect(1 + 1).toBe(2);
  });

  test("strings can be concatenated", () => {
    expect("hello" + " world").toBe("hello world");
  });
});
