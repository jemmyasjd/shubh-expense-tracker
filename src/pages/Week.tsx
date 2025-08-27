import { useEffect, useState } from "react";
import { itemService, TodayItem } from "../services/item.service";
import { Card } from "@/components/ui/card";
import { Loader2, CalendarDays, IndianRupee, Search } from "lucide-react";

const Week = () => {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TodayItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Convert UTC → IST date string (only date)
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

  // Generate current week dates (Mon → Today)
  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay(); // Sun=0, Mon=1...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const dates: string[] = [];
    for (let i = 0; i <= day - (day === 0 ? -6 : 1); i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(
        d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) // YYYY-MM-DD
      );
    }
    return dates;
  };

  const weekDates = getWeekDates();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await itemService.getThisWeek();
        setItems(res.data);
        setFilteredItems(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error("Failed to load week items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search + filter
  useEffect(() => {
    let data = items;

    if (selectedDate) {
      data = data.filter((item) =>
        new Date(item.createdAt).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        }) === selectedDate
      );
    }

    if (search.trim()) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredItems(data);
  }, [selectedDate, search, items]);

  // Group items by date
  const groupedItems = filteredItems.reduce((acc, item) => {
    const dateStr = toISTDate(item.createdAt);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(item);
    return acc;
  }, {} as Record<string, TodayItem[]>);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 animate-fade-in">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <CalendarDays className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            This Week’s Items
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          "कालः सर्वभक्षी" – Time devours everything, but wisdom and records remain
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        {/* Date Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {weekDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(selectedDate === date ? null : date)}
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${selectedDate === date
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              {new Date(date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Grouped Items */}
          {Object.keys(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(([date, items]) => (
              <div key={date} className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{date}</h2>
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
                          <td className="px-4 py-3">{toISTTime(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No items found this week
            </div>
          )}


          {/* Total Card */}
          <Card className="mt-6 p-5 flex items-center justify-between">
            <p className="text-lg font-semibold">
              {selectedDate ? `Total for ${selectedDate}` : search.trim() ? "Total for Search" : "Total for the Week"}
            </p>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
              {selectedDate || search.trim()
                ? filteredItems.reduce((sum, item) => sum + item.totalprice, 0)
                : total}
            </div>
          </Card>

        </>
      )}
    </div>
  );
};

export default Week;
