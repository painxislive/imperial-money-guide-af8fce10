import EnterpriseLayout from '@/layouts/EnterpriseLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  module: string;
}

export default function EnterprisePlaceholder({ title, description, module }: PlaceholderProps) {
  return (
    <EnterpriseLayout title={title} description={description}>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Construction className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{module} Module</h3>
          <p className="text-sm">This module will be built in the next iteration.</p>
          <p className="text-xs mt-2">Database tables are ready — UI coming soon.</p>
        </CardContent>
      </Card>
    </EnterpriseLayout>
  );
}
