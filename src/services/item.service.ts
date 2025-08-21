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
  message?: string;
  data: T;
}

export interface AnalyticsData {
  today: number;
  week: number;
  month: number;
  overall: number;
}

export interface TodayItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalprice: number;
  createdAt: string;
}

export interface TodayData {
  data: TodayItem[];
  total: number;
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

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await api.get<ApiResponse<AnalyticsData>>("/item/analytics");
      return res.data.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to fetch analytics");
    }
  }


  async getToday() {
    try {
      const res = await api.get<TodayData>(`/item/today`);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to fetch data");
    }
  }
}

export const itemService = new ItemService();
