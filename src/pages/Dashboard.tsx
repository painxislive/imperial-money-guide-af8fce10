import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService, SavedScenario } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { 
  Calculator, 
  BookmarkIcon, 
  Clock, 
  Trash2, 
  FileText, 
  TrendingUp,
  User,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedScenarios();
      loadBookmarks();
    }
  }, [user]);

  const loadSavedScenarios = async () => {
    try {
      const scenarios = await authService.getSavedScenarios();
      setScenarios(scenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoadingScenarios(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await authService.getBookmarks();
      setBookmarks(bookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handleDeleteScenario = async (scenarioId: string) => {
    try {
      const { error } = await authService.deleteScenario(scenarioId);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete scenario",
          variant: "destructive",
        });
      } else {
        setScenarios(prev => prev.filter(s => s.id !== scenarioId));
        toast({
          title: "Success",
          description: "Scenario deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scenario",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = async (scenario: SavedScenario) => {
    // Placeholder for PDF export functionality
    toast({
      title: "PDF Export",
      description: "PDF export feature coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - ImperialPedia | Your Financial Hub</title>
        <meta name="description" content="Access your saved calculations, bookmarked articles, and personalized financial tools dashboard." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user.email}</h1>
              <p className="text-muted-foreground mt-1">
                Manage your saved calculations and bookmarks
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <User className="w-3 h-3 mr-1" />
                {profile?.role || 'User'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Scenarios</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scenarios.length}</div>
              <p className="text-xs text-muted-foreground">
                Total calculations saved
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">
                Articles bookmarked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Type</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{profile?.role || 'User'}</div>
              <p className="text-xs text-muted-foreground">
                Current plan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Saved Scenarios */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Saved Scenarios</h2>
          </div>
          
          {loadingScenarios ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : scenarios.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved scenarios yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start using our calculators and save your results for future reference.
                </p>
                <Button asChild>
                  <a href="/calculators">Explore Calculators</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {scenario.tool_type.replace(/([A-Z])/g, ' $1')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {scenario.is_private ? 'Private' : 'Public'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(scenario.created_at), { addSuffix: true })}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-1" />
                        Load
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportToPDF(scenario)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteScenario(scenario.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Bookmarked Articles</h2>
          </div>
          
          {bookmarks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookmarkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookmarked articles</h3>
                <p className="text-muted-foreground mb-4">
                  Bookmark articles while reading to save them for later.
                </p>
                <Button asChild>
                  <a href="/articles">Browse Articles</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Content ID: {bookmark.content_id}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;