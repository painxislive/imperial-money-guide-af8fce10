import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ArticlesListPage from "./pages/ArticlesListPage";
import ArticlePage from "./pages/ArticlePage";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import CategoryPillarPage from "./pages/CategoryPillarPage";
import CategoryPage from "./pages/CategoryPage";
import AuthorProfile from "./pages/AuthorProfile";
import TopicsLetter from "./pages/TopicsLetter";
import AdminDashboard from "./pages/AdminDashboard";
import AdminArticles from "./pages/AdminArticles";
import AdminUsers from "./pages/AdminUsers";
import AdminGlossaryPage from "./pages/AdminGlossaryPage";
import Tools from "./pages/Tools";
import HiddenTools from "./pages/HiddenTools";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Premium } from "./pages/Premium";
import { About } from "./pages/About";
import Contact from "./pages/Contact";
import Editorial from "./pages/Editorial";
import Disclaimer from "./pages/Disclaimer";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import PremiumTools from "./pages/PremiumTools";
import VerifiedAuthors from "./pages/VerifiedAuthors";
import ArticleHistory from "./pages/ArticleHistory";
import SourcesCitations from "./pages/SourcesCitations";
import RiskDisclosures from "./pages/RiskDisclosures";
import DashboardInsights from "./pages/DashboardInsights";
import DashboardReports from "./pages/DashboardReports";
import AIInsights from "./pages/AIInsights";
import CalculatorExplain from "./pages/CalculatorExplain";
import CompareScenarios from "./pages/CompareScenarios";
import BetaFeatures from "./pages/BetaFeatures";
import Labs from "./pages/Labs";
import Glossary from "./pages/Glossary";
import GlossaryLetter from "./pages/GlossaryLetter";
import GlossaryTerm from "./pages/GlossaryTerm";
import AdminGlossary from "./pages/AdminGlossary";
import SecureEditPage from "./pages/SecureEditPage";
import AdminAutomation from "./pages/AdminAutomation";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import EnterpriseRoles from "./pages/enterprise/EnterpriseRoles";
import EnterpriseWorkflow from "./pages/enterprise/EnterpriseWorkflow";
import EnterpriseAudit from "./pages/enterprise/EnterpriseAudit";
import EnterprisePlaceholder from "./pages/enterprise/EnterprisePlaceholder";
import EnterpriseSEO from "./pages/enterprise/EnterpriseSEO";
import EnterpriseAutoLinks from "./pages/enterprise/EnterpriseAutoLinks";
import EnterpriseAuthors from "./pages/enterprise/EnterpriseAuthors";
import EnterpriseOrgSettings from "./pages/enterprise/EnterpriseOrgSettings";
import EnterpriseCategorySEO from "./pages/enterprise/EnterpriseCategorySEO";

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
              {/* Articles */}
              <Route path="/articles" element={<ArticlesListPage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsArticle />} />
              {/* Category Pillar Pages */}
              <Route path="/crypto" element={<CategoryPillarPage />} />
              <Route path="/stocks" element={<CategoryPillarPage />} />
              <Route path="/personal-finance" element={<CategoryPillarPage />} />
              <Route path="/investing" element={<CategoryPillarPage />} />
              <Route path="/banking" element={<CategoryPillarPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/author/:authorId" element={<AuthorProfile />} />
              <Route path="/topics/:letter" element={<TopicsLetter />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/glossary" element={<AdminGlossaryPage />} />
              <Route path="/admin/automation" element={<AdminAutomation />} />
              <Route path="/edit/:token" element={<SecureEditPage />} />
              {/* Tools */}
              <Route path="/tools" element={<Tools />} />
              <Route path="/hidden-tools" element={<HiddenTools />} />
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Static Pages */}
              <Route path="/premium" element={<Premium />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/editorial" element={<Editorial />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/premium/tools" element={<PremiumTools />} />
              <Route path="/authors/verified" element={<VerifiedAuthors />} />
              <Route path="/article-update-history" element={<ArticleHistory />} />
              <Route path="/sources-and-citations" element={<SourcesCitations />} />
              <Route path="/risk-and-disclosures" element={<RiskDisclosures />} />
              <Route path="/dashboard/insights" element={<DashboardInsights />} />
              <Route path="/dashboard/reports" element={<DashboardReports />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/calculator/:slug/explain" element={<CalculatorExplain />} />
              <Route path="/compare/scenarios" element={<CompareScenarios />} />
              <Route path="/beta" element={<BetaFeatures />} />
              <Route path="/labs" element={<Labs />} />
              {/* Glossary */}
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/glossary/letter/:letter" element={<GlossaryLetter />} />
              <Route path="/glossary/term/:slug" element={<GlossaryTerm />} />
              {/* Enterprise Routes */}
              <Route path="/enterprise" element={<EnterpriseDashboard />} />
              <Route path="/enterprise/roles" element={<EnterpriseRoles />} />
              <Route path="/enterprise/workflow" element={<EnterpriseWorkflow />} />
              <Route path="/enterprise/audit" element={<EnterpriseAudit />} />
              <Route path="/enterprise/authors" element={<EnterpriseAuthors />} />
              <Route path="/enterprise/auto-links" element={<EnterpriseAutoLinks />} />
              <Route path="/enterprise/org-settings" element={<EnterpriseOrgSettings />} />
              <Route path="/enterprise/category-seo" element={<EnterpriseCategorySEO />} />
              <Route path="/enterprise/seo" element={<EnterpriseSEO />} />
              <Route path="/enterprise/monetization" element={<EnterprisePlaceholder title="Monetization Control" description="Ads, affiliates, subscriptions management." module="Monetization" />} />
              <Route path="/enterprise/analytics" element={<EnterprisePlaceholder title="Analytics Engine" description="Article metrics, revenue, performance dashboards." module="Analytics" />} />
              <Route path="/enterprise/security" element={<EnterprisePlaceholder title="Security & Audit" description="IP whitelist, rate limits, feature flags." module="Security" />} />
              <Route path="/enterprise/feature-flags" element={<EnterprisePlaceholder title="Feature Flags" description="Toggle features, A/B experiments, gradual rollout." module="Feature Flags" />} />
              <Route path="/enterprise/system" element={<EnterprisePlaceholder title="System Settings" description="Site config, API keys, branding, SMTP." module="System Settings" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
