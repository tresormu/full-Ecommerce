import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "../../services/productSetUp";
import Layout from "../layouts/layout";
import ProductHomeCard from "../ui/ProductCard";

export default function CategoriesWeb() {
  const { name } = useParams<{ name: string }>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ProductsService.getProducts,
  });

  const categoryProducts = products.filter(
    (p) => p.category?.name?.toLowerCase() === name?.toLowerCase()
  );

  return (
    <Layout>
      <div className="bg-gray-100 text-center py-14">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{name}</h1>
        <p className="text-gray-500 mt-2">{categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductHomeCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                images={product.Images}
                category={product.category.name}
                breadcrumb=""
                description=""
                sku=""
                availability={product.inStock ? "In Stock" : "Out of Stock"}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
