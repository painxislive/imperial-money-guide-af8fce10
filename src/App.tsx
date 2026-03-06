import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { PageSkeleton } from "@/components/LoadingSkeleton";

// Eager load critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const ArticlesListPage = lazy(() => import("./pages/ArticlesListPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const NewsCategoryPage = lazy(() => import("./pages/NewsCategoryPage"));
const NewsCountryPage = lazy(() => import("./pages/NewsCountryPage"));
const CountriesListPage = lazy(() => import("./pages/CountriesListPage"));
const CategoryPillarPage = lazy(() => import("./pages/CategoryPillarPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AuthorProfile = lazy(() => import("./pages/AuthorProfile"));
const TopicsLetter = lazy(() => import("./pages/TopicsLetter"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminGlossaryPage = lazy(() => import("./pages/AdminGlossaryPage"));
const Tools = lazy(() => import("./pages/Tools"));
const HiddenTools = lazy(() => import("./pages/HiddenTools"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Premium = lazy(() => import("./pages/Premium").then(m => ({ default: m.Premium })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("./pages/Contact"));
const Editorial = lazy(() => import("./pages/Editorial"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const Pricing = lazy(() => import("./pages/Pricing"));
const Billing = lazy(() => import("./pages/Billing"));
const PremiumTools = lazy(() => import("./pages/PremiumTools"));
const VerifiedAuthors = lazy(() => import("./pages/VerifiedAuthors"));
const ArticleHistory = lazy(() => import("./pages/ArticleHistory"));
const SourcesCitations = lazy(() => import("./pages/SourcesCitations"));
const RiskDisclosures = lazy(() => import("./pages/RiskDisclosures"));
const DashboardInsights = lazy(() => import("./pages/DashboardInsights"));
const DashboardReports = lazy(() => import("./pages/DashboardReports"));
const AIInsights = lazy(() => import("./pages/AIInsights"));
const CalculatorExplain = lazy(() => import("./pages/CalculatorExplain"));
const CompareScenarios = lazy(() => import("./pages/CompareScenarios"));
const BetaFeatures = lazy(() => import("./pages/BetaFeatures"));
const Labs = lazy(() => import("./pages/Labs"));
const Glossary = lazy(() => import("./pages/Glossary"));
const GlossaryLetter = lazy(() => import("./pages/GlossaryLetter"));
const GlossaryTerm = lazy(() => import("./pages/GlossaryTerm"));
const AdminGlossary = lazy(() => import("./pages/AdminGlossary"));
const SecureEditPage = lazy(() => import("./pages/SecureEditPage"));
const AdminAutomation = lazy(() => import("./pages/AdminAutomation"));
const ServerError = lazy(() => import("./pages/ServerError"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const TrendingPage = lazy(() => import("./pages/TrendingPage"));
const LatestNewsPage = lazy(() => import("./pages/LatestNewsPage"));
const AdminAuthors = lazy(() => import("./pages/AdminAuthors"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminSEO = lazy(() => import("./pages/AdminSEO"));
const AdminHealth = lazy(() => import("./pages/AdminHealth"));
const AdminAPI = lazy(() => import("./pages/AdminAPI"));
const AdminAds = lazy(() => import("./pages/AdminAds"));

// Trust & E-E-A-T pages
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy"));
const ReviewPolicy = lazy(() => import("./pages/ReviewPolicy"));
const AffiliateDisclosure = lazy(() => import("./pages/AffiliateDisclosure"));

// Enterprise
const EnterpriseDashboard = lazy(() => import("./pages/enterprise/EnterpriseDashboard"));
const EnterpriseRoles = lazy(() => import("./pages/enterprise/EnterpriseRoles"));
const EnterpriseWorkflow = lazy(() => import("./pages/enterprise/EnterpriseWorkflow"));
const EnterpriseAudit = lazy(() => import("./pages/enterprise/EnterpriseAudit"));
const EnterprisePlaceholder = lazy(() => import("./pages/enterprise/EnterprisePlaceholder"));
const EnterpriseSEO = lazy(() => import("./pages/enterprise/EnterpriseSEO"));
const EnterpriseAutoLinks = lazy(() => import("./pages/enterprise/EnterpriseAutoLinks"));
const EnterpriseAuthors = lazy(() => import("./pages/enterprise/EnterpriseAuthors"));
const EnterpriseOrgSettings = lazy(() => import("./pages/enterprise/EnterpriseOrgSettings"));
const EnterpriseCategorySEO = lazy(() => import("./pages/enterprise/EnterpriseCategorySEO"));
const EnterpriseGlobalSEO = lazy(() => import("./pages/enterprise/EnterpriseGlobalSEO"));
const EnterpriseNewsManager = lazy(() => import("./pages/enterprise/EnterpriseNewsManager"));

const queryClient = new QueryClient();

const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Articles */}
                <Route path="/articles" element={<Lazy><ArticlesListPage /></Lazy>} />
                <Route path="/article/:slug" element={<Lazy><ArticlePage /></Lazy>} />
                {/* News System */}
                <Route path="/news" element={<Lazy><News /></Lazy>} />
                <Route path="/news/countries" element={<Lazy><CountriesListPage /></Lazy>} />
                <Route path="/news/country/:countrySlug" element={<Lazy><NewsCountryPage /></Lazy>} />
                <Route path="/news/:categorySlug" element={<Lazy><NewsCategoryPage /></Lazy>} />
                <Route path="/news/:categorySlug/:slug" element={<Lazy><NewsArticle /></Lazy>} />
                {/* Category Pillar Pages */}
                <Route path="/crypto" element={<Lazy><CategoryPillarPage /></Lazy>} />
                <Route path="/stocks" element={<Lazy><CategoryPillarPage /></Lazy>} />
                <Route path="/personal-finance" element={<Lazy><CategoryPillarPage /></Lazy>} />
                <Route path="/investing" element={<Lazy><CategoryPillarPage /></Lazy>} />
                <Route path="/banking" element={<Lazy><CategoryPillarPage /></Lazy>} />
                <Route path="/category/:category" element={<Lazy><CategoryPage /></Lazy>} />
                <Route path="/author/:authorId" element={<Lazy><AuthorProfile /></Lazy>} />
                <Route path="/topics/:letter" element={<Lazy><TopicsLetter /></Lazy>} />
                {/* Admin Routes */}
                <Route path="/admin" element={<Lazy><AdminDashboard /></Lazy>} />
                <Route path="/admin/articles" element={<Lazy><AdminArticles /></Lazy>} />
                <Route path="/admin/users" element={<Lazy><AdminUsers /></Lazy>} />
                <Route path="/admin/glossary" element={<Lazy><AdminGlossaryPage /></Lazy>} />
                <Route path="/admin/automation" element={<Lazy><AdminAutomation /></Lazy>} />
                <Route path="/edit/:token" element={<Lazy><SecureEditPage /></Lazy>} />
                {/* Tools */}
                <Route path="/tools" element={<Lazy><Tools /></Lazy>} />
                <Route path="/hidden-tools" element={<Lazy><HiddenTools /></Lazy>} />
                {/* Auth */}
                <Route path="/login" element={<Lazy><Login /></Lazy>} />
                <Route path="/signup" element={<Lazy><Signup /></Lazy>} />
                <Route path="/dashboard" element={<Lazy><Dashboard /></Lazy>} />
                {/* Static & Trust Pages */}
                <Route path="/premium" element={<Lazy><Premium /></Lazy>} />
                <Route path="/about" element={<Lazy><About /></Lazy>} />
                <Route path="/contact" element={<Lazy><Contact /></Lazy>} />
                <Route path="/editorial" element={<Lazy><Editorial /></Lazy>} />
                <Route path="/editorial-policy" element={<Lazy><EditorialPolicy /></Lazy>} />
                <Route path="/review-policy" element={<Lazy><ReviewPolicy /></Lazy>} />
                <Route path="/affiliate-disclosure" element={<Lazy><AffiliateDisclosure /></Lazy>} />
                <Route path="/disclaimer" element={<Lazy><Disclaimer /></Lazy>} />
                <Route path="/privacy" element={<Lazy><Privacy /></Lazy>} />
                <Route path="/terms" element={<Lazy><Terms /></Lazy>} />
                <Route path="/pricing" element={<Lazy><Pricing /></Lazy>} />
                <Route path="/billing" element={<Lazy><Billing /></Lazy>} />
                <Route path="/premium/tools" element={<Lazy><PremiumTools /></Lazy>} />
                <Route path="/authors/verified" element={<Lazy><VerifiedAuthors /></Lazy>} />
                <Route path="/article-update-history" element={<Lazy><ArticleHistory /></Lazy>} />
                <Route path="/sources-and-citations" element={<Lazy><SourcesCitations /></Lazy>} />
                <Route path="/risk-and-disclosures" element={<Lazy><RiskDisclosures /></Lazy>} />
                <Route path="/dashboard/insights" element={<Lazy><DashboardInsights /></Lazy>} />
                <Route path="/dashboard/reports" element={<Lazy><DashboardReports /></Lazy>} />
                <Route path="/ai-insights" element={<Lazy><AIInsights /></Lazy>} />
                <Route path="/calculator/:slug/explain" element={<Lazy><CalculatorExplain /></Lazy>} />
                <Route path="/compare/scenarios" element={<Lazy><CompareScenarios /></Lazy>} />
                <Route path="/beta" element={<Lazy><BetaFeatures /></Lazy>} />
                <Route path="/labs" element={<Lazy><Labs /></Lazy>} />
                <Route path="/server-error" element={<Lazy><ServerError /></Lazy>} />
                {/* Glossary */}
                <Route path="/glossary" element={<Lazy><Glossary /></Lazy>} />
                <Route path="/glossary/letter/:letter" element={<Lazy><GlossaryLetter /></Lazy>} />
                <Route path="/glossary/term/:slug" element={<Lazy><GlossaryTerm /></Lazy>} />
                {/* Enterprise Routes */}
                <Route path="/enterprise" element={<Lazy><EnterpriseDashboard /></Lazy>} />
                <Route path="/enterprise/roles" element={<Lazy><EnterpriseRoles /></Lazy>} />
                <Route path="/enterprise/workflow" element={<Lazy><EnterpriseWorkflow /></Lazy>} />
                <Route path="/enterprise/audit" element={<Lazy><EnterpriseAudit /></Lazy>} />
                <Route path="/enterprise/authors" element={<Lazy><EnterpriseAuthors /></Lazy>} />
                <Route path="/enterprise/auto-links" element={<Lazy><EnterpriseAutoLinks /></Lazy>} />
                <Route path="/enterprise/org-settings" element={<Lazy><EnterpriseOrgSettings /></Lazy>} />
                <Route path="/enterprise/category-seo" element={<Lazy><EnterpriseCategorySEO /></Lazy>} />
                <Route path="/enterprise/seo" element={<Lazy><EnterpriseSEO /></Lazy>} />
                <Route path="/enterprise/global-seo" element={<Lazy><EnterpriseGlobalSEO /></Lazy>} />
                <Route path="/enterprise/news" element={<Lazy><EnterpriseNewsManager /></Lazy>} />
                <Route path="/enterprise/monetization" element={<Lazy><EnterprisePlaceholder title="Monetization Control" description="Ads, affiliates, subscriptions management." module="Monetization" /></Lazy>} />
                <Route path="/enterprise/analytics" element={<Lazy><EnterprisePlaceholder title="Analytics Engine" description="Article metrics, revenue, performance dashboards." module="Analytics" /></Lazy>} />
                <Route path="/enterprise/security" element={<Lazy><EnterprisePlaceholder title="Security & Audit" description="IP whitelist, rate limits, feature flags." module="Security" /></Lazy>} />
                <Route path="/enterprise/feature-flags" element={<Lazy><EnterprisePlaceholder title="Feature Flags" description="Toggle features, A/B experiments, gradual rollout." module="Feature Flags" /></Lazy>} />
                <Route path="/enterprise/system" element={<Lazy><EnterprisePlaceholder title="System Settings" description="Site config, API keys, branding, SMTP." module="System Settings" /></Lazy>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
