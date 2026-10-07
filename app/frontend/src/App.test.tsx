import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import { App } from "@/App";

test("resolves a table name through the api", async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>,
  );

  await userEvent.click(screen.getByRole("button"));

  expect(await screen.findByText("acme.silver.orders")).toBeInTheDocument();
});
