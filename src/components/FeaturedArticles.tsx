import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, TrendingUp, ArrowRight } from "lucide-react";

const FeaturedArticles = () => {
  const articles = [
    {
      id: 1,
      title: "Complete Guide to Compound Interest",
      description: "Learn how compound interest works and why Einstein called it the 8th wonder of the world. Includes real examples and calculations.",
      category: "Investing",
      readTime: "8 min read",
      author: "Sarah Johnson",
      trending: true,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Stock Market Basics for Beginners",
      description: "Everything you need to know before making your first investment. From market terminology to portfolio diversification strategies.",
      category: "Stocks",
      readTime: "12 min read",
      author: "Michael Chen",
      trending: false,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Cryptocurrency Investment Guide 2024",
      description: "Navigate the crypto market with confidence. Analysis of Bitcoin, Ethereum, and emerging altcoins with risk management tips.",
      category: "Cryptocurrency",
      readTime: "15 min read",
      author: "David Rodriguez",
      trending: true,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 4,
      title: "Personal Finance Budgeting Strategies",
      description: "Master your money with proven budgeting techniques. From the 50/30/20 rule to zero-based budgeting methods.",
      category: "Personal Finance",
      readTime: "10 min read",
      author: "Emily Taylor",
      trending: false,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Real Estate Investment Analysis",
      description: "Evaluate property investments like a pro. Learn about cap rates, cash flow analysis, and market timing strategies.",
      category: "Real Estate",
      readTime: "14 min read",
      author: "James Wilson",
      trending: true,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 6,
      title: "Tax-Advantaged Investment Accounts",
      description: "Maximize your savings with 401(k), IRA, and HSA strategies. Compare traditional vs. Roth options for your situation.",
      category: "Tax Planning",
      readTime: "11 min read",
      author: "Lisa Anderson",
      trending: false,
      image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=250&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Finance Articles
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay ahead with our expert-written guides on investing, personal finance, and market analysis
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="group overflow-hidden border-0 shadow-finance hover:shadow-finance-strong transition-finance cursor-pointer card-gradient">
              {/* Article Image */}
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-finance"
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {article.category}
                  </Badge>
                  {article.trending && (
                    <Badge className="bg-success text-success-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-finance line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <Button variant="ghost" className="w-full justify-between group/btn p-0 h-auto text-left">
                  <span className="font-medium">Read Article</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-finance" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="finance-gradient hover:shadow-glow transition-finance">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;