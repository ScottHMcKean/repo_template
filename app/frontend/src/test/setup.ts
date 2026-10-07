import "@testing-library/jest-dom/vitest";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

// The frontend is tested without a backend running. A request the handlers do not cover
// fails the test rather than reaching the network.
export const server = setupServer(
  http.get("/api/table", () => HttpResponse.json({ table: "acme.silver.orders" })),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
