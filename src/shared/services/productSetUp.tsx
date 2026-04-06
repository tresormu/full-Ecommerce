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

export const ProductsService = {
  // GET all users
  getProducts: async (): Promise<ProductResponse[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  // GET single user
  getProduct: async (id: string): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // POST create user
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
    return response.data;
  },
  updateProduct: async (
    id: string,
    ProductData: Partial<{ name: string; email: string; role: string }>,
  ) => {
    const response = await api.put(`/product/${id}`, ProductData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },
};
