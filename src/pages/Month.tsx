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
} from "@/components/ui/select";

const Month = () => {
  const [items, setItems] = useState<TodayItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const toISTDate = (utc: string) => {
    const date = new Date(utc);
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toISTTime = (utc: string) => {
    const date = new Date(utc);
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedDate) {
        const res = await itemService.getByDate(selectedDate);
        setItems(res.data);
        setTotal(res.data.length);
        setTotalPrice(res.total);
      } else {
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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-5xl mx-auto p-3 animate-fade-in">
      {/* Viewport meta tag should be in your main HTML file */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> */}

      {/* Header */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            This Month's Items
          </h1>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Track all your expenses for this month
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Search - Top row */}
        <div className="flex w-full border rounded-lg overflow-hidden">
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
            className="px-3 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition min-w-[44px] min-h-[44px]"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Date and Items per page - Second row */}
        <div className="flex flex-col xs:flex-row gap-3">
          {/* Date input */}
          <div className="flex-1">
            <input
              type="date"
              value={selectedDate || ""}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setPage(1);
                setSelectedDate(e.target.value || null);
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          {/* Page size selector */}
          <div className="xs:min-w-[180px]">
            <Select
              value={limit.toString()}
              onValueChange={(val) => {
                setPage(1);
                setLimit(Number(val));
              }}
            >
              <SelectTrigger className="min-h-[44px] w-full">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
                <SelectItem value="100">100 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 animate-spin" />
        </div>
      ) : items.length > 0 ? (
        <>
          <Card className="mb-4 p-4 flex items-center justify-between">
            <p className="text-base font-semibold">
              {selectedDate
                ? `Total for ${selectedDate}`
                : search.trim()
                  ? "Total for Search"
                  : "Total for the Month"}
            </p>
            <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-primary">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
              {selectedDate || search.trim()
                ? items.reduce((sum, item) => sum + item.totalprice, 0)
                : totalPrice}
            </div>
          </Card>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-2 sm:px-3 sm:py-2">Name</th>
                  <th className="p-2 sm:px-3 sm:py-2">Price</th>
                  <th className="p-2 sm:px-3 sm:py-2">Qty</th>
                  <th className="p-2 sm:px-3 sm:py-2">Total</th>
                  <th className="p-2 sm:px-3 sm:py-2">Date</th>
                  <th className="p-2 sm:px-3 sm:py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-muted/40 transition"
                  >
                    <td className="p-2 sm:px-3 sm:py-2 font-medium whitespace-normal break-words">
                      {item.name}
                    </td>
                    <td className="p-2 sm:px-3 sm:py-2">₹{item.price}</td>
                    <td className="p-2 sm:px-3 sm:py-2">{item.quantity}</td>
                    <td className="p-2 sm:px-3 sm:py-2 font-semibold">
                      ₹{item.totalprice}
                    </td>
                    <td className="p-2 sm:px-3 sm:py-2 whitespace-normal break-words">
                      {toISTDate(item.createdAt)}
                    </td>
                    <td className="p-2 sm:px-3 sm:py-2 whitespace-nowrap">
                      {toISTTime(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!selectedDate && (
            <div className="flex flex-col items-center justify-between mt-4 gap-3">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} ({total} items)
              </p>
              <div className="flex items-center gap-1 overflow-x-auto w-full justify-center">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 min-w-[60px] min-h-[44px] text-xs"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg min-w-[36px] min-h-[36px] text-xs ${page === pageNum
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 min-w-[60px] min-h-[44px] text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No items found.
        </div>
      )}

      <div className="text-center text-muted-foreground py-6 italic text-xs sm:text-sm">
        "धर्मो रक्षति रक्षितः" – Dharma protects those who protect it
      </div>
    </div>
  );
};

export default Month;