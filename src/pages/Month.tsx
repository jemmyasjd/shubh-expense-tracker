import { useEffect, useState } from "react";
import { itemService, TodayItem } from "../services/item.service";
import { Card } from "@/components/ui/card";
import { Loader2, CalendarDays, IndianRupee, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Month = () => {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState(""); // 👈 for typing buffer
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Convert UTC → IST date string
  const toISTDate = (utc: string) => {
    const date = new Date(utc);
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Convert UTC → IST time string
  const toISTTime = (utc: string) => {
    const date = new Date(utc);
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch items (Month or Day API)
  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedDate) {
        // 👇 If a date is picked, call getByDate API
        const res = await itemService.getByDate(selectedDate);
        setItems(res.data);
        setTotal(res.data.length);
        setTotalPrice(res.total);
      } else {
        // 👇 Otherwise use Month API
        const res = await itemService.getThisMonth({
          page,
          limit,
          search,
          date: null,
        });
        setItems(res.data);
        setTotal(res.totalItems);
        setTotalPrice(res.totalPrice);
      }
    } catch (err) {
      console.error("Failed to load items", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, limit, selectedDate, search]);

  // Pagination values
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-5 animate-fade-in">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <CalendarDays className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            This Month’s Items
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track all your expenses for this month
        </p>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search with button */}
        <div className="flex flex-1 sm:max-w-xs border rounded-xl overflow-hidden">
          <input
            type="text"
            placeholder="Search item..."
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => {
              setPage(1);
              setSelectedDate(null);
              setSearch(pendingSearch);
            }}
            className="px-3 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Date + Items (mobile: one row, desktop: inline anyway) */}
        <div className="flex flex-row gap-3">
          {/* Date filter */}
          <input
            type="date"
            value={selectedDate || ""}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setPage(1);
              setSelectedDate(e.target.value || null);
            }}
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Page size dropdown */}
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setPage(1);
              setLimit(Number(val));
            }}
          >
            <SelectTrigger className="flex-1 sm:w-[150px]">
              <SelectValue placeholder="Select items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 items</SelectItem>
              <SelectItem value="50">50 items</SelectItem>
              <SelectItem value="100">100 items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>



      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <>
          <Card className="mb-5 p-5 flex items-center justify-between">
            <p className="text-lg font-semibold">
              {selectedDate
                ? `Total for ${selectedDate}`
                : search.trim()
                  ? "Total for Search"
                  : "Total for the Month"}
            </p>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
              {selectedDate || search.trim()
                ? items.reduce((sum, item) => sum + item.totalprice, 0)
                : totalPrice}
            </div>
          </Card>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
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
                    <td className="px-4 py-3">{toISTDate(item.createdAt)}</td>
                    <td className="px-4 py-3">{toISTTime(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!selectedDate && ( // 👈 Hide pagination if showing a single date
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} items)
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border rounded-lg ${page === num
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700"
                      }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          <br /> No items found.
        </div>
      )}
      <div className="text-center text-muted-foreground py-8 italic">
        "धर्मो रक्षति रक्षितः" – Dharma protects those who protect it
      </div>
    </div>
  );
};

export default Month;
