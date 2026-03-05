import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, BookOpen, Moon, Sun, ChevronDown, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsService, NewsCategory } from "@/services/newsService";

const STATIC_NAV = [
  { path: "/", label: "Home" },
  { path: "/articles", label: "Guides" },
  { path: "/tools", label: "Calculators" },
  { path: "/glossary", label: "Glossary" },
];

const DynamicHeader = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [showNewsDropdown, setShowNewsDropdown] = useState(false);
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    newsService.getCategories(true).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowNewsDropdown(false);
    setShowCountriesDropdown(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Imperialpedia</h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">Global Finance Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {STATIC_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted ${
                  location.pathname === item.path ? "text-primary bg-muted" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Dynamic News Categories Dropdown */}
            {categories.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setShowNewsDropdown(true)}
                onMouseLeave={() => setShowNewsDropdown(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted text-foreground/80">
                  News <ChevronDown className="h-3 w-3" />
                </button>
                {showNewsDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-popover border rounded-lg shadow-lg p-2 z-50">
                    <Link
                      to="/news"
                      className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors font-medium"
                    >
                      All News
                    </Link>
                    <div className="border-t my-1" />
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/news/${cat.slug}`}
                        className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Countries */}
            <div
              className="relative"
              onMouseEnter={() => setShowCountriesDropdown(true)}
              onMouseLeave={() => setShowCountriesDropdown(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted text-foreground/80">
                <Globe className="h-3.5 w-3.5" /> Countries <ChevronDown className="h-3 w-3" />
              </button>
              {showCountriesDropdown && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-popover border rounded-lg shadow-lg p-2 z-50 max-h-80 overflow-y-auto">
                  <Link
                    to="/news/countries"
                    className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors font-medium"
                  >
                    All Countries
                  </Link>
                  <div className="border-t my-1" />
                  <CountryLinks />
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted text-foreground/80"
            >
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-40 lg:w-56 pl-10 bg-muted/50 border-0 focus:bg-background"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t max-h-[70vh] overflow-y-auto">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="w-full pl-10 bg-muted/50 border-0" />
            </div>
            <nav className="flex flex-col space-y-1">
              {STATIC_NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t my-2" />
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">News</p>
              <Link to="/news" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg">All News</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/news/${cat.slug}`}
                  className="px-3 py-2 text-sm hover:bg-muted rounded-lg pl-6"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t my-2" />
              <Link to="/news/countries" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                <Globe className="inline h-4 w-4 mr-2" />Countries
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg">About</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg">Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Sub-component that lazily loads countries
const CountryLinks = () => {
  const [countries, setCountries] = useState<Array<{ name: string; slug: string; flag_emoji: string | null }>>([]);

  useEffect(() => {
    import("@/services/newsService").then(({ newsService }) => {
      newsService.getCountries().then(setCountries).catch(() => {});
    });
  }, []);

  return (
    <>
      {countries.slice(0, 15).map((c) => (
        <Link
          key={c.slug}
          to={`/news/country/${c.slug}`}
          className="block px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
        >
          {c.flag_emoji} {c.name}
        </Link>
      ))}
      {countries.length > 15 && (
        <Link to="/news/countries" className="block px-3 py-1.5 text-sm text-primary hover:underline">
          View all {countries.length} countries →
        </Link>
      )}
    </>
  );
};

export default DynamicHeader;
