"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";

export function EventSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(urlSearch);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.id === "event-search") {
        return;
      }
      setValue(urlSearch);
    }, 0);
    return () => window.clearTimeout(id);
  }, [urlSearch]);

  useEffect(() => {
    if (debounced === urlSearch) return;
    const next = new URLSearchParams(searchParams.toString());
    if (debounced) next.set("search", debounced);
    else next.delete("search");
    next.set("page", "1");
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [debounced, router, searchParams, urlSearch]);

  return (
    <div className="flex w-full flex-col gap-2 sm:max-w-md">
      <Label htmlFor="event-search" className="sr-only">
        Rechercher
      </Label>
      <div className="relative">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id="event-search"
          className="pl-9"
          placeholder="Rechercher par titre ou lieu…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
