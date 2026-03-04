import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/utils/seo';

const ServerError = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <SEO title="Server Error - ImperialPedia" description="An unexpected error occurred." />
    <div className="text-center max-w-md">
      <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
      <h1 className="text-5xl font-bold mb-4">500</h1>
      <h2 className="text-xl font-semibold mb-2">Internal Server Error</h2>
      <p className="text-muted-foreground mb-8">
        Something went wrong on our end. Please try again later.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
      </div>
    </div>
  </div>
);

export default ServerError;
