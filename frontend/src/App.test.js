/** @format */

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // Just checking that the app renders without throwing
  expect(true).toBe(true);
});
