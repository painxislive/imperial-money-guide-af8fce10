import React from 'react';
import { PremiumLayout } from '@/layouts/PremiumLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Download, AlertCircle } from 'lucide-react';

const Billing = () => {
  return (
    <PremiumLayout
      title="Billing & Subscription"
      subtitle="ACCOUNT"
      description="Manage your subscription, payment methods, and billing history."
      showTrustSignals={false}
      tiers={[]}
      featureComparison={[]}
      seoTitle="Billing - Imperialpedia"
      seoDescription="Manage your Imperialpedia subscription, payment methods, and view billing history."
    >
      <section className="container mx-auto px-4 py-8 -mt-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <Badge>Premium</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">$29<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Next billing date: February 15, 2024
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Billing History</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid' },
                  { date: 'Dec 15, 2023', amount: '$29.00', status: 'Paid' },
                  { date: 'Nov 15, 2023', amount: '$29.00', status: 'Paid' },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">Premium Plan</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{invoice.amount}</span>
                      <Badge variant="secondary">{invoice.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notice */}
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                <div>
                  <p className="font-medium">Need help with billing?</p>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance with payments, refunds, or plan changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PremiumLayout>
  );
};

export default Billing;
