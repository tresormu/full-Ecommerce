// services/userService.ts
import api from "./ApiSetter";
export interface Category {
  _id: string;
  name: string;
  __v: number;
}

export interface ProductResponse {
  _id: string;
  name: string;
  price: number;
  priceUSD: number;
  priceEUR: number;
  priceRWF: number;
  oldPrice?: number;
  description?: string;
  size?: "S" | "M" | "L" | "XL" | "XXL";
  color?: string;
  rating?: number;
  Images: string[];
  category: Category;
  createdBy: string;
  inStock: boolean;
  __v: number;
}

let cachedProducts: ProductResponse[] | null = null;
let productsCacheTimestamp = 0;
let productsRequestPromise: Promise<ProductResponse[]> | null = null;
const PRODUCTS_CACHE_TTL = 3 * 60 * 1000; // keep cached product list for 3 minutes

const normalizeProducts = (data: unknown): ProductResponse[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray((data as any).products)) return (data as any).products;
    if (Array.isArray((data as any).data)) return (data as any).data;
  }
  return [];
};

export const ProductsService = {
  clearCache: () => {
    cachedProducts = null;
    productsCacheTimestamp = 0;
    productsRequestPromise = null;
  },

  // GET all products
  getProducts: async (): Promise<ProductResponse[]> => {
    const now = Date.now();
    if (cachedProducts && now - productsCacheTimestamp < PRODUCTS_CACHE_TTL) {
      return cachedProducts;
    }

    if (productsRequestPromise) {
      return productsRequestPromise;
    }

    productsRequestPromise = (async () => {
      try {
        const response = await api.get("/products");
        const products = normalizeProducts(response.data);
        cachedProducts = products;
        productsCacheTimestamp = Date.now();
        return products;
      } finally {
        productsRequestPromise = null;
      }
    })();

    return productsRequestPromise;
  },

  // GET single product
  getProduct: async (id: string): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // POST create product
  createProduct: async (ProductData: {
    name: string;
    price: number;
    Images: string[];
    category: string;
    createdBy: string;
    inStock: boolean;
    size?: string;
    color?: string;
    rating?: number;
  }) => {
    const response = await api.post("/products", ProductData);
    ProductsService.clearCache();
    return response.data;
  },
  updateProduct: async (
    id: string,
    ProductData: Partial<{ name: string; email: string; role: string }>,
  ) => {
    const response = await api.put(`/product/${id}`, ProductData);
    ProductsService.clearCache();
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    ProductsService.clearCache();
    return response.data;
  },
};
