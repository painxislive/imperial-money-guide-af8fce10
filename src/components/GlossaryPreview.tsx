import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlossaryPreview = () => {
  const popularTerms = [
    { term: "Compound Interest", letter: "c" },
    { term: "GDP", letter: "g" },
    { term: "Inflation", letter: "i" },
    { term: "Mutual Fund", letter: "m" },
    { term: "Bond", letter: "b" },
    { term: "ETF", letter: "e" },
    { term: "Diversification", letter: "d" },
    { term: "Fiscal Policy", letter: "f" },
    { term: "Monetary Policy", letter: "m" },
    { term: "Risk Management", letter: "r" },
    { term: "Insurance Premium", letter: "i" },
    { term: "Central Bank", letter: "c" }
  ];

  // Generate A-Z links
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A–Z Financial Glossary
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive definitions of financial, investing, and economic terms
          </p>
        </div>

        {/* A-Z Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {alphabet.map(letter => (
            <Link
              key={letter}
              to={`/topics/${letter.toLowerCase()}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-card border hover:bg-primary hover:text-primary-foreground transition-colors font-medium text-sm"
            >
              {letter}
            </Link>
          ))}
        </div>

        {/* Popular Terms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {popularTerms.map((item, index) => (
            <Link key={index} to={`/topics/${item.letter}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.term}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link to="/topics/a">
            <Button size="lg" variant="outline">
              Browse Full Glossary
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GlossaryPreview;
