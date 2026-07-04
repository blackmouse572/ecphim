import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/(unauthenticated)/verify-email/page";

test("Verify Email Page", () => {
  const { container } = render(<Page />);
  expect(container).toBeDefined();
});
