import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/(unauthenticated)/forgot-password/page";

test("Forgot Password Page", () => {
  const { container } = render(<Page />);
  expect(container).toBeDefined();
});
