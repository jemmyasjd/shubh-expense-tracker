import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calculator, BarChart3, Plus } from 'lucide-react';
import gayatriMata from '@/assets/gayatri-mata-illustration.png';


const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-8 relative">
          <img
            src={gayatriMata}
            alt="Gayatri Mata"
            className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full shadow-glow border-4 border-primary/20"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-xl"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
          Gayatri Expense Tracker
        </h1>

        {/* <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Manage your finances with divine blessings. Track expenses, analyze spending patterns, 
          and achieve financial wisdom with the grace of Gayatri Mata.
        </p> */}

        <p className="text-xl md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          "ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gradient-primary shadow-warm">
            <Link to="/expenses">
              <Calculator className="mr-2 h-5 w-5" />
              Start Tracking
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
            <Link to="/analytics">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="p-6 text-center hover:shadow-warm transition-all duration-300 hover:scale-105">
          <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Calculator</h3>
          <p className="text-muted-foreground">
            Add multiple items dynamically with automatic calculations
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-warm transition-all duration-300 hover:scale-105">
          <BarChart3 className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            Visualize your spending patterns and financial insights
          </p>
        </Card>

        <Card className="p-6 text-center hover:shadow-warm transition-all duration-300 hover:scale-105">
          <Plus className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Dynamic Forms</h3>
          <p className="text-muted-foreground">
            Easily add and manage multiple expense entries
          </p>
        </Card>
      </div>

      {/* Blessing Quote */}
      <div className="mt-16 text-center">
        {/* <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
          "ॐ भूर् भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्"
        </blockquote> */}
        <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
          Manage your finances with divine blessings. Track expenses, analyze spending patterns,
          and achieve financial wisdom with the grace of Gayatri Mata.
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2">
          May divine wisdom guide your financial decisions
        </p>
      </div>
    </div>
  );
};

export default Welcome;