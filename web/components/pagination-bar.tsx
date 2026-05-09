"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

type PaginationBarProps = {
  totalPages: number;
  currentPage: number;
  basePath: string;
};

function buildHref(
  basePath: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const next = new URLSearchParams(searchParams.toString());
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function PaginationBar({
  totalPages,
  currentPage,
  basePath,
}: PaginationBarProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - windowSize && p <= currentPage + windowSize)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pl-2"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link
                href={buildHref(basePath, searchParams, currentPage - 1)}
                scroll={false}
              >
                <ChevronLeftIcon data-icon="inline-start" />
                <span className="hidden sm:inline">Précédent</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 opacity-50">
                <ChevronLeftIcon data-icon="inline-start" />
                <span className="hidden sm:inline">Précédent</span>
              </span>
            )}
          </Button>
        </PaginationItem>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <Button
                variant={p === currentPage ? "outline" : "ghost"}
                size="icon"
                asChild
              >
                <Link
                  href={buildHref(basePath, searchParams, p)}
                  scroll={false}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </Link>
              </Button>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pr-2"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link
                href={buildHref(basePath, searchParams, currentPage + 1)}
                scroll={false}
              >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRightIcon data-icon="inline-end" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 opacity-50">
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRightIcon data-icon="inline-end" />
              </span>
            )}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
