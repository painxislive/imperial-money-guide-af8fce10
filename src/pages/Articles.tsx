import { useState } from "react";
import { Search, Filter, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const articles = [
    {
      id: 1,
      title: "Understanding Compound Interest: The 8th Wonder of the World",
      description: "Learn how compound interest works and why Einstein called it the most powerful force in the universe. Complete guide with examples and calculations.",
      category: "Investing",
      author: "Sarah Johnson",
      date: "2024-03-15",
      readTime: "8 min read",
      featured: true,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Stock Market Basics: A Beginner's Complete Guide",
      description: "Everything you need to know before making your first investment. From market terminology to portfolio diversification strategies.",
      category: "Stocks",
      author: "Michael Chen",
      date: "2024-03-12",
      readTime: "12 min read",
      featured: false,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Cryptocurrency Investment Guide 2024",
      description: "Navigate the crypto market with confidence. Analysis of Bitcoin, Ethereum, and emerging altcoins with risk management tips.",
      category: "Cryptocurrency",
      author: "David Rodriguez",
      date: "2024-03-10",
      readTime: "15 min read",
      featured: true,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 4,
      title: "Personal Finance Budgeting Strategies",
      description: "Master your money with proven budgeting techniques. From the 50/30/20 rule to zero-based budgeting methods.",
      category: "Personal Finance",
      author: "Emily Taylor",
      date: "2024-03-08",
      readTime: "10 min read",
      featured: false,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Real Estate Investment Analysis",
      description: "Evaluate property investments like a pro. Learn about cap rates, cash flow analysis, and market timing strategies.",
      category: "Real Estate",
      author: "James Wilson",
      date: "2024-03-05",
      readTime: "14 min read",
      featured: true,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 6,
      title: "Tax-Advantaged Investment Accounts",
      description: "Maximize your savings with 401(k), IRA, and HSA strategies. Compare traditional vs. Roth options for your situation.",
      category: "Tax Planning",
      author: "Lisa Anderson",
      date: "2024-03-03",
      readTime: "11 min read",
      featured: false,
      image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 7,
      title: "Emergency Fund: How Much Do You Really Need?",
      description: "Build financial security with the right emergency fund size. Learn the 3-6 month rule and when to adjust it.",
      category: "Personal Finance",
      author: "Robert Kim",
      date: "2024-03-01",
      readTime: "7 min read",
      featured: false,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop&q=80"
    },
    {
      id: 8,
      title: "Dividend Investing Strategy",
      description: "Generate passive income through dividend stocks. Learn about dividend yield, growth, and DRIP programs.",
      category: "Investing",
      author: "Amanda Foster",
      date: "2024-02-28",
      readTime: "13 min read",
      featured: true,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop&q=80"
    }
  ];

  const categories = ["all", "Investing", "Stocks", "Cryptocurrency", "Personal Finance", "Real Estate", "Tax Planning"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Finance Articles
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guides and insights to help you make informed financial decisions
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
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
                  {article.featured && (
                    <Badge className="bg-success text-success-foreground">
                      Featured
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
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {article.readTime}
                  </span>
                  <Button variant="ghost" size="sm" className="group/btn p-0 h-auto">
                    <span className="font-medium mr-2">Read More</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-finance" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="text-center mt-12">
            <Button size="lg" className="finance-gradient hover:shadow-glow transition-finance">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Articles;