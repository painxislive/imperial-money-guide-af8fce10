import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Home, PiggyBank, CreditCard, Percent, ArrowRight } from "lucide-react";

const CalculatorSection = () => {
  const calculators = [
    {
      icon: PiggyBank,
      title: "Compound Interest Calculator",
      description: "Calculate how your money grows over time with compound interest",
      category: "Savings",
      popular: true
    },
    {
      icon: Home,
      title: "Mortgage Calculator",
      description: "Calculate monthly payments, total interest, and amortization schedules",
      category: "Real Estate",
      popular: true
    },
    {
      icon: TrendingUp,
      title: "Investment Return Calculator",
      description: "Analyze potential returns on your investment portfolio",
      category: "Investing",
      popular: false
    },
    {
      icon: CreditCard,
      title: "Debt Payoff Calculator",
      description: "Plan your debt elimination strategy and save on interest",
      category: "Debt Management",
      popular: true
    },
    {
      icon: Percent,
      title: "Tax Calculator",
      description: "Estimate your tax liability and plan accordingly",
      category: "Tax Planning",
      popular: false
    },
    {
      icon: Calculator,
      title: "Retirement Calculator",
      description: "Plan for your golden years with retirement savings projections",
      category: "Retirement",
      popular: true
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Financial Calculators
          </h2>
          <p className="text-lg text-muted-foreground">
            Make informed financial decisions with our comprehensive suite of calculators
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, index) => (
            <Card key={index} className="group border-0 shadow-finance hover:shadow-finance-strong transition-finance cursor-pointer card-gradient">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 finance-gradient rounded-xl group-hover:shadow-glow transition-finance">
                    <calc.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  {calc.popular && (
                    <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-finance">
                  {calc.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {calc.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {calc.category}
                  </span>
                  <Button variant="ghost" size="sm" className="group/btn p-0 h-auto">
                    <span className="font-medium mr-2">Calculate</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-finance" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary-glow/10 to-success/10 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Calculator?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the calculator you need? Let us know what financial calculations 
              would help your decision-making process.
            </p>
            <Button size="lg" className="finance-gradient hover:shadow-glow transition-finance">
              Request Calculator
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;