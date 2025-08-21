import { useEffect, useState } from "react";
import { itemService, TodayItem } from "../services/item.service";
import { Card } from "@/components/ui/card";
import { Loader2, ShoppingCart, IndianRupee } from "lucide-react";

const Today = () => {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // convert UTC string → IST string
  const toIST = (utc: string) => {
  const date = new Date(utc);
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await itemService.getToday();
        setItems(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error("Failed to load today items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Today’s Items
          </h1>
        </div>
        <p className="text-muted-foreground">
          "धनं गतं पुनः लभ्यते" – Wealth once spent can be earned again
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Items Table */}
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">₹{item.price}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{item.totalprice}
                      </td>
                      <td className="px-4 py-3">{toIST(item.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      No items recorded today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Card */}
          <Card className="mt-8 p-6 flex items-center justify-between">
            <p className="text-lg font-semibold">Total for Today</p>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <IndianRupee className="w-6 h-6" />
              {total}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Today;
