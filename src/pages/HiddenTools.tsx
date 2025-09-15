import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HiddenFinancialTools from "@/components/HiddenFinancialTools";
import { generateSEO } from "@/utils/seo";

const HiddenTools = () => {
  const seo = generateSEO({
    title: "Hidden Financial Tools - Advanced Institutional Calculators | ImperialPedia",
    description: "Interactive calculators for institutional financial instruments including repos, rehypothecation, OTC derivatives, and option payoffs. Educational tools for advanced finance concepts.",
    keywords: "repo calculator, rehypothecation, OTC derivatives, option payoff, institutional finance, hidden leverage, dark pools, shadow banking",
    path: "/hidden-tools"
  });

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Hidden Financial Tools",
            "description": seo.description,
            "url": seo.canonical,
            "isPartOf": {
              "@type": "WebSite",
              "name": "ImperialPedia",
              "url": "https://imperialpedia.com"
            },
            "about": {
              "@type": "Thing",
              "name": "Institutional Financial Instruments",
              "description": "Advanced financial tools and calculators for institutional finance"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <HiddenFinancialTools />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HiddenTools;