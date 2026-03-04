import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2 } from 'lucide-react';
import { db } from '@/lib/supabase-helpers';
import { useToast } from '@/hooks/use-toast';

interface OrgSettings {
  id?: string;
  name: string;
  logo_url: string;
  founding_date: string;
  contact_email: string;
  address: string;
  social_links: { twitter?: string; linkedin?: string; facebook?: string; youtube?: string };
  editorial_policy_url: string;
  disclaimer_url: string;
}

const defaults: OrgSettings = {
  name: 'ImperialPedia',
  logo_url: '',
  founding_date: '',
  contact_email: 'editorial@imperialpedia.com',
  address: '',
  social_links: {},
  editorial_policy_url: '/editorial-policy',
  disclaimer_url: '/disclaimer',
};

export default function EnterpriseGlobalSEO() {
  const [settings, setSettings] = useState<OrgSettings>(defaults);
  const [metaTitleTemplate, setMetaTitleTemplate] = useState('{title} | ImperialPedia');
  const [metaDescTemplate, setMetaDescTemplate] = useState('{description} - Learn more on ImperialPedia.');
  const [defaultOgImage, setDefaultOgImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    db('organization_settings').select('*').limit(1).single().then(({ data }: any) => {
      if (data) setSettings({ ...defaults, ...data });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await db('organization_settings').update(settings).eq('id', settings.id);
      } else {
        await db('organization_settings').insert(settings);
      }
      toast({ title: 'Global SEO settings saved' });
    } catch {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EnterpriseLayout title="Global SEO Settings">
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </EnterpriseLayout>
    );
  }

  return (
    <EnterpriseLayout title="Global SEO Settings" description="Configure site-wide SEO defaults, meta templates, and structured data.">
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Meta Templates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default Title Template</Label>
              <Input value={metaTitleTemplate} onChange={e => setMetaTitleTemplate(e.target.value)} placeholder="{title} | ImperialPedia" />
              <p className="text-xs text-muted-foreground mt-1">Use {'{title}'} as placeholder</p>
            </div>
            <div>
              <Label>Default Description Template</Label>
              <Textarea value={metaDescTemplate} onChange={e => setMetaDescTemplate(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Use {'{description}'} as placeholder</p>
            </div>
            <div>
              <Label>Default OG Image URL</Label>
              <Input value={defaultOgImage} onChange={e => setDefaultOgImage(e.target.value)} placeholder="https://imperialpedia.com/og-image.jpg" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Organization Schema</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Organization Name</Label><Input value={settings.name} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} /></div>
              <div><Label>Contact Email</Label><Input value={settings.contact_email} onChange={e => setSettings(s => ({ ...s, contact_email: e.target.value }))} /></div>
              <div><Label>Founding Date</Label><Input value={settings.founding_date} onChange={e => setSettings(s => ({ ...s, founding_date: e.target.value }))} placeholder="2024-01-01" /></div>
              <div><Label>Logo URL</Label><Input value={settings.logo_url} onChange={e => setSettings(s => ({ ...s, logo_url: e.target.value }))} /></div>
            </div>
            <div><Label>Address</Label><Input value={settings.address} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(['twitter', 'linkedin', 'facebook', 'youtube'] as const).map(platform => (
              <div key={platform}>
                <Label className="capitalize">{platform}</Label>
                <Input
                  value={(settings.social_links as any)?.[platform] || ''}
                  onChange={e => setSettings(s => ({ ...s, social_links: { ...s.social_links, [platform]: e.target.value } }))}
                  placeholder={`https://${platform}.com/imperialpedia`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Global SEO Settings
        </Button>
      </div>
    </EnterpriseLayout>
  );
}
