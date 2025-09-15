import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const SEO = ({ 
  title = "ImperialPedia - Finance Encyclopedia", 
  description = "Comprehensive finance encyclopedia with articles, calculators, and guides to help you make informed financial decisions.",
  keywords = "finance, investing, personal finance, calculators, financial planning, money management",
  image = "/og-image.jpg",
  url = "https://imperialpedia.com",
  type = "website",
  structuredData 
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ImperialPedia" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ImperialPedia" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined structured data schemas
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "ImperialPedia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://imperialpedia.com/logo.png"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "image": article.image,
  "url": article.url,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export const generateFinanceTermSchema = (term: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": term.name,
  "description": term.description,
  "url": term.url,
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Finance Terms",
    "description": "Comprehensive collection of finance and investment terms"
  }
});

export const generateCalculatorSchema = (calculator: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": calculator.name,
  "description": calculator.description,
  "url": calculator.url,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ImperialPedia",
  "description": "Finance Encyclopedia with articles, calculators, and educational content",
  "url": "https://imperialpedia.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://imperialpedia.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ImperialPedia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://imperialpedia.com/logo.png"
    }
  }
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string; }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generateSEO = ({ title, description, keywords, path }: {
  title: string;
  description: string;
  keywords?: string;
  path: string;
}) => ({
  title,
  description,
  keywords: keywords || "finance, investing, personal finance, calculators",
  canonical: `https://imperialpedia.com${path}`
});