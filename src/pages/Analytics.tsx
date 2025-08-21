import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { itemService, AnalyticsData } from "../services/item.service";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, IndianRupee, Calendar, Loader2 } from "lucide-react";

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await itemService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const liveStats = data
    ? [
        {
          title: "Today",
          value: `₹${data.today.toLocaleString()}`,
          icon: BarChart3,
          color: "text-muted-foreground",
          path: "/today",
        },
        {
          title: "This Week",
          value: `₹${data.week.toLocaleString()}`,
          icon: TrendingUp,
          color: "text-accent",
          path: "/week",
        },
        {
          title: "This Month",
          value: `₹${data.month.toLocaleString()}`,
          icon: Calendar,
          color: "text-secondary",
          path: "/month",
        },
        {
          title: "Overall",
          value: `₹${data.overall.toLocaleString()}`,
          icon: IndianRupee,
          color: "text-primary",
          path: "/overall",
        },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः" - Where there is wisdom, there is prosperity
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {liveStats.map((stat, index) => (
            <Card
              key={index}
              onClick={() => navigate(stat.path)}
              className="p-6 hover:shadow-warm transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Blessing */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          Gain insights into your spending patterns with divine wisdom
        </p>
      </div>
    </div>
  );
};

export default Analytics;
