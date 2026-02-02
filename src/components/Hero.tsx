import { Search, BookOpen, Calculator, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Hero = () => {
  const quickActions = [
    { icon: BookOpen, label: "Finance Guides", count: "500+", href: "/articles" },
    { icon: Calculator, label: "Calculators & Tools", count: "15+", href: "/tools" },
    { icon: FileText, label: "A-Z Glossary", count: "1,000+ terms", href: "/topics/a" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Imperialpedia
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            A Global Finance & Investing Knowledge Platform
          </p>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Clear, unbiased explanations of finance, investing, banking, taxation, insurance, 
            and economic concepts — built for a global audience.
          </p>

          {/* Hero Search */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search financial terms, guides, and calculators..."
                className="w-full h-14 pl-12 pr-32 text-lg bg-card shadow-lg border rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button className="absolute right-2 top-2 h-10 px-6 bg-primary hover:bg-primary/90 transition-colors">
                Search
              </Button>
            </div>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Compound Interest", "GDP", "Mutual Funds", "Inflation", "Bonds"].map((term) => (
                <Link
                  key={term}
                  to={`/articles?q=${encodeURIComponent(term)}`}
                  className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="p-6 bg-card border shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <action.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{action.label}</h3>
                      <p className="text-muted-foreground text-sm">{action.count}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
