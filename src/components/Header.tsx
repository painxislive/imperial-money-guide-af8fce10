import { Search, Menu, BookOpen, TrendingUp, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="finance-gradient p-2 rounded-lg shadow-finance">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ImperialPedia</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Finance Encyclopedia</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/articles" className="text-sm font-medium hover:text-primary transition-finance">Articles</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-finance">Terms</a>
            <a href="/tools" className="text-sm font-medium hover:text-primary transition-finance">Calculators</a>
            <a href="/hidden-tools" className="text-sm font-medium hover:text-primary transition-finance">Advanced Tools</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-finance">Guides</a>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search finance terms..."
                className="w-64 pl-10 pr-4 bg-muted/50 border-0 focus:bg-background transition-finance"
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-3">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search finance terms..."
                  className="w-full pl-10 pr-4 bg-muted/50 border-0"
                />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <a href="/articles" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-finance">Articles</a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-finance">Terms</a>
                <a href="/tools" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-finance">Calculators</a>
                <a href="/hidden-tools" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-finance">Advanced Tools</a>
                <a href="#" className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-finance">Guides</a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;