import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ShopSidebar from "../layouts/ShopSidebar";
import Layout from "../layouts/layout";
import Products from "../ui/products";

export interface Filters {
  category: string;
  price: string;
  color: string;
  size: string;
  rating: string;
}

const defaultFilters: Filters = {
  category: "",
  price: "",
  color: "",
  size: "",
  rating: "",
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const query = searchParams.get("q") || "";
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  return (
    <Layout>
      {query && (
        <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-gray-500">
          {t("blog.search")}:{" "}
          <span className="font-semibold text-gray-800">{query}</span>
        </div>
      )}
      <ShopSidebar filters={filters} onFilterChange={updateFilter} />
      <div className="px-4 lg:px-8 mt-4">
        <Products search={query} filters={filters} />
      </div>
    </Layout>
  );
}
