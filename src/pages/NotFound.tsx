import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO, generateBreadcrumbSchema } from "@/utils/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found - ImperialPedia"
        description="The page you're looking for doesn't exist. Browse our finance guides, glossary, and calculators."
        structuredData={generateBreadcrumbSchema([
          { name: 'Home', url: 'https://imperialpedia.com' },
          { name: '404 Not Found', url: `https://imperialpedia.com${location.pathname}` },
        ])}
      />
      <Header />
      <main className="flex flex-col items-center justify-center py-24 px-4 min-h-[60vh]">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved. Try browsing our guides or searching for a topic.
        </p>
        <div className="flex gap-4">
          <Link to="/">
            <Button><Home className="h-4 w-4 mr-2" />Go Home</Button>
          </Link>
          <Link to="/articles">
            <Button variant="outline"><Search className="h-4 w-4 mr-2" />Browse Guides</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
