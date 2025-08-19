import api from "./api";

// -----------------------------
// Core Item Types
// -----------------------------
export interface Item {
  id?: number;   // local UI id
  _id?: string;  // MongoDB id from backend
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ApiItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  totalprice: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// -----------------------------
// Item Service
// -----------------------------
class ItemService {
  async createItems(items: Item[]): Promise<ApiItem[]> {
    try {
      const response = await api.post<ApiResponse<ApiItem[]>>(
        "/item/create",
        {
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalprice: item.total,
          })),
        },
      );

      // unwrap `data`
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create items");
    }
  }

}

export const itemService = new ItemService();
