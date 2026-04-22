import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageHref = (page: number) => {
    const separator = baseHref.includes("?") ? "&" : "?";
    return `${baseHref}${separator}page=${page}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10"
    >
      {currentPage > 1 && (
        <Link
          href={getPageHref(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      )}

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageHref(page)}
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-xl transition-colors",
              page === currentPage
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={getPageHref(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
