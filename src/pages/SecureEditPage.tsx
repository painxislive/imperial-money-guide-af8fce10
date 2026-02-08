import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { secureEditService } from '@/services/secureEditService';
import { articleService } from '@/services/articleService';
import { Article } from '@/types/database';
import { SEO } from '@/utils/seo';
import { AlertCircle, Clock, CheckCircle, Save } from 'lucide-react';

const SecureEditPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    preview_content: '',
    full_content: '',
    excerpt: '',
  });

  useEffect(() => {
    if (token) {
      validateAndLoad();
    }
  }, [token]);

  const validateAndLoad = async () => {
    setLoading(true);
    try {
      const result = await secureEditService.validateSecureEditLink(token!);
      
      if (!result.valid) {
        setError(result.error || 'Invalid or expired link');
        return;
      }

      // Use the link
      await secureEditService.useSecureEditLink(token!);

      // Load full article data
      if (result.article) {
        const fullArticle = await articleService.getArticleById(result.article.id);
        if (fullArticle) {
          setArticle(fullArticle);
          setFormData({
            title: fullArticle.title,
            preview_content: fullArticle.preview_content || '',
            full_content: fullArticle.full_content || '',
            excerpt: fullArticle.excerpt || '',
          });
        }
      }
    } catch (err) {
      console.error('Error validating link:', err);
      setError('Failed to validate edit link');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    setSaving(true);
    try {
      const { error } = await articleService.updateArticle(
        article.id,
        formData,
        undefined,
        'External Editor (via secure link)',
        'Updated via secure edit link'
      );

      if (error) throw error;

      setSaved(true);
      toast({
        title: 'Success',
        description: 'Article updated successfully.',
      });
    } catch (err) {
      console.error('Error saving article:', err);
      toast({
        title: 'Error',
        description: 'Failed to save article.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Validating edit link...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Invalid Edit Link</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Changes Saved!</h1>
              <p className="text-muted-foreground mb-6">
                Your changes to "{article?.title}" have been saved successfully.
              </p>
              <Button asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`Editing: ${article?.title} | Imperialpedia`} />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 bg-warning/10 border-warning">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Secure Edit Session</p>
                  <p className="text-sm text-muted-foreground">
                    You are editing via a secure link. This link is single-use and will expire.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Article</h1>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief excerpt for listings"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preview Content
                <span className="text-muted-foreground font-normal ml-2">
                  (Visible to all users)
                </span>
              </label>
              <Textarea
                value={formData.preview_content}
                onChange={(e) => setFormData(prev => ({ ...prev, preview_content: e.target.value }))}
                placeholder="Content shown to all users as a preview"
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Content
                <span className="text-muted-foreground font-normal ml-2">
                  (Premium users only if marked as premium)
                </span>
              </label>
              <Textarea
                value={formData.full_content}
                onChange={(e) => setFormData(prev => ({ ...prev, full_content: e.target.value }))}
                placeholder="Full article content"
                rows={16}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecureEditPage;
