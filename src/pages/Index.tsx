import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import CalculatorSection from "@/components/CalculatorSection";
import GlossaryPreview from "@/components/GlossaryPreview";
import Footer from "@/components/Footer";
import { SEO, generateWebsiteSchema } from "@/utils/seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Imperialpedia - Global Finance & Investing Knowledge Platform"
        description="Clear, unbiased explanations of finance, investing, banking, taxation, insurance, and economic concepts. Free educational resources for a global audience."
        keywords="finance encyclopedia, investment education, financial glossary, economic concepts, banking guide, taxation basics, insurance explained"
        structuredData={generateWebsiteSchema()}
      />
      <Header />
      <main>
        <Hero />
        <FeaturedArticles />
        <CalculatorSection />
        <GlossaryPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
