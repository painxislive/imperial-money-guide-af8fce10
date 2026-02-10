import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { automationService, type AutomationSettings, type TrackedKeyword, type DetectedTrend, type PipelineLog } from "@/services/automationService";
import {
  Activity, Zap, Search, FileText, Settings, Play, Pause,
  Plus, Trash2, Eye, CheckCircle, XCircle, Clock, TrendingUp,
  AlertTriangle, RefreshCw, Rocket, BarChart3
} from "lucide-react";

const AdminAutomation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AutomationSettings>({
    automation_enabled: false,
    daily_post_limit: 25,
    growth_threshold: 150,
    publish_mode: "approval_required",
    hybrid_threshold: 50,
  });
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([]);
  const [trends, setTrends] = useState<DetectedTrend[]>([]);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordCategory, setNewKeywordCategory] = useState("markets");
  const [trendFilter, setTrendFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, kw, tr, lg, dr, st] = await Promise.all([
        automationService.getSettings(),
        automationService.getKeywords(),
        automationService.getTrends(undefined, 50),
        automationService.getPipelineLogs(30),
        automationService.getDraftArticles(30),
        automationService.getAutomationStats(),
      ]);
      setSettings(s);
      setKeywords(kw);
      setTrends(tr);
      setLogs(lg);
      setDrafts(dr);
      setStats(st);
    } catch (e) {
      console.error("Load failed:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ─── Settings Handlers ───
  const toggleAutomation = async () => {
    const newVal = !settings.automation_enabled;
    await automationService.updateSetting("automation_enabled", { enabled: newVal });
    setSettings(prev => ({ ...prev, automation_enabled: newVal }));
    toast({ title: newVal ? "Automation enabled" : "Automation paused" });
  };

  const updateDailyLimit = async (val: number[]) => {
    const limit = val[0];
    await automationService.updateSetting("daily_post_limit", { value: limit });
    setSettings(prev => ({ ...prev, daily_post_limit: limit }));
  };

  const updateGrowthThreshold = async (val: number[]) => {
    const threshold = val[0];
    await automationService.updateSetting("growth_threshold", { value: threshold });
    setSettings(prev => ({ ...prev, growth_threshold: threshold }));
  };

  const updatePublishMode = async (mode: string) => {
    await automationService.updateSetting("publish_mode", {
      mode, hybrid_threshold: settings.hybrid_threshold
    });
    setSettings(prev => ({ ...prev, publish_mode: mode as any }));
    toast({ title: `Publish mode set to: ${mode.replace("_", " ")}` });
  };

  // ─── Keywords ───
  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    await automationService.addKeyword(newKeyword.trim(), newKeywordCategory);
    setNewKeyword("");
    toast({ title: `Keyword "${newKeyword}" added` });
    const kw = await automationService.getKeywords();
    setKeywords(kw);
  };

  const removeKeyword = async (id: string) => {
    await automationService.deleteKeyword(id);
    setKeywords(prev => prev.filter(k => k.id !== id));
    toast({ title: "Keyword removed" });
  };

  // ─── Actions ───
  const runDetection = async () => {
    setActionLoading("detect");
    try {
      const result = await automationService.triggerTrendDetection();
      toast({ title: "Trend detection complete", description: `Found ${result.stats?.qualified || 0} qualified trends` });
      await loadAll();
    } catch (e: any) {
      toast({ title: "Detection failed", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  const runGeneration = async (trendId?: string) => {
    setActionLoading(trendId || "generate");
    try {
      const result = await automationService.triggerContentGeneration(trendId);
      toast({ title: result.message || "Content generated" });
      await loadAll();
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  const publishDraft = async (articleId: string) => {
    setActionLoading(articleId);
    try {
      await automationService.publishArticle(articleId);
      toast({ title: "Article published" });
      await loadAll();
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  const rejectDraft = async (articleId: string) => {
    setActionLoading(`reject-${articleId}`);
    try {
      await automationService.rejectArticle(articleId);
      toast({ title: "Article rejected" });
      await loadAll();
    } catch (e: any) {
      toast({ title: "Reject failed", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  const runFullPipeline = async () => {
    setActionLoading("pipeline");
    try {
      const result = await automationService.runFullPipeline();
      toast({ title: "Pipeline complete", description: `Generated ${result.generated || 0} articles` });
      await loadAll();
    } catch (e: any) {
      toast({ title: "Pipeline failed", description: e.message, variant: "destructive" });
    }
    setActionLoading(null);
  };

  const filteredTrends = trendFilter === "all" ? trends : trends.filter(t => t.status === trendFilter);

  const statusColor = (status: string) => {
    switch (status) {
      case "completed": case "published": case "processed": return "default";
      case "pending": return "secondary";
      case "processing": return "outline";
      case "failed": case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Automation Dashboard - ImperialPedia</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Automation Dashboard</h1>
            <p className="text-muted-foreground">Content automation control center</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={settings.automation_enabled ? "default" : "secondary"} className="text-sm px-3 py-1">
              {settings.automation_enabled ? "Active" : "Paused"}
            </Badge>
            <Button
              variant={settings.automation_enabled ? "destructive" : "default"}
              onClick={toggleAutomation}
              className="gap-2"
            >
              {settings.automation_enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {settings.automation_enabled ? "Pause" : "Enable"}
            </Button>
            <Button onClick={runFullPipeline} disabled={actionLoading === "pipeline"} className="gap-2">
              <Rocket className="h-4 w-4" />
              {actionLoading === "pipeline" ? "Running..." : "Run Pipeline"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Articles", value: stats.totalArticles, icon: FileText },
            { label: "Today", value: stats.todayArticles, icon: BarChart3 },
            { label: "Pending Trends", value: stats.pendingTrends, icon: TrendingUp },
            { label: "Drafts", value: stats.draftArticles, icon: Clock },
            { label: "Keywords", value: stats.totalKeywords, icon: Search },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{value || 0}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="drafts" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* ─── Drafts Tab ─── */}
          <TabsContent value="drafts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI-Generated Drafts</h2>
              <Button onClick={() => runGeneration()} disabled={!!actionLoading} variant="outline" className="gap-2">
                <Zap className="h-4 w-4" />
                {actionLoading === "generate" ? "Generating..." : "Generate New"}
              </Button>
            </div>
            {drafts.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No drafts pending review</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {drafts.map((article: any) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {article.excerpt || article.preview_content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{article.tags?.[0] || "untagged"}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(article.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="sm" variant="ghost" asChild>
                            <a href={`/article/${article.slug}`} target="_blank"><Eye className="h-4 w-4" /></a>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => publishDraft(article.id)}
                            disabled={actionLoading === article.id}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Publish
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectDraft(article.id)}
                            disabled={actionLoading === `reject-${article.id}`}
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Trends Tab ─── */}
          <TabsContent value="trends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Detected Trends</h2>
              <div className="flex items-center gap-2">
                <Select value={trendFilter} onValueChange={setTrendFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={runDetection} disabled={actionLoading === "detect"} variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  {actionLoading === "detect" ? "Detecting..." : "Run Detection"}
                </Button>
              </div>
            </div>
            {filteredTrends.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No trends found</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {filteredTrends.map(trend => (
                  <Card key={trend.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate max-w-md">{trend.keyword}</h4>
                          <Badge variant={statusColor(trend.status)}>{trend.status}</Badge>
                          <Badge variant="outline">{trend.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{trend.growth_percentage}%
                          </span>
                          <span>{trend.source}</span>
                          <span>{trend.confirming_sources} source(s)</span>
                          <span>{new Date(trend.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      {trend.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => runGeneration(trend.id)}
                          disabled={actionLoading === trend.id}
                          className="gap-1"
                        >
                          <Zap className="h-3 w-3" />
                          Generate
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Keywords Tab ─── */}
          <TabsContent value="keywords" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tracked Keywords ({keywords.length})</h2>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    placeholder="Add keyword..."
                    onKeyDown={e => e.key === "Enter" && addKeyword()}
                    className="flex-1"
                  />
                  <Select value={newKeywordCategory} onValueChange={setNewKeywordCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="markets">Markets</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="regulations">Regulations</SelectItem>
                      <SelectItem value="etf">ETFs</SelectItem>
                      <SelectItem value="macroeconomics">Macro</SelectItem>
                      <SelectItem value="investing">Investing</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addKeyword} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {keywords.map(kw => (
                <Card key={kw.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{kw.keyword}</span>
                      <Badge variant="outline" className="text-xs">{kw.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={kw.is_active}
                        onCheckedChange={checked => {
                          automationService.toggleKeyword(kw.id, checked);
                          setKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, is_active: checked } : k));
                        }}
                      />
                      <Button size="sm" variant="ghost" onClick={() => removeKeyword(kw.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ─── Logs Tab ─── */}
          <TabsContent value="logs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pipeline Logs</h2>
              <Button onClick={loadAll} variant="ghost" className="gap-1">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
            {logs.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No logs yet</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {logs.map(log => (
                  <Card key={log.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={statusColor(log.status)}>{log.status}</Badge>
                          <span className="font-medium text-sm">{log.stage}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.error_message && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {log.error_message}
                        </p>
                      )}
                      {log.output_data && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(log.output_data).substring(0, 200)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Settings Tab ─── */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation Settings
                </CardTitle>
                <CardDescription>Control how the content automation system operates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Daily Post Limit</Label>
                  <p className="text-sm text-muted-foreground">Maximum articles per day: {settings.daily_post_limit}</p>
                  <Slider
                    value={[settings.daily_post_limit]}
                    onValueCommit={updateDailyLimit}
                    min={1}
                    max={25}
                    step={1}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Growth Threshold (%)</Label>
                  <p className="text-sm text-muted-foreground">Minimum trend growth to qualify: +{settings.growth_threshold}%</p>
                  <Slider
                    value={[settings.growth_threshold]}
                    onValueCommit={updateGrowthThreshold}
                    min={50}
                    max={500}
                    step={10}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Publishing Mode</Label>
                  <Select value={settings.publish_mode} onValueChange={updatePublishMode}>
                    <SelectTrigger className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approval_required">Always Require Approval</SelectItem>
                      <SelectItem value="auto_publish">Auto-Publish (with safety checks)</SelectItem>
                      <SelectItem value="hybrid">Hybrid (approval first, then auto)</SelectItem>
                    </SelectContent>
                  </Select>
                  {settings.publish_mode === "hybrid" && (
                    <p className="text-sm text-muted-foreground">
                      Auto-publish activates after {settings.hybrid_threshold} manually approved articles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAutomation;
