import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href && { item: `${process.env.NEXT_PUBLIC_SITE_URL || ""}${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            {item.href && idx < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
