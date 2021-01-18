const { FileLoader } = require("./FileLoader");

describe("FileLoader", () => {
  it("works", () => {
    const loader = new FileLoader([
      "../data/lsb-1yr.json",
      "../data/lsb-daily.json",
    ]);
  });
});
