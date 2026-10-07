import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/** One page, wiring every piece once: Query calls the API, which calls the Python package. */
export function App() {
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["table"],
    queryFn: async () => {
      const res = await fetch("/api/table?catalog=acme&schema=silver&name=orders");
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      return (await res.json()) as { table: string };
    },
    enabled,
  });

  return (
    <main className="mx-auto flex max-w-md flex-col items-start gap-4 p-8">
      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <Database className="size-5" />
        project-name
      </h1>
      <Button onClick={() => setEnabled(true)} disabled={isFetching}>
        {isFetching ? "Resolving" : "Resolve a table name"}
      </Button>
      {data ? <p className="font-mono text-sm">{data.table}</p> : null}
    </main>
  );
}
