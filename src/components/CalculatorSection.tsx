import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Home, PiggyBank, CreditCard, Percent, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CalculatorSection = () => {
  const calculators = [
    {
      icon: PiggyBank,
      title: "Compound Interest Calculator",
      description: "Calculate how your money grows over time with compound interest",
      category: "Savings"
    },
    {
      icon: Home,
      title: "Mortgage Calculator",
      description: "Calculate monthly payments, total interest, and amortization schedules",
      category: "Real Estate"
    },
    {
      icon: TrendingUp,
      title: "Investment Return Calculator",
      description: "Analyze potential returns on your investment portfolio",
      category: "Investing"
    },
    {
      icon: CreditCard,
      title: "Debt Payoff Calculator",
      description: "Plan your debt elimination strategy and save on interest",
      category: "Debt"
    },
    {
      icon: Percent,
      title: "Inflation Calculator",
      description: "Understand how inflation affects purchasing power over time",
      category: "Economics"
    },
    {
      icon: Calculator,
      title: "Retirement Calculator",
      description: "Plan for retirement with savings and withdrawal projections",
      category: "Retirement"
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Financial Calculators & Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Free tools to help you understand and plan your financial decisions
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, index) => (
            <Card key={index} className="group border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <calc.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {calc.category}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {calc.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {calc.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-between group/btn p-0 h-auto">
                  <span className="font-medium">Use Calculator</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/tools">
            <Button size="lg" variant="outline">
              View All Calculators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
