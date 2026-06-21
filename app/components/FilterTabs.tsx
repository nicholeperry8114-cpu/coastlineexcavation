import Link from "next/link";

type FilterTabsProps = {
  basePath: string;
  filters: string[];
  active: string;
};

export function FilterTabs({ basePath, filters, active }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Status filters">
      {filters.map((filter) => {
        const isActive = filter === active;
        const href = filter === "All" ? basePath : `${basePath}?status=${encodeURIComponent(filter)}`;

        return (
          <Link key={filter} href={href} className={`filter-tab ${isActive ? "filter-tab--active" : ""}`}>
            {filter}
          </Link>
        );
      })}
    </div>
  );
}
