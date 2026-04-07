import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ProductsService, type ProductResponse } from "../../services/productSetUp";
import { useLocale } from "../../context/LocaleContext";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export default function SearchBar({ placeholder = "Search...", className = "", inputClassName = "" }: SearchBarProps) {
  const navigate = useNavigate();
  const { formatPrice } = useLocale();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductResponse[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all products once on mount
  useEffect(() => {
    ProductsService.getProducts()
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filterProducts = useCallback((term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const lower = term.toLowerCase();
    const matched = allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category?.name?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      )
      .slice(0, 6);
    setSuggestions(matched);
    setIsOpen(matched.length > 0);
    setLoading(false);
  }, [allProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => filterProducts(val), 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/Shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (product: ProductResponse) => {
    setQuery(product.name);
    setIsOpen(false);
    navigate(`/product/${product._id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center bg-white rounded-full px-4 py-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`flex-1 outline-none text-sm text-gray-700 bg-transparent ${inputClassName}`}
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={clearSearch} className="mr-1 text-gray-400 hover:text-gray-600">
            <FaTimes className="text-xs" />
          </button>
        )}
        <button type="submit">
          <FaSearch className={`text-sm cursor-pointer transition-colors ${loading ? "text-blue-400 animate-pulse" : "text-gray-500 hover:text-blue-600"}`} />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] max-h-[420px] overflow-y-auto">
          {suggestions.map((product, index) => (
            <li
              key={product._id}
              onMouseDown={() => handleSelect(product)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                activeIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              {/* Product image */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {product.Images?.[0] && (
                  <img
                    src={product.Images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-400 capitalize">{product.category?.name}</p>
              </div>

              {/* Price */}
              <span className="text-sm font-bold text-blue-600 shrink-0">
                {formatPrice(
                  product.priceUSD ?? product.price,
                  product.priceEUR ?? product.price * 0.92,
                  product.priceRWF ?? product.price * 1300,
                )}
              </span>
            </li>
          ))}

          {/* View all results */}
          <li
            onMouseDown={handleSubmit as any}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-100 transition-colors"
          >
            <FaSearch className="text-xs" />
            See all results for &quot;{query}&quot;
          </li>
        </ul>
      )}
    </div>
  );
}
