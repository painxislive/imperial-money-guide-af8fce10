import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, X } from 'lucide-react';
import { db } from '@/lib/supabase-helpers';
import { toast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  variant?: 'popup' | 'inline' | 'footer';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ variant = 'inline' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await db('subscribers')
        .insert({ email: email.trim() });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our finance newsletter.",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Get daily market insights and crypto news delivered to your inbox.
      </p>
    </form>
  );

  if (variant === 'footer') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <h3 className="font-semibold">Newsletter</h3>
        </div>
        {content}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Card className="my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return null; // Popup variant would be implemented with a trigger
};

export const NewsletterPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Auto-show popup after 30 seconds (can be improved with localStorage to show once per session)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const hasShown = localStorage.getItem('newsletter-popup-shown');
      if (!hasShown) {
        setOpen(true);
        localStorage.setItem('newsletter-popup-shown', 'true');
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Never Miss Market Updates
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Join 10,000+ traders getting our daily market analysis and crypto insights.
          </p>
          <NewsletterSignup variant="inline" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
