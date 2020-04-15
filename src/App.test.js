import React from "react";
import { cleanup, render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  afterEach(cleanup);

  test("empty", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
