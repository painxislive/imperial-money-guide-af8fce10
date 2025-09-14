import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import CalculatorSection from "@/components/CalculatorSection";
import Footer from "@/components/Footer";
import { SEO, generateWebsiteSchema } from "@/utils/seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="ImperialPedia - Your Complete Finance Encyclopedia"
        description="Discover comprehensive finance guides, calculators, and expert insights. Master investing, personal finance, and wealth building with ImperialPedia."
        keywords="finance encyclopedia, investment guides, financial calculators, personal finance, wealth building, money management"
        structuredData={generateWebsiteSchema()}
      />
      <Header />
      <main>
        <Hero />
        <FeaturedArticles />
        <CalculatorSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
