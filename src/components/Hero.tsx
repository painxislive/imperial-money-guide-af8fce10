import { Search, TrendingUp, BookOpen, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Hero = () => {
  const quickActions = [
    { icon: BookOpen, label: "Browse Articles", count: "2,500+" },
    { icon: TrendingUp, label: "Market Analysis", count: "Daily" },
    { icon: Calculator, label: "Calculators", count: "15+" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 finance-gradient rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 success-gradient rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 hero-gradient rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-success-light text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>Trusted by 100,000+ Finance Professionals</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Your Complete
            <span className="block bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
              Finance Encyclopedia
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Master finance with comprehensive articles, real-time market insights, and powerful calculators. 
            From basic concepts to advanced strategies.
          </p>

          {/* Hero Search */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for any finance term... (e.g., compound interest, ROI, stocks)"
                className="w-full h-14 pl-12 pr-32 text-lg bg-card shadow-finance-strong border-0 rounded-2xl focus:shadow-glow transition-finance"
              />
              <Button className="absolute right-2 top-2 h-10 px-6 finance-gradient hover:shadow-glow transition-finance">
                Search
              </Button>
            </div>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Compound Interest", "Stock Market", "Cryptocurrency", "Investment", "Loans"].map((term) => (
                <button
                  key={term}
                  className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-finance"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="p-6 card-gradient border-0 shadow-finance hover:shadow-finance-strong transition-finance cursor-pointer group">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 finance-gradient rounded-xl group-hover:shadow-glow transition-finance">
                    <action.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.label}</h3>
                    <p className="text-muted-foreground text-sm">{action.count} resources</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;