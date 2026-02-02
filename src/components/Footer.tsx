import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  // Generate A-Z alphabet links for glossary navigation
  const alphabetLinks = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
    <Link
      key={letter}
      to={`/topics/${letter.toLowerCase()}`}
      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
    >
      {letter}
    </Link>
  ));

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* A-Z Glossary Navigation */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-center">Financial Terms A-Z</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {alphabetLinks}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Explore our comprehensive glossary of financial and economic terms
          </p>
        </div>

        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Imperialpedia</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A global finance and investing knowledge platform providing clear, unbiased explanations 
              of finance, investing, banking, taxation, insurance, and economic concepts.
            </p>
            <p className="text-xs text-muted-foreground">
              All content is for educational and informational purposes only.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/articles" className="text-muted-foreground hover:text-foreground">Finance Guides</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-foreground">Calculators</Link></li>
              <li><Link to="/topics/a" className="text-muted-foreground hover:text-foreground">Glossary</Link></li>
              <li><Link to="/news" className="text-muted-foreground hover:text-foreground">Latest Articles</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/editorial" className="text-muted-foreground hover:text-foreground">Editorial Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="mt-8 mb-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Imperialpedia. All rights reserved.</p>
          <p className="text-xs mt-2">
            This website is for educational purposes only and does not provide financial, legal, or investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
