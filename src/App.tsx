import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import CategoryPage from "./pages/CategoryPage";
import AuthorProfile from "./pages/AuthorProfile";
import TopicsLetter from "./pages/TopicsLetter";
import AdminDashboard from "./pages/AdminDashboard";
import Tools from "./pages/Tools";
import HiddenTools from "./pages/HiddenTools";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Premium } from "./pages/Premium";
import { About } from "./pages/About";
import Editorial from "./pages/Editorial";
import Disclaimer from "./pages/Disclaimer";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsArticle />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/author/:authorId" element={<AuthorProfile />} />
              <Route path="/topics/:letter" element={<TopicsLetter />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/hidden-tools" element={<HiddenTools />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/about" element={<About />} />
              <Route path="/editorial" element={<Editorial />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
