import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Author data - single source of truth
export const authors = {
  "james-chen": {
    id: "james-chen",
    name: "James Chen",
    title: "Finance Content Researcher",
    bio: "James Chen is a finance content researcher with over 8 years of experience in financial education. He specializes in making complex economic concepts accessible to general audiences and has contributed to numerous financial literacy publications.",
    avatar: null
  }
};

const FeaturedArticles = () => {
  const articles = [
    {
      id: 1,
      slug: "what-is-compound-interest",
      title: "What Is Compound Interest?",
      description: "Learn how compound interest works and why it's considered one of the most powerful concepts in finance. Understand the formula and see real-world examples.",
      category: "Basics",
      readTime: "8 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-15",
      updatedDate: "2024-01-20"
    },
    {
      id: 2,
      slug: "what-is-inflation",
      title: "What Is Inflation?",
      description: "Understand what inflation is, how it's measured, and why it matters for your purchasing power and financial planning.",
      category: "Economics",
      readTime: "10 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-12",
      updatedDate: "2024-01-18"
    },
    {
      id: 3,
      slug: "what-is-a-mutual-fund",
      title: "What Is a Mutual Fund?",
      description: "Discover how mutual funds work, the different types available, and how they can help diversify your investment portfolio.",
      category: "Investing",
      readTime: "12 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-10",
      updatedDate: "2024-01-15"
    },
    {
      id: 4,
      slug: "what-is-gdp",
      title: "What Is GDP (Gross Domestic Product)?",
      description: "Learn about GDP, how it's calculated, and why it's the most widely used measure of a country's economic health.",
      category: "Economics",
      readTime: "9 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-08",
      updatedDate: "2024-01-14"
    },
    {
      id: 5,
      slug: "what-is-a-bond",
      title: "What Is a Bond?",
      description: "Understand bonds, how they work, and the role they play in investment portfolios and government financing.",
      category: "Investing",
      readTime: "11 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-05",
      updatedDate: "2024-01-12"
    },
    {
      id: 6,
      slug: "what-is-diversification",
      title: "What Is Diversification?",
      description: "Learn why diversification is a fundamental principle of investing and how it helps manage risk in your portfolio.",
      category: "Investing",
      readTime: "8 min read",
      author: authors["james-chen"],
      publishedDate: "2024-01-03",
      updatedDate: "2024-01-10"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Finance Guides
          </h2>
          <p className="text-lg text-muted-foreground">
            Clear, educational explanations of essential finance and economic concepts
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="group overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Author Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground">{article.author.title}</p>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(article.publishedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Button variant="ghost" className="w-full justify-between group/btn p-0 h-auto text-left">
                  <span className="font-medium">Read Guide</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/articles">
            <Button size="lg" variant="outline">
              View All Guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
