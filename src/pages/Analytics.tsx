import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, IndianRupee, Calendar } from 'lucide-react';

const Analytics = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Expenses',
      value: '₹12,450',
      change: '+12%',
      icon: IndianRupee,
      color: 'text-primary'
    },
    {
      title: 'This Month',
      value: '₹3,280',
      change: '+8%',
      icon: Calendar,
      color: 'text-secondary'
    },
    {
      title: 'Average Daily',
      value: '₹156',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      title: 'Categories',
      value: '8',
      change: '+2',
      icon: BarChart3,
      color: 'text-muted-foreground'
    }
  ];

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
          Gain insights into your spending patterns with divine wisdom
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-warm transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-primary mr-2" />
            Monthly Spending Trend
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chart visualization coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect to see detailed analytics
              </p>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-secondary mr-2" />
            Category Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <IndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pie chart coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                Visualize spending by categories
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-accent mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { item: 'Groceries', amount: '₹850', date: 'Today', category: 'Food' },
            { item: 'Fuel', amount: '₹1,200', date: 'Yesterday', category: 'Transport' },
            { item: 'Medicine', amount: '₹450', date: '2 days ago', category: 'Health' },
            { item: 'Electricity Bill', amount: '₹2,100', date: '3 days ago', category: 'Utilities' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div>
                <p className="font-medium text-foreground">{activity.item}</p>
                <p className="text-sm text-muted-foreground">{activity.date} • {activity.category}</p>
              </div>
              <p className="font-semibold text-primary">{activity.amount}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Blessing */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः" - Where there is wisdom, there is prosperity
        </p>
      </div>
    </div>
  );
};

export default Analytics;