import ProductHomeCard from "../ui/ProductCard";
import { ProductsService } from "../../services/productSetUp";
import { useState, useEffect } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import type { ProductResponse } from "../../services/productSetUp";
import type { Filters } from "../pages/shop";

interface ProductsProps {
  limit?: number;
  category?: string;
  random?: boolean;
  search?: string;
  filters?: Filters;
}

export default function Products({
  limit,
  category,
  random = false,
  search,
  filters,
}: ProductsProps) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data:ProductResponse[] = await ProductsService.getProducts();
        let displayedProducts = [...data];
        
        if (category || filters?.category) {
          const cat = filters?.category || category || "";
          displayedProducts = displayedProducts.filter(p =>
            p?.category?.name?.toLowerCase().includes(cat.toLowerCase())
          );
        }

        if (filters?.size) {
          displayedProducts = displayedProducts.filter(p =>
            p?.size?.toUpperCase() === filters.size.toUpperCase()
          );
        }

        if (filters?.price) {
          const [minStr, maxStr] = filters.price.replace(/\$/g, "").split("-").map(s => s.trim());
          const min = parseFloat(minStr);
          const max = parseFloat(maxStr);
          displayedProducts = displayedProducts.filter(p => p.price >= min && p.price <= max);
        }

        if (filters?.rating) {
          const minRating = parseFloat(filters.rating.replace("+", ""));
          displayedProducts = displayedProducts.filter(p => (p?.rating ?? 0) >= minRating);
        }

        if (filters?.color) {
          displayedProducts = displayedProducts.filter(p =>
            p?.color?.toLowerCase() === filters.color.toLowerCase()
          );
        }

        if (search) {
          const q = search.toLowerCase();
          displayedProducts = displayedProducts.filter(p =>
            p?.name?.toLowerCase().includes(q) ||
            p?.category?.name?.toLowerCase().includes(q) ||
            p?.description?.toLowerCase().includes(q)
          );
        }
        
        if (random) {
          displayedProducts = displayedProducts.sort(() => Math.random() - 0.5);
        }
        
        if (limit) {
          displayedProducts = displayedProducts.slice(0, limit);
        }
        
        setProducts(displayedProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, category, random, search, filters?.category, filters?.price, filters?.size, filters?.color, filters?.rating]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-4">
      {products.map((product, index) => (
        <ProductHomeCard
          key={`${product._id}-${index}`}
          id={product._id}
          name={product.name}
          price={product.price}
          images={product.Images}
          category={product.category.name}
          breadcrumb=""
          description=""
          availability={product.inStock ? "In Stock" : "Out of Stock"}
          sku={product._id}
        />
      ))}
    </div>
  );
}
