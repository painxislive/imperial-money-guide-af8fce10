import { useState, useEffect } from 'react';
import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/supabase-helpers';
import type { OrganizationSettings } from '@/types/enterprise';
import { Building, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function EnterpriseOrgSettings() {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await db('organization_settings').select('*').limit(1).single();
    setSettings(data as OrganizationSettings);
    setLoading(false);
  };

  const update = (field: string, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateSocial = (key: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, social_links: { ...settings.social_links, [key]: value } });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await db('organization_settings').update({
      name: settings.name,
      logo_url: settings.logo_url,
      founding_date: settings.founding_date,
      contact_email: settings.contact_email,
      address: settings.address,
      social_links: settings.social_links,
      editorial_policy_url: settings.editorial_policy_url,
      disclaimer_url: settings.disclaimer_url,
    }).eq('id', settings.id);
    setSaving(false);
    if (error) return toast.error('Failed to save');
    toast.success('Settings saved');
  };

  if (loading || !settings) {
    return (
      <EnterpriseLayout title="Organization Settings" description="Manage structured data and organization info.">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </EnterpriseLayout>
    );
  }

  return (
    <EnterpriseLayout title="Organization Settings" description="Manage structured data and organization info used in JSON-LD.">
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Organization Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Organization Name</Label><Input value={settings.name} onChange={e => update('name', e.target.value)} /></div>
            <div><Label>Logo URL</Label><Input value={settings.logo_url || ''} onChange={e => update('logo_url', e.target.value)} /></div>
            <div><Label>Founding Date</Label><Input value={settings.founding_date || ''} onChange={e => update('founding_date', e.target.value)} placeholder="2024-01-01" /></div>
            <div><Label>Contact Email</Label><Input value={settings.contact_email || ''} onChange={e => update('contact_email', e.target.value)} /></div>
            <div><Label>Address</Label><Input value={settings.address || ''} onChange={e => update('address', e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Twitter</Label><Input value={settings.social_links?.twitter || ''} onChange={e => updateSocial('twitter', e.target.value)} /></div>
            <div><Label>LinkedIn</Label><Input value={settings.social_links?.linkedin || ''} onChange={e => updateSocial('linkedin', e.target.value)} /></div>
            <div><Label>Facebook</Label><Input value={settings.social_links?.facebook || ''} onChange={e => updateSocial('facebook', e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Policy URLs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Editorial Policy URL</Label><Input value={settings.editorial_policy_url} onChange={e => update('editorial_policy_url', e.target.value)} /></div>
            <div><Label>Disclaimer URL</Label><Input value={settings.disclaimer_url} onChange={e => update('disclaimer_url', e.target.value)} /></div>
          </CardContent>
        </Card>

        <Button onClick={save} disabled={saving} className="w-full">
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </EnterpriseLayout>
  );
}
