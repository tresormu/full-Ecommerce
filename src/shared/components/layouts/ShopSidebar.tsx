import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaTshirt, FaDollarSign, FaPalette, FaRulerHorizontal, FaStar, FaTimes } from "react-icons/fa";
import type { Filters } from "../pages/shop";

const filters: { key: keyof Filters; title: string; icon: React.ReactNode; items: string[] }[] = [
  { key: "category", title: "Category", icon: <FaTshirt />, items: ["men", "women", "shoes", "bags", "watches", "jewelleries", "Accessories", "dresses", "tops", "jeans", "nightwear", "trousers"] },
  { key: "price", title: "Price", icon: <FaDollarSign />, items: ["$0 - $50", "$50 - $100", "$100 - $200", "$200 - $500"] },
  { key: "color", title: "Color", icon: <FaPalette />, items: ["Red", "Blue", "Green", "Black", "White"] },
  { key: "size", title: "Size", icon: <FaRulerHorizontal />, items: ["S", "M", "L", "XL", "XXL"] },
  { key: "rating", title: "Rating", icon: <FaStar />, items: ["1+", "2+", "3+", "4+", "5"] },
];

interface Props {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export default function ShopSidebar({ filters: selected, onFilterChange }: Props) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasActive = Object.values(selected).some(Boolean);

  return (
    <div ref={ref} className="w-full bg-white px-4 lg:px-8 py-4">
      {/* blue growing accent bar */}
      <div className="h-1 bg-blue-600 rounded-full mb-4 transition-all duration-500 ml-auto" style={{ width: hasActive ? "100%" : "4rem" }} />

      <div className="flex flex-wrap items-center justify-end gap-2">
        {filters.map((filter, index) => {
          const isOpen = openIndex === index;
          const activeValue = selected[filter.key];

          return (
            <div key={filter.key} className="relative">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${activeValue
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <span className="text-xs">{filter.icon}</span>
                {activeValue ? `${t(`product.${filter.key}`)}: ${activeValue}` : t(`product.${filter.key}`)}
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <ul className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 z-[999] bg-white border border-gray-100 rounded-xl shadow-xl py-1 min-w-[150px] max-w-[calc(100vw-2rem)]">
                  {filter.items.map((item) => (
                    <li
                      key={item}
                      onClick={() => { onFilterChange(filter.key, item); setOpenIndex(null); }}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors
                        ${selected[filter.key] === item
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        {hasActive && (
          <button
            onClick={() => filters.forEach((f) => selected[f.key] && onFilterChange(f.key, selected[f.key]))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <FaTimes className="text-xs" />
            {t('common.clearAll')}
          </button>
        )}
      </div>
    </div>
  );
}
